import React, { useState } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { MemberType } from '../../../enums/member.enum';
import { Member } from '../../../types/member/member';
import { Car } from '../../../types/car/car';
import UserAvatar from '../../common/UserAvatar';
import RatingStars from '../../common/RatingStars';
import ContactSellerModal from './ContactSellerModal';
import { userVar } from '../../../../apollo/store';

interface SellerInfoBoxProps {
	sellerInfo?: Member;
	car?: Car | null;
}

const SellerInfoBox = ({ sellerInfo, car }: SellerInfoBoxProps) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [contactOpen, setContactOpen] = useState(false);
	const [showPhone, setShowPhone] = useState(false);
	const own = !!user?._id && user._id === sellerInfo?._id;
	const typeLabel =
		sellerInfo?.memberType === MemberType.AGENT ? t('Verified Agent') : sellerInfo?.memberType === MemberType.MECHANIC ? t('Mechanic') : t('Private Seller');

	return (
		<Stack className="seller-info">
			<Typography className="section-title">{t('Seller Information')}</Typography>
			<Stack className="seller-profile">
				<UserAvatar image={sellerInfo?.memberImage} name={sellerInfo?.memberNick} size={80} className="profile-image" />
				<Stack className="profile-details">
					<Link href={sellerInfo?.memberType === MemberType.AGENT ? `/agent/detail?agentId=${sellerInfo?._id}` : `/member?memberId=${sellerInfo?._id}`}>
						<Typography className="seller-name">{sellerInfo?.memberFullName || sellerInfo?.memberNick}</Typography>
					</Link>
					<Typography className="seller-type">{typeLabel}</Typography>
					<Stack className="seller-rating">
						{sellerInfo?.memberReviews ? (
							<RatingStars value={sellerInfo.memberRating ?? 0} count={sellerInfo.memberReviews} showValue />
						) : (
							<Typography className="rating-count">{t('No reviews yet')}</Typography>
						)}
						<Typography className="rating-count">
							{sellerInfo?.memberCars ?? 0} {t('listings')} · {sellerInfo?.memberLikes ?? 0} {t('likes')}
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack className="contact-buttons">
				{sellerInfo?.memberPhone && (
					<Button className="contact-button primary" startIcon={<PhoneIcon />} onClick={() => setShowPhone(true)} href={showPhone ? `tel:${sellerInfo.memberPhone}` : undefined}>
						{showPhone ? sellerInfo.memberPhone : t('Show phone')}
					</Button>
				)}
				{!own && (
					<Button className="contact-button secondary" startIcon={<ChatBubbleOutlineIcon />} onClick={() => setContactOpen(true)}>
						{t('Send Message')}
					</Button>
				)}
			</Stack>
			<ContactSellerModal open={contactOpen} onClose={() => setContactOpen(false)} car={car} />
		</Stack>
	);
};

export default SellerInfoBox;
