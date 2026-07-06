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
import { differenceInDays } from 'date-fns';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL, GRAPHQL_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDeviceType } from '../../libs/utils';
import SEO from '../../libs/components/SEO';
import { vehicleJsonLd, breadcrumbJsonLd } from '../../libs/seo';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_CARS, GET_CAR } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import CarSpecs from '../../libs/components/car/detail/CarSpecs';
import SellerInfoBox from '../../libs/components/car/detail/SellerInfoBox';
import CarReviews from '../../libs/components/car/detail/CarReviews';
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import HeadsetIcon from '@mui/icons-material/Headset';
import SecurityIcon from '@mui/icons-material/Security';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import WifiIcon from '@mui/icons-material/Wifi';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SunroofIcon from '@mui/icons-material/Brightness5';
import TireRepairIcon from '@mui/icons-material/Build';
import UsbIcon from '@mui/icons-material/Usb';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import { CarFuelType, CarLocation, CarType, CarOptions } from '../../libs/enums/car.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { Member } from '../../libs/types/member/member';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getServerSideProps = async ({ locale, query, req }: any) => {
	const translations = await serverSideTranslations(locale, ['common']);
	let initialCar = null;
	const id = query?.id;
	if (id) {
		try {
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `query GetCar($input: String!) { getCar(carId: $input) { _id carTitle carDesc carPrice carImages carBrand carModel carType carFuelType carMileage carColor manufacturedAt carTransmission carSeats carOptions carViews carLikes carRank carAddress carLocation createdAt } }`,
					variables: { input: id },
				}),
			});
			const json = await res.json();
			initialCar = json?.data?.getCar ?? null;
		} catch {
			initialCar = null;
		}
	}
	return { props: { deviceType: getDeviceType(req), ...translations, initialCar } };
};

const CarDetail: NextPage = ({ initialComment, initialCar, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [carId, setCarId] = useState<string | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [sellerInfo, setSellerInfo] = useState<Member>();
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
			if (data?.getCar?.carImages?.[0]) setSlideImage(data.getCar.carImages[0]);
			if (getCarData?.getCar?.memberData) setSellerInfo(getCarData?.getCar?.memberData);
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
					locationList: getCarData?.getCar?.carLocation ? [getCarData.getCar.carLocation] : [],
				},
			},
		},
		skip: !carId,
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
			if (!getCarData?.getCar) return;

			const currentLikeState = getCarData.getCar.meLiked && getCarData.getCar.meLiked[0]?.myFavorite;

			await likeTargetCar({
				variables: { input: id },
				optimisticResponse: {
					__typename: 'Mutation',
					likeTargetCar: {
						__typename: 'Car',
						...getCarData.getCar,
						carLikes: currentLikeState ? getCarData.getCar.carLikes - 1 : getCarData.getCar.carLikes + 1,
						meLiked: [
							{
								__typename: 'Like',
								memberId: user._id,
								likeRefId: id,
								myFavorite: !currentLikeState,
							},
						],
					},
				},
			});

			// Refetch only the relevant data based on which car was liked
			if (getCarData.getCar._id === id) {
				await getCarRefetch({ input: id });
			} else {
				await getCarsRefetch({
					input: {
						page: 1,
						limit: 4,
						sort: 'createdAt',
						direction: Direction.DESC,
						search: {
							locationList: getCarData.getCar?.carLocation ? [getCarData.getCar.carLocation] : undefined,
						},
					},
				});
			}

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

	const car = getCarData?.getCar || initialCar;
	const carForSeo = car;
	const seoImage = carForSeo?.carImages?.[0] ? `${REACT_APP_API_URL}/${carForSeo.carImages[0]}` : undefined;
	const seoTags = carForSeo ? (
		<SEO
			canonical={`/car/detail?id=${carForSeo._id}`}
			title={carForSeo.carTitle}
			description={
				carForSeo.carDesc
					? String(carForSeo.carDesc).slice(0, 160)
					: `${carForSeo.carTitle} for sale on Solven — $${formatterStr(carForSeo.carPrice)}. Browse cars in Korea.`
			}
			image={seoImage}
			type="product"
			jsonLd={[
				vehicleJsonLd(carForSeo, seoImage),
				breadcrumbJsonLd([
					{ name: 'Home', path: '/' },
					{ name: 'Cars', path: '/car/' },
					{ name: carForSeo.carTitle, path: '/car/detail/?id=' + carForSeo._id },
				]),
			].filter(Boolean)}
		/>
	) : null;

	if (getCarsLoading) {
		return (
			<Stack
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '800px',
					borderRadius: '80px',
					background: '#f4f5f5',
				}}
			>
				{seoTags}
				<CircularProgress size={'6rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<div id="car-detail-page">
				{seoTags}
				<div className="container">
					<Stack className="car-detail-config">
						<Stack className="car-info-config">
							<Stack className="images-container">
								<Stack className="main-image-info-container">
									<Box className="main-image-box">
										<Image
											src={`${REACT_APP_API_URL}/${slideImage || car?.carImages?.[0]}`}
											alt={car?.carTitle || 'Car'}
											width={1200}
											height={900}
											sizes="(max-width: 768px) 100vw, 700px"
										/>
									</Box>
									<Stack className="thumbnail-list">
										{car?.carImages?.map((image: string, index: number) => (
											<Box
												key={index}
												className={`thumbnail-item ${slideImage === image ? 'active' : ''}`}
												onClick={() => changeImageHandler(image)}
											>
												<Image
												src={`${REACT_APP_API_URL}/${image}`}
												alt={`${car?.carTitle} - Image ${index + 1}`}
												width={200}
												height={200}
												sizes="120px"
											/>
											</Box>
										))}
									</Stack>

									<Stack className="car-info-box">
										<Stack className="content-wrapper">
											<Typography className="title-main">{car?.carTitle}</Typography>
											<Typography className="listed-date">
												Listed{' '}
												{car?.createdAt
													? differenceInDays(new Date(), new Date(car.createdAt))
													: 0}{' '}
												days ago
											</Typography>

											<Stack className="main-info-row">
												<Stack className="info-item">
													<AttachMoneyIcon />
													<Stack>
														<Typography className="info-value">
															${formatterStr(car?.carPrice)}
														</Typography>
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

											<Stack className="address-section">
												<Typography className="section-title">Location</Typography>
												<Typography className="address-text">
													{car?.carAddress || car?.carLocation || 'Address not available'}
												</Typography>
											</Stack>
										</Stack>

										<Stack className="action-buttons">
											<Button className="view-btn" startIcon={<RemoveRedEyeIcon />}>
												{car?.carViews}
											</Button>
											<Button
												className="like-btn"
												startIcon={
													getCarData?.getCar?.meLiked && getCarData?.getCar?.meLiked[0]?.myFavorite ? (
														<FavoriteIcon className="liked" />
													) : (
														<FavoriteBorderIcon />
													)
												}
												onClick={() => getCarData?.getCar?._id && likeCarHandler(user, getCarData.getCar._id)}
											>
												{car?.carLikes}
											</Button>
										</Stack>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack className="car-specs-config">
							<Stack className="left-config">
								<CarSpecs car={car} />

								<Stack className="right-config">
									<SellerInfoBox sellerInfo={sellerInfo} />
								</Stack>

								<CarReviews
									carComments={carComments}
									commentTotal={commentTotal}
									commentInquiry={commentInquiry}
									commentPaginationChangeHandler={commentPaginationChangeHandler}
									insertCommentData={insertCommentData}
									setInsertCommentData={setInsertCommentData}
									createCommentHandler={createCommentHandler}
								/>
							</Stack>
						</Stack>
						{/* Similar Cars Section */}
						{getCarsData?.getCars?.list?.length > 0 && (
							<Stack className="similar-cars-config">
								<Stack className="title-pagination-box">
									<Stack className="title-box">
										<Typography className="section-title">Similar Cars</Typography>
										<Typography className="section-subtitle">Other cars you might be interested in</Typography>
									</Stack>
								</Stack>
								<Stack className="cards-box">
									<Swiper
										className="similar-cars-swiper"
										slidesPerView={1.6}
										spaceBetween={12}
										modules={[Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{getCarsData?.getCars?.list?.map((car: Car) => (
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
	} else {
		return (
			<div id="car-detail-page">
				{seoTags}
				<div className="container">
					<Stack className="car-detail-config">
						<Stack className="car-info-config">
							<Stack className="images-container">
								<Stack className="main-image-info-container">
									<Box className="main-image-box">
										<Image
											src={`${REACT_APP_API_URL}/${slideImage || car?.carImages?.[0]}`}
											alt={car?.carTitle || 'Car'}
											width={1200}
											height={900}
											sizes="(max-width: 768px) 100vw, 700px"
										/>
									</Box>

									<Stack className="car-info-box">
										<Stack className="content-wrapper">
											<Typography className="title-main">{car?.carTitle}</Typography>
											<Typography className="listed-date">
												Listed{' '}
												{car?.createdAt
													? differenceInDays(new Date(), new Date(car.createdAt))
													: 0}{' '}
												days ago
											</Typography>

											<Stack className="main-info-row">
												<Stack className="info-item">
													<AttachMoneyIcon />
													<Stack>
														<Typography className="info-value">
															${formatterStr(car?.carPrice)}
														</Typography>
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

											<Stack className="address-section">
												<Typography className="section-title">Location</Typography>
												<Typography className="address-text">
													{car?.carAddress || car?.carLocation || 'Address not available'}
												</Typography>
											</Stack>
										</Stack>

										<Stack className="action-buttons">
											<Button className="view-btn" startIcon={<RemoveRedEyeIcon />}>
												{car?.carViews}
											</Button>
											<Button
												className="like-btn"
												startIcon={
													getCarData?.getCar?.meLiked && getCarData?.getCar?.meLiked[0]?.myFavorite ? (
														<FavoriteIcon className="liked" />
													) : (
														<FavoriteBorderIcon />
													)
												}
												onClick={() => getCarData?.getCar?._id && likeCarHandler(user, getCarData.getCar._id)}
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
											<Image
												src={`${REACT_APP_API_URL}/${image}`}
												alt={`${car?.carTitle} - Image ${index + 1}`}
												width={200}
												height={200}
												sizes="120px"
											/>
										</Box>
									))}
								</Stack>
							</Stack>
						</Stack>
						<Stack className="car-specs-config">
							<Stack className="left-config">
								<CarSpecs car={car} />
								<CarReviews
									carComments={carComments}
									commentTotal={commentTotal}
									commentInquiry={commentInquiry}
									commentPaginationChangeHandler={commentPaginationChangeHandler}
									insertCommentData={insertCommentData}
									setInsertCommentData={setInsertCommentData}
									createCommentHandler={createCommentHandler}
								/>
							</Stack>
							<Stack className="right-config">
								<SellerInfoBox sellerInfo={sellerInfo} />
							</Stack>
						</Stack>
						{/* Similar Cars Section */}
						{getCarsData?.getCars?.list?.length > 0 && (
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
										slidesPerView={4}
										spaceBetween={16}
										modules={[Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{getCarsData?.getCars?.list?.map((car: Car) => (
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

CarDetail.defaultProps = {
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

export default withLayoutBasic(CarDetail);
