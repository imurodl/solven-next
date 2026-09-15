import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminTable, { Column } from '../../../libs/components/admin/shared/AdminTable';
import { GET_ALL_REVIEWS_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_REVIEW_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Review } from '../../../libs/types/review/review';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin } from '../../../libs/sweetAlert';
import RatingStars from '../../../libs/components/common/RatingStars';
import { REACT_APP_API_URL } from '../../../libs/config';

const AdminReviews: NextPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const { data, loading, refetch } = useQuery(GET_ALL_REVIEWS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: page + 1, limit: rowsPerPage, search: {} } },
	});
	const [removeReview] = useMutation(REMOVE_REVIEW_BY_ADMIN);
	const reviews: Review[] = data?.getAllReviewsByAdmin?.list ?? [];
	const total: number = data?.getAllReviewsByAdmin?.metaCounter?.[0]?.total ?? 0;

	const remove = async (r: Review) => {
		try {
			if (!(await sweetConfirmAlert('Hide this review?'))) return;
			await removeReview({ variables: { reviewId: r._id } });
			await refetch();
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};

	const columns: Column<Review>[] = [
		{ key: 'car', label: 'Car', render: (r) => r.carTitle ?? r.carId },
		{ key: 'member', label: 'Reviewer', render: (r) => r.memberData?.memberNick ?? '-' },
		{ key: 'rating', label: 'Rating', render: (r) => <RatingStars value={r.reviewRating} /> },
		{
			key: 'content',
			label: 'Review',
			render: (r) => (
				<Stack spacing={0.5}>
					<span style={{ maxWidth: 420, display: 'block' }}>{r.reviewContent}</span>
					{r.reviewImages?.length > 0 && (
						<Stack direction="row" spacing={0.5}>
							{r.reviewImages.map((img) => (
								<img key={img} src={`${REACT_APP_API_URL}/${img}`} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
							))}
						</Stack>
					)}
				</Stack>
			),
		},
		{ key: 'reactions', label: '👍 / 👎', render: (r) => `${r.likesCount ?? 0} / ${r.dislikesCount ?? 0}` },
		{ key: 'status', label: 'Status', render: (r) => <Chip size="small" label={r.reviewStatus} color={r.reviewStatus === 'ACTIVE' ? 'success' : 'default'} /> },
		{ key: 'date', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
		{
			key: 'actions',
			label: '',
			render: (r) =>
				r.reviewStatus === 'ACTIVE' ? (
					<Button size="small" color="error" variant="outlined" onClick={() => remove(r)}>
						Hide
					</Button>
				) : null,
		},
	];

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Reviews</Typography>
			</Box>
			<AdminTable columns={columns} rows={reviews} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }} loading={loading} rowKey={(r) => r._id} emptyText="No reviews" />
		</Box>
	);
};

export default withAdminLayout(AdminReviews);
