import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Car } from '../../types/car/car';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

interface CarBigCardProps {
	car: Car;
	likeCarHandler?: any;
}

const CarBigCard = (props: CarBigCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goCarDetailPage = (carId: string) => {
		router.push(`/car/detail?id=${carId}`);
	};

	if (device === 'mobile') {
		return <div>CAR BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					onClick={() => goCarDetailPage(car?._id)}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages?.[0]})` }}
				>
					{car && car?.carRank >= topCarRank && (
						<div className={'status'}>
							<DirectionsCarIcon />
							<span>top</span>
						</div>
					)}
					<div className={'price'}>${formatterStr(car?.carPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong onClick={() => goCarDetailPage(car?._id)} className={'title'}>
						{car?.carTitle}
					</strong>
					<p className={'desc'}>{car?.carAddress}</p>
					<div className={'options'}>
						<div>
							<SpeedIcon />
							<span>{car?.carMileage}km</span>
						</div>
						<div>
							<LocalGasStationIcon />
							<span>{car?.carFuelType}</span>
						</div>
						<div>
							<SettingsIcon />
							<span>{car?.carTransmission}</span>
						</div>
					</div>
					<div className={'bott'}>
						<div>
							{car?.carRent ? <p>Rent</p> : <span>Rent</span>}
							{car?.carBarter ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<Stack flexDirection={'row'} style={{ width: 'auto' }}>
								<IconButton
									color={'default'}
									sx={{
										width: '32px',
										height: '32px',
										'& svg': {
											fontSize: '20px',
										},
									}}
								>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{car?.carViews}</Typography>
							</Stack>
							<Stack
								flexDirection={'row'}
								style={{ width: 'auto' }}
								onClick={(e: any) => {
									e.stopPropagation();
									likeCarHandler(user, car?._id);
								}}
							>
								<IconButton
									color={'default'}
									sx={{
										width: '32px',
										height: '32px',
										'& svg': {
											fontSize: '22px',
										},
									}}
								>
									{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon style={{ color: '#eb6753' }} />
									) : (
										<FavoriteIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{car?.carLikes}</Typography>
							</Stack>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default CarBigCard;
