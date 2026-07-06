import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../config';
import { a11yClickProps } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="community-general-card-config"
				onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
				{...a11yClickProps((e: any) => chooseArticleHandler(e, boardArticle))}
			>
				<Stack className="image-box">
					<Image src={imagePath} alt={boardArticle?.articleTitle || 'Article'} className="card-img" width={800} height={600} />
				</Stack>
				<Stack className="desc-box" sx={{ marginTop: '-20px' }}>
					<Stack width={'100%'}>
						<Typography
							className="desc"
							// onClick={(e: any) => {
							// 	e.stopPropagation();
							// 	goMemberPage(boardArticle?.memberData?._id as string);
							// }}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="title">{boardArticle?.articleTitle}</Typography>
					</Stack>
					<Stack className={'buttons'}>
						<div className="stat-group" style={{ display: 'flex' }}>
							<IconButton color={'default'} aria-label="Views">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
						</div>
						<div className="stat-group" style={{ display: 'flex' }}>
							<IconButton
								color={'default'}
								aria-label={
									boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite
										? 'Remove from favorites'
										: 'Add to favorites'
								}
								onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
							>
								{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
						</div>
					</Stack>
				</Stack>
				<Stack className="date-box">
					<span className="month">
						{boardArticle?.createdAt ? format(new Date(boardArticle.createdAt), 'MMMM') : ''}
					</span>
					<Typography className="day">
						{boardArticle?.createdAt ? format(new Date(boardArticle.createdAt), 'dd') : ''}
					</Typography>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="community-general-card-config"
				onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
				{...a11yClickProps((e: any) => chooseArticleHandler(e, boardArticle))}
			>
				<Stack className="image-box">
					<Image src={imagePath} alt={boardArticle?.articleTitle || 'Article'} className="card-img" width={800} height={600} />
				</Stack>
				<Stack className="desc-box" sx={{ marginTop: '-20px' }}>
					<Stack width={'100%'}>
						<Typography
							className="desc"
							// onClick={(e: any) => {
							// 	e.stopPropagation();
							// 	goMemberPage(boardArticle?.memberData?._id as string);
							// }}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="title">{boardArticle?.articleTitle}</Typography>
					</Stack>
					<Stack className={'buttons'}>
						<div className="stat-group" style={{ display: 'flex' }}>
							<IconButton color={'default'} aria-label="Views">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
						</div>
						<div className="stat-group" style={{ display: 'flex' }}>
							<IconButton
								color={'default'}
								aria-label={
									boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite
										? 'Remove from favorites'
										: 'Add to favorites'
								}
								onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
							>
								{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
						</div>
					</Stack>
				</Stack>
				<Stack className="date-box">
					<span className="month">
						{boardArticle?.createdAt ? format(new Date(boardArticle.createdAt), 'MMMM') : ''}
					</span>
					<Typography className="day">
						{boardArticle?.createdAt ? format(new Date(boardArticle.createdAt), 'dd') : ''}
					</Typography>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
