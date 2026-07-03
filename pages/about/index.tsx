import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import SEO from '../../libs/components/SEO';
import { breadcrumbJsonLd } from '../../libs/seo';
import { getDeviceType } from '../../libs/utils';
import { GRAPHQL_URL } from '../../libs/config';
import { Stack, Box } from '@mui/material';

interface AboutProps {
	carsCount: string;
	agentsCount: string;
}

const About: NextPage<AboutProps> = ({ carsCount, agentsCount }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="about-page">
				<SEO
					title="About Solven"
					description="Learn about Solven — South Korea's trusted marketplace for buying and selling new and used cars with verified agents."
					jsonLd={breadcrumbJsonLd([
						{ name: 'Home', path: '/' },
						{ name: 'About', path: '/about/' },
					])}
				/>
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
								<span className="number">{carsCount}</span>
								<span className="label">Cars Listed</span>
							</div>
							<div className="stat-item">
								<span className="number">{agentsCount}</span>
								<span className="label">Expert Dealers</span>
							</div>
							<div className="stat-item">
								<span className="number">4</span>
								<span className="label">Languages</span>
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
				<SEO
					title="About Solven"
					description="Learn about Solven — South Korea's trusted marketplace for buying and selling new and used cars with verified agents."
					jsonLd={breadcrumbJsonLd([
						{ name: 'Home', path: '/' },
						{ name: 'About', path: '/about/' },
					])}
				/>
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
								<span className="number">{carsCount}</span>
								<span className="label">Cars Listed</span>
							</div>
							<div className="stat-item">
								<span className="number">{agentsCount}</span>
								<span className="label">Expert Dealers</span>
							</div>
							<div className="stat-item">
								<span className="number">4</span>
								<span className="label">Languages</span>
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

export const getServerSideProps = async ({ req }: any) => {
	const endpoint = GRAPHQL_URL;
	const query = `query {
		getCars(input: { page: 1, limit: 1, sort: "createdAt", direction: DESC, search: {} }) { metaCounter { total } }
		getAgents(input: { page: 1, limit: 1, sort: "memberRank", direction: DESC, search: {} }) { metaCounter { total } }
	}`;
	// Fail-open: real stats when reachable, honest fallbacks otherwise — never break the page.
	let carsCount = '—';
	let agentsCount = '—';
	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query }),
		});
		const json = await res.json();
		carsCount = `${json?.data?.getCars?.metaCounter?.[0]?.total ?? '—'}`;
		agentsCount = `${json?.data?.getAgents?.metaCounter?.[0]?.total ?? '—'}`;
	} catch {
		// keep fallbacks
	}
	return { props: { deviceType: getDeviceType(req), carsCount, agentsCount } };
};

export default withLayoutBasic(About);
