import React, { useState } from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { userVar } from '../../../../apollo/store';
import { Car } from '../../../types/car/car';
import { isPurchasable, isReserved, isSoldOut } from '../../../utils/sale';
import ContactSellerModal from './ContactSellerModal';
import ShareModal from '../../common/ShareModal';
import { SITE_URL } from '../../../seo';

// Primary call-to-action row on the car detail page.
const DealActions = ({ car }: { car?: Car | null }) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [contactOpen, setContactOpen] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);

	if (!car) return null;
	const own = !!user?._id && user._id === car.memberId;
	const purchasable = isPurchasable(car) && !own;
	const buyLabel = isSoldOut(car) ? t('Sold') : isReserved(car) ? t('Reserved') : own ? t('Your listing') : t('Buy / Reserve');

	const buy = async () => {
		if (!user?._id) {
			await router.push({ pathname: '/account/join', query: { referrer: `/checkout?carId=${car._id}` } });
			return;
		}
		await router.push({ pathname: '/checkout', query: { carId: car._id } });
	};

	const shareUrl = `${SITE_URL}/car/detail/?id=${car._id}`;

	return (
		<Stack direction="row" className="deal-actions" spacing={1.5}>
			<Tooltip title={purchasable ? '' : buyLabel}>
				<span className="grow">
					<Button variant="contained" className="btn-primary buy-btn" startIcon={<ShoppingCartCheckoutIcon />} onClick={buy} disabled={!purchasable} fullWidth>
						{buyLabel}
					</Button>
				</span>
			</Tooltip>
			{!own && (
				<Button className="btn-outline" startIcon={<ChatBubbleOutlineIcon />} onClick={() => setContactOpen(true)}>
					{t('Contact seller')}
				</Button>
			)}
			{car.car3dModel && (
				<Button className="btn-outline" startIcon={<ViewInArIcon />} onClick={() => router.push({ pathname: '/car/3d', query: { id: car._id } })}>
					{t('3D / AR')}
				</Button>
			)}
			<Button className="btn-outline icon-only" onClick={() => setShareOpen(true)} aria-label={t('Share') as string}>
				<ShareOutlinedIcon />
			</Button>
			<ContactSellerModal open={contactOpen} onClose={() => setContactOpen(false)} car={car} />
			<ShareModal open={shareOpen} onClose={() => setShareOpen(false)} url={shareUrl} title={car.carTitle} text={car.carDesc?.slice(0, 120)} />
		</Stack>
	);
};

export default DealActions;
