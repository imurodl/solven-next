import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import SEO from '../libs/components/SEO';

const ServerError: NextPage = () => {
	return (
		<div className="error-section-page layout-radius">
			<SEO title="Server Error" noindex={true} />
			<div className="boxcar-container">
				<div className="right-box">
					<div className="image-box">
						<div className="content-box">
							<h2>Oops! Something went wrong.</h2>
							<div className="text">
								A server error occurred. Please try again in a moment or go back to the home page.
							</div>
							<Link href={`/`} className="error-btn">
								Go back to home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServerError;
