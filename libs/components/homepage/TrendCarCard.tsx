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
		<Card
			sx={{
				width: 320,
				borderRadius: '16px',
				boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				transition: 'transform 0.2s ease-in-out',
				'&:hover': {
					transform: 'translateY(-4px)',
				},
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Image Section */}
			<Box sx={{ position: 'relative', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
				<Box
					sx={{
						height: 200,
						backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						cursor: 'pointer',
					}}
					onClick={() => pushDetailHandler(car._id)}
				/>

				{/* Price Badge */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 12,
						left: 12,
						backgroundColor: 'rgba(0,0,0,0.7)',
						color: 'white',
						padding: '6px 12px',
						borderRadius: '6px',
						fontWeight: 'bold',
						fontSize: '16px',
					}}
				>
					${car.carPrice || '95,000'}
				</Box>

				{/* Views Count - Only visible on hover */}
				{isHovered && (
					<Box
						sx={{
							position: 'absolute',
							top: 16,
							right: 16,
							backgroundColor: 'rgba(0,0,0,0.7)',
							color: 'white',
							padding: '6px 10px',
							borderRadius: '20px',
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							fontSize: '12px',
							fontWeight: '500',
							transition: 'opacity 0.2s ease-in-out',
						}}
					>
						<VisibilityIcon sx={{ fontSize: 16 }} />
						{car.carViews || 0}
					</Box>
				)}
			</Box>

			{/* Content Section */}
			<CardContent sx={{ padding: '20px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
				{/* Car Title with hover effect and animated underline */}
				<Box sx={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
					<Typography
						variant="h6"
						component="div"
						sx={{
							fontWeight: 'bold',
							fontSize: '16px',
							mb: 0.5,
							cursor: 'pointer',
							color: '#1a1a1a',
							transition: 'color 0.3s ease',
							position: 'relative',
							'&:hover': {
								color: '#6200ee',
							},
							'&::before': {
								content: '""',
								position: 'absolute',
								width: 0,
								height: '1px',
								bottom: '-1px',
								left: 0,
								backgroundColor: '#6200ee',
								transition: 'width 0.3s ease',
							},
							'&:hover::before': {
								width: '100%',
							},
						}}
						onClick={() => pushDetailHandler(car._id)}
					>
						{car.carTitle.split(' ').slice(0, 4).join(' ')} ...
					</Typography>
				</Box>

				{/* Car Description */}
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mb: 2,
						fontSize: '14px',
						lineHeight: 1.4,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{car.carDesc?.slice(0, 36) || '4.0 D5 PowerPulse Momentum 5dr AW'}...
				</Typography>

				{/* Car Features */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						borderTop: '1px solid #eee',
						borderBottom: '1px solid #eee',
						py: 2,
						my: 2,
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<SpeedIcon sx={{ color: '#666', fontSize: '20px', mb: 0.5 }} />
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
							{car.carMileage || '50'} Miles
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<LocalGasStationIcon sx={{ color: '#666', fontSize: '20px', mb: 0.5 }} />
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
							{car.carFuelType}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<SettingsIcon sx={{ color: '#666', fontSize: '20px', mb: 0.5 }} />
						<Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
							{car.carTransmission}
						</Typography>
					</Box>
				</Box>

				{/* Barter/Rent Status and Like Button */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mt: 'auto',
					}}
				>
					{/* Barter/Rent Status */}
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Typography
							variant="body2"
							sx={{
								fontSize: '14px',
								color: car.carBarter ? '#1a1a1a' : '#ccc',
								fontWeight: car.carBarter ? '500' : '400',
							}}
						>
							Barter
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontSize: '14px',
								color: '#ccc',
							}}
						>
							/
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontSize: '14px',
								color: car.carRent ? '#1a1a1a' : '#ccc',
								fontWeight: car.carRent ? '500' : '400',
							}}
						>
							Rent
						</Typography>
					</Box>

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
							{car.carLikes || 0}
						</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrendCarCard;
