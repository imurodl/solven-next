import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';

const featureData = [
	{
		id: 1,
		icon: 'img/events/f1-white-svg.svg',
		title: 'Special Financing Offers',
		description: 'Our stress-free finance department that can find financial solutions to save you money.',
	},
	{
		id: 2,
		icon: '/f2-white-svg.svg',
		title: 'Trusted Car Dealership',
		description: 'Our stress-free finance department that can find financial solutions to save you money.',
	},
	{
		id: 3,
		icon: '/f3-white-svg.svg',
		title: 'Transparent Pricing',
		description: 'Our stress-free finance department that can find financial solutions to save you money.',
	},
	{
		id: 4,
		icon: '/f4-white-svg.svg',
		title: 'Expert Car Service',
		description: 'Our stress-free finance department that can find financial solutions to save you money.',
	},
];

const Background4 = () => {
	return (
		<Box sx={{ bgcolor: '#405ff2', py: 8, width: '100%' }}>
			<Container maxWidth="xl">
				<Typography
					variant="h3"
					component="h2"
					sx={{
						fontFamily: "'DM_Sans-Bold', Helvetica",
						fontWeight: 700,
						color: 'white',
						fontSize: '40px',
						lineHeight: '40px',
						mb: 6,
					}}
				>
					Why Choose Us?
				</Typography>

				<Grid container spacing={4}>
					{featureData.map((feature) => (
						<Grid item xs={12} sm={6} md={3} key={feature.id}>
							<Box
								sx={{
									backgroundImage: `url(${feature.icon})`,
									backgroundSize: '100% 100%',
									width: '60px',
									height: '61px',
									mb: 2.5,
								}}
							/>
							<Typography
								variant="h6"
								sx={{
									fontFamily: "'DM_Sans-Medium', Helvetica",
									fontWeight: 500,
									color: 'white',
									fontSize: '20px',
									lineHeight: '24px',
									mb: 1.5,
								}}
							>
								{feature.title}
							</Typography>
							<Typography
								sx={{
									fontFamily: "'DM_Sans-9ptRegular', Helvetica",
									fontWeight: 400,
									color: 'white',
									fontSize: '15px',
									lineHeight: '27.8px',
								}}
							>
								{feature.description}
							</Typography>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Background4;
