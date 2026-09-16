import React, { useEffect } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { compareVar } from '../../../apollo/store';
import { clearCompare, loadCompare } from '../../utils/compare';

// Floating tray shown while at least one car is queued for comparison.
const CompareTray = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const ids = useReactiveVar(compareVar);

	useEffect(() => {
		loadCompare();
	}, []);

	if (!ids.length || router.pathname === '/car/compare') return null;
	return (
		<Stack className="compare-tray" direction="row" alignItems="center" spacing={1.5}>
			<CompareArrowsIcon />
			<Typography className="tray-text">{t('{{n}} selected for comparison', { n: ids.length })}</Typography>
			<Button className="btn-primary" size="small" disabled={ids.length < 2} onClick={() => router.push('/car/compare')}>
				{t('Compare')}
			</Button>
			<Button className="tray-clear" size="small" onClick={clearCompare} aria-label={t('Clear') as string}>
				<CloseIcon fontSize="small" />
			</Button>
		</Stack>
	);
};

export default CompareTray;
