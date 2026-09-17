import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { organizationJsonLd, websiteJsonLd } from '../libs/seo';
import { THEME_BOOT_SCRIPT } from '../libs/security/inline-scripts';

class MyDocument extends Document<{ locale: string }> {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps, locale: ctx.locale || 'en' };
	}

	render() {
		return (
			<Html lang={this.props.locale}>
				<Head>
					<meta name="theme-color" content="#1e40af" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
					/>
					<link rel="icon" href="/favicon.ico" sizes="any" />
					<link rel="icon" type="image/svg+xml" href="/img/logo/favicon.svg" />
					<link rel="apple-touch-icon" href="/img/logo/solven.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }}
					/>
				</Head>
				<body>
					{/* Apply the saved/system theme before first paint so there is no light->dark flash (hashed in the CSP) */}
					<script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
