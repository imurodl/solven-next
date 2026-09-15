import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { SEND_SERVICE_REQUEST } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Member } from '../../types/member/member';

interface ServiceRequestModalProps {
	open: boolean;
	onClose: () => void;
	mechanic?: Member | null;
	defaultCar?: string;
}

// "Request service": opens a SERVICE conversation with the mechanic.
const ServiceRequestModal = ({ open, onClose, mechanic, defaultCar = '' }: ServiceRequestModalProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [message, setMessage] = useState('');
	const [carInfo, setCarInfo] = useState(defaultCar);
	const [phone, setPhone] = useState('');
	const [send, { loading }] = useMutation(SEND_SERVICE_REQUEST);

	const submit = async () => {
		try {
			if (!user?._id) {
				await router.push({ pathname: '/account/join', query: { referrer: router.asPath } });
				return;
			}
			if (!mechanic?._id || message.trim().length < 3) return;
			await send({ variables: { input: { mechanicId: mechanic._id, message: message.trim(), carInfo: carInfo.trim() || undefined, phone: phone.trim() || undefined } } });
			await sweetTopSmallSuccessAlert(t('Request sent'), 1200);
			setMessage('');
			onClose();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="service-request-modal">
			<DialogTitle>{t('Request service')}</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					{mechanic && (
						<Typography variant="body2" sx={{ color: 'var(--text-2)' }}>
							{t('To')}: {mechanic.memberFullName || mechanic.memberNick}
						</Typography>
					)}
					<TextField label={t('Your car (brand, model, year)')} value={carInfo} onChange={(e) => setCarInfo(e.target.value)} inputProps={{ maxLength: 100 }} fullWidth />
					<TextField
						label={t('What needs to be done?')}
						multiline
						minRows={4}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						inputProps={{ maxLength: 2000 }}
						fullWidth
					/>
					<TextField label={t('Phone (optional)')} value={phone} onChange={(e) => setPhone(e.target.value)} inputProps={{ maxLength: 20 }} fullWidth />
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose} className="btn-outline">
					{t('Cancel')}
				</Button>
				<Button onClick={submit} disabled={loading || message.trim().length < 3} variant="contained" className="btn-primary">
					{t('Send request')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ServiceRequestModal;
