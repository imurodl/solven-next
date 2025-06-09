import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { T } from '../../types/common';
import { ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);
	const [recommendArticles, setRecommendArticles] = useState<BoardArticle[]>([]);
	const { t, i18n } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list || []);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list || []);
		},
	});

	const {
		loading: getRecommendArticlesLoading,
		data: getRecommendArticlesData,
		error: getRecommendArticlesError,
		refetch: getRecommendArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.RECOMMEND } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecommendArticles(data?.getBoardArticles?.list || []);
		},
	});

	// Prepare placeholder arrays for loading state
	const loadingArray = Array(2).fill({ _id: 'loading' });

	if (device === 'mobile') {
		return (
			<section className="community-board">
				<div className="container">
					<div className="info-box">
						<div className="left">
							<h2>{t('Blog Posts')}</h2>
						</div>
					</div>
					<div className="community-main">
						<div className="community-section">
							<div className="content-top">
								<Link href="/community?articleCategory=NEWS">
									<span>News</span>
									<img src="/img/icons/arrowBig.svg" alt="View all news" />
								</Link>
							</div>
							<div className="card-wrap">
								{(getNewsArticlesLoading ? loadingArray : newsArticles.slice(0, 2)).map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
								))}
							</div>
						</div>
						<div className="community-section">
							<div className="content-top">
								<Link href="/community?articleCategory=RECOMMEND">
									<span>Recommended</span>
									<img src="/img/icons/arrowBig.svg" alt="View recommended posts" />
								</Link>
							</div>
							<div className="card-wrap">
								{(getRecommendArticlesLoading ? loadingArray : recommendArticles.slice(0, 2)).map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	} else
		return (
			<section className="community-board">
				<div className="container">
					<div className="info-box">
						<div className="left">
							<span>{t('Blog Posts')}</span>
						</div>
						<div className="right">
							<Link href="/community" className="more-box">
								<span>{t('View All Posts')}</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</Link>
						</div>
					</div>
					<div className="community-main">
						<div className="community-section">
							<div className="content-top">
								<Link href="/community?articleCategory=NEWS">
									<span>News</span>
									<img src="/img/icons/arrowBig.svg" alt="View all news" />
								</Link>
							</div>
							<div className="card-wrap">
								{(getNewsArticlesLoading ? loadingArray : newsArticles).map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
								))}
							</div>
						</div>
						<div className="community-section">
							<div className="content-top">
								<Link href="/community?articleCategory=FREE">
									<span>Free Board</span>
									<img src="/img/icons/arrowBig.svg" alt="View all free posts" />
								</Link>
							</div>
							<div className="card-wrap">
								{(getFreeArticlesLoading ? loadingArray : freeArticles).map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
								))}
							</div>
						</div>
						<div className="community-section">
							<div className="content-top">
								<Link href="/community?articleCategory=RECOMMEND">
									<span>Recommended</span>
									<img src="/img/icons/arrowBig.svg" alt="View recommended posts" />
								</Link>
							</div>
							<div className="card-wrap">
								{(getRecommendArticlesLoading ? loadingArray : recommendArticles).map((article, index) => (
									<CommunityCard vertical={false} article={article} index={index} key={article?._id} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
};

export default CommunityBoards;
