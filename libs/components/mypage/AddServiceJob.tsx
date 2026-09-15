import React, { useEffect, useRef, useState } from 'react';
import { Button, MenuItem, Select, Stack, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { CREATE_SERVICE_JOB, UPDATE_SERVICE_JOB } from '../../../apollo/user/mutation';
import { GET_CAR_BRANDS_BY_USER, GET_SERVICE_JOB } from '../../../apollo/user/query';
import { ServiceType } from '../../enums/service-job.enum';
import { CarLocation } from '../../enums/car.enum';
import { REACT_APP_API_URL } from '../../config';
import { uploadImages } from '../../utils/upload';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const empty = {
	serviceType: ServiceType.ENGINE,
	serviceTitle: '',
	serviceDesc: '',
	carBrand: '',
	carModel: '',
	manufacturedAt: '' as string | number,
	servicePrice: '' as string | number,
	serviceDuration: 2,
	serviceImages: [] as string[],
	serviceLocation: CarLocation.SEOUL,
	serviceAddress: '',
};

// Create / edit a mechanic's service showcase (?jobId= for edit).
const AddServiceJob = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const jobId = typeof router.query.jobId === 'string' ? router.query.jobId : '';
	const [form, setForm] = useState({ ...empty });
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);
	const { data: brandsData } = useQuery(GET_CAR_BRANDS_BY_USER);
	const { data: jobData } = useQuery(GET_SERVICE_JOB, { skip: !jobId, variables: { serviceJobId: jobId }, fetchPolicy: 'network-only' });
	const [createJob, { loading: creating }] = useMutation(CREATE_SERVICE_JOB);
	const [updateJob, { loading: updating }] = useMutation(UPDATE_SERVICE_JOB);
	const brands: { carBrandName: string; carBrandModels: string[] }[] = brandsData?.getCarBrandsByUser ?? [];
	const models = brands.find((b) => b.carBrandName === form.carBrand)?.carBrandModels ?? [];

	useEffect(() => {
		const j = jobData?.getServiceJob;
		if (!j) return;
		setForm({
			serviceType: j.serviceType,
			serviceTitle: j.serviceTitle,
			serviceDesc: j.serviceDesc ?? '',
			carBrand: j.carBrand,
			carModel: j.carModel,
			manufacturedAt: j.manufacturedAt ?? '',
			servicePrice: j.servicePrice,
			serviceDuration: j.serviceDuration,
			serviceImages: j.serviceImages ?? [],
			serviceLocation: j.serviceLocation,
			serviceAddress: j.serviceAddress,
		});
	}, [jobData]);

	const set = (k: keyof typeof empty, v: any) => setForm((f) => ({ ...f, [k]: v }));

	const pick = async (files: FileList | null) => {
		if (!files?.length) return;
		try {
			setUploading(true);
			const urls = await uploadImages(Array.from(files).slice(0, 8), 'service');
			set('serviceImages', [...form.serviceImages, ...urls].slice(0, 8));
		} catch (err) {
			await sweetErrorHandling(err);
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	const valid =
		form.serviceTitle.trim().length >= 3 && form.carBrand && form.carModel && Number(form.servicePrice) >= 0 && form.serviceImages.length > 0 && form.serviceAddress.trim().length >= 3;

	const submit = async () => {
		try {
			if (!valid) throw new Error(t('Please fill all required fields and add at least one photo'));
			const input: any = {
				serviceType: form.serviceType,
				serviceTitle: form.serviceTitle.trim(),
				serviceDesc: form.serviceDesc.trim() || undefined,
				carBrand: form.carBrand,
				carModel: form.carModel,
				manufacturedAt: form.manufacturedAt ? Number(form.manufacturedAt) : undefined,
				servicePrice: Number(form.servicePrice),
				serviceDuration: Number(form.serviceDuration) || 1,
				serviceImages: form.serviceImages,
				serviceLocation: form.serviceLocation,
				serviceAddress: form.serviceAddress.trim(),
			};
			if (jobId) await updateJob({ variables: { input: { _id: jobId, ...input } } });
			else await createJob({ variables: { input } });
			await sweetMixinSuccessAlert(jobId ? t('Service job updated') : t('Service job published'));
			await router.push({ pathname: '/mypage', query: { category: 'myServiceJobs' } });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<div id="add-service-job-page" className="mypage-panel">
			<Stack className="main-title-box">
				<Typography className="main-title">{jobId ? t('Edit Service Job') : t('Add Service Job')}</Typography>
				<Typography className="sub-title">{t('Show a repair you completed so customers can find you')}</Typography>
			</Stack>
			<Stack className="form-grid" spacing={2}>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<Select value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)} fullWidth size="small">
						{Object.values(ServiceType).map((v) => (
							<MenuItem key={v} value={v}>
								{t(`service.type.${v}`)}
							</MenuItem>
						))}
					</Select>
					<Select value={form.serviceLocation} onChange={(e) => set('serviceLocation', e.target.value)} fullWidth size="small">
						{Object.values(CarLocation).map((v) => (
							<MenuItem key={v} value={v}>
								{v}
							</MenuItem>
						))}
					</Select>
				</Stack>
				<TextField label={t('Title')} value={form.serviceTitle} onChange={(e) => set('serviceTitle', e.target.value)} inputProps={{ maxLength: 100 }} size="small" fullWidth required />
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<Select value={form.carBrand} displayEmpty onChange={(e) => set('carBrand', e.target.value)} fullWidth size="small">
						<MenuItem value="">{t('Brand')}</MenuItem>
						{brands.map((b) => (
							<MenuItem key={b.carBrandName} value={b.carBrandName}>
								{b.carBrandName}
							</MenuItem>
						))}
					</Select>
					<Select value={form.carModel} displayEmpty onChange={(e) => set('carModel', e.target.value)} fullWidth size="small" disabled={!form.carBrand}>
						<MenuItem value="">{t('Model')}</MenuItem>
						{models.map((m) => (
							<MenuItem key={m} value={m}>
								{m}
							</MenuItem>
						))}
					</Select>
					<TextField label={t('Year')} type="number" value={form.manufacturedAt} onChange={(e) => set('manufacturedAt', e.target.value)} size="small" fullWidth />
				</Stack>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<TextField label={t('Price from (USD)')} type="number" value={form.servicePrice} onChange={(e) => set('servicePrice', e.target.value)} size="small" fullWidth required />
					<TextField label={t('Duration (hours)')} type="number" value={form.serviceDuration} onChange={(e) => set('serviceDuration', e.target.value)} size="small" fullWidth />
					<TextField label={t('Workshop address')} value={form.serviceAddress} onChange={(e) => set('serviceAddress', e.target.value)} size="small" fullWidth required />
				</Stack>
				<TextField label={t('Description')} value={form.serviceDesc} onChange={(e) => set('serviceDesc', e.target.value)} multiline minRows={4} inputProps={{ maxLength: 3000 }} fullWidth />
				<Stack direction="row" spacing={1} className="review-photos" flexWrap="wrap">
					{form.serviceImages.map((p) => (
						<div className="photo" key={p}>
							<img src={`${REACT_APP_API_URL}/${p}`} alt="" />
							<IconButton size="small" onClick={() => set('serviceImages', form.serviceImages.filter((x) => x !== p))} aria-label="Remove">
								<CloseIcon fontSize="small" />
							</IconButton>
						</div>
					))}
					{form.serviceImages.length < 8 && (
						<Button component="label" className="btn-outline" startIcon={<AddPhotoAlternateOutlinedIcon />} disabled={uploading}>
							{uploading ? t('Uploading...') : t('Add photos')}
							<input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => pick(e.target.files)} />
						</Button>
					)}
				</Stack>
				<Stack direction="row" justifyContent="flex-end">
					<Button className="btn-primary" variant="contained" disabled={!valid || creating || updating} onClick={submit}>
						{jobId ? t('Save changes') : t('Publish')}
					</Button>
				</Stack>
			</Stack>
		</div>
	);
};

export default AddServiceJob;
