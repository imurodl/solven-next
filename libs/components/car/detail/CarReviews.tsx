import React, { ChangeEvent } from 'react';
import { Box, Button, Stack, Typography, Pagination as MuiPagination } from '@mui/material';
import Review from '../Review';
import { Comment } from '../../../types/comment/comment';
import { CommentInput, CommentsInquiry } from '../../../types/comment/comment.input';

interface CarReviewsProps {
	carComments: Comment[];
	commentTotal: number;
	commentInquiry: CommentsInquiry;
	commentPaginationChangeHandler: (event: ChangeEvent<unknown>, value: number) => void;
	insertCommentData: CommentInput;
	setInsertCommentData: (data: CommentInput) => void;
	createCommentHandler: () => void;
}

const CarReviews = (props: CarReviewsProps) => {
	const {
		carComments,
		commentTotal,
		commentInquiry,
		commentPaginationChangeHandler,
		insertCommentData,
		setInsertCommentData,
		createCommentHandler,
	} = props;

	return (
		<>
			{/* Comments section */}
			{carComments?.length > 0 && (
				<Stack className="reviews-config">
					<Typography className="section-title">Reviews ({commentTotal})</Typography>
					<Stack className="review-list">
						{carComments?.map((comment: Comment) => (
							<Review comment={comment} key={comment?._id} />
						))}
						<Box className="pagination-box">
							<MuiPagination
								page={commentInquiry.page}
								count={Math.ceil(commentTotal / commentInquiry.limit)}
								onChange={commentPaginationChangeHandler}
								shape="circular"
								color="primary"
							/>
						</Box>
					</Stack>
				</Stack>
			)}
			<Stack className="leave-review-config">
				<Typography className="section-title">Leave A Review</Typography>
				<textarea
					placeholder="Write your review here..."
					onChange={({ target: { value } }: any) => {
						setInsertCommentData({ ...insertCommentData, commentContent: value });
					}}
					value={insertCommentData.commentContent}
				></textarea>
				<Button
					className="submit-review-btn"
					variant="contained"
					onClick={createCommentHandler}
					disabled={!insertCommentData.commentContent.trim()}
				>
					Submit Review
				</Button>
			</Stack>
		</>
	);
};

export default CarReviews;
