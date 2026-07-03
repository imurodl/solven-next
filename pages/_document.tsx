import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { organizationJsonLd, websiteJsonLd } from '../libs/seo';

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
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
