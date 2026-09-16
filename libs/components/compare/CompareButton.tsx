import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { compareVar } from '../../../apollo/store';
import { COMPARE_LIMIT, toggleCompare } from '../../utils/compare';
import { sweetMixinErrorAlert } from '../../sweetAlert';

// Card-level toggle for the compare tray.
const CompareButton = ({ carId, className }: { carId: string; className?: string }) => {
	const { t } = useTranslation('common');
	const ids = useReactiveVar(compareVar);
	const active = ids.includes(carId);
	return (
		<Tooltip title={active ? t('Remove from compare') : t('Add to compare')} arrow>
			<IconButton
				className={`compare-btn ${active ? 'active' : ''} ${className || ''}`}
				aria-label={active ? (t('Remove from compare') as string) : (t('Add to compare') as string)}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (!toggleCompare(carId)) sweetMixinErrorAlert(t('You can compare up to {{n}} cars', { n: COMPARE_LIMIT }) as string).then();
				}}
			>
				<CompareArrowsIcon color={active ? 'primary' : 'inherit'} />
			</IconButton>
		</Tooltip>
	);
};

export default CompareButton;
