import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularCars from '../libs/components/homepage/PopularCars';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendCars from '../libs/components/homepage/TrendCars';
import TopCars from '../libs/components/homepage/TopCars';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Features from '../libs/components/homepage/Features';
import CtaSection from '../libs/components/homepage/CtaSection';
import CarBrands from '../libs/components/homepage/CarBrands';
import CarTempCards from '../libs/components/car/CarTempCards';
import Background4 from '../libs/components/homepage/FeatureData';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendCars />
				<PopularCars />
				<Advertisement />
				<TopCars />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* @ts-ignore */}
				<CarBrands />
				<TrendCars />
				<Background4 />
				<Features />
				<PopularCars />
				<Advertisement />
				<TopCars />
				<TopAgents />
				<Events />
				<CommunityBoards />
				<CtaSection />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
