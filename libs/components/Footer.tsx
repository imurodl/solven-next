import { Box, Stack, Typography, IconButton, InputBase, Button, useMediaQuery } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useRouter } from 'next/router';

const Footer = () => {
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';
	const router = useRouter();
	const isFullWidthPage = router.pathname === '/mypage' || router.pathname.startsWith('/member');

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
		<footer className="footer">
			<div className="footer-inner">
				<div
					className={`footer-container`}
					style={{
						width: isFullWidthPage ? '100%' : '1300px',
						padding: isFullWidthPage ? '0 40px' : '0',
					}}
				>
					{/* Subscribe Section */}
					<div className="subscribe-section">
						<div className="title-box">
							<h2>Join Solven</h2>
							<p>Receive pricing updates, shopping tips & more!</p>
						</div>

						<div className="input-box">
							<input type="email" placeholder="Your e-mail address" />
							<button>Sign Up</button>
						</div>
					</div>

					{/* Footer Links + App & Social */}
					<div className="footer-content">
						{/* Link Columns */}
						{footerLinks.map((section, idx) => (
							<div key={idx} className="footer-column">
								<h3 className="column-title">{section.title}</h3>
								<div className="footer-links">
									{section.links.map((link, i) => (
										<a key={i} href="#">
											{link}
										</a>
									))}
								</div>
							</div>
						))}

						{/* App Links & Social Icons */}
						<div className="app-section">
							<h3 className="app-title">Get the App</h3>
							<div className="app-buttons">
								<a href="#" className="app-button">
									<AppleIcon className="app-icon" />
									<div className="app-text">
										<span className="store-type">Download on the</span>
										<span className="store-name">App Store</span>
									</div>
								</a>
								<a href="#" className="app-button">
									<AndroidIcon className="app-icon" />
									<div className="app-text">
										<span className="store-type">Get it on</span>
										<span className="store-name">Google Play</span>
									</div>
								</a>
							</div>

							<div className="social-section">
								<h4 className="social-title">Connect With Us</h4>
								<div className="social-icons">
									{socialIcons.map((icon, i) => (
										<a key={i} href="#" className="social-icon">
											{icon}
										</a>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="footer-bottom">
					<p>
						© {new Date().getFullYear()} <a href="/">Solven</a>. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
