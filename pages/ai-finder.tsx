import React, { useRef, useState } from 'react';
import { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../libs/utils';
import { ANALYZE_CAR_PHOTO, LIKE_TARGET_CAR } from '../apollo/user/mutation';
import { GET_AI_STATUS } from '../apollo/user/query';
import { CarPhotoAnalysis } from '../libs/types/ai/ai';
import { compressImage, fileToBase64 } from '../libs/utils/upload';
import CarCard from '../libs/components/car/CarCard';
import { sweetMixinErrorAlert } from '../libs/sweetAlert';
import { Message } from '../libs/enums/common.enum';
import SEO from '../libs/components/SEO';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

// Photo -> brand/model/body/colour -> matching listings. The image never
// leaves the request: it is compressed in the browser and analysed server-side.
const AiFinder: NextPage = () => {
	const { t } = useTranslation('common');
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [request, setRequest] = useState('');
	const [result, setResult] = useState<CarPhotoAnalysis | null>(null);
	const [drag, setDrag] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: statusData } = useQuery(GET_AI_STATUS, { fetchPolicy: 'network-only' });
	const [analyze, { loading }] = useMutation(ANALYZE_CAR_PHOTO);
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	const status = statusData?.getAiStatus;

	const pick = (f: File | null | undefined) => {
		if (!f || !f.type.startsWith('image/')) return;
		setFile(f);
		setResult(null);
		const reader = new FileReader();
		reader.onload = () => setPreview(String(reader.result));
		reader.readAsDataURL(f);
	};

	const run = async () => {
		if (!file) return;
		try {
			const compressed = await compressImage(file, 1280, 0.8);
			const { base64, mimeType } = await fileToBase64(compressed);
			const res = await analyze({ variables: { input: { imageBase64: base64, mimeType, userRequest: request.trim() || undefined } } });
			setResult(res.data.analyzeCarPhoto);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const likeCarHandler = async (user: any, id: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetCar({ variables: { input: id } });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<div id="ai-finder-page">
			<SEO title={t('AI Car Finder') as string} description={t('ai.finder.seoDesc') as string} canonical="/ai-finder" />
			<div className="container">
				<Stack className="finder-hero">
					<span className="eyebrow">
						<AutoAwesomeIcon fontSize="inherit" /> {t('AI Finder')}
					</span>
					<Typography className="hero-title">{t('Saw a car you like? Find it here.')}</Typography>
					<Typography className="hero-sub">{t('ai.finder.heroSub')}</Typography>
					{status && !status.photoFinder && <div className="notice info">{t('ai.finder.disabled')}</div>}
				</Stack>

				<Stack className="finder-body" direction={{ xs: 'column', md: 'row' }}>
					<Stack className="finder-upload">
						<div
							className={`dropzone ${drag ? 'drag' : ''} ${preview ? 'has-image' : ''}`}
							onDragOver={(e) => {
								e.preventDefault();
								setDrag(true);
							}}
							onDragLeave={() => setDrag(false)}
							onDrop={(e) => {
								e.preventDefault();
								setDrag(false);
								pick(e.dataTransfer.files?.[0]);
							}}
							onClick={() => inputRef.current?.click()}
						>
							{preview ? <img src={preview} alt="preview" /> : (
								<>
									<CloudUploadOutlinedIcon className="icon" />
									<b>{t('Drop a car photo here')}</b>
									<span>{t('or click to choose · JPG, PNG, WEBP')}</span>
								</>
							)}
							<input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
						</div>
						<TextField
							label={t('Anything else? (optional)')}
							placeholder={t('e.g. under $20,000, automatic, in Seoul') as string}
							value={request}
							onChange={(e) => setRequest(e.target.value.slice(0, 300))}
							size="small"
							fullWidth
						/>
						<Stack direction="row" spacing={1}>
							<Button className="btn-primary" variant="contained" disabled={!file || loading || (status && !status.photoFinder)} onClick={run} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}>
								{loading ? t('Analysing...') : t('Find this car')}
							</Button>
							{preview && (
								<Button
									className="btn-outline"
									onClick={() => {
										setPreview(null);
										setFile(null);
										setResult(null);
									}}
								>
									{t('Clear')}
								</Button>
							)}
						</Stack>
						{status && <span className="muted quota">{t('ai.finder.quota', { n: status.remainingToday })}</span>}
					</Stack>

					<Stack className="finder-result">
						{!result && !loading && (
							<div className="placeholder">
								<Typography className="muted">{t('ai.finder.placeholder')}</Typography>
							</div>
						)}
						{result && (
							<>
								<div className="analysis">
									<Typography className="section-title">{t('What we see')}</Typography>
									<div className="chips">
										{result.brand && <span className="chip">{result.brand}</span>}
										{result.model && <span className="chip">{result.model}</span>}
										{result.bodyType && <span className="chip">{t(result.bodyType)}</span>}
										{result.color && <span className="chip">{t(result.color)}</span>}
										{result.yearGuess && <span className="chip">~{result.yearGuess}</span>}
										<span className="chip soft">
											{t('Confidence')} {Math.round(result.confidence * 100)}%
										</span>
									</div>
									{result.notes && <Typography className="notes">{result.notes}</Typography>}
								</div>
								<Typography className="section-title">
									{t('Matching listings')} {result.matchedCars.length ? `(${result.matchedCars.length})` : ''}
								</Typography>
								{result.matchedCars.length === 0 ? (
									<Typography className="muted">{t('ai.finder.noMatch')}</Typography>
								) : (
									<div className="match-grid">
										{result.matchedCars.map((car) => (
											<CarCard key={car._id} car={car} likeCarHandler={likeCarHandler} />
										))}
									</div>
								)}
							</>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(AiFinder);
