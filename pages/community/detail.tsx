import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
	Button,
	Stack,
	Typography,
	Tab,
	Tabs,
	IconButton,
	Backdrop,
	Pagination,
	Box,
	CircularProgress,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: boardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: articleId,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle.memberData.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter[0]?.total || 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeBoArticleHandler = async (user: any, id: string) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeBoArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
					return;
				}
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}

			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedCommentWordsCnt(0);
			setUpdatedComment('');
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<img src="/img/logo/solvenBackWhite.png" alt="" />
								<Stack className={'community-name'}>
									<Typography className={'name'}>Community Articles</Typography>
								</Stack>
							</Stack>
							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								<Tab
									value={'FREE'}
									label={'Free Board'}
									className={`tab-button ${articleCategory === 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={'Recommendation'}
									className={`tab-button ${articleCategory === 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={'News'}
									className={`tab-button ${articleCategory === 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={'Humor'}
									className={`tab-button ${articleCategory === 'HUMOR' ? 'active' : ''}`}
								/>
							</Tabs>
						</Stack>
						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">{articleCategory} BOARD</Typography>
									<Typography className="sub-title">
										Express your opinions freely here without content restrictions
									</Typography>
								</Stack>
								<Button
									onClick={() =>
										router.push({
											pathname: '/mypage',
											query: {
												category: 'writeArticle',
											},
										})
									}
									className="right"
								>
									Write
								</Button>
							</Stack>
							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										<Stack className="content">
											<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{boardArticle?.createdAt}
												</Moment>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<ThumbUpOffAltIcon onClick={() => likeBoArticleHandler(user, boardArticle!._id)} />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<VisibilityIcon />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}

												<Typography className="text">{boardArticle?.articleComments}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<ThumbUpOffAltIcon onClick={() => likeBoArticleHandler(user, boardArticle!._id)} />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack className="reviews-config">
									<Typography className="section-title">Comments ({total})</Typography>

									{comments?.length > 0 && (
										<Stack className="review-list">
											{comments?.map((commentData) => (
												<Stack className="review-item" key={commentData?._id}>
													<Stack className="review-header">
														<Stack className="user-info">
															<img
																src={getCommentMemberImage(commentData?.memberData?.memberImage)}
																alt=""
																onClick={() => goMemberPage(commentData?.memberData?._id)}
															/>
															<Stack className="info">
																<Typography className="name" onClick={() => goMemberPage(commentData?.memberData?._id)}>
																	{commentData?.memberData?.memberNick}
																</Typography>
																<Typography className="date">
																	<Moment format={'DD.MM.YY HH:mm'}>{commentData?.createdAt}</Moment>
																</Typography>
															</Stack>
														</Stack>
														{commentData?.memberId === user?._id && (
															<Stack className="actions">
																<IconButton
																	onClick={() => {
																		setUpdatedCommentId(commentData?._id);
																		updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																	}}
																>
																	<DeleteForeverIcon />
																</IconButton>
																<IconButton
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
													<Typography className="review-content">{commentData?.commentContent}</Typography>
												</Stack>
											))}
										</Stack>
									)}

									{/* Write comment section */}
									<Stack className="write-review">
										<Stack className="write-header">
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
							</div>
						</div>
					</Stack>
				</div>
				<Backdrop open={openBackdrop} sx={{ zIndex: 999 }}>
					<Stack className="edit-comment-box">
						<Stack className="write-header">
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
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
