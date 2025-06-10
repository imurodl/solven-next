'use client';
import { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import type { Car } from '../../types/car/car';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CarCardType {
	car: Car;
	likeCarHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CarCard = (props: CarCardType) => {
	const { car, likeCarHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [isHovered, setIsHovered] = useState(false);
	const imagePath: string = car?.carImages[0] ? `${REACT_APP_API_URL}/${car?.carImages[0]}` : '/img/banner/header1.svg';

	const isLiked = myFavorites || (car?.meLiked && car?.meLiked[0]?.myFavorite);

	if (device === 'mobile') {
		return (
			<Stack className="card-config" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
				<Stack className="top">
					<Link
						href={{
							pathname: '/car/detail',
							query: { id: car?._id },
						}}
						className="image-link"
					>
						<img src={imagePath || '/placeholder.svg'} alt="" />
					</Link>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/car/detail',
									query: { id: car?._id },
								}}
							>
								<Typography className={'car-titlee'}>{car.carTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{car.carAddress}, {car.carLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<SpeedIcon className="option-icon" />
							<Typography>{car.carMileage || '50'} Miles</Typography>
						</Stack>
						<Stack className="option">
							<LocalGasStationIcon className="option-icon" />
							<Typography>{car.carFuelType}</Typography>
						</Stack>
						<Stack className="option">
							<SettingsIcon className="option-icon" />
							<Typography>{car.carTransmission}</Typography>
						</Stack>
					</Stack>
					<Stack className="type-buttons">
						<Stack className="price">
							<Typography>${formatterStr(car?.carPrice)}</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{car?.carViews}</Typography>
								<IconButton color={'default'} onClick={() => likeCarHandler(user, car?._id)}>
									{isLiked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
								</IconButton>
								<Typography className="view-cnt">{car?.carLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="card-config" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
				<Stack className="top">
					<Link
						href={{
							pathname: '/car/detail',
							query: { id: car?._id },
						}}
					>
						<img src={imagePath || '/placeholder.svg'} alt="" />
					</Link>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/car/detail',
									query: { id: car?._id },
								}}
							>
								<Typography>{car.carTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{car.carAddress}, {car.carLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<SpeedIcon className="option-icon" />
							<Typography>{car.carMileage || '50'} Miles</Typography>
						</Stack>
						<Stack className="option">
							<LocalGasStationIcon className="option-icon" />
							<Typography>{car.carFuelType}</Typography>
						</Stack>
						<Stack className="option">
							<SettingsIcon className="option-icon" />
							<Typography>{car.carTransmission}</Typography>
						</Stack>
					</Stack>
					<Stack className="type-buttons">
						<Stack className="price">
							<Typography>${formatterStr(car?.carPrice)}</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{car?.carViews}</Typography>
								<IconButton color={'default'} onClick={() => likeCarHandler(user, car?._id)}>
									{isLiked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
								</IconButton>
								<Typography className="view-cnt">{car?.carLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CarCard;
