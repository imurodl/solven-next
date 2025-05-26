'use client';
import { Box, Typography, Card, CardContent } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Car } from '../../types/car/car';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useState } from 'react';

interface TrendCarCardProps {
	car: Car;
	likeCarHandler: any;
}

const TrendCarCard = (props: TrendCarCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [isHovered, setIsHovered] = useState(false);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('ID', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const isLiked = car?.meLiked && car?.meLiked[0]?.myFavorite;

	return (
		<Card className="trend-car-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
			{/* Image Section */}
			<Box className="car-image-section">
				<Box
					className="car-image"
					style={{
						backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})`,
					}}
					onClick={() => pushDetailHandler(car._id)}
				/>

				{/* Price Badge */}
				<Box className="price-badge">${car.carPrice}</Box>

				{/* Views Count - Only visible on hover */}
				{isHovered && (
					<Box className="views-count">
						<VisibilityIcon className="views-icon" />
						{car.carViews}
					</Box>
				)}
			</Box>

			{/* Content Section */}
			<CardContent className="car-content">
				{/* Car Title with hover effect and animated underline */}
				<Box className="car-title-wrapper">
					<Typography variant="h6" component="div" className="car-title" onClick={() => pushDetailHandler(car._id)}>
						{car.carTitle}
					</Typography>
				</Box>

				{/* Car Description */}
				<Typography variant="body2" className="car-description">
					{car.carDesc || '4.0 D5 PowerPulse Momentum 5dr AW'}
				</Typography>

				{/* Car Features */}
				<Box className="car-features">
					<Box className="feature-item">
						<SpeedIcon className="feature-icon" />
						<Typography variant="body2" className="feature-text">
							{car.carMileage || '50'} Miles
						</Typography>
					</Box>

					<Box className="feature-item">
						<LocalGasStationIcon className="feature-icon" />
						<Typography variant="body2" className="feature-text">
							{car.carFuelType}
						</Typography>
					</Box>

					<Box className="feature-item">
						<SettingsIcon className="feature-icon" />
						<Typography variant="body2" className="feature-text">
							{car.carTransmission}
						</Typography>
					</Box>
				</Box>

				{/* Barter/Rent Status and Like Button */}
				<Box className="car-footer">
					{/* Barter/Rent Status */}
					<Box className="status-section">
						<Typography variant="body2" className={`status-text ${car.carBarter ? 'active' : 'inactive'}`}>
							Barter
						</Typography>
						<Typography variant="body2" className="status-divider">
							/
						</Typography>
						<Typography variant="body2" className={`status-text ${car.carRent ? 'active' : 'inactive'}`}>
							Rent
						</Typography>
					</Box>

					{/* Like Button with Count */}
					<Box
						className="like-section"
						onClick={(e: any) => {
							e.stopPropagation();
							likeCarHandler(user, car?._id);
						}}
					>
						{isLiked ? <FavoriteIcon className="like-icon liked" /> : <FavoriteBorderIcon className="like-icon" />}
						<Typography variant="body2" className="like-count">
							{car.carLikes}
						</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrendCarCard;
