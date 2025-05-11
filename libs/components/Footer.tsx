import { Box, Stack, Typography, IconButton, InputBase, Button, useMediaQuery, Divider } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import useDeviceDetect from '../hooks/useDeviceDetect';

const Footer = () => {
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	const socialIcons = [
		<FacebookOutlinedIcon key="facebook" />,
		<InstagramIcon key="instagram" />,
		<TelegramIcon key="telegram" />,
		<TwitterIcon key="twitter" />,
	];

	const footerLinks = [
		{
			title: 'Company',
			links: ['Home', 'About Us', 'Blog', 'Services', 'FAQs', 'Terms', 'Contact Us'],
		},
		{
			title: 'Quick Links',
			links: ['Get In Touch', 'Privacy Policy', 'Support', 'Help Center'],
		},
		{
			title: 'Brands',
			links: ['Toyota', 'Hyundai', 'BMW', 'Kia', 'Tesla', 'BMW', 'Ford'],
		},
		{
			title: 'Vehicle Types',
			links: ['Sedan', 'SUV', 'Truck', 'EV', 'LARGE', 'Midsize'],
		},
	];

	return (
		<Stack sx={{ bgcolor: '#050b20', color: '#fff', margin: '0 auto', gap: 6, width: '1300px' }}>
			{/* Subscribe Section */}
			<Stack
				direction={isMobile ? 'column' : 'row'}
				justifyContent="space-between"
				alignItems={isMobile ? 'flex-start' : 'center'}
				spacing={2}
			>
				<Box>
					<Typography variant="h2" sx={{ fontWeight: 500, fontSize: '32px', lineHeight: '30px' }}>
						Join Solven
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '28px', mt: '8px' }}>
						Receive pricing updates, shopping tips & more!
					</Typography>
				</Box>

				<Stack direction="row" spacing={1} alignItems="center">
					<InputBase
						placeholder="Your e-mail address"
						sx={{
							bgcolor: '#f8f5f0',
							borderRadius: '50px',
							pl: 2,
							py: 1.5,
							width: 250,
							fontSize: '0.9rem',
							color: '#050b20',
						}}
					/>
					<Button
						variant="contained"
						sx={{
							bgcolor: '#405ff2',
							color: '#fff',
							borderRadius: '50px',
							px: 4,
							py: 2,
							fontWeight: 600,
							textTransform: 'uppercase',
							'&:hover': {
								bgcolor: '#0146a6',
							},
						}}
					>
						Sign Up
					</Button>
				</Stack>
			</Stack>

			{/* Footer Links + App & Social */}
			<Stack
				direction={isMobile ? 'column' : 'row'}
				justifyContent="space-between"
				gap={6}
				flexWrap="wrap"
				borderTop="1px solid #333"
				sx={{ pt: 4 }}
			>
				{/* Link Columns */}
				{footerLinks.map((section, idx) => (
					<Box key={idx} sx={{ minWidth: 150 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontFamily: 'DM Sans', fontSize: '17px' }}>
							{section.title}
						</Typography>
						<Stack spacing={2} mt={2}>
							{section.links.map((link, i) => (
								<Typography
									key={i}
									variant="body2"
									sx={{
										cursor: 'pointer',
										color: '#fff',
										'&:hover': { textDecoration: 'underline', color: '#fff' },
										fontSize: '16px',
										lineHeight: '28px',
										fontWeight: 400,
										fontFamily: 'DM Sans',
									}}
								>
									{link}
								</Typography>
							))}
						</Stack>
					</Box>
				))}

				{/* App Links & Social Icons */}
				<Box sx={{ minWidth: 220 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
						Get the App
					</Typography>
					<Stack spacing={1.5}>
						<Button
							variant="outlined"
							startIcon={<AppleIcon />}
							sx={{
								color: '#fff',
								borderColor: '#fff',
								borderRadius: '12px',
								justifyContent: 'flex-start',
								textTransform: 'none',
								'&:hover': {
									bgcolor: '#fff',
									color: '#000',
									borderColor: '#fff',
								},
							}}
						>
							<Box>
								<Typography variant="caption">Download on the</Typography>
								<Typography variant="body2" sx={{ fontWeight: 700 }}>
									App Store
								</Typography>
							</Box>
						</Button>
						<Button
							variant="outlined"
							startIcon={<AndroidIcon />}
							sx={{
								color: '#fff',
								borderColor: '#fff',
								borderRadius: '12px',
								justifyContent: 'flex-start',
								textTransform: 'none',
								'&:hover': {
									bgcolor: '#fff',
									color: '#000',
									borderColor: '#fff',
								},
							}}
						>
							<Box>
								<Typography variant="caption">Get it on</Typography>
								<Typography variant="body2" sx={{ fontWeight: 700 }}>
									Google Play
								</Typography>
							</Box>
						</Button>
					</Stack>
					<Typography variant="subtitle2" sx={{ mt: 4, mb: 1, fontWeight: 600 }}>
						Connect With Us
					</Typography>
					<Stack direction="row" spacing={1}>
						{socialIcons.map((icon, i) => (
							<IconButton
								key={i}
								sx={{
									color: '#fff',
									// border: '1px solid #fff',
									p: 1,
									'&:hover': {
										bgcolor: '#405ff2',
										borderColor: '#405ff2',
									},
								}}
							>
								{icon}
							</IconButton>
						))}
					</Stack>
				</Box>
			</Stack>

			{/* Footer Bottom */}
			<Stack
				direction={isMobile ? 'column' : 'row'}
				justifyContent="space-between"
				alignItems="center"
				pt={4}
				mb={2}
				mt={4}
				borderTop="1px solid #333"
			>
				<Typography variant="caption" color="#bbb" fontSize={'13px'}>
					© {new Date().getFullYear()} Solven. All rights reserved.
				</Typography>
				<Stack direction="row" spacing={2}>
					<Typography
						variant="caption"
						fontSize={'13px'}
						sx={{ cursor: 'pointer', color: '#bbb', '&:hover': { color: '#fff' } }}
					>
						Terms & Conditions
					</Typography>
					<Typography
						variant="caption"
						fontSize={'13px'}
						sx={{ cursor: 'pointer', color: '#bbb', '&:hover': { color: '#fff' } }}
					>
						Privacy Notice
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;
