'use client';
import { Stack, Box, Divider, Typography, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import type { Car } from '../../types/car/car';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SellIcon from '@mui/icons-material/Sell';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CarRentalIcon from '@mui/icons-material/CarRental';

interface PopularCarCardProps {
	car: Car;
}

const PopularCarCard = (props: PopularCarCardProps) => {
	const { car } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('ID', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car._id)}
				>
					{car && car?.carRank >= topCarRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${car.carPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car._id)}>
						{car.carTitle}
					</strong>
					<p className={'desc'}>{car.carAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{car?.carMileage} mileage</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{car?.carSeats} seats</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{car?.carBrand} brand</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{car?.carRent ? 'rent' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
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
					{car && car?.carRank >= topCarRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${car.carPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car._id)}>
						{car.carTitle}
					</strong>
					<p className={'car-desc'}>{car.carDesc?.slice(0, 50) || ''}...</p>

					<div className={'car-specs'}>
						<Tooltip title={'Car Mileage'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<SpeedIcon className={'spec-icon'} />
								<span>{car?.carMileage?.toLocaleString()} miles</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Fuel Type'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<LocalGasStationIcon className={'spec-icon'} />
								<span>{car?.carFuelType}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Transmission'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<SettingsIcon className={'spec-icon'} />
								<span>{car?.carTransmission}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Seats'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<EventSeatIcon className={'spec-icon'} />
								<span>{car?.carSeats} seats</span>
							</div>
						</Tooltip>
						<Tooltip title={'Manufactured Year'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<CalendarTodayIcon className={'spec-icon'} />
								<span>{car?.manufacturedAt}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Type'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<DirectionsCarIcon className={'spec-icon'} />
								<span>{car?.carType}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Color'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<div className={'color-dot'} style={{ backgroundColor: car?.carColor?.toLowerCase() }}></div>
								<span>{car?.carColor}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Location'} placement="top">
							<div className={'spec-item'} style={{ cursor: 'pointer' }}>
								<LocationOnIcon className={'spec-icon'} />
								<span>{car?.carLocation}</span>
							</div>
						</Tooltip>
						<Tooltip title={'Car Rent & Car Barter Status'} placement="top">
							<div className={'spec-item sale-barter'} style={{ cursor: 'pointer' }}>
								<CarRentalIcon className={car?.carRent ? 'spec-icon active' : 'spec-icon inactive'} />
								<span></span>
								<SwapHorizIcon className={car?.carBarter ? 'spec-icon active' : 'spec-icon inactive'} />
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
							<IconButton color={'default'}>
								<FavoriteIcon />
							</IconButton>
							<Typography className="like-cnt">{car?.carLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCarCard;
