import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDeviceType } from '../../libs/utils';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { Messages, GRAPHQL_URL } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import CommunityDetailMobile from '../../libs/components/community/detail/CommunityDetailMobile';
import CommunityDetailDesktop from '../../libs/components/community/detail/CommunityDetailDesktop';

export const getServerSideProps = async ({ locale, query, req }: any) => {
	const translations = await serverSideTranslations(locale, ['common']);
	let initialArticle = null;
	const id = query?.id;
	if (id) {
		try {
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `query GetBoardArticle($input: String!) { getBoardArticle(articleId: $input) { _id articleTitle articleContent articleImage articleCategory articleViews articleLikes articleComments createdAt updatedAt memberData { memberNick } } }`,
					variables: { input: id },
				}),
			});
			const json = await res.json();
			initialArticle = json?.data?.getBoardArticle ?? null;
		} catch {
			initialArticle = null;
		}
	}
	return { props: { deviceType: getDeviceType(req), ...translations, initialArticle } };
};

const CommunityDetail: NextPage = ({ initialInput, initialArticle, ...props }: T) => {
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
	const article = boardArticleData?.getBoardArticle || initialArticle;

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
		return (
			<CommunityDetailMobile
				article={article}
				boardArticle={boardArticle}
				initialArticle={initialArticle}
				articleCategory={articleCategory}
				memberImage={memberImage}
				user={user}
				total={total}
				comments={comments}
				comment={comment}
				wordsCnt={wordsCnt}
				searchFilter={searchFilter}
				openBackdrop={openBackdrop}
				updatedComment={updatedComment}
				updatedCommentWordsCnt={updatedCommentWordsCnt}
				updatedCommentId={updatedCommentId}
				setComment={setComment}
				setWordsCnt={setWordsCnt}
				setUpdatedComment={setUpdatedComment}
				setUpdatedCommentWordsCnt={setUpdatedCommentWordsCnt}
				setUpdatedCommentId={setUpdatedCommentId}
				setOpenBackdrop={setOpenBackdrop}
				goMemberPage={goMemberPage}
				likeBoArticleHandler={likeBoArticleHandler}
				getCommentMemberImage={getCommentMemberImage}
				updateButtonHandler={updateButtonHandler}
				creteCommentHandler={creteCommentHandler}
				paginationHandler={paginationHandler}
				updateCommentInputHandler={updateCommentInputHandler}
				cancelButtonHandler={cancelButtonHandler}
			/>
		);
	}

	return (
		<CommunityDetailDesktop
			article={article}
			boardArticle={boardArticle}
			initialArticle={initialArticle}
			articleCategory={articleCategory}
			memberImage={memberImage}
			user={user}
			total={total}
			comments={comments}
			comment={comment}
			wordsCnt={wordsCnt}
			searchFilter={searchFilter}
			openBackdrop={openBackdrop}
			updatedComment={updatedComment}
			updatedCommentWordsCnt={updatedCommentWordsCnt}
			updatedCommentId={updatedCommentId}
			setComment={setComment}
			setWordsCnt={setWordsCnt}
			setUpdatedComment={setUpdatedComment}
			setUpdatedCommentWordsCnt={setUpdatedCommentWordsCnt}
			setUpdatedCommentId={setUpdatedCommentId}
			setOpenBackdrop={setOpenBackdrop}
			tabChangeHandler={tabChangeHandler}
			goMemberPage={goMemberPage}
			likeBoArticleHandler={likeBoArticleHandler}
			getCommentMemberImage={getCommentMemberImage}
			updateButtonHandler={updateButtonHandler}
			creteCommentHandler={creteCommentHandler}
			paginationHandler={paginationHandler}
			updateCommentInputHandler={updateCommentInputHandler}
			cancelButtonHandler={cancelButtonHandler}
		/>
	);
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
