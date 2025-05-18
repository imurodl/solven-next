import ArrowForward from '@mui/icons-material/ArrowForward';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import LocalGasStation from '@mui/icons-material/LocalGasStation';
import Settings from '@mui/icons-material/Settings';
import { Box, Card, CardContent, CardMedia, Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';

// Sample data for car listings
const carListings = [
	{
		id: 1,
		title: 'T-Cross – 2023',
		description: '4.0 D5 PowerPulse Momentum 5dr AW',
		miles: '15 Miles',
		fuelType: 'Petrol',
		transmission: 'CVT',
		price: '$15,000',
		image: '/car9-660x440-jpg.png',
		link: 'https://demoapus1.com/boxcar/listing/t-cross-2023/',
		label: null,
	},
	{
		id: 2,
		title: 'BMW X8 – 5.0',
		description: '4.0 D5 PowerPulse Momentum 5dr AW',
		miles: '100 Miles',
		fuelType: 'Hybrid',
		transmission: 'CVT',
		price: '$12,000',
		image: '/car10-660x440-jpg.png',
		link: 'https://demoapus1.com/boxcar/listing/bmw-x8-5-0/',
		label: {
			text: 'Great Price',
			color: '#3d923a',
		},
	},
	{
		id: 3,
		title: 'Audi A4 – 2022',
		description: '2.0 D5 PowerPulse Momentum 5dr AW',
		miles: '150 Miles',
		fuelType: 'Diesel',
		transmission: 'CVT',
		price: '$120,000',
		image: '/car20-660x440-jpg.png',
		link: 'https://demoapus1.com/boxcar/listing/new-range-rover-evoque/',
		label: {
			text: 'Sale',
			color: '#405ff2',
		},
	},
	{
		id: 4,
		title: 'Toyota Camry New',
		description: '3.5 D5 PowerPulse Momentum 5dr AW',
		miles: '20 Miles',
		fuelType: 'Petrol',
		transmission: 'Automatic',
		price: '$40,000',
		image: '/car8-660x440-jpg.png',
		link: 'https://demoapus1.com/boxcar/listing/toyota-camry-new/',
		label: {
			text: 'Great Price',
			color: '#3d923a',
		},
	},
];

const CarCard = ({ car }: any) => {
	return (
		<Card
			sx={{
				width: 328,
				height: 433,
				borderRadius: '16px',
				overflow: 'hidden',
			}}
		>
			<Box sx={{ position: 'relative' }}>
				<CardMedia
					component="a"
					href={car.link}
					target="_blank"
					rel="noopener noreferrer"
					sx={{
						height: 219,
						backgroundImage: `url(${car.image})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>

				{car.label && (
					<Chip
						label={car.label.text}
						sx={{
							position: 'absolute',
							top: 23,
							left: 20,
							height: 30,
							borderRadius: 30,
							backgroundColor: car.label.color,
							color: 'white',
							fontFamily: 'DM Sans',
							fontWeight: 500,
							fontSize: '14px',
							'& .MuiChip-label': {
								px: 2,
							},
						}}
						component="a"
						href={`https://demoapus1.com/boxcar/listing-label/${car.label.text.toLowerCase().replace(' ', '-')}/`}
						target="_blank"
						rel="noopener noreferrer"
						clickable
					/>
				)}

				<IconButton
					sx={{
						position: 'absolute',
						top: 20,
						right: 20,
						width: 36,
						height: 36,
						backgroundColor: 'white',
						'&:hover': {
							backgroundColor: 'white',
						},
					}}
				>
					<FavoriteBorder sx={{ width: 12, height: 12 }} />
				</IconButton>
			</Box>

			<CardContent
				sx={{
					p: 0,
					height: 214,
					borderRight: 1,
					borderBottom: 1,
					borderLeft: 1,
					borderColor: '#e9e9e9',
					borderBottomLeftRadius: 16,
					borderBottomRightRadius: 16,
				}}
			>
				<Box sx={{ px: 3.875, pt: 4 }}>
					<Typography
						component="a"
						href={car.link}
						target="_blank"
						rel="noopener noreferrer"
						sx={{
							fontFamily: 'DM Sans',
							fontWeight: 500,
							fontSize: 18,
							color: '#050b20',
							textDecoration: 'none',
							lineHeight: '21.6px',
							display: 'block',
							mb: 1,
						}}
					>
						{car.title}
					</Typography>

					<Typography
						sx={{
							fontFamily: 'DM Sans',
							fontSize: 14,
							color: '#050b20',
							lineHeight: '14px',
							height: 16,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{car.description}...
					</Typography>
				</Box>

				<Box
					sx={{
						mt: 2.5,
						mx: 3.875,
						pt: 2,
						borderTop: 1,
						borderColor: '#e9e9e9',
					}}
				>
					<Stack direction="row" justifyContent="space-between">
						<Box sx={{ textAlign: 'center' }}>
							<DirectionsCar sx={{ width: 18, height: 18 }} />
							<Typography
								sx={{
									fontFamily: 'DM Sans',
									fontSize: 14,
									color: '#050b20',
									mt: 1,
								}}
							>
								{car.miles}
							</Typography>
						</Box>

						<Box sx={{ textAlign: 'center' }}>
							<LocalGasStation sx={{ width: 18, height: 18 }} />
							<Typography
								sx={{
									fontFamily: 'DM Sans',
									fontSize: 14,
									color: '#050b20',
									mt: 1,
								}}
							>
								{car.fuelType}
							</Typography>
						</Box>

						<Box sx={{ textAlign: 'center' }}>
							<Settings sx={{ width: 18, height: 18 }} />
							<Typography
								sx={{
									fontFamily: 'DM Sans',
									fontSize: 14,
									color: '#050b20',
									mt: 1,
								}}
							>
								{car.transmission}
							</Typography>
						</Box>
					</Stack>
				</Box>

				<Box
					sx={{
						mt: 1.5,
						mx: 3.875,
						pt: 2,
						borderTop: 1,
						borderColor: '#e9e9e9',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{
							fontFamily: 'DM Sans',
							fontWeight: 700,
							fontSize: 20,
							color: '#050b20',
							lineHeight: '30px',
						}}
					>
						{car.price}
					</Typography>

					<Box
						component="a"
						href={car.link}
						target="_blank"
						rel="noopener noreferrer"
						sx={{
							display: 'flex',
							alignItems: 'center',
							textDecoration: 'none',
						}}
					>
						<Typography
							sx={{
								fontFamily: 'DM Sans',
								fontWeight: 500,
								fontSize: 15,
								color: '#405ff2',
								lineHeight: '27.8px',
								mr: 1,
							}}
						>
							View Details
						</Typography>
						<ArrowForward sx={{ width: 14, height: 14, color: '#405ff2' }} />
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

const Container3 = () => {
	return (
		<Box sx={{ width: 1430, height: 544, position: 'relative' }}>
			<Grid container spacing={3.75}>
				{carListings.map((car) => (
					<Grid item key={car.id}>
						<CarCard car={car} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default Container3;
