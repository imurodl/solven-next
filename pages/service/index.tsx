import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { Button, MenuItem, Pagination, Select, Stack, TextField, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../../libs/utils';
import { GET_MECHANICS, GET_SERVICE_JOBS } from '../../apollo/user/query';
import { LIKE_TARGET_SERVICE_JOB } from '../../apollo/user/mutation';
import { ServiceJob } from '../../libs/types/service-job/service-job';
import { Member } from '../../libs/types/member/member';
import { ServiceType } from '../../libs/enums/service-job.enum';
import { CarLocation } from '../../libs/enums/car.enum';
import ServiceJobCard from '../../libs/components/service/ServiceJobCard';
import AgentCard from '../../libs/components/common/AgentCard';
import { SkeletonGrid } from '../../libs/components/common/Skeletons';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import SEO from '../../libs/components/SEO';
import { GRAPHQL_URL } from '../../libs/config';

const LIMIT = 9;

export const getServerSideProps = async ({ locale, req }: any) => {
	const translations = await serverSideTranslations(locale, ['common']);
	let initialJobs = null;
	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `query($input: ServiceJobsInquiry!){ getServiceJobs(input:$input){ list { _id serviceType serviceTitle carBrand carModel manufacturedAt servicePrice serviceDuration serviceImages serviceLocation serviceViews serviceLikes memberId memberData { _id memberNick memberImage } } metaCounter { total } } }`,
				variables: { input: { page: 1, limit: LIMIT, sort: 'createdAt', direction: 'DESC', search: {} } },
			}),
		});
		initialJobs = (await res.json())?.data?.getServiceJobs ?? null;
	} catch {
		initialJobs = null;
	}
	return { props: { deviceType: getDeviceType(req), ...translations, initialJobs } };
};

// Service vertical: mechanics' completed-work showcases + mechanic directory.
const ServicePage: NextPage = ({ initialJobs }: any) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [tab, setTab] = useState<'jobs' | 'mechanics'>('jobs');
	const [page, setPage] = useState(1);
	const [type, setType] = useState<string>('');
	const [location, setLocation] = useState<string>('');
	const [text, setText] = useState('');

	const search: any = {};
	if (type) search.typeList = [type];
	if (location) search.locationList = [location];
	if (text.trim()) search.text = text.trim();

	const { data, loading, refetch } = useQuery(GET_SERVICE_JOBS, {
		variables: { input: { page, limit: LIMIT, sort: 'createdAt', direction: 'DESC', search } },
		fetchPolicy: 'cache-and-network',
	});
	const { data: mechData, loading: mechLoading } = useQuery(GET_MECHANICS, {
		variables: { input: { page: 1, limit: 30, sort: 'memberRank', direction: 'DESC', search: {} } },
		skip: tab !== 'mechanics',
	});
	const [likeJob] = useMutation(LIKE_TARGET_SERVICE_JOB);

	const jobs: ServiceJob[] = data?.getServiceJobs?.list ?? initialJobs?.list ?? [];
	const total: number = data?.getServiceJobs?.metaCounter?.[0]?.total ?? initialJobs?.metaCounter?.[0]?.total ?? 0;
	const mechanics: Member[] = mechData?.getMechanics?.list ?? [];

	const likeHandler = async (user: any, id: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeJob({ variables: { serviceJobId: id } });
			await refetch();
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<div id="service-page">
			<SEO title={t('Car service & mechanics') as string} description={t('service.seoDesc') as string} canonical="/service" />
			<div className="container">
				<Stack className="service-hero">
					<Typography className="hero-title">{t('Trusted mechanics, real work')}</Typography>
					<Typography className="hero-sub">{t('service.heroSub')}</Typography>
					<Stack direction="row" className="tabs">
						<button className={tab === 'jobs' ? 'active' : ''} onClick={() => setTab('jobs')}>
							{t('Completed work')} {total ? `(${total})` : ''}
						</button>
						<button className={tab === 'mechanics' ? 'active' : ''} onClick={() => setTab('mechanics')}>
							{t('Mechanics')}
						</button>
					</Stack>
				</Stack>

				{tab === 'jobs' && (
					<>
						<Stack direction={{ xs: 'column', md: 'row' }} className="service-filters" spacing={1.5}>
							<TextField size="small" placeholder={t('Search work, brand, model...') as string} value={text} onChange={(e) => setText(e.target.value)} fullWidth />
							<Select size="small" value={type} displayEmpty onChange={(e) => setType(String(e.target.value))} className="filter-select">
								<MenuItem value="">{t('All service types')}</MenuItem>
								{Object.values(ServiceType).map((v) => (
									<MenuItem key={v} value={v}>
										{t(`service.type.${v}`)}
									</MenuItem>
								))}
							</Select>
							<Select size="small" value={location} displayEmpty onChange={(e) => setLocation(String(e.target.value))} className="filter-select">
								<MenuItem value="">{t('All locations')}</MenuItem>
								{Object.values(CarLocation).map((v) => (
									<MenuItem key={v} value={v}>
										{v}
									</MenuItem>
								))}
							</Select>
							{(type || location || text) && (
								<Button
									className="btn-outline"
									onClick={() => {
										setType('');
										setLocation('');
										setText('');
										setPage(1);
									}}
								>
									{t('Reset')}
								</Button>
							)}
						</Stack>

						{loading && jobs.length === 0 ? (
							<SkeletonGrid count={6} />
						) : jobs.length === 0 ? (
							<Stack className="empty-box">
								<Typography>{t('No service work found')}</Typography>
							</Stack>
						) : (
							<div className="service-grid">
								{jobs.map((job) => (
									<ServiceJobCard key={job._id} job={job} likeHandler={likeHandler} />
								))}
							</div>
						)}
						{total > LIMIT && (
							<Stack alignItems="center" className="pagination-config">
								<Pagination page={page} count={Math.ceil(total / LIMIT)} onChange={(_, v) => setPage(v)} shape="rounded" />
							</Stack>
						)}
					</>
				)}

				{tab === 'mechanics' &&
					(mechLoading ? (
						<SkeletonGrid count={6} kind="agent" />
					) : mechanics.length === 0 ? (
						<Stack className="empty-box">
							<Typography>{t('No mechanics registered yet')}</Typography>
						</Stack>
					) : (
						<div className="mechanic-grid">
							{mechanics.map((m) => (
								<AgentCard key={m._id} agent={m} likeMemberHandler={() => {}} />
							))}
						</div>
					))}
			</div>
		</div>
	);
};

export default withLayoutBasic(ServicePage);
