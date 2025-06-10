import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="about-page">
				{/* Hero Section */}
				<Stack className="hero-section">
					<Stack className="container">
						<Box className="content">
							<h1>Revolutionizing The Way You Find Your Dream Car</h1>
							<p>
								We're passionate about connecting car enthusiasts with their perfect vehicles. Our platform combines
								cutting-edge technology with personalized service to make car buying and selling a seamless experience.
							</p>
						</Box>
					</Stack>
				</Stack>

				{/* Stats Section */}
				<Stack className="stats-section">
					<Stack className="container">
						<Box className="stat-grid">
							<div className="stat-item">
								<span className="number">15K+</span>
								<span className="label">Cars Listed</span>
							</div>
							<div className="stat-item">
								<span className="number">10K+</span>
								<span className="label">Happy Customers</span>
							</div>
							<div className="stat-item">
								<span className="number">500+</span>
								<span className="label">Expert Dealers</span>
							</div>
							<div className="stat-item">
								<span className="number">24/7</span>
								<span className="label">Support</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* Mission Section */}
				<Stack className="mission-section">
					<Stack className="container">
						<Box className="content-grid">
							<div className="image-side">
								<img src="/img/about/mission.jpg" alt="Our Mission" />
							</div>
							<div className="text-side">
								<h2>Our Mission</h2>
								<p>
									To provide a transparent, efficient, and enjoyable car buying and selling experience through
									innovative technology and exceptional customer service.
								</p>
								<div className="features">
									<div className="feature">
										<div className="icon">🔍</div>
										<div className="text">
											<h3>Smart Search</h3>
											<p>Advanced filters to find your perfect match</p>
										</div>
									</div>
									<div className="feature">
										<div className="icon">🛡️</div>
										<div className="text">
											<h3>Secure Transactions</h3>
											<p>Safe and protected buying process</p>
										</div>
									</div>
									<div className="feature">
										<div className="icon">👥</div>
										<div className="text">
											<h3>Expert Support</h3>
											<p>Professional guidance at every step</p>
										</div>
									</div>
								</div>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* CTA Section */}
				<Stack className="cta-section">
					<Stack className="container">
						<Box className="cta-content">
							<h2>Ready to Find Your Dream Car?</h2>
							<p>Join thousands of satisfied customers who found their perfect match</p>
							<Link href="/account/join">
								<button className="cta-button">Get Started</button>
							</Link>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="about-page">
				{/* Hero Section */}
				<Stack className="hero-section">
					<Stack className="container">
						<Box className="content">
							<h1>Revolutionizing The Way You Find Your Dream Car</h1>
							<p>
								We're passionate about connecting car enthusiasts with their perfect vehicles. Our platform combines
								cutting-edge technology with personalized service to make car buying and selling a seamless experience.
							</p>
						</Box>
					</Stack>
				</Stack>

				{/* Stats Section */}
				<Stack className="stats-section">
					<Stack className="container">
						<Box className="stat-grid">
							<div className="stat-item">
								<span className="number">15K+</span>
								<span className="label">Cars Listed</span>
							</div>
							<div className="stat-item">
								<span className="number">10K+</span>
								<span className="label">Happy Customers</span>
							</div>
							<div className="stat-item">
								<span className="number">500+</span>
								<span className="label">Expert Dealers</span>
							</div>
							<div className="stat-item">
								<span className="number">24/7</span>
								<span className="label">Support</span>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* Mission Section */}
				<Stack className="mission-section">
					<Stack className="container">
						<Box className="content-grid">
							<div className="image-side">
								<img src="/img/about/mission.jpg" alt="Our Mission" />
							</div>
							<div className="text-side">
								<h2>Our Mission</h2>
								<p>
									To provide a transparent, efficient, and enjoyable car buying and selling experience through
									innovative technology and exceptional customer service.
								</p>
								<div className="features">
									<div className="feature">
										<div className="icon">🔍</div>
										<div className="text">
											<h3>Smart Search</h3>
											<p>Advanced filters to find your perfect match</p>
										</div>
									</div>
									<div className="feature">
										<div className="icon">🛡️</div>
										<div className="text">
											<h3>Secure Transactions</h3>
											<p>Safe and protected buying process</p>
										</div>
									</div>
									<div className="feature">
										<div className="icon">👥</div>
										<div className="text">
											<h3>Expert Support</h3>
											<p>Professional guidance at every step</p>
										</div>
									</div>
								</div>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* CTA Section */}
				<Stack className="cta-section">
					<Stack className="container">
						<Box className="cta-content">
							<h2>Ready to Find Your Dream Car?</h2>
							<p>Join thousands of satisfied customers who found their perfect match</p>
							<Link href="/account/join">
								<button className="cta-button">Get Started</button>
							</Link>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
