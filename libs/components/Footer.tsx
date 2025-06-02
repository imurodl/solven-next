import { Box, Stack, Typography, IconButton, InputBase, Button, useMediaQuery } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface FooterLink {
	text: string;
	href?: string;
}

interface FooterSection {
	title: string;
	links: FooterLink[];
	langCodes?: string[];
}

const Footer = () => {
	const { t, i18n } = useTranslation('common');
	const [lang, setLang] = useState<string | null>('en');
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';
	const router = useRouter();
	const isFullWidthPage = router.pathname === '/mypage' || router.pathname.startsWith('/member');

	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	const handleLanguageChange = useCallback(
		async (langCode: string) => {
			setLang(langCode);
			localStorage.setItem('locale', langCode);
			await router.push(router.asPath, router.asPath, { locale: langCode });
		},
		[router],
	);

	const socialIcons = [
		<FacebookOutlinedIcon key="facebook" />,
		<InstagramIcon key="instagram" />,
		<TelegramIcon key="telegram" />,
		<TwitterIcon key="twitter" />,
	];

	const footerLinks: FooterSection[] = [
		{
			title: 'Company',
			links: [
				{ text: 'Home', href: '/' },
				{ text: 'About Us', href: '/about' },
				{ text: 'Listings', href: '/car' },
				{ text: 'Agents', href: '/agent' },
				{ text: 'Community', href: '/community?articleCategory=FREE' },
				{ text: 'Help', href: '/help' },
			],
		},
		{
			title: 'Quick Links',
			links: [
				{ text: 'Terms & Conditions', href: '/help?tab=terms' },
				{ text: 'FAQ', href: '/help?tab=faq' },
				{ text: 'Support', href: '/help' },
				{ text: 'Contact Us', href: '/help' },
			],
		},
		{
			title: 'Languages',
			links: [{ text: 'English' }, { text: 'Korean' }, { text: 'Russian' }],
			langCodes: ['en', 'kr', 'ru'],
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
					{/* Logo Section */}
					<div className="subscribe-section">
						<Link href="/">
							<img src="/img/logo/solven.png" alt="Solven" style={{ height: '52px' }} />
						</Link>

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
									{section.title === 'Languages' && section.langCodes
										? section.links.map((link, i) => (
												<a
													key={i}
													href="#"
													onClick={(e) => {
														e.preventDefault();
														handleLanguageChange(section.langCodes![i]);
													}}
												>
													{link.text}
												</a>
										  ))
										: section.links.map((link, i) => (
												<Link key={i} href={link.href || '#'}>
													{link.text}
												</Link>
										  ))}
								</div>
							</div>
						))}

						{/* App Links & Social Icons */}
						<div className="app-section">
							<h3 className="app-title">{t('Get the App')}</h3>
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
