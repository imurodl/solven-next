import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { CarBrand } from '../../types/car/car-brand';
import { REACT_APP_API_URL } from '../../config';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { CarsInquiry } from '../../types/car/car.input';
import { NextPage } from 'next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const CarBrands: NextPage<{ initialInput: CarsInquiry }> = ({ initialInput }) => {
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);

	const { data: getCarBrandsData } = useQuery(GET_CAR_BRANDS_BY_USER, {
		fetchPolicy: 'network-only',
	});

	const pushBrandHandler = (brandName: string) => {
		router.push({
			pathname: '/car',
			query: {
				input: JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						brandList: [brandName],
						modelList: [],
					},
				}),
			},
		});
	};

	return (
		<section
			style={{
				marginTop: '-80px',
				padding: '80px 0',
				backgroundColor: '#F9FBFC',
				borderTopLeftRadius: '80px',
				borderTopRightRadius: '80px',
				position: 'relative',
				zIndex: 1,
				overflow: 'hidden',
			}}
		>
			<Stack style={{ maxWidth: '1300px', margin: '0 auto' }}>
				<Stack
					className={'info-box'}
					sx={{ marginBottom: '40px', textAlign: 'center', flexDirection: 'row', justifyContent: 'space-between' }}
				>
					<h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Explore Our Premium Brands</h2>
					<Box component={'div'} className={'right'}>
						<Stack className={'pagination-box'} flexDirection={'row'} alignItems={'center'}>
							<WestIcon className={'swiper-brand-prev'} background={'#000'} />
							<div className={'swiper-brand-pagination'} color={'#000'}></div>
							<EastIcon className={'swiper-brand-next'} background={'#000'} />
						</Stack>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					<Swiper
						slidesPerView={6}
						spaceBetween={10}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-brand-next',
							prevEl: '.swiper-brand-prev',
						}}
						pagination={{
							el: '.swiper-brand-pagination',
						}}
						style={{
							width: '100%',
							height: 'auto',
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						{getCarBrandsData?.getCarBrandsByUser?.map((carBrand: CarBrand) => {
							return (
								<SwiperSlide
									key={carBrand._id}
									style={{
										width: 'auto',
										height: 'auto',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Stack
										onClick={() => pushBrandHandler(carBrand.carBrandName)}
										flexDirection={'column'}
										alignItems={'center'}
										width={'200px'}
										padding={'26px'}
									>
										<img
											alt={carBrand.carBrandName}
											src={`${REACT_APP_API_URL}/${carBrand.carBrandImg}`}
											width={100}
											height={60}
											style={{ objectFit: 'contain' }}
										/>
										<Typography component="span" sx={{ cursor: 'pointer' }}>
											{carBrand.carBrandName}
										</Typography>
									</Stack>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</Stack>
			</Stack>
		</section>
	);
};

CarBrands.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 500000000, // adjust if needed
			},
			mileageRange: {
				start: 0,
				end: 500000, // adjust if needed
			},
			yearRange: {
				start: 1990,
				end: new Date().getFullYear(),
			},
		},
	},
};

export default CarBrands;
