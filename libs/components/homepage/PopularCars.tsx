import React, { useState } from 'react';
import { Stack, Box, Typography, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularCarCard from './PopularCarCard';
import { Car } from '../../types/car/car';
import Link from 'next/link';
import { CarsInquiry } from '../../types/car/car.input';
import { GET_CARS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PopularCarsProps {
	initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCars, setPopularCars] = useState<Car[]>([]);
	const [activeBrand, setActiveBrand] = useState(initialInput.search.brandList?.[0]);

	/** APOLLO REQUESTS **/
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
	const carSearchChangeHandler = async (brand: string) => {
		try {
			await getCarsRefetch({
				input: {
					...initialInput,
					search: {
						...initialInput.search,
						brandList: [brand], // ✅ update brandList inside search
					},
				},
			});
			setActiveBrand(brand); // update activeBrand for UI state
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
						<span>Popular cars</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularCars.map((car: Car) => {
								return (
									<SwiperSlide key={car._id} className={'popular-property-slide'}>
										<PopularCarCard car={car} />
									</SwiperSlide>
								);
							})}
						</Swiper>
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
							<span>Popular Car Listings</span>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/car'}>
									<span>See All Categories</span>
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
								Hyundai
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('KIA')}
								className={activeBrand === 'KIA' ? 'active' : ''}
							>
								KIA
							</Typography>
							<Typography
								onClick={() => carSearchChangeHandler('RENAULT KOREA')}
								className={activeBrand === 'RENAULT KOREA' ? 'active' : ''}
							>
								Renault Korea
							</Typography>
						</Stack>
						<Divider color={'#fff'} width={'100%'} height={'1px'} />
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={20}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularCars.map((car: Car) => {
								return (
									<SwiperSlide key={car._id} className={'popular-property-slide'}>
										<PopularCarCard car={car} />
									</SwiperSlide>
								);
							})}
						</Swiper>
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
		limit: 7,
		sort: 'carViews',
		direction: 'DESC',
		search: {
			// brandList: ['HYUNDAI'],
		},
	},
};

export default PopularCars;
