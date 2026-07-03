import React from 'react';
import Link from 'next/link';
import { NextPage, NextPageContext } from 'next';
import SEO from '../libs/components/SEO';

interface ErrorProps {
	statusCode?: number;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
	return (
		<div className="error-section-page layout-radius">
			<SEO title="Error" noindex={true} />
			<div className="boxcar-container">
				<div className="right-box">
					<div className="image-box">
						<div className="content-box">
							<h2>{statusCode ? `Error ${statusCode}` : 'Oops! Something went wrong.'}</h2>
							<div className="text">
								Something went wrong. Please try again later or go back to the home page.
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

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default ErrorPage;
