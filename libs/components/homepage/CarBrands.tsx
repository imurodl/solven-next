import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { CarBrand } from '../../types/car/car-brand';
import { REACT_APP_API_URL } from '../../config';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { CarsInquiry } from '../../types/car/car.input';
import { NextPage } from 'next';

const CarBrands: NextPage<{ initialInput: CarsInquiry }> = ({ initialInput }) => {
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);

	const { data: getCarBrandsData } = useQuery(GET_CAR_BRANDS_BY_USER, {
		fetchPolicy: 'network-only',
	});

	return (
		<section
			style={{
				marginTop: '-80px',
				padding: '80px 0',
				backgroundColor: '#f9f9f9',
				borderTopLeftRadius: '80px',
				borderTopRightRadius: '80px',
				position: 'relative',
				zIndex: 1,
				overflow: 'hidden',
			}}
		>
			<div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px' }}>
				<div style={{ marginBottom: '40px', textAlign: 'center' }}>
					<h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Explore Our Premium Brands</h2>
					<Link
						href={`/inventory-list-01`}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px',
							fontSize: '15px',
							fontWeight: 600,
							textDecoration: 'none',
							color: '#050B20',
						}}
					>
						Show All Brands
						<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none">
							<g clipPath="url(#clip0_601_3199)">
								<path
									d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z"
									fill="#050B20"
								/>
							</g>
							<defs>
								<clipPath id="clip0_601_3199">
									<rect width={14} height={14} fill="white" />
								</clipPath>
							</defs>
						</svg>
					</Link>
				</div>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						gap: '24px',
					}}
				>
					{getCarBrandsData?.getCarBrandsByUser?.map((carBrand: CarBrand, index: number) => (
						<Link
							key={index}
							href={{
								pathname: '/car',
								query: {
									input: JSON.stringify({
										...searchFilter,
										search: {
											...searchFilter.search,
											brandList: [carBrand.carBrandName],
											modelList: [],
										},
									}),
								},
							}}
							scroll={false}
							style={{
								width: '150px',
								textAlign: 'center',
								backgroundColor: '#fff',
								borderRadius: '12px',
								padding: '20px 10px',
								boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
								transition: 'transform 0.3s ease',
							}}
						>
							<div style={{ marginBottom: '12px' }}>
								<div>
									<img
										alt={carBrand.carBrandName}
										src={`${REACT_APP_API_URL}/${carBrand.carBrandImg}`}
										width={100}
										height={60}
										style={{ objectFit: 'contain' }}
									/>
								</div>
							</div>
							<h6 style={{ fontSize: '14px', fontWeight: 600, color: '#050B20' }}>
								<Typography component="span" sx={{ cursor: 'pointer' }}>
									{carBrand.carBrandName}
								</Typography>
							</h6>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

CarBrands.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			brandList: [],
		},
	},
};

export default CarBrands;
