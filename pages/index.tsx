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
import HotDeals from '../libs/components/homepage/HotDeals';
import AiFinderBanner from '../libs/components/homepage/AiFinderBanner';
import ServiceBanner from '../libs/components/homepage/ServiceBanner';
import SocialProofToast from '../libs/components/common/SocialProofToast';
import PromoModal from '../libs/components/common/PromoModal';
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
				<HotDeals />
				<AiFinderBanner />
				<PopularCars />
				<ServiceBanner />
				<TopAgents />
				<CommunityBoards />
				<CtaSection />
				<SocialProofToast />
				<PromoModal />
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
					<HotDeals />
				</div>
				<div data-aos="fade-up">
					<AiFinderBanner />
				</div>
				<div data-aos="fade-up">
					<PopularCars />
				</div>
				<div data-aos="fade-up">
					<ServiceBanner />
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
				<SocialProofToast />
				<PromoModal />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
