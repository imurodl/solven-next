import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar, Box, Chip, IconButton, Rating, Stack, Typography } from '@mui/material';
import React from 'react';

const testimonialData = {
	rating: 5,
	reviewCount: 5801,
	currentTestimonial: {
		name: 'Ali TUFAN',
		occupation: 'Designer',
		text: "I'd suggest Macklin Motors Nissan Glasgow South to a friend because I had great service from my salesman Patrick and all of the team.",
		verified: true,
	},
	avatars: [
		{ id: 1, active: true, url: '/team6-150x150-jpg.png' },
		{ id: 2, active: false, url: '/team8-150x150-jpg.png' },
		{ id: 3, active: false, url: '/team5-150x150-jpg.png' },
	],
};

const Background = () => {
	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				maxWidth: 1920,
				height: 748,
				bgcolor: '#f9fbfc',
				p: 4,
			}}
		>
			<Box
				sx={{
					maxWidth: 1400,
					mx: 'auto',
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					justifyContent: 'space-between',
					mt: 8,
				}}
			>
				{/* Left Section - Heading and Ratings */}
				<Box sx={{ maxWidth: 614 }}>
					<Typography
						variant="h2"
						sx={{
							fontFamily: "'DM_Sans-Bold', Helvetica",
							fontWeight: 700,
							color: '#050b20',
							fontSize: '40px',
							lineHeight: '48px',
							mb: 5,
						}}
					>
						What Our
						<br />
						Customers Say
					</Typography>

					<Typography
						variant="h6"
						sx={{
							fontFamily: "'DM_Sans-Medium', Helvetica",
							fontWeight: 500,
							color: '#050b20',
							fontSize: '20px',
							lineHeight: '20px',
							mb: 2,
						}}
					>
						Great
					</Typography>

					<Rating
						value={testimonialData.rating}
						readOnly
						sx={{
							mb: 3,
							'& .MuiRating-iconFilled': {
								color: '#00b67a',
							},
							'& .MuiSvgIcon-root': {
								fontSize: 28,
							},
						}}
					/>

					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<Typography
							variant="body2"
							sx={{
								fontFamily: "'DM_Sans-9ptRegular', Helvetica",
								fontWeight: 400,
								color: '#050b20',
								fontSize: '15px',
								lineHeight: '15px',
							}}
						>
							Based on
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontFamily: "'DM_Sans-Medium', Helvetica",
								fontWeight: 500,
								color: '#050b20',
								fontSize: '15px',
								lineHeight: '15px',
								ml: 0.5,
							}}
						>
							{testimonialData.reviewCount} reviews
						</Typography>
					</Box>

					<Box
						component="img"
						src="img/logo/trustpilot.png"
						alt="Trustpilot"
						sx={{
							width: 100,
							height: 26,
							objectFit: 'cover',
						}}
					/>
				</Box>

				{/* Right Section - Testimonial */}
				<Box sx={{ maxWidth: 786, position: 'relative', mt: { xs: 4, md: 0 } }}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
						<IconButton
							sx={{
								width: 60,
								height: 40,
								bgcolor: 'white',
								borderRadius: '30px',
								border: '1px solid #e9e9e9',
								mr: 1,
								'&:hover': {
									bgcolor: 'white',
								},
							}}
						>
							<ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
						</IconButton>
						<IconButton
							sx={{
								width: 60,
								height: 40,
								bgcolor: 'white',
								borderRadius: '30px',
								border: '1px solid #e9e9e9',
								'&:hover': {
									bgcolor: 'white',
								},
							}}
						>
							<ArrowForwardIosIcon sx={{ fontSize: 12 }} />
						</IconButton>
					</Box>

					<Box sx={{ mt: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<Rating
								value={5}
								readOnly
								sx={{
									'& .MuiRating-iconFilled': {
										color: '#00b67a',
									},
									'& .MuiSvgIcon-root': {
										fontSize: 20,
									},
								}}
							/>
							<Chip
								icon={<VerifiedIcon sx={{ fontSize: 14, color: 'white !important' }} />}
								label="Verified"
								size="small"
								sx={{
									ml: 2,
									bgcolor: '#6c6c83',
									color: 'white',
									fontFamily: "'DM_Sans-9ptRegular', Helvetica",
									fontSize: '14px',
									height: 17,
									'& .MuiChip-label': {
										px: 1,
									},
								}}
							/>
						</Box>

						<Typography
							variant="h6"
							sx={{
								fontFamily: "'DM_Sans-Medium', Helvetica",
								fontWeight: 500,
								color: '#050b20',
								fontSize: '18px',
								lineHeight: '21.6px',
								mt: 2,
							}}
						>
							{testimonialData.currentTestimonial.name}
						</Typography>

						<Typography
							variant="body2"
							sx={{
								fontFamily: "'DM_Sans-9ptRegular', Helvetica",
								fontWeight: 400,
								color: '#050b20',
								fontSize: '14px',
								lineHeight: '25.9px',
								mb: 2,
							}}
						>
							{testimonialData.currentTestimonial.occupation}
						</Typography>

						<Typography
							variant="h4"
							sx={{
								fontFamily: "'DM_Sans-Medium', Helvetica",
								fontWeight: 500,
								color: '#050b20',
								fontSize: '26px',
								lineHeight: '41.6px',
								mt: 2,
							}}
						>
							{testimonialData.currentTestimonial.text}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Avatar Selection */}
			<Stack
				direction="row"
				spacing={2}
				sx={{
					position: 'absolute',
					bottom: 115,
					right: { xs: 'center', md: 258 },
				}}
			>
				{testimonialData.avatars.map((avatar) => (
					<Box
						key={avatar.id}
						sx={{
							width: 70,
							height: 70,
							borderRadius: '35px',
							overflow: 'hidden',
							opacity: avatar.active ? 1 : 0.3,
							border: avatar.active ? '2px solid #405ff2' : 'none',
						}}
					>
						<Avatar
							src={avatar.url}
							alt={`Testimonial user ${avatar.id}`}
							sx={{
								width: 58,
								height: 58,
								margin: '6px',
								borderRadius: '29px',
							}}
						/>
					</Box>
				))}
			</Stack>
		</Box>
	);
};

export default Background;
