import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

const NotFound: NextPage = () => {
	return (
		<div className="error-section-page layout-radius">
			<div className="boxcar-container">
				<div className="right-box">
					<div className="image-box">
						<Image width={1401} height={708} src="/img/banner/error.png" alt="404 not found" />
						<div className="content-box">
							<h2>Oops! It looks like you're lost.</h2>
							<div className="text">
								The page you're looking for isn't available. Try to search again or use the go to.
							</div>
							<Link href={`/`} className="error-btn">
								Go back to home
								<svg xmlns="http://www.w3.org/2000/svg" width={14} height={15} viewBox="0 0 14 15" fill="none">
									<g clipPath="url(#clip0_858_848)">
										<path
											d="M13.6111 0.891113H5.05558C4.84062 0.891113 4.66668 1.06506 4.66668 1.28001C4.66668 1.49497 4.84062 1.66892 5.05558 1.66892H12.6723L0.113941 14.2273C-0.0379805 14.3792 -0.0379805 14.6253 0.113941 14.7772C0.189884 14.8531 0.289415 14.8911 0.38891 14.8911C0.488405 14.8911 0.5879 14.8531 0.663879 14.7772L13.2222 2.21882V9.83558C13.2222 10.0505 13.3962 10.2245 13.6111 10.2245C13.8261 10.2245 14 10.0505 14 9.83558V1.28001C14 1.06506 13.8261 0.891113 13.6111 0.891113Z"
											fill="#fff"
										/>
									</g>
									<defs>
										<clipPath id="clip0_858_848">
											<rect width={14} height={14} fill="white" transform="translate(0 0.891113)" />
										</clipPath>
									</defs>
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(NotFound);
