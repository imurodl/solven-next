import React, { useState } from 'react';
import { Button, MenuItem, Select, Stack, TextField, Typography, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GENERATE_CAR_DESCRIPTION } from '../../../../apollo/user/mutation';
import { ESTIMATE_CAR_PRICE } from '../../../../apollo/user/query';
import { CarInput } from '../../../types/car/car.input';
import { CarCondition } from '../../../enums/car.enum';
import { useCurrency } from '../../../context/CurrencyContext';
import { sweetMixinErrorAlert } from '../../../sweetAlert';

interface AddCarExtrasProps {
	insertCarData: CarInput;
	setInsertCarData: (data: CarInput) => void;
}

// Condition / VIN fields plus the two AI helpers (description writer, fair price).
const AddCarExtras = ({ insertCarData, setInsertCarData }: AddCarExtrasProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { formatPrice } = useCurrency();
	const [notes, setNotes] = useState('');
	const [generate, { loading: generating }] = useMutation(GENERATE_CAR_DESCRIPTION);
	const [estimate, { data: estData, loading: estimating }] = useLazyQuery(ESTIMATE_CAR_PRICE, { fetchPolicy: 'network-only' });
	const est = estData?.estimateCarPrice;

	const canRunAi = !!(insertCarData.carBrand && insertCarData.carModel && insertCarData.manufacturedAt && insertCarData.carMileage);

	const writeDescription = async () => {
		try {
			const res = await generate({
				variables: {
					input: {
						carBrand: insertCarData.carBrand,
						carModel: insertCarData.carModel,
						manufacturedAt: Number(insertCarData.manufacturedAt),
						carMileage: Number(insertCarData.carMileage),
						carFuelType: insertCarData.carFuelType || undefined,
						carTransmission: insertCarData.carTransmission || undefined,
						carType: insertCarData.carType || undefined,
						carOptions: insertCarData.carOptions,
						notes: notes.trim() || undefined,
						locale: router.locale || 'en',
					},
				},
			});
			const out = res.data?.generateCarDescription;
			if (!out) return;
			setInsertCarData({ ...insertCarData, carDesc: out.desc, carTitle: insertCarData.carTitle || out.title });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const checkPrice = () =>
		estimate({
			variables: {
				input: {
					carBrand: insertCarData.carBrand,
					carModel: insertCarData.carModel,
					manufacturedAt: Number(insertCarData.manufacturedAt),
					carMileage: Number(insertCarData.carMileage),
					carFuelType: insertCarData.carFuelType || undefined,
					carType: insertCarData.carType || undefined,
					askingPrice: Number(insertCarData.carPrice) || undefined,
				},
			},
		});

	return (
		<Stack className="addcar-extras" spacing={2}>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
				<Stack flex={1}>
					<Typography className="title">{t('Condition')}</Typography>
					<Select
						size="small"
						value={insertCarData.carCondition || CarCondition.USED}
						onChange={(e) => setInsertCarData({ ...insertCarData, carCondition: e.target.value as CarCondition })}
					>
						<MenuItem value={CarCondition.USED}>{t('Used')}</MenuItem>
						<MenuItem value={CarCondition.NEW}>{t('New')}</MenuItem>
					</Select>
				</Stack>
				<Stack flex={1}>
					<Typography className="title">{t('VIN (optional)')}</Typography>
					<TextField
						size="small"
						placeholder="KMHxxxxxxxxxxxxxx"
						value={insertCarData.carVin || ''}
						onChange={(e) => setInsertCarData({ ...insertCarData, carVin: e.target.value.toUpperCase().slice(0, 17) })}
						inputProps={{ maxLength: 17 }}
					/>
				</Stack>
			</Stack>

			<Stack className="ai-tools">
				<Typography className="title">
					<AutoAwesomeIcon fontSize="inherit" /> {t('AI tools')}
				</Typography>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
					<TextField
						size="small"
						fullWidth
						placeholder={t('Notes for the writer, e.g. one owner, new tyres, dealer-serviced') as string}
						value={notes}
						onChange={(e) => setNotes(e.target.value.slice(0, 500))}
					/>
					<Button className="btn-outline" onClick={writeDescription} disabled={!canRunAi || generating} startIcon={generating ? <CircularProgress size={14} /> : <AutoAwesomeIcon />} sx={{ whiteSpace: 'nowrap' }}>
						{t('Write description')}
					</Button>
					<Button className="btn-outline" onClick={checkPrice} disabled={!canRunAi || estimating} startIcon={estimating ? <CircularProgress size={14} /> : <PriceCheckIcon />} sx={{ whiteSpace: 'nowrap' }}>
						{t('Check fair price')}
					</Button>
				</Stack>
				{!canRunAi && <Typography className="muted hint">{t('Fill brand, model, year and mileage first')}</Typography>}
				{est && est.sampleSize > 0 && (
					<div className={`estimate ${String(est.verdict || '').toLowerCase()}`}>
						<b>
							{t('Estimated')}: {formatPrice(est.estimate)}
						</b>
						<span>
							{formatPrice(est.low)} – {formatPrice(est.high)} · {est.sampleSize} {t('comparable listings')}
							{est.verdict && est.verdict !== 'UNKNOWN' ? ` · ${t(`price.verdict.${est.verdict}`)}` : ''}
						</span>
						<p>{est.reasoning}</p>
					</div>
				)}
				{est && est.sampleSize === 0 && <Typography className="muted hint">{est.reasoning}</Typography>}
			</Stack>
		</Stack>
	);
};

export default AddCarExtras;
