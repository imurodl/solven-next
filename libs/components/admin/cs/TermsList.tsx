import React from 'react';
import { useRouter } from 'next/router';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Stack,
	Select,
	MenuItem,
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../../apollo/user/query';
import { REMOVE_NOTICE_BY_ADMIN, UPDATE_NOTICE_BY_ADMIN } from '../../../../apollo/admin/mutation';
import { typeNotice } from '../../../types/notice/notice';
import { NoticeStatus } from '../../../enums/notice.enum';
import { format } from 'date-fns';
import { sweetConfirmAlert } from '../../../sweetAlert';

interface TermsListType {
	dense?: boolean;
	searchInput?: string;
	searchCategory: string;
	currentTab?: string;
	onEdit: (notice: typeNotice) => void;
}

export const TermsList = (props: TermsListType) => {
	const { dense, searchInput, searchCategory, currentTab, onEdit } = props;
	const router = useRouter();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(20);

	// Query notices
	const { data: noticesData, loading } = useQuery(GET_ALL_NOTICES, {
		variables: {
			input: {
				page: page + 1,
				limit: rowsPerPage,
				search: searchInput || undefined,
				noticeStatus: currentTab === 'all' ? undefined : currentTab?.toUpperCase(),
				noticeCategory: 'TERMS',
			},
		},
	});

	const [removeNotice] = useMutation(REMOVE_NOTICE_BY_ADMIN, {
		refetchQueries: [
			{
				query: GET_ALL_NOTICES,
				variables: {
					input: {
						page: page + 1,
						limit: rowsPerPage,
						search: searchInput || undefined,
						noticeStatus: currentTab === 'all' ? undefined : currentTab?.toUpperCase(),
						noticeCategory: 'TERMS',
					},
				},
			},
		],
	});

	const [updateNotice] = useMutation(UPDATE_NOTICE_BY_ADMIN, {
		refetchQueries: [
			{
				query: GET_ALL_NOTICES,
				variables: {
					input: {
						page: page + 1,
						limit: rowsPerPage,
						search: searchInput || undefined,
						noticeStatus: currentTab === 'all' ? undefined : currentTab?.toUpperCase(),
						noticeCategory: 'TERMS',
					},
				},
			},
		],
	});

	const handleDelete = async (noticeId: string) => {
		if (await sweetConfirmAlert('Do you want to delete this terms?')) {
			try {
				await removeNotice({
					variables: {
						input: noticeId,
					},
				});
			} catch (error) {
				console.error('Error deleting terms:', error);
			}
		}
	};

	const handleStatusChange = async (notice: typeNotice, newStatus: NoticeStatus) => {
		const confirmMessage =
			newStatus === NoticeStatus.DELETE
				? 'Do you want to delete this terms?'
				: `Do you want to change the status to ${newStatus}?`;

		if (await sweetConfirmAlert(confirmMessage)) {
			try {
				if (newStatus === NoticeStatus.DELETE) {
					await removeNotice({
						variables: {
							input: notice._id,
						},
					});
				} else {
					await updateNotice({
						variables: {
							noticeId: notice._id,
							input: {
								noticeStatus: newStatus,
								noticeCategory: notice.noticeCategory,
								noticeTitle: notice.noticeTitle,
								noticeContent: notice.noticeContent,
							},
						},
					});
				}
			} catch (error) {
				console.error('Error updating terms status:', error);
			}
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					<TableHead>
						<TableRow>
							<TableCell align="left" width="15%">
								Category
							</TableCell>
							<TableCell align="left" width="20%">
								Title
							</TableCell>
							<TableCell align="left" width="35%">
								Content
							</TableCell>
							<TableCell align="left" width="15%">
								Status
							</TableCell>
							<TableCell align="left" width="10%">
								Created Date
							</TableCell>
							<TableCell align="right" width="5%">
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{noticesData?.getAllNotices?.list.map((notice: typeNotice) => (
							<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{notice.noticeCategory}</TableCell>
								<TableCell align="left">{notice.noticeTitle}</TableCell>
								<TableCell
									align="left"
									sx={{
										maxWidth: 0,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{notice.noticeContent}
								</TableCell>
								<TableCell align="left">
									<Select
										size="small"
										value={notice.noticeStatus}
										onChange={(e) => handleStatusChange(notice, e.target.value as NoticeStatus)}
										disabled={notice.noticeStatus === NoticeStatus.DELETE}
										sx={{
											minWidth: 100,
											'& .MuiSelect-select': {
												color: notice.noticeStatus === NoticeStatus.DELETE ? '#dc3545' : 'inherit',
											},
										}}
									>
										<MenuItem value={NoticeStatus.ACTIVE}>Active</MenuItem>
										<MenuItem value={NoticeStatus.HOLD}>Hold</MenuItem>
										<MenuItem value={NoticeStatus.DELETE} sx={{ color: '#dc3545' }}>
											Delete
										</MenuItem>
									</Select>
								</TableCell>
								<TableCell align="left">{format(new Date(notice.createdAt), 'yyyy-MM-dd')}</TableCell>
								<TableCell
									align="right"
									sx={{
										display: 'flex',
										gap: '4px',
										justifyContent: 'flex-end',
										padding: '6px 16px',
									}}
								>
									<Tooltip title={'delete'}>
										<IconButton size="small" onClick={() => handleDelete(notice._id)}>
											<DeleteRoundedIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title="edit">
										<IconButton size="small" onClick={() => onEdit(notice)}>
											<NotePencil size={20} weight="fill" />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
