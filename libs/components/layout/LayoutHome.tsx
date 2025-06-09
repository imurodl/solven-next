import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Typography } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ScrollToTop from '../common/ScrollToTop';
import { useTranslation } from 'next-i18next';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const { t, i18n } = useTranslation('common');

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Solven</title>
						<meta name={'title'} content={`Solven`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<Stack className={'container'}>
								<Typography className={'header-main-title'}>{t('Find Your Perfect Car')}</Typography>
								<HeaderFilter />
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<p
								style={{
									width: '100%',
									height: '100px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								HomePage main content will be here
							</p>
							{/* <Component {...props} /> */}
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Solven</title>
						<meta name={'title'} content={`Solven`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<Stack className={'container'}>
								<Typography className={'header-main-subtitle'}>
									{t('Explore Local Car Listings — And Share Yours with Ease')}
								</Typography>
								<Typography className={'header-main-title'}>{t('Find Your Perfect Car')}</Typography>
								<HeaderFilter />
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />
						<ScrollToTop />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
