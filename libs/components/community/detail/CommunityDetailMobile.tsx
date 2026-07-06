import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { Button, Stack, Typography, IconButton, Backdrop, Pagination, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import SEO from '../../SEO';
import { articleJsonLd, breadcrumbJsonLd } from '../../../seo';
import { CommentStatus } from '../../../enums/comment.enum';

const ToastViewerComponent = dynamic(() => import('../TViewer'), { ssr: false });

interface CommunityDetailMobileProps {
	article: any;
	boardArticle: any;
	initialArticle: any;
	articleCategory: string;
	memberImage: string;
	user: any;
	total: number;
	comments: any[];
	comment: string;
	wordsCnt: number;
	searchFilter: any;
	openBackdrop: boolean;
	updatedComment: string;
	updatedCommentWordsCnt: number;
	updatedCommentId: string;
	setComment: (value: string) => void;
	setWordsCnt: (value: number) => void;
	setUpdatedComment: (value: string) => void;
	setUpdatedCommentWordsCnt: (value: number) => void;
	setUpdatedCommentId: (value: string) => void;
	setOpenBackdrop: (value: boolean) => void;
	goMemberPage: (id: any) => void;
	likeBoArticleHandler: (user: any, id: string) => void;
	getCommentMemberImage: (imageUrl: string | undefined) => string;
	updateButtonHandler: (commentId: string, commentStatus?: any) => void;
	creteCommentHandler: () => void;
	paginationHandler: (e: any, value: number) => void;
	updateCommentInputHandler: (value: string) => void;
	cancelButtonHandler: () => void;
}

const CommunityDetailMobile = (props: CommunityDetailMobileProps) => {
	const {
		article,
		boardArticle,
		initialArticle,
		articleCategory,
		memberImage,
		user,
		total,
		comments,
		comment,
		wordsCnt,
		searchFilter,
		openBackdrop,
		updatedComment,
		updatedCommentWordsCnt,
		updatedCommentId,
		setComment,
		setWordsCnt,
		setUpdatedComment,
		setUpdatedCommentWordsCnt,
		setUpdatedCommentId,
		setOpenBackdrop,
		goMemberPage,
		likeBoArticleHandler,
		getCommentMemberImage,
		updateButtonHandler,
		creteCommentHandler,
		paginationHandler,
		updateCommentInputHandler,
		cancelButtonHandler,
	} = props;

	const art = boardArticle || initialArticle;
	const seoImg = art?.articleImage ? `${process.env.REACT_APP_API_URL}/${art.articleImage}` : undefined;
	const seoPlain = art?.articleContent ? String(art.articleContent).replace(/<[^>]*>/g, ' ').trim() : '';
	const meLiked = boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite;

	return (
		<div id="community-detail-mobile">
			{art && (
				<SEO
					canonical={`/community/detail?id=${art._id}`}
					title={art.articleTitle}
					description={seoPlain ? seoPlain.slice(0, 160) : `Read "${art.articleTitle}" on the Solven community.`}
					image={seoImg}
					type="article"
					publishedTime={art.createdAt ? new Date(art.createdAt).toISOString() : undefined}
					modifiedTime={art.updatedAt ? new Date(art.updatedAt).toISOString() : undefined}
					section={art.articleCategory}
					author={art.memberData?.memberNick}
					jsonLd={[
						articleJsonLd(art, { image: seoImg, plain: seoPlain, author: art.memberData?.memberNick }),
						breadcrumbJsonLd([
							{ name: 'Home', path: '/' },
							{ name: 'Community', path: '/community/' },
							{ name: art.articleTitle, path: '/community/detail/?id=' + art._id },
						]),
					].filter(Boolean)}
				/>
			)}

			<Stack className="article-header">
				<Typography className="category">{articleCategory} BOARD</Typography>
				<Typography className="title">{article?.articleTitle}</Typography>
				<Stack className="author-row">
					<Image
						src={memberImage}
						alt=""
						className="avatar"
						onClick={() => goMemberPage(boardArticle?.memberData?._id)}
						width={800}
						height={600}
					/>
					<Stack className="author-meta">
						<Typography className="nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
							{article?.memberData?.memberNick}
						</Typography>
						<span className={'date'}>
							{article?.createdAt ? format(new Date(article.createdAt), 'dd.MM.yy HH:mm') : ''}
						</span>
					</Stack>
				</Stack>
				<Stack className="stats-row">
					<Stack className="stat">
						{meLiked ? (
							<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
						) : (
							<ThumbUpOffAltIcon onClick={() => likeBoArticleHandler(user, boardArticle!._id)} />
						)}
						<Typography className="text">{article?.articleLikes}</Typography>
					</Stack>
					<Stack className="stat">
						<VisibilityIcon />
						<Typography className="text">{article?.articleViews}</Typography>
					</Stack>
					<Stack className="stat">
						{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
						<Typography className="text">{article?.articleComments}</Typography>
					</Stack>
				</Stack>
			</Stack>

			<Stack className="article-body">
				<ToastViewerComponent markdown={article?.articleContent} className={'ytb_play'} />
			</Stack>

			<Stack className="comments-section">
				<Typography className="section-title">Comments ({total})</Typography>

				{comments?.length > 0 && (
					<Stack className="comment-list">
						{comments?.map((commentData) => (
							<Stack className="comment-item" key={commentData?._id}>
								<Stack className="comment-top">
									<Stack className="user-info">
										<Image
											src={getCommentMemberImage(commentData?.memberData?.memberImage)}
											alt=""
											onClick={() => goMemberPage(commentData?.memberData?._id)}
											width={800}
											height={600}
										/>
										<Stack className="info">
											<Typography className="name" onClick={() => goMemberPage(commentData?.memberData?._id)}>
												{commentData?.memberData?.memberNick}
											</Typography>
											<Typography className="date">
												{commentData?.createdAt ? format(new Date(commentData.createdAt), 'dd.MM.yy HH:mm') : ''}
											</Typography>
										</Stack>
									</Stack>
									{commentData?.memberId === user?._id && (
										<Stack className="actions">
											<IconButton
												aria-label="Delete comment"
												onClick={() => {
													setUpdatedCommentId(commentData?._id);
													updateButtonHandler(commentData?._id, CommentStatus.DELETE);
												}}
											>
												<DeleteForeverIcon />
											</IconButton>
											<IconButton
												aria-label="Edit comment"
												onClick={() => {
													setUpdatedComment(commentData?.commentContent);
													setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
													setUpdatedCommentId(commentData?._id);
													setOpenBackdrop(true);
												}}
											>
												<EditIcon />
											</IconButton>
										</Stack>
									)}
								</Stack>
								<Typography className="comment-content">{commentData?.commentContent}</Typography>
							</Stack>
						))}
					</Stack>
				)}

				<Stack className="write-box">
					<Stack className="write-head">
						<Typography className="title">Write a comment</Typography>
						<Typography className="counter">{wordsCnt}/100</Typography>
					</Stack>
					<textarea
						placeholder="Share your thoughts..."
						value={comment}
						onChange={(e) => {
							if (e.target.value.length > 100) return;
							setWordsCnt(e.target.value.length);
							setComment(e.target.value);
						}}
					/>
					<Stack className="button-box">
						<Button onClick={creteCommentHandler}>Post Comment</Button>
					</Stack>
				</Stack>

				{total > 0 && (
					<Box className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchFilter.limit) || 1}
							page={searchFilter.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Box>
				)}
			</Stack>

			<Backdrop open={openBackdrop} sx={{ zIndex: 999 }}>
				<Stack className="edit-comment-box">
					<Stack className="write-head">
						<Typography className="title">Edit comment</Typography>
						<Typography className="counter">{updatedCommentWordsCnt}/100</Typography>
					</Stack>
					<textarea
						placeholder="Update your comment..."
						value={updatedComment}
						onChange={(e) => updateCommentInputHandler(e.target.value)}
					/>
					<Stack className="button-box">
						<Button onClick={cancelButtonHandler}>Cancel</Button>
						<Button onClick={() => updateButtonHandler(updatedCommentId)}>Update</Button>
					</Stack>
				</Stack>
			</Backdrop>
		</div>
	);
};

export default CommunityDetailMobile;
