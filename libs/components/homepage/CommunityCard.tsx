import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Skeleton } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const device = useDeviceDetect();
	const isLoading = article?._id === 'loading';
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';

	if (device === 'mobile') {
		if (isLoading) {
			return (
				<div className="community-card horizontal">
					<div className="card-media">
						<Skeleton variant="rectangular" width="100%" height="100%" />
					</div>
					<div className="card-content">
						<Skeleton variant="text" width="80%" height={20} style={{ marginBottom: 8 }} />
						<div className="card-footer">
							<Skeleton variant="text" width={60} />
							<Skeleton variant="text" width={40} />
						</div>
					</div>
				</div>
			);
		}

		return (
			<Link
				href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
				className={`community-card horizontal`}
			>
				<div className="card-media">
					<img src={articleImage} alt={article?.articleTitle} />
				</div>
				<div className="card-content">
					<h3 className="article-title">{article.articleTitle}</h3>
					<div className="card-footer">
						<div className="meta-info">
							<span className="date">
								<Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
							</span>
						</div>
						<div className="meta-info">
							<VisibilityIcon className="views-icon" />
							<span>{article?.articleViews || 0}</span>
						</div>
					</div>
				</div>
			</Link>
		);
	} else {
		if (isLoading) {
			return (
				<div className="community-card horizontal">
					<div className="card-media">
						<Skeleton variant="rectangular" width="100%" height="100%" />
					</div>
					<div className="card-content">
						<Skeleton variant="text" width="80%" height={20} style={{ marginBottom: 8 }} />
						<div className="card-footer">
							<Skeleton variant="text" width={60} />
							<Skeleton variant="text" width={40} />
						</div>
					</div>
				</div>
			);
		}

		return (
			<Link
				href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
				className={`community-card horizontal`}
			>
				<div className="card-media">
					<img src={articleImage} alt={article?.articleTitle} />
				</div>
				<div className="card-content">
					<h3 className="article-title">{article.articleTitle}</h3>
					<div className="card-footer">
						<div className="meta-info">
							<span className="date">
								<Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
							</span>
						</div>
						<div className="meta-info">
							<VisibilityIcon className="views-icon" />
							<span>{article?.articleViews || 0}</span>
						</div>
					</div>
				</div>
			</Link>
		);
	}
};

export default CommunityCard;
