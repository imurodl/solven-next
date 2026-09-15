import React, { useState } from 'react';
import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GET_MECHANIC_SERVICE_JOBS } from '../../../apollo/user/query';
import { UPDATE_SERVICE_JOB } from '../../../apollo/user/mutation';
import { ServiceJob } from '../../types/service-job/service-job';
import { ServiceJobStatus } from '../../enums/service-job.enum';
import { REACT_APP_API_URL } from '../../config';
import { useCurrency } from '../../context/CurrencyContext';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { RowSkeleton } from '../common/Skeletons';

const LIMIT = 8;

const MyServiceJobs = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { formatPrice } = useCurrency();
	const [page, setPage] = useState(1);
	const { data, loading, refetch } = useQuery(GET_MECHANIC_SERVICE_JOBS, {
		variables: { input: { page, limit: LIMIT, sort: 'createdAt', direction: -1, search: {} } },
		fetchPolicy: 'network-only',
	});
	const [updateJob] = useMutation(UPDATE_SERVICE_JOB);
	const jobs: ServiceJob[] = data?.getMechanicServiceJobs?.list ?? [];
	const total: number = data?.getMechanicServiceJobs?.metaCounter?.[0]?.total ?? 0;

	const remove = async (id: string) => {
		try {
			if (!(await sweetConfirmAlert(t('Delete this service job?') as string))) return;
			await updateJob({ variables: { input: { _id: id, serviceStatus: ServiceJobStatus.DELETE } } });
			await refetch();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	return (
		<div id="my-service-jobs-page" className="mypage-panel">
			<Stack className="main-title-box" direction="row" justifyContent="space-between" alignItems="center">
				<div>
					<Typography className="main-title">{t('My Service Jobs')}</Typography>
					<Typography className="sub-title">{t('Showcase the work you have completed')}</Typography>
				</div>
				<Button className="btn-primary" variant="contained" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addServiceJob' } })}>
					{t('Add Service Job')}
				</Button>
			</Stack>
			<Stack className="orders-list">
				{loading && jobs.length === 0 && [1, 2].map((i) => <RowSkeleton key={i} />)}
				{!loading && jobs.length === 0 && (
					<Stack className="empty-box">
						<Typography>{t('No service jobs yet')}</Typography>
					</Stack>
				)}
				{jobs.map((job) => (
					<Stack className="order-row" key={job._id}>
						<div className="order-car" onClick={() => router.push({ pathname: '/service/detail', query: { id: job._id } })}>
							<img src={job.serviceImages?.[0] ? `${REACT_APP_API_URL}/${job.serviceImages[0]}` : '/img/banner/header2.svg'} alt={job.serviceTitle} />
							<div className="meta">
								<b>{job.serviceTitle}</b>
								<span className="muted">
									{t(`service.type.${job.serviceType}`)} · {job.carBrand} {job.carModel}
								</span>
								<span className="muted">
									{job.serviceViews} {t('views')} · {job.serviceLikes} {t('likes')}
								</span>
							</div>
						</div>
						<div className="order-money">
							<b>{formatPrice(job.servicePrice)}</b>
							<span className="muted">{new Date(job.createdAt).toLocaleDateString()}</span>
						</div>
						<div className="order-state">
							<span className={`status-chip ${job.serviceStatus.toLowerCase()}`}>{job.serviceStatus}</span>
							<Button className="btn-text" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addServiceJob', jobId: job._id } })}>
								{t('Edit')}
							</Button>
							<Button className="btn-text danger" onClick={() => remove(job._id)}>
								{t('Delete')}
							</Button>
						</div>
					</Stack>
				))}
			</Stack>
			{total > LIMIT && (
				<Stack className="pagination-config" alignItems="center">
					<Pagination page={page} count={Math.ceil(total / LIMIT)} onChange={(_, v) => setPage(v)} shape="rounded" />
				</Stack>
			)}
		</div>
	);
};

export default MyServiceJobs;
