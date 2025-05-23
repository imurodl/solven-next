import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularCars from '../libs/components/homepage/PopularCars';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendCars from '../libs/components/homepage/TrendCars';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CtaSection from '../libs/components/homepage/CtaSection';
import CarBrands from '../libs/components/homepage/CarBrands';
import CarTempCards from '../libs/components/car/CarTempCards';

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
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* @ts-ignore */}
				<CarBrands />
				<TrendCars />
				<PopularCars />
				<TopAgents />
				<CommunityBoards />
				<CtaSection />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
