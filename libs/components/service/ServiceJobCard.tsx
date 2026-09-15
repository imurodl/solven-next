import React from 'react';
import Link from 'next/link';
import { Stack, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { ServiceJob } from '../../types/service-job/service-job';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';
import { useCurrency } from '../../context/CurrencyContext';
import { localizeService } from '../../utils/localize';
import UserAvatar from '../common/UserAvatar';

interface ServiceJobCardProps {
	job: ServiceJob;
	likeHandler?: (user: any, id: string) => void;
}

const ServiceJobCard = ({ job, likeHandler }: ServiceJobCardProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { formatPrice } = useCurrency();
	const liked = job?.meLiked?.[0]?.myFavorite;
	const image = job.serviceImages?.[0] ? `${REACT_APP_API_URL}/${job.serviceImages[0]}` : '/img/banner/header2.svg';
	const localized = localizeService(job, router.locale);

	return (
		<Stack className="service-card slv-reveal">
			<Link href={{ pathname: '/service/detail', query: { id: job._id } }} className="image-link">
				<img src={image} alt={job.serviceTitle} />
				<span className="type-badge">
					<BuildOutlinedIcon fontSize="inherit" /> {t(`service.type.${job.serviceType}`)}
				</span>
			</Link>
			<Stack className="body">
				<Link href={{ pathname: '/service/detail', query: { id: job._id } }}>
					<Typography className="title">{localized.title}</Typography>
				</Link>
				<Typography className="car">
					{job.carBrand} {job.carModel} {job.manufacturedAt ? `· ${job.manufacturedAt}` : ''}
				</Typography>
				<Stack direction="row" className="meta" spacing={1.5}>
					<span>
						<PlaceOutlinedIcon fontSize="inherit" /> {job.serviceLocation}
					</span>
					<span>
						<ScheduleOutlinedIcon fontSize="inherit" /> {job.serviceDuration}h
					</span>
				</Stack>
				<Stack direction="row" className="foot" alignItems="center" justifyContent="space-between">
					<span className="price">
						{t('from')} <b>{formatPrice(job.servicePrice)}</b>
					</span>
					<Stack direction="row" alignItems="center" spacing={0.5} className="actions">
						<Link href={`/member?memberId=${job.memberId}`} className="mechanic">
							<UserAvatar image={job.memberData?.memberImage} name={job.memberData?.memberNick} size={24} />
						</Link>
						<RemoveRedEyeIcon fontSize="small" className="muted-icon" />
						<span className="cnt">{job.serviceViews}</span>
						<IconButton size="small" aria-label={liked ? 'Unlike' : 'Like'} onClick={() => likeHandler?.(user, job._id)}>
							{liked ? <FavoriteIcon color="primary" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
						</IconButton>
						<span className="cnt">{job.serviceLikes}</span>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ServiceJobCard;
