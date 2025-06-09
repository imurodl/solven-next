import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ScrollToTop from '../common/ScrollToTop';
import TopBasic from '../TopBasic';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/car':
					title = 'Car Search';
					desc = 'Home / Listings';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Home / Agents';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Home / Agents / Detail';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / My Page';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / Community';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / Community / Detail';
					break;
				case '/help':
					title = 'Help';
					desc = 'Home / Help';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / Member';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

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

						<Stack id={'main'}>
							<Component {...props} title={memoizedValues.title} desc={memoizedValues.desc} />
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
							<TopBasic />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} title={memoizedValues.title} desc={memoizedValues.desc} />
						</Stack>

						{router.pathname === '/404' ? '' : <Chat />}
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

export default withLayoutBasic;
