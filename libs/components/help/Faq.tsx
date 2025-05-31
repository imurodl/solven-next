import React, { SyntheticEvent, useState } from 'react';
import { Box, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import CircularProgress from '@mui/material/CircularProgress';

const Faq = () => {
	const device = useDeviceDetect();
	const [expanded, setExpanded] = useState<string | false>('panel1');

	const { data: faqData, loading } = useQuery(GET_ALL_NOTICES, {
		variables: {
			input: {
				noticeCategory: NoticeCategory.FAQ,
				noticeStatus: NoticeStatus.ACTIVE,
			},
		},
	});

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	}

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Stack className={'faq-content'}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
				<Typography variant="h4" component="h1" className={'title'} sx={{ mb: 0 }}>
					Frequently Asked Questions
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
					Find answers to common questions about our services
				</Typography>
			</Box>

			<Box className={'wrap'}>
				{faqData?.getAllNotices?.list
					.slice()
					.reverse()
					.map((faq: any, index: number) => (
						<Accordion
							key={faq._id}
							expanded={expanded === `panel${index + 1}`}
							onChange={handleChange(`panel${index + 1}`)}
							sx={{
								'&.MuiAccordion-root': {
									borderRadius: '12px',
									mb: 2,
									overflow: 'hidden',
									border: '1px solid #E2E8F0',
									'&:before': {
										display: 'none',
									},
									'&.Mui-expanded': {
										margin: '8px 0',
									},
								},
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								sx={{
									backgroundColor: '#ffffff',
									'&:hover': {
										backgroundColor: '#F8FAFC',
									},
									'&.Mui-expanded': {
										backgroundColor: '#F8FAFC',
									},
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<HelpOutlineIcon sx={{ color: '#3B82F6' }} />
									<Typography sx={{ color: '#1E293B', fontWeight: 500 }}>{faq.noticeTitle}</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									backgroundColor: '#ffffff',
									borderTop: '1px solid #E2E8F0',
									p: 3,
								}}
							>
								<Typography sx={{ color: '#64748B', lineHeight: 1.6 }}>{faq.noticeContent}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</Stack>
	);
};

export default Faq;
