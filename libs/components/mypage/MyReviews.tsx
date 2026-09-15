import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { userVar } from '../../../apollo/store';
import ReviewSection from '../car/detail/ReviewSection';
import { MemberType } from '../../enums/member.enum';

// Reviews I wrote (buyer) or reviews about my listings (seller).
const MyReviews = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const isSeller = user.memberType === MemberType.AGENT;
	return (
		<div id="my-reviews-page" className="mypage-panel">
			<Stack className="main-title-box">
				<Typography className="main-title">{t('My Reviews')}</Typography>
				<Typography className="sub-title">{isSeller ? t('What buyers say about your cars') : t('Reviews you have written')}</Typography>
			</Stack>
			{isSeller ? <ReviewSection sellerId={user._id} compact /> : <MyWrittenReviews memberId={user._id} />}
		</div>
	);
};

const MyWrittenReviews = ({ memberId }: { memberId: string }) => <ReviewSection sellerId={undefined} carId={undefined} compact key={memberId} memberFilter={memberId} />;

export default MyReviews;
