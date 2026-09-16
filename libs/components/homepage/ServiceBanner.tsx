import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Button } from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { GET_SERVICE_JOBS } from '../../../apollo/user/query';
import { ServiceJob } from '../../types/service-job/service-job';
import ServiceJobCard from '../service/ServiceJobCard';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Homepage teaser for the service vertical: latest three showcases + CTA.
const ServiceBanner = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const device = useDeviceDetect();
	const { data } = useQuery(GET_SERVICE_JOBS, {
		variables: { input: { page: 1, limit: 3, sort: 'serviceRank', direction: 'DESC', search: {} } },
		fetchPolicy: 'cache-and-network',
	});
	const jobs: ServiceJob[] = data?.getServiceJobs?.list ?? [];

	return (
		<Stack className="service-banner">
			<Stack className="container">
				<div className="service-banner-card">
					<div className="text">
						<span className="eyebrow">
							<BuildOutlinedIcon fontSize="inherit" /> {t('Service')}
						</span>
						<Typography className="title">{t('Repairs, inspections and detailing by trusted mechanics')}</Typography>
						<Typography className="sub">{t('service.banner.sub')}</Typography>
						<Button className="btn-light" variant="contained" onClick={() => router.push('/service')}>
							{t('Explore service')}
						</Button>
					</div>
				</div>
				{jobs.length > 0 && (
					<div className={`service-grid ${device === 'mobile' ? 'mobile' : ''}`}>
						{jobs.map((job) => (
							<ServiceJobCard key={job._id} job={job} />
						))}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default ServiceBanner;
