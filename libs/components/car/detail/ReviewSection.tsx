import React, { useRef, useState } from 'react';
import { Box, Button, Pagination, Stack, TextField, Typography, IconButton, Dialog } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { GET_CAR_REVIEW_SUMMARY, GET_MY_ORDERS, GET_REVIEWS } from '../../../../apollo/user/query';
import { CREATE_REVIEW, TOGGLE_REVIEW_REACTION } from '../../../../apollo/user/mutation';
import { userVar } from '../../../../apollo/store';
import { Review, ReviewSummary } from '../../../types/review/review';
import { ReviewReaction } from '../../../enums/review.enum';
import { OrderStatus } from '../../../enums/order.enum';
import RatingStars from '../../common/RatingStars';
import UserAvatar from '../../common/UserAvatar';
import { REACT_APP_API_URL } from '../../../config';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { uploadImages } from '../../../utils/upload';
import { timeAgo } from '../../../utils/format';
import { Message } from '../../../enums/common.enum';

interface ReviewSectionProps {
	carId?: string;
	sellerId?: string; // when set, lists the seller's reviews across cars (agent page)
	memberFilter?: string; // when set, lists reviews written by this member
	compact?: boolean;
}

const PAGE = 5;

// Purchase-gated reviews: summary bar, list with photos + reactions, and a
// write form that only appears when the viewer completed a deal for this car.
const ReviewSection = ({ carId, sellerId, memberFilter, compact = false }: ReviewSectionProps) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [page, setPage] = useState(1);
	const [showAll, setShowAll] = useState(false);
	const [lightbox, setLightbox] = useState<string | null>(null);
	const [rating, setRating] = useState(5);
	const [content, setContent] = useState('');
	const [photos, setPhotos] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const search = carId ? { carId } : memberFilter ? { memberId: memberFilter } : { sellerId };
	const { data: summaryData } = useQuery(GET_CAR_REVIEW_SUMMARY, { skip: !carId, variables: { carId } });
	const {
		data: reviewsData,
		refetch: refetchReviews,
		loading,
	} = useQuery(GET_REVIEWS, {
		variables: { input: { page, limit: showAll ? 50 : PAGE, sort: 'createdAt', direction: -1, search } },
		fetchPolicy: 'cache-and-network',
		skip: !carId && !sellerId && !memberFilter,
	});
	// Eligible orders: completed deals for this car by the viewer that are not yet reviewed.
	const { data: ordersData, refetch: refetchOrders } = useQuery(GET_MY_ORDERS, {
		skip: !user?._id || !carId,
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 5, search: { carId, orderStatus: OrderStatus.COMPLETED } } },
	});
	const [createReview, { loading: creating }] = useMutation(CREATE_REVIEW);
	const [toggleReaction] = useMutation(TOGGLE_REVIEW_REACTION);

	const summary: ReviewSummary | undefined = summaryData?.getCarReviewSummary;
	const reviews: Review[] = reviewsData?.getReviews?.list ?? [];
	const total: number = reviewsData?.getReviews?.metaCounter?.[0]?.total ?? 0;
	const eligibleOrder = ordersData?.getMyOrders?.list?.find((o: any) => !o.reviewed);

	const onPickPhotos = async (files: FileList | null) => {
		if (!files?.length) return;
		try {
			setUploading(true);
			const urls = await uploadImages(Array.from(files).slice(0, 3), 'review');
			setPhotos((p) => [...p, ...urls].slice(0, 3));
		} catch (err) {
			await sweetErrorHandling(err);
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	const submit = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!eligibleOrder) throw new Error(t('You can review a car only after completing a deal for it'));
			if (content.trim().length < 3) throw new Error(t('Please write at least a few words'));
			await createReview({
				variables: { input: { carId, orderId: eligibleOrder._id, reviewRating: rating, reviewContent: content.trim(), reviewImages: photos } },
			});
			setContent('');
			setPhotos([]);
			setRating(5);
			await Promise.all([refetchReviews(), refetchOrders()]);
			await sweetTopSmallSuccessAlert(t('Thank you for your review'), 1200);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const react = async (review: Review, reaction: ReviewReaction) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await toggleReaction({ variables: { reviewId: review._id, reaction } });
			await refetchReviews();
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const avg = summary?.averageRating ?? 0;
	const dist = summary?.ratingDistribution ?? [];
	const maxCount = Math.max(1, ...dist.map((d) => d.count));

	return (
		<Stack className={`review-section ${compact ? 'compact' : ''}`}>
			<Stack className="review-header">
				<Typography className="section-title">
					{t('Reviews')} {total > 0 && <span className="muted">({total})</span>}
				</Typography>
				{carId && summary && summary.totalReviews > 0 && (
					<Stack className="review-summary" direction="row">
						<Stack className="avg">
							<b>{avg.toFixed(1)}</b>
							<RatingStars value={avg} size="medium" />
							<span className="muted">
								{summary.totalReviews} {t('reviews')}
							</span>
						</Stack>
						<Stack className="dist">
							{dist.map((d) => (
								<div className="dist-row" key={d.star}>
									<span>{d.star}★</span>
									<div className="bar">
										<i style={{ width: `${(d.count / maxCount) * 100}%` }} />
									</div>
									<span className="muted">{d.count}</span>
								</div>
							))}
						</Stack>
					</Stack>
				)}
			</Stack>

			{carId && eligibleOrder && (
				<Stack className="review-form">
					<Typography className="form-title">{t('Write a review')}</Typography>
					<RatingStars value={rating} size="large" onChange={setRating} />
					<TextField
						multiline
						minRows={3}
						placeholder={t('Share your experience with this car and the seller') as string}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						inputProps={{ maxLength: 1000 }}
						fullWidth
					/>
					<Stack direction="row" alignItems="center" spacing={1} className="review-photos">
						{photos.map((p) => (
							<div className="photo" key={p}>
								<img src={`${REACT_APP_API_URL}/${p}`} alt="review" />
								<IconButton size="small" onClick={() => setPhotos((x) => x.filter((y) => y !== p))} aria-label="Remove photo">
									<CloseIcon fontSize="small" />
								</IconButton>
							</div>
						))}
						{photos.length < 3 && (
							<Button component="label" className="btn-outline" startIcon={<AddPhotoAlternateOutlinedIcon />} disabled={uploading}>
								{uploading ? t('Uploading...') : t('Add photos')}
								<input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onPickPhotos(e.target.files)} />
							</Button>
						)}
					</Stack>
					<Button variant="contained" className="btn-primary" onClick={submit} disabled={creating}>
						{t('Submit review')}
					</Button>
				</Stack>
			)}

			<Stack className="review-list">
				{!loading && reviews.length === 0 && <Typography className="muted empty">{t('No reviews yet')}</Typography>}
				{reviews.map((review) => (
					<Stack className="review-card slv-reveal" key={review._id}>
						<Stack direction="row" className="review-top">
							<UserAvatar image={review.memberData?.memberImage} name={review.memberData?.memberNick} size={40} />
							<Stack className="who">
								<b>{review.memberData?.memberNick ?? t('Buyer')}</b>
								<span className="muted">
									{timeAgo(review.createdAt)}
									{(sellerId || memberFilter) && review.carTitle ? ` · ${review.carTitle}` : ''}
								</span>
							</Stack>
							<RatingStars value={review.reviewRating} />
						</Stack>
						<Typography className="review-text">{review.reviewContent}</Typography>
						{review.reviewImages?.length > 0 && (
							<Stack direction="row" className="review-gallery">
								{review.reviewImages.map((img) => (
									<img key={img} src={`${REACT_APP_API_URL}/${img}`} alt="review" onClick={() => setLightbox(`${REACT_APP_API_URL}/${img}`)} />
								))}
							</Stack>
						)}
						<Stack direction="row" className="review-reactions">
							<button className={review.myReaction === ReviewReaction.LIKE ? 'on' : ''} onClick={() => react(review, ReviewReaction.LIKE)} aria-label="Helpful">
								{review.myReaction === ReviewReaction.LIKE ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
								<span>{review.likesCount ?? 0}</span>
							</button>
							<button className={review.myReaction === ReviewReaction.DISLIKE ? 'on' : ''} onClick={() => react(review, ReviewReaction.DISLIKE)} aria-label="Not helpful">
								{review.myReaction === ReviewReaction.DISLIKE ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
								<span>{review.dislikesCount ?? 0}</span>
							</button>
						</Stack>
					</Stack>
				))}
			</Stack>

			{!showAll && total > PAGE && (
				<Stack direction="row" justifyContent="center" alignItems="center" spacing={2} className="review-pagination">
					<Pagination page={page} count={Math.ceil(total / PAGE)} onChange={(_, v) => setPage(v)} shape="rounded" />
					<Button className="btn-text" onClick={() => setShowAll(true)}>
						{t('Show all')}
					</Button>
				</Stack>
			)}

			<Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="lg" className="review-lightbox">
				<Box sx={{ position: 'relative' }}>
					<IconButton onClick={() => setLightbox(null)} sx={{ position: 'absolute', top: 8, right: 8, background: 'var(--surface)' }} aria-label="Close">
						<CloseIcon />
					</IconButton>
					{lightbox && <img src={lightbox} alt="review" style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block' }} />}
				</Box>
			</Dialog>
		</Stack>
	);
};

export default ReviewSection;
