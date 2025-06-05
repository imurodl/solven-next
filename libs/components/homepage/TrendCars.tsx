'use client';
import { useState } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import type { Car } from '../../types/car/car';
import type { CarsInquiry } from '../../types/car/car.input';
import TrendCarCard from './TrendCarCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import type { T } from '../../types/common';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useTranslation } from 'next-i18next';

interface TrendCarsProps {
	initialInput: CarsInquiry;
}

const TrendCars = (props: TrendCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendCars, setTrendCars] = useState<Car[]>([]);
	const [activeSort, setActiveSort] = useState(initialInput.sort);
	const { t, i18n } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendCars(data?.getCars?.list);
		},
	});

	/** HANDLERS **/
	const likeCarHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likeCarHandler Mutation
			await likeTargetCar({ variables: { input: id } });

			//execute getCarsRefetch
			await getCarsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const carSearchChangeHandler = async (sortInput: string) => {
		try {
			await getCarsRefetch({
				input: {
					...initialInput,
					sort: sortInput,
				},
			});
			setActiveSort(sortInput);
		} catch (err: any) {
			console.log('ERROR, carSearchChangeHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	if (trendCars) console.log('trendCars:', trendCars);
	if (!trendCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trending Cars</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-car-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendCars.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'trend-car-slide'}>
											<TrendCarCard car={car} likeCarHandler={likeCarHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('Featured Car Listings')}</span>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className="car-filter-box">
						<Stack className="car-filter-boxes">
							<Typography
								onClick={() => carSearchChangeHandler('carViews')}
								className={activeSort === 'carViews' ? 'active' : ''}
							>
								{t('Popular Cars')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('carLikes')}
								className={activeSort === 'carLikes' ? 'active' : ''}
							>
								{t('Trending Cars')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('carRank')}
								className={activeSort === 'carRank' ? 'active' : ''}
							>
								{t('Top Cars')}
							</Typography>
						</Stack>
						<Divider
							sx={{
								color: '#e9e9e9',
								width: '100%',
								height: '1px',
							}}
						/>
					</Stack>
					<Stack className={'card-box'}>
						{trendCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-car-swiper'}
								slidesPerView={4}
								spaceBetween={10}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendCars.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'trend-car-slide'}>
											<TrendCarCard car={car} likeCarHandler={likeCarHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'carViews',
		direction: 'DESC',
		search: {},
	},
};

export default TrendCars;
