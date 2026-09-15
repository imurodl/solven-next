import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { getDeviceType } from '../../libs/utils';
import { GET_SERVICE_JOB, GET_SERVICE_JOBS } from '../../apollo/user/query';
import { LIKE_TARGET_SERVICE_JOB } from '../../apollo/user/mutation';
import { ServiceJob } from '../../libs/types/service-job/service-job';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../../libs/config';
import { useCurrency } from '../../libs/context/CurrencyContext';
import { localizeService } from '../../libs/utils/localize';
import ServiceJobCard from '../../libs/components/service/ServiceJobCard';
import ServiceRequestModal from '../../libs/components/service/ServiceRequestModal';
import UserAvatar from '../../libs/components/common/UserAvatar';
import RatingStars from '../../libs/components/common/RatingStars';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import SEO from '../../libs/components/SEO';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: { deviceType: getDeviceType(req), ...(await serverSideTranslations(locale, ['common'])) },
});

const ServiceDetail: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { formatPrice } = useCurrency();
	const id = typeof router.query.id === 'string' ? router.query.id : '';
	const [slide, setSlide] = useState(0);
	const [requestOpen, setRequestOpen] = useState(false);

	const { data, loading, refetch } = useQuery(GET_SERVICE_JOB, { skip: !id, variables: { serviceJobId: id }, fetchPolicy: 'network-only' });
	const job: ServiceJob | undefined = data?.getServiceJob;
	const { data: moreData } = useQuery(GET_SERVICE_JOBS, {
		skip: !job,
		variables: { input: { page: 1, limit: 4, sort: 'createdAt', direction: -1, search: { memberId: job?.memberId } } },
	});
	const [likeJob] = useMutation(LIKE_TARGET_SERVICE_JOB);

	const like = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeJob({ variables: { serviceJobId: id } });
			await refetch();
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	if (loading || !job) {
		return (
			<div id="service-detail-page">
				<div className="container empty">{loading ? <CircularProgress /> : <Typography>{t('Not found')}</Typography>}</div>
			</div>
		);
	}

	const localized = localizeService(job, router.locale);
	const liked = job.meLiked?.[0]?.myFavorite;
	const mechanic = job.memberData;
	const others = (moreData?.getServiceJobs?.list ?? []).filter((j: ServiceJob) => j._id !== job._id).slice(0, 3);
	const cover = job.serviceImages?.[slide] ? `${REACT_APP_API_URL}/${job.serviceImages[slide]}` : '/img/banner/header2.svg';

	return (
		<div id="service-detail-page">
			<SEO title={job.serviceTitle} description={(job.serviceDesc || '').slice(0, 160)} image={cover} canonical={`/service/detail?id=${job._id}`} />
			<div className="container">
				<Stack className="detail-layout" direction={{ xs: 'column', md: 'row' }}>
					<Stack className="detail-main">
						<div className="gallery">
							<img className="main" src={cover} alt={job.serviceTitle} />
							{job.serviceImages.length > 1 && (
								<div className="thumbs">
									{job.serviceImages.map((img, i) => (
										<img key={img} src={`${REACT_APP_API_URL}/${img}`} alt="" className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} />
									))}
								</div>
							)}
						</div>
						<Stack className="head">
							<span className="type-badge">
								<BuildOutlinedIcon fontSize="inherit" /> {t(`service.type.${job.serviceType}`)}
							</span>
							<Typography className="title">{localized.title}</Typography>
							<Stack direction="row" className="meta" spacing={2} flexWrap="wrap">
								<span>
									<DirectionsCarFilledOutlinedIcon fontSize="inherit" /> {job.carBrand} {job.carModel} {job.manufacturedAt ?? ''}
								</span>
								<span>
									<PlaceOutlinedIcon fontSize="inherit" /> {job.serviceLocation} · {job.serviceAddress}
								</span>
								<span>
									<ScheduleOutlinedIcon fontSize="inherit" /> ~{job.serviceDuration}h
								</span>
								<span>
									<RemoveRedEyeIcon fontSize="inherit" /> {job.serviceViews}
								</span>
							</Stack>
						</Stack>
						<Typography className="desc">{localized.desc || t('No description available.')}</Typography>
						<Stack direction="row" className="detail-actions" spacing={1.5}>
							<Button className="btn-primary" variant="contained" onClick={() => setRequestOpen(true)} disabled={user._id === job.memberId}>
								{t('Request this service')}
							</Button>
							<Button className="btn-outline" startIcon={liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />} onClick={like}>
								{job.serviceLikes}
							</Button>
						</Stack>
					</Stack>

					<Stack className="detail-side" spacing={2}>
						<div className="panel price-panel">
							<span className="muted">{t('Starting from')}</span>
							<b className="price">{formatPrice(job.servicePrice)}</b>
							<span className="muted">{t('final price after inspection')}</span>
						</div>
						<div className="panel mechanic-panel">
							<Typography className="panel-title">{t('Mechanic')}</Typography>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<UserAvatar image={mechanic?.memberImage} name={mechanic?.memberNick} size={56} />
								<div>
									<b>{mechanic?.memberFullName || mechanic?.memberNick}</b>
									{mechanic?.memberReviews ? <RatingStars value={mechanic.memberRating ?? 0} count={mechanic.memberReviews} /> : null}
									<span className="muted block">
										{mechanic?.memberServiceJobs ?? 0} {t('jobs')} · {mechanic?.memberLikes ?? 0} {t('likes')}
									</span>
									{mechanic?.memberAddress && <span className="muted block">{mechanic.memberAddress}</span>}
								</div>
							</Stack>
							{mechanic?.memberDesc && <p className="muted">{mechanic.memberDesc}</p>}
							<Button className="btn-outline" fullWidth onClick={() => router.push(`/member?memberId=${job.memberId}`)}>
								{t('View profile')}
							</Button>
						</div>
					</Stack>
				</Stack>

				{others.length > 0 && (
					<Stack className="more-jobs">
						<Typography className="section-title">{t('More work by this mechanic')}</Typography>
						<div className="service-grid">
							{others.map((j: ServiceJob) => (
								<ServiceJobCard key={j._id} job={j} />
							))}
						</div>
					</Stack>
				)}
			</div>
			<ServiceRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} mechanic={mechanic} defaultCar={`${job.carBrand} ${job.carModel}`} />
		</div>
	);
};

export default withLayoutBasic(ServiceDetail);
