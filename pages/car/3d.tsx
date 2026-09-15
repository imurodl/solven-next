import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../../libs/utils';
import { GET_CAR } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';
import SEO from '../../libs/components/SEO';
import { localizeCar } from '../../libs/utils/localize';

// The custom element registers on import, so the viewer stays out of the SSR bundle.
const CarModelViewer = dynamic(() => import('../../libs/components/car/viewer/CarModelViewer'), { ssr: false });

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

const Car3dPage: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const carId = typeof router.query.id === 'string' ? router.query.id : '';
	const { data, loading } = useQuery(GET_CAR, { variables: { input: carId }, skip: !carId, fetchPolicy: 'cache-and-network' });
	const car = data?.getCar ?? null;
	const title = car ? localizeCar(car, router.locale).title : '';

	return (
		<Stack id="car-3d-page">
			<SEO title={car ? `${title} in 3D` : '3D View'} noindex />
			<Stack className="container">
				<Stack direction="row" alignItems="center" justifyContent="space-between" className="head" flexWrap="wrap" gap={1}>
					<div>
						<Typography className="page-title">{title || t('3D view')}</Typography>
						{car && (
							<Typography className="muted">
								{car.carBrand} {car.carModel} · {car.manufacturedAt}
							</Typography>
						)}
					</div>
					<Button className="btn-outline" startIcon={<ArrowBackIcon />} onClick={() => (carId ? router.push({ pathname: '/car/detail', query: { id: carId } }) : router.back())}>
						{t('Back to listing')}
					</Button>
				</Stack>
				{car?.car3dModel ? (
					<CarModelViewer
						src={`${REACT_APP_API_URL}/${car.car3dModel}`}
						poster={car.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : undefined}
						title={title}
					/>
				) : (
					<Typography className="muted empty">{loading ? t('Loading...') : t('This listing has no 3D model yet.')}</Typography>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Car3dPage);
