import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta
					name="keyword"
					content={
						'solven, solven.uz, car marketplace, car dealership, buy cars korea, sell cars korea, car trading platform'
					}
				/>
				<meta
					name={'description'}
					content={
						'Solven - Your premier destination for buying and selling cars in South Korea. Find new and used cars, compare prices, connect with dealers, and make informed decisions. The most trusted automotive marketplace platform in Korea | ' +
						'솔벤 - 대한민국 최고의 자동차 거래 플랫폼. 새 차와 중고차를 찾고, 가격을 비교하고, 딜러와 연결하세요. 신뢰할 수 있는 자동차 마켓플레이스 | ' +
						'Solven - Your trusted platform for automotive trading in Korea. Discover a wide selection of vehicles, from new releases to quality used cars, all in one place'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
