import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
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
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	}

	if (vertical) {
		return (
			<Link
				href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
				className={`community-card vertical`}
			>
				<div className="card-media">
					<div className="index-badge">{index + 1}</div>
					<img src={articleImage} alt={article?.articleTitle} />
				</div>
				<div className="card-content">
					<h3 className="article-title">{article?.articleTitle}</h3>
					<div className="card-footer">
						<span className="category-chip">News</span>
						<div className="meta-info">
							<VisibilityIcon className="views-icon" />
							<span>{article?.articleViews || 0}</span>
						</div>
					</div>
				</div>
			</Link>
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
				<h3 className="title">{article.articleTitle}</h3>
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
};

export default CommunityCard;
