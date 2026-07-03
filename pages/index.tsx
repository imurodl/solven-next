import { useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import SEO from '../libs/components/SEO';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularCars from '../libs/components/homepage/PopularCars';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendCars from '../libs/components/homepage/TrendCars';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDeviceType } from '../libs/utils';
import CtaSection from '../libs/components/homepage/CtaSection';
import CarBrands from '../libs/components/homepage/CarBrands';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: {
		deviceType: getDeviceType(req),
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			AOS.init({
				duration: 1200,
				easing: 'ease-in-out',
				once: true,
			});
		}
	}, []);

	if (device === 'mobile') {
		return (
			<Stack className="home-page">
				<SEO
					title="Buy & Sell Cars in Korea"
					description="Solven is South Korea's trusted car marketplace. Browse thousands of new and used cars, compare prices, and connect with verified agents."
				/>
				<CarBrands />
				<TrendCars />
				<PopularCars />
				<TopAgents />
				<CommunityBoards />
				<CtaSection />
			</Stack>
		);
	} else {
		return (
			<Stack className="home-page">
				<SEO
					title="Buy & Sell Cars in Korea"
					description="Solven is South Korea's trusted car marketplace. Browse thousands of new and used cars, compare prices, and connect with verified agents."
				/>
				<div data-aos="fade-up">
					<CarBrands />
				</div>
				<div data-aos="fade-up">
					<TrendCars />
				</div>
				<div data-aos="fade-up">
					<PopularCars />
				</div>
				<div data-aos="fade-up">
					<TopAgents />
				</div>
				<div data-aos="fade-up">
					<CommunityBoards />
				</div>
				<div data-aos="fade-up">
					<CtaSection />
				</div>
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
