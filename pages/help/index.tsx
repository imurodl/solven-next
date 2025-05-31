import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/help/Notice';
import Faq from '../../libs/components/help/Faq';
import Terms from '../../libs/components/help/Terms';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SupportIcon from '@mui/icons-material/Support';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArticleIcon from '@mui/icons-material/Article';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = (props: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const tab = router.query.tab ?? 'notice';

	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/help',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	}

	return (
		<div id="pc-wrap">
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<Box className={'cs-main-info'}>
						<Box className={'info'}>
							<Typography component="span">Customer Support</Typography>
							<Typography component="p">
								<Link href="/">Home</Link> / Help
							</Typography>
						</Box>

						<Box className={'btns'}>
							<div className={tab === 'notice' ? 'active' : ''} onClick={() => changeTabHandler('notice')}>
								<SupportIcon />
								Notices & Updates
							</div>
							<div className={tab === 'faq' ? 'active' : ''} onClick={() => changeTabHandler('faq')}>
								<QuestionAnswerIcon />
								FAQ
							</div>
							<div className={tab === 'terms' ? 'active' : ''} onClick={() => changeTabHandler('terms')}>
								<ArticleIcon />
								Terms & Conditions
							</div>
						</Box>
					</Box>

					<Box className={'cs-content'}>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
						{tab === 'terms' && <Terms />}
					</Box>
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(CS);
