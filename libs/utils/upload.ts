import axios from 'axios';
import { getJwtToken } from '../auth';
import { GRAPHQL_URL } from '../config';

// Multipart GraphQL upload (graphql-upload spec). Returns the stored relative paths.
export async function uploadImages(files: FileList | File[], target: string): Promise<string[]> {
	const list = Array.from(files);
	if (!list.length) return [];
	const formData = new FormData();
	formData.append(
		'operations',
		JSON.stringify({
			query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { imagesUploader(files: $files, target: $target) }`,
			variables: { files: list.map(() => null), target },
		}),
	);
	const map: Record<string, string[]> = {};
	list.forEach((_, i) => (map[String(i)] = [`variables.files.${i}`]));
	formData.append('map', JSON.stringify(map));
	list.forEach((file, i) => formData.append(String(i), file));

	const response = await axios.post(GRAPHQL_URL, formData, {
		headers: { 'Content-Type': 'multipart/form-data', 'apollo-require-preflight': 'true', Authorization: `Bearer ${getJwtToken()}` },
	});
	if (response.data?.errors?.length) throw new Error(response.data.errors[0].message);
	return response.data?.data?.imagesUploader ?? [];
}

export async function uploadModel(file: File): Promise<string> {
	const formData = new FormData();
	formData.append(
		'operations',
		JSON.stringify({ query: `mutation ModelUploader($file: Upload!) { modelUploader(file: $file) }`, variables: { file: null } }),
	);
	formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
	formData.append('0', file);
	const response = await axios.post(GRAPHQL_URL, formData, {
		headers: { 'Content-Type': 'multipart/form-data', 'apollo-require-preflight': 'true', Authorization: `Bearer ${getJwtToken()}` },
	});
	if (response.data?.errors?.length) throw new Error(response.data.errors[0].message);
	return response.data?.data?.modelUploader;
}

// Read a File as base64 (without the data: prefix) for the AI photo finder.
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result || '');
			const comma = result.indexOf(',');
			resolve({ base64: result.slice(comma + 1), mimeType: file.type || 'image/jpeg' });
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});

// Downscale a photo in the browser before sending it (keeps AI payloads small).
export async function compressImage(file: File, maxSide = 1280, quality = 0.82): Promise<File> {
	if (!file.type.startsWith('image/')) return file;
	const bitmap = await createImageBitmap(file).catch(() => null);
	if (!bitmap) return file;
	const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
	if (scale === 1 && file.size < 1_500_000) return file;
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality));
	if (!blob) return file;
	return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}
