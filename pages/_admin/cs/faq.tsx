import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { FaqList } from '../../../libs/components/admin/cs/FaqList';
import { NoticeCreate } from '../../../libs/components/admin/cs/NoticeCreate';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { NoticeStatus, NoticeCategory } from '../../../libs/enums/notice.enum';
import { typeNotice } from '../../../libs/types/notice/notice';

const AdminFaq: NextPage = () => {
	const router = useRouter();
	const [currentTab, setCurrentTab] = useState<string>('all');
	const [searchCategory, setSearchCategory] = useState<string>('title');
	const [searchInput, setSearchInput] = useState<string>('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingNotice, setEditingNotice] = useState<typeNotice | undefined>(undefined);

	// Get total counts for tabs
	const { data: noticesData } = useQuery(GET_ALL_NOTICES, {
		variables: {
			input: {
				limit: 1,
				noticeCategory: NoticeCategory.FAQ,
			},
		},
	});

	const getStatusCount = (status?: NoticeStatus) => {
		if (!noticesData?.getAllNotices?.metaCounter) return 0;

		if (!status) {
			return noticesData.getAllNotices.metaCounter.reduce((acc: number, curr: any) => acc + curr.count, 0);
		}

		const statusCount = noticesData.getAllNotices.metaCounter.find((counter: any) => counter.status === status);
		return statusCount ? statusCount.count : 0;
	};

	const handleTabChange = (tab: string) => {
		setCurrentTab(tab);
		setPage(0);
	};

	const handleSearchInput = (value: string) => {
		setSearchInput(value);
		setPage(0);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleEdit = (notice: typeNotice) => {
		setEditingNotice(notice);
		setShowCreateForm(true);
	};

	const handleCloseForm = () => {
		setShowCreateForm(false);
		setEditingNotice(undefined);
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				{!showCreateForm && (
					<Button className="btn_add" variant={'contained'} size={'medium'} onClick={() => setShowCreateForm(true)}>
						<AddRoundedIcon sx={{ mr: '8px' }} />
						ADD FAQ
					</Button>
				)}
			</Box>

			{showCreateForm && (
				<NoticeCreate
					onClose={handleCloseForm}
					editNotice={editingNotice}
					defaultCategory={NoticeCategory.FAQ}
					disableCategory
				/>
			)}

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={currentTab}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={() => handleTabChange('all')}
									value="all"
									className={currentTab === 'all' ? 'li on' : 'li'}
								>
									All ({getStatusCount()})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('active')}
									value="active"
									className={currentTab === 'active' ? 'li on' : 'li'}
								>
									Active ({getStatusCount(NoticeStatus.ACTIVE)})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('hold')}
									value="hold"
									className={currentTab === 'hold' ? 'li on' : 'li'}
								>
									Hold ({getStatusCount(NoticeStatus.HOLD)})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('delete')}
									value="delete"
									className={currentTab === 'delete' ? 'li on' : 'li'}
								>
									Deleted ({getStatusCount(NoticeStatus.DELETE)})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select
									sx={{ width: '160px', mr: '20px' }}
									value={searchCategory}
									onChange={(e) => setSearchCategory(e.target.value)}
								>
									<MenuItem value={'title'}>Title</MenuItem>
									<MenuItem value={'content'}>Content</MenuItem>
								</Select>

								<OutlinedInput
									value={searchInput}
									onChange={(e) => handleSearchInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={`Search FAQs by ${searchCategory}`}
									endAdornment={
										<>
											{searchInput && (
												<CancelRoundedIcon onClick={() => handleSearchInput('')} style={{ cursor: 'pointer' }} />
											)}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<FaqList
							dense={false}
							searchInput={searchInput}
							searchCategory={searchCategory}
							currentTab={currentTab}
							onEdit={handleEdit}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={
								noticesData?.getAllNotices?.metaCounter?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0
							}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminFaq);
