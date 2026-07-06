import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { REACT_APP_API_URL } from '../../../config';
import { MemberType } from '../../../enums/member.enum';
import { Member } from '../../../types/member/member';

interface SellerInfoBoxProps {
	sellerInfo?: Member;
}

const SellerInfoBox = (props: SellerInfoBoxProps) => {
	const { sellerInfo } = props;

	return (
		<Stack className="seller-info">
			<Typography className="section-title">Seller Information</Typography>
			<Stack className="seller-profile">
				<Image
					className="profile-image"
					src={
						sellerInfo?.memberImage
							? `${REACT_APP_API_URL}/${sellerInfo.memberImage}`
							: '/img/profile/defaultUser.svg'
					}
					alt="Seller"
					width={80}
					height={80}
				/>
				<Stack className="profile-details">
					<Link href={`/member?memberId=${sellerInfo?._id}`}>
						<Typography className="seller-name">{sellerInfo?.memberNick}</Typography>
					</Link>
					<Typography className="seller-type">
						{sellerInfo?.memberType === MemberType.AGENT ? 'Verified Agent' : 'Private Seller'}
					</Typography>
					<Stack className="seller-rating">
						<Typography className="rating-count">
							{sellerInfo?.memberCars ?? 0} listings · {sellerInfo?.memberLikes ?? 0} likes
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack className="contact-buttons">
				<Button className="contact-button primary" startIcon={<PhoneIcon />}>
					{sellerInfo?.memberPhone}
				</Button>
				<Button className="contact-button secondary" startIcon={<EmailIcon />}>
					Send Message
				</Button>
			</Stack>
		</Stack>
	);
};

export default SellerInfoBox;
