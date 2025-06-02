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
import { useTranslation } from 'next-i18next';

const CarBrands: NextPage<{ initialInput?: CarsInquiry }> = ({ initialInput }) => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');

	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(
		initialInput || {
			page: 1,
			limit: 8,
			search: {},
		},
	);

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
		<section className="car-brands-section">
			<Stack className="car-brands-container">
				<Stack className="info-box">
					<h2 className="section-title">{t('Explore Our Premium Brands')}</h2>
					<Box component={'div'} className={'right'}>
						<Stack className={'pagination-box'} flexDirection={'row'} alignItems={'center'}>
							<WestIcon className={'swiper-brand-prev'} />
							<div className={'swiper-brand-pagination'}></div>
							<EastIcon className={'swiper-brand-next'} />
						</Stack>
					</Box>
				</Stack>
				<Stack className="card-box">
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
						className="swiper-container"
					>
						{getCarBrandsData?.getCarBrandsByUser?.slice(0, 8).map((carBrand: CarBrand) => {
							return (
								<SwiperSlide key={carBrand._id} className="brand-slide">
									<Stack onClick={() => pushBrandHandler(carBrand.carBrandName)} className="brand-item">
										<img
											alt={carBrand.carBrandName}
											src={`${REACT_APP_API_URL}/${carBrand.carBrandImg}`}
											width={100}
											height={60}
											style={{ objectFit: 'contain' }}
										/>
										<Typography component="span" className="brand-name">
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
		limit: 8,
		search: {},
	},
};

export default CarBrands;
