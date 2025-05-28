import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import { Comment } from '../../types/comment/comment';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';

interface ReviewCardProps {
	fromMyPage?: string;
	comment: Comment;
}

const ReviewCard = (props: ReviewCardProps) => {
	const { fromMyPage, comment } = props;
	const device = useDeviceDetect();
	const imagePath: string = comment?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>REVIEW CARD</div>;
	} else {
		return (
			<Box
				component={'div'}
				className={'review-card'}
				sx={{
					padding: '20px',
					borderRadius: '12px',
					background: 'rgba(30, 64, 175, 0.02)',
					border: '1px solid',
					borderColor: 'transparent',
					transition: 'all 0.3s ease',
					marginBottom: '12px',
					'&:hover': {
						borderColor: 'rgba(30, 64, 175, 0.2)',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						transform: 'translateY(-2px)',
					},
				}}
			>
				<Stack className={'info'} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<img
							src={imagePath}
							alt=""
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '10px',
								objectFit: 'cover',
								transition: 'transform 0.3s ease',
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = 'scale(1.05)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
						/>
						<Stack spacing={0.5}>
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 600,
									color: '#050b20',
									fontSize: '15px',
								}}
							>
								{comment.memberData?.memberNick}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: '#6b7280',
									fontSize: '13px',
								}}
							>
								<Moment format={'DD MMMM YYYY'}>{comment.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Typography
					sx={{
						mt: 1.5,
						color: '#050b20',
						fontSize: '14px',
						lineHeight: 1.6,
						pl: '56px',
					}}
				>
					{comment.commentContent}
				</Typography>
				{fromMyPage && (
					<Stack
						className="reply-button-box"
						direction="row"
						spacing={1}
						alignItems="center"
						sx={{
							mt: 1.5,
							pl: '56px',
							cursor: 'pointer',
							'&:hover': {
								'& .reply-text': {
									color: '#1e40af',
								},
								'& svg path': {
									fill: '#1e40af',
								},
							},
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
							<g clipPath="url(#clip0_7037_6550)">
								<path
									d="M6.66667 4.67077V1.8361C6.66667 1.63544 6.546 1.4541 6.36133 1.37544C6.17733 1.29744 5.962 1.33677 5.81867 1.47744L0.152 6.97744C0.0546667 7.07144 0 7.20077 0 7.3361C0 7.47144 0.0546667 7.60077 0.152 7.69477L5.81867 13.1948C5.96333 13.3348 6.178 13.3741 6.36133 13.2968C6.546 13.2181 6.66667 13.0368 6.66667 12.8361V10.0028H7.612C10.7027 10.0028 13.552 11.6828 15.0473 14.3841L15.0613 14.4094C15.1507 14.5721 15.32 14.6694 15.5 14.6694C15.5413 14.6694 15.5827 14.6648 15.624 14.6541C15.8453 14.5974 16 14.3981 16 14.1694C16 8.98677 11.8287 4.7601 6.66667 4.67077Z"
									fill="#181A20"
									style={{ transition: 'fill 0.3s ease' }}
								/>
							</g>
							<defs>
								<clipPath id="clip0_7037_6550">
									<rect width="16" height="16" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<Typography
							className="reply-text"
							sx={{
								fontSize: '13px',
								fontWeight: 500,
								color: '#181A20',
								transition: 'color 0.3s ease',
							}}
						>
							Reply
						</Typography>
					</Stack>
				)}
			</Box>
		);
	}
};

export default ReviewCard;
