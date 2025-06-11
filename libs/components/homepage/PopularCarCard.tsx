'use client';
import { Stack, Box, Divider, Typography, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import type { Car } from '../../types/car/car';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface PopularCarCardProps {
	car: Car;
	likeCarHandler: any;
}

const PopularCarCard = (props: PopularCarCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('ID', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const isLiked = car?.meLiked && car?.meLiked[0]?.myFavorite;

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box" direction="row">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car._id)}
				>
					<div className={'price'}>${car.carPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car._id)}>
						{car.carTitle}
					</strong>
					<p className={'car-desc'}>{car.carDesc?.slice(0, 50) || ''}...</p>

					<div className={'car-specs'}>
						<Tooltip title={'Manufactured Year'} placement="top" arrow>
							<div className={'spec-item'}>
								<CalendarTodayIcon className={'spec-icon'} />
								<span>{car?.manufacturedAt}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Mileage'} placement="top" arrow>
							<div className={'spec-item'}>
								<SpeedIcon className={'spec-icon'} />
								<span>{car?.carMileage?.toLocaleString()}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Fuel Type'} placement="top" arrow>
							<div className={'spec-item'}>
								<LocalGasStationIcon className={'spec-icon'} />
								<span>{car?.carFuelType}</span>
							</div>
						</Tooltip>
					</div>

					<div className={'bottom-section'}>
						<div className="view-like-box">
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									cursor: 'pointer',
								}}
							>
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{car?.carViews}</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									cursor: 'pointer',
									gap: '4px',
								}}
								onClick={(e: any) => {
									e.stopPropagation();
									likeCarHandler(user, car?._id);
								}}
							>
								{isLiked ? (
									<FavoriteIcon sx={{ color: 'red', fontSize: 24 }} />
								) : (
									<FavoriteBorderIcon sx={{ color: '#666', fontSize: 24 }} />
								)}
								<Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
									{car.carLikes}
								</Typography>
							</Box>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box" direction="row">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car._id)}
				>
					<div className={'price'}>${car.carPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car._id)}>
						{car.carTitle}
					</strong>
					<p className={'car-desc'}>{car.carDesc?.slice(0, 50) || ''}...</p>

					<div className={'car-specs'}>
						<Tooltip title={'Manufactured Year'} placement="top" arrow>
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<CalendarTodayIcon className={'spec-icon'} />
								<span>{car?.manufacturedAt}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Mileage'} placement="top" arrow>
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<SpeedIcon className={'spec-icon'} />
								<span>{car?.carMileage?.toLocaleString()} miles</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Fuel Type'} placement="top" arrow>
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<LocalGasStationIcon className={'spec-icon'} />
								<span>{car?.carFuelType}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Transmission'} placement="top" arrow>
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<SettingsIcon className={'spec-icon'} />
								<span>{car?.carTransmission}</span>
							</div>
						</Tooltip>
					</div>

					<div className={'bottom-section'}>
						<div className="brand-model-box">
							<span>Brand: {car?.carBrand}</span>
							<span>Model: {car?.carModel}</span>
						</div>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							{/* Like Button with Count */}
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									cursor: 'pointer',
								}}
								onClick={(e: any) => {
									e.stopPropagation();
									likeCarHandler(user, car?._id);
								}}
							>
								{isLiked ? (
									<FavoriteIcon sx={{ color: 'red', fontSize: 24 }} />
								) : (
									<FavoriteBorderIcon sx={{ color: '#666', fontSize: 24 }} />
								)}
								<Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
									{car.carLikes}
								</Typography>
							</Box>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCarCard;
