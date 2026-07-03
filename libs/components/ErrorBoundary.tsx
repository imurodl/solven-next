import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	handleReload = () => {
		if (typeof window !== 'undefined') window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="error-section-page layout-radius">
					<div className="boxcar-container">
						<div className="right-box">
							<div className="image-box">
								<div className="content-box">
									<h2>Oops! Something went wrong.</h2>
									<div className="text">
										An unexpected error occurred. Please try reloading the page or go back to the home page.
									</div>
									<div className="error-actions">
										<button type="button" onClick={this.handleReload} className="error-btn">
											Reload page
										</button>
										<a href="/" className="error-btn">
											Go back to home
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
