import React, { useState } from 'react';
import { Stack, Box, Typography, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import PopularCarCard from './PopularCarCard';
import { Car } from '../../types/car/car';
import Link from 'next/link';
import { CarsInquiry } from '../../types/car/car.input';
import { GET_CARS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { useTranslation } from 'next-i18next';

interface PopularCarsProps {
	initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCars, setPopularCars] = useState<Car[]>([]);
	const [activeBrand, setActiveBrand] = useState(initialInput.search.brandList?.[0] || '');
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
			setPopularCars(data?.getCars?.list);
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

	const carSearchChangeHandler = async (brand: string) => {
		try {
			const updatedSearch = { ...initialInput.search };

			// If brand is empty (All), remove brandList
			if (brand === '') {
				delete updatedSearch.brandList;
			} else {
				updatedSearch.brandList = [brand];
			}

			await getCarsRefetch({
				input: {
					...initialInput,
					search: updatedSearch,
				},
			});

			setActiveBrand(brand);
		} catch (err: any) {
			console.log('ERROR, carSearchChangeHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	if (!popularCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<h2>{t('Popular Car Listings')}</h2>
						</Box>
					</Stack>
					<Stack className="car-filter-box">
						<Stack className="car-filter-boxes">
							<Typography
								onClick={() => carSearchChangeHandler('HYUNDAI')}
								className={activeBrand === 'HYUNDAI' ? 'active' : ''}
							>
								{t('Hyundai')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('KIA')}
								className={activeBrand === 'KIA' ? 'active' : ''}
							>
								{t('KIA')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('CHEVROLET')}
								className={activeBrand === 'CHEVROLET' ? 'active' : ''}
							>
								{t('Chevrolet')}
							</Typography>
						</Stack>
						<Divider
							sx={{
								color: '#fff',
								width: '100%',
								height: '1px',
							}}
						/>
					</Stack>
					<Stack className={'card-box'}>
						{popularCars.length === 0 ? (
							<Stack
								component={'div'}
								className={'empty-list'}
								justifyContent={'center'}
								alignItems={'center'}
								height={'300px'}
							>
								Cars Empty
							</Stack>
						) : (
							<Swiper
								className={'popular-car-swiper'}
								slidesPerView={1}
								spaceBetween={16}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-popular-next',
									prevEl: '.swiper-popular-prev',
								}}
								pagination={{
									el: '.swiper-popular-pagination',
									clickable: true,
								}}
							>
								{popularCars.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'popular-property-slide'}>
											<PopularCarCard car={car} likeCarHandler={likeCarHandler} />
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
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('Popular Car Listings')}</span>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/car'}>
									<span>{t('See All Listings')}</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className="car-filter-box">
						<Stack className="car-filter-boxes">
							<Typography
								onClick={() => carSearchChangeHandler('HYUNDAI')}
								className={activeBrand === 'HYUNDAI' ? 'active' : ''}
							>
								{t('Hyundai')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('KIA')}
								className={activeBrand === 'KIA' ? 'active' : ''}
							>
								{t('KIA')}
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('CHEVROLET')}
								className={activeBrand === 'CHEVROLET' ? 'active' : ''}
							>
								{t('Chevrolet')}
							</Typography>
						</Stack>
						<Divider
							sx={{
								color: '#fff',
								width: '100%',
								height: '1px',
							}}
						/>
					</Stack>
					<Stack className={'card-box'}>
						{popularCars.length === 0 ? (
							<Stack
								component={'div'}
								className={'empty-list'}
								justifyContent={'center'}
								alignItems={'center'}
								height={'300px'}
							>
								Cars Empty
							</Stack>
						) : (
							<Swiper
								className={'popular-car-swiper'}
								slidesPerView={2}
								spaceBetween={20}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-popular-next',
									prevEl: '.swiper-popular-prev',
								}}
								pagination={{
									el: '.swiper-popular-pagination',
									clickable: true,
								}}
							>
								{popularCars.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'popular-property-slide'}>
											<PopularCarCard car={car} likeCarHandler={likeCarHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<Stack className={'pagination-box'}>
						<ChevronLeftIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<ChevronRightIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'carViews',
		direction: 'DESC',
		search: {
			brandList: ['HYUNDAI'],
		},
	},
};

export default PopularCars;
