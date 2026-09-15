import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { userVar } from '../../../apollo/store';
import OAuthButtons from '../common/OAuthButtons';
import { API_AUTH_URL } from '../../config';
import { getJwtToken, hydrateProfile } from '../../auth';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

// Google / Telegram linking status for the signed-in member (MyProfile).
const LinkedAccounts = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const unlink = async (provider: 'google' | 'telegram') => {
		try {
			if (!(await sweetConfirmAlert(t('Unlink this account?') as string))) return;
			const res = await fetch(`${API_AUTH_URL}/auth/unlink/${provider}`, { method: 'POST', headers: { Authorization: `Bearer ${getJwtToken()}` } });
			const data = await res.json();
			if (!res.ok) throw new Error(data?.message || 'Failed');
			await hydrateProfile();
			await sweetTopSmallSuccessAlert(t('Unlinked'), 1000);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<Stack className="linked-accounts">
			<Typography className="input-label">{t('Linked accounts')}</Typography>
			<Typography className="muted small">{t('linked.hint')}</Typography>
			<OAuthButtons mode="link" linked={{ google: user.hasGoogle, telegram: user.hasTelegram }} onLinked={() => hydrateProfile()} />
			<Stack direction="row" spacing={1} className="unlink-row">
				{user.hasGoogle && (
					<Button className="btn-text danger" onClick={() => unlink('google')}>
						{t('Unlink Google')}
					</Button>
				)}
				{user.hasTelegram && (
					<Button className="btn-text danger" onClick={() => unlink('telegram')}>
						{t('Unlink Telegram')}
					</Button>
				)}
			</Stack>
		</Stack>
	);
};

export default LinkedAccounts;
