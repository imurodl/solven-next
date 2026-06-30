import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document<{ locale: string }> {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps, locale: ctx.locale || 'en' };
	}

	render() {
		return (
			<Html lang={this.props.locale}>
				<Head>
					<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />
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
