import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { NextPage } from 'next';
import Review from '../../libs/components/car/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import CarBigCard from '../../libs/components/common/CarBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Car } from '../../libs/types/car/car';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_CARS, GET_CAR } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { create } from 'domain';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Rating } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [carId, setCarId] = useState<string | null>(null);
	const [car, setCar] = useState<Car | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationCars, setDestinationCars] = useState<Car[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [carComments, setCarComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.CAR,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getCarLoading,
		data: getCarData,
		error: getCarError,
		refetch: getCarRefetch,
	} = useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		variables: { input: carId },
		skip: !carId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getCar) setCar(data?.getCar);
			if (data?.getCar) setSlideImage(data?.getCar?.carImages[0]);
		},
	});

	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: car?.carLocation ? [car?.carLocation] : [],
				},
			},
		},
		skip: !carId && !car,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getCars?.list) setDestinationCars(data?.getCars?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialComment,
		},
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setCarComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setCarId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likeCarHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likePropertyHandler Mutation
			await likeTargetCar({ variables: { input: id } });

			//execute getPropertiesRefetch
			await getCarRefetch({ input: id });
			await getCarsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [car?.carLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (getCarsLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1800px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>CAR LISTING DETAIL PAGE</div>;
	} else {
		return (
			<div id="car-detail-page">
				<div className="container">
					<Stack className="car-detail-config">
						<Stack className="car-info-config">
							<Stack className="images-container">
								<Stack className="main-image-info-container">
									<Box className="main-image-box">
										<img src={`${REACT_APP_API_URL}/${slideImage || car?.carImages?.[0]}`} alt={car?.carTitle} />
									</Box>

									<Stack className="car-info-box">
										<Typography className="title-main">{car?.carTitle}</Typography>
										<Typography className="listed-date">
											Listed {moment().diff(car?.createdAt, 'days')} days ago
										</Typography>

										<Stack className="main-info-row">
											<Stack className="info-item">
												<AttachMoneyIcon />
												<Stack>
													<Typography className="info-value">${formatterStr(car?.carPrice)}</Typography>
												</Stack>
											</Stack>
											<Stack className="info-item">
												<CalendarTodayIcon />
												<Stack>
													<Typography className="info-value">{car?.manufacturedAt}</Typography>
												</Stack>
											</Stack>
											<Stack className="info-item">
												<SpeedIcon />
												<Stack>
													<Typography className="info-value">{car?.carMileage} km</Typography>
												</Stack>
											</Stack>
										</Stack>

										<Stack className="description-section">
											<Typography className="section-title">Description</Typography>
											<Typography className="description-text">
												{car?.carDesc || 'No description available.'}
											</Typography>
										</Stack>

										<Stack className="action-buttons">
											<Button className="view-btn" startIcon={<RemoveRedEyeIcon />}>
												{car?.carViews}
											</Button>
											<Button
												className="like-btn"
												startIcon={
													car?.meLiked && car?.meLiked[0]?.myFavorite ? (
														<FavoriteIcon className="liked" />
													) : (
														<FavoriteBorderIcon />
													)
												}
												onClick={() => car?._id && likeCarHandler(user, car._id)}
											>
												{car?.carLikes}
											</Button>
										</Stack>
									</Stack>
								</Stack>

								<Stack className="thumbnail-list">
									{car?.carImages?.map((image: string, index: number) => (
										<Box
											key={index}
											className={`thumbnail-item ${slideImage === image ? 'active' : ''}`}
											onClick={() => changeImageHandler(image)}
										>
											<img src={`${REACT_APP_API_URL}/${image}`} alt={`${car?.carTitle} - Image ${index + 1}`} />
										</Box>
									))}
								</Stack>
							</Stack>
						</Stack>
						<Stack className="car-specs-config">
							<Stack className="left-config">
								<Stack className="specs-grid">
									<Stack className="spec-item">
										<Stack className="icon-box">
											<DirectionsCarIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Car Type</Typography>
											<Typography className="spec-value">{car?.carType}</Typography>
										</Stack>
									</Stack>
									<Stack className="spec-item">
										<Stack className="icon-box">
											<SpeedIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Mileage</Typography>
											<Typography className="spec-value">{car?.carMileage} km</Typography>
										</Stack>
									</Stack>
									<Stack className="spec-item">
										<Stack className="icon-box">
											<LocalGasStationIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Fuel Type</Typography>
											<Typography className="spec-value">{car?.carFuelType}</Typography>
										</Stack>
									</Stack>
									<Stack className="spec-item">
										<Stack className="icon-box">
											<ColorLensIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Color</Typography>
											<Typography className="spec-value">{car?.carColor}</Typography>
										</Stack>
									</Stack>
									<Stack className="spec-item">
										<Stack className="icon-box">
											<AirlineSeatReclineNormalIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Seats</Typography>
											<Typography className="spec-value">{car?.carSeats} seats</Typography>
										</Stack>
									</Stack>
									<Stack className="spec-item">
										<Stack className="icon-box">
											<SettingsIcon />
										</Stack>
										<Stack className="spec-content">
											<Typography className="spec-label">Transmission</Typography>
											<Typography className="spec-value">{car?.carTransmission}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className="car-features">
									<Typography className="section-title">Car Features</Typography>
									<Stack className="features-grid">
										{car?.carOptions?.map((option: string) => (
											<Stack className="feature-item" key={option}>
												<CheckCircleIcon className="feature-icon" />
												<Typography className="feature-text">
													{option
														.split('_')
														.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
														.join(' ')}
												</Typography>
											</Stack>
										))}
									</Stack>
								</Stack>
								{/* Comments section */}
								{carComments?.length > 0 && (
									<Stack className="reviews-config">
										<Typography className="section-title">Reviews ({commentTotal})</Typography>
										<Stack className="review-list">
											{carComments?.map((comment: Comment) => (
												<Review comment={comment} key={comment?._id} />
											))}
											<Box className="pagination-box">
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}
								<Stack className="leave-review-config">
									<Typography className="section-title">Leave A Review</Typography>
									<textarea
										placeholder="Write your review here..."
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Button
										className="submit-review-btn"
										variant="contained"
										onClick={createCommentHandler}
										disabled={!insertCommentData.commentContent.trim()}
									>
										Submit Review
									</Button>
								</Stack>
							</Stack>
							<Stack className="right-config">
								<Stack className="seller-info">
									<Typography className="section-title">Seller Information</Typography>
									<Stack className="seller-profile">
										<img
											className="profile-image"
											src={
												car?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${car?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt="Seller"
										/>
										<Stack className="profile-details">
											<Link href={`/member?memberId=${car?.memberData?._id}`}>
												<Typography className="seller-name">{car?.memberData?.memberNick}</Typography>
											</Link>
											<Typography className="seller-type">Verified Seller</Typography>
											<Stack className="seller-rating">
												<Rating value={4.5} readOnly precision={0.5} size="small" />
												<Typography className="rating-count">(32 reviews)</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack className="contact-buttons">
										<Button className="contact-button primary" startIcon={<PhoneIcon />}>
											{car?.memberData?.memberPhone}
										</Button>
										<Button className="contact-button secondary" startIcon={<EmailIcon />}>
											Send Message
										</Button>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						{/* Similar Cars Section */}
						{destinationCars.length > 0 && (
							<Stack className="similar-cars-config">
								<Stack className="title-pagination-box">
									<Stack className="title-box">
										<Typography className="section-title">Similar Cars</Typography>
										<Typography className="section-subtitle">Other cars you might be interested in</Typography>
									</Stack>
									<Stack className="pagination-box">
										<WestIcon className="swiper-similar-prev" />
										<div className="swiper-similar-pagination"></div>
										<EastIcon className="swiper-similar-next" />
									</Stack>
								</Stack>
								<Stack className="cards-box">
									<Swiper
										className="similar-cars-swiper"
										slidesPerView={'auto'}
										spaceBetween={24}
										modules={[Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationCars.map((car: Car) => (
											<SwiperSlide className="similar-cars-slide" key={car._id}>
												<CarBigCard car={car} likeCarHandler={likeCarHandler} />
											</SwiperSlide>
										))}
									</Swiper>
								</Stack>
							</Stack>
						)}
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(PropertyDetail);
