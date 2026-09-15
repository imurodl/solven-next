import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { SEND_MESSAGE } from '../../../../apollo/user/mutation';
import { userVar } from '../../../../apollo/store';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { Car } from '../../../types/car/car';

interface ContactSellerModalProps {
	open: boolean;
	onClose: () => void;
	car?: Car | null;
}

// "Contact seller" form: creates/continues the per-car conversation and notifies the seller.
const ContactSellerModal = ({ open, onClose, car }: ContactSellerModalProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [message, setMessage] = useState('');
	const [phone, setPhone] = useState('');
	const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

	const defaultMessage = car ? t('contact.defaultMessage', { title: car.carTitle }) : '';

	const submit = async () => {
		try {
			if (!user?._id) {
				await router.push({ pathname: '/account/join', query: { referrer: router.asPath } });
				return;
			}
			if (!car?._id) return;
			const text = message.trim() || defaultMessage;
			await sendMessage({ variables: { input: { carId: car._id, message: text, phone: phone.trim() || undefined } } });
			await sweetTopSmallSuccessAlert(t('Message sent'), 1200);
			setMessage('');
			onClose();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="contact-seller-modal">
			<DialogTitle>{t('Contact seller')}</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					{car && (
						<Typography variant="body2" sx={{ color: 'var(--text-2)' }}>
							{car.carTitle}
						</Typography>
					)}
					<TextField
						label={t('Your message')}
						placeholder={defaultMessage}
						multiline
						minRows={4}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						inputProps={{ maxLength: 2000 }}
						fullWidth
					/>
					<TextField
						label={t('Phone (optional)')}
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						inputProps={{ maxLength: 20 }}
						fullWidth
					/>
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose} className="btn-outline">
					{t('Cancel')}
				</Button>
				<Button onClick={submit} disabled={loading} variant="contained" className="btn-primary">
					{t('Send')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ContactSellerModal;
