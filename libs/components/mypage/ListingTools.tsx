import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { UPDATE_CAR } from '../../../apollo/user/mutation';
import { Car } from '../../types/car/car';
import { CarAvailability } from '../../enums/car.enum';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { isSaleActive } from '../../utils/sale';

interface ListingToolsProps {
	car: Car;
	onChanged?: () => void;
	compact?: boolean;
}

const toLocalInput = (d?: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 16) : '');

// Seller controls per listing: Available/Reserved toggle and the hot-deal editor.
const ListingTools = ({ car, onChanged, compact = false }: ListingToolsProps) => {
	const { t } = useTranslation('common');
	const [updateCar, { loading }] = useMutation(UPDATE_CAR);
	const [open, setOpen] = useState(false);
	const [onSale, setOnSale] = useState(!!car.carIsOnSale);
	const [salePrice, setSalePrice] = useState<string>(car.carSalePrice ? String(car.carSalePrice) : '');
	const [startsAt, setStartsAt] = useState(toLocalInput(car.carSaleStartsAt));
	const [expiresAt, setExpiresAt] = useState(toLocalInput(car.carSaleExpiresAt) || toLocalInput(new Date(Date.now() + 7 * 86400000)));

	const reserved = car.carAvailability === CarAvailability.RESERVED;
	const sold = car.carAvailability === CarAvailability.SOLD || car.carStatus !== 'ACTIVE';

	const toggleAvailability = async () => {
		try {
			await updateCar({
				variables: { input: { _id: car._id, carAvailability: reserved ? CarAvailability.AVAILABLE : CarAvailability.RESERVED } },
			});
			await sweetTopSmallSuccessAlert(reserved ? t('Marked as available') : t('Marked as reserved'), 1000);
			onChanged?.();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	const saveSale = async () => {
		try {
			const price = Number(salePrice);
			if (onSale && (!price || price >= car.carPrice)) throw new Error(t('Sale price must be lower than the listing price'));
			await updateCar({
				variables: {
					input: {
						_id: car._id,
						carIsOnSale: onSale,
						carSalePrice: onSale ? price : null,
						carSaleStartsAt: onSale && startsAt ? new Date(startsAt).toISOString() : null,
						carSaleExpiresAt: onSale && expiresAt ? new Date(expiresAt).toISOString() : null,
					},
				},
			});
			await sweetTopSmallSuccessAlert(t('Deal updated'), 1000);
			setOpen(false);
			onChanged?.();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (sold) return null;
	const pct = car.carSalePrice ? Math.round(((car.carPrice - car.carSalePrice) / car.carPrice) * 100) : 0;

	return (
		<Stack direction={compact ? 'column' : 'row'} spacing={1} alignItems={compact ? 'flex-start' : 'center'} className="listing-tools">
			<FormControlLabel
				control={<Switch size="small" checked={!reserved} onChange={toggleAvailability} disabled={loading} />}
				label={<span className="tool-label">{reserved ? t('Reserved') : t('Available')}</span>}
			/>
			<Button size="small" className={`btn-outline sale-btn ${isSaleActive(car) ? 'on' : ''}`} startIcon={<LocalOfferOutlinedIcon />} onClick={() => setOpen(true)}>
				{isSaleActive(car) ? `-${pct}%` : t('Hot deal')}
			</Button>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
				<DialogTitle>{t('Hot deal')}</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<Typography variant="body2" className="muted">
							{t('sale.hint')}
						</Typography>
						<FormControlLabel control={<Switch checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />} label={t('Enable hot deal')} />
						<TextField label={`${t('Sale price')} (USD)`} type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} disabled={!onSale} size="small" helperText={`${t('Listing price')}: $${car.carPrice.toLocaleString()}`} />
						<TextField label={t('Starts at')} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} disabled={!onSale} size="small" InputLabelProps={{ shrink: true }} />
						<TextField label={t('Ends at')} type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} disabled={!onSale} size="small" InputLabelProps={{ shrink: true }} />
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button className="btn-outline" onClick={() => setOpen(false)}>
						{t('Cancel')}
					</Button>
					<Button className="btn-primary" variant="contained" onClick={saveSale} disabled={loading}>
						{t('Save')}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

export default ListingTools;
