import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
	Paper,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_NOTICE_BY_ADMIN, UPDATE_NOTICE_BY_ADMIN } from '../../../../apollo/admin/mutation';
import { NoticeCategory } from '../../../enums/notice.enum';
import { GET_ALL_NOTICES } from '../../../../apollo/user/query';
import { typeNotice } from '../../../types/notice/notice';

interface NoticeCreateProps {
	onClose: () => void;
	editNotice?: typeNotice;
	defaultCategory?: NoticeCategory;
	disableCategory?: boolean;
}

export const NoticeCreate = ({ onClose, editNotice, defaultCategory, disableCategory }: NoticeCreateProps) => {
	const [formData, setFormData] = useState({
		noticeCategory: defaultCategory || NoticeCategory.FAQ,
		noticeTitle: '',
		noticeContent: '',
	});

	useEffect(() => {
		if (editNotice) {
			setFormData({
				noticeCategory: editNotice.noticeCategory,
				noticeTitle: editNotice.noticeTitle,
				noticeContent: editNotice.noticeContent,
			});
		}
	}, [editNotice]);

	const [createNotice] = useMutation(CREATE_NOTICE_BY_ADMIN, {
		refetchQueries: [
			{
				query: GET_ALL_NOTICES,
				variables: {
					input: {
						page: 1,
						limit: 20,
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
						page: 1,
						limit: 20,
					},
				},
			},
		],
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editNotice) {
				await updateNotice({
					variables: {
						noticeId: editNotice._id,
						input: formData,
					},
				});
			} else {
				await createNotice({
					variables: {
						input: formData,
					},
				});
			}
			onClose();
		} catch (error) {
			console.error('Error saving notice:', error);
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCategoryChange = (e: SelectChangeEvent) => {
		setFormData((prev) => ({
			...prev,
			noticeCategory: e.target.value as NoticeCategory,
		}));
	};

	return (
		<Paper sx={{ p: 3, maxWidth: 800, margin: '24px auto' }}>
			<Box component="form" onSubmit={handleSubmit}>
				<Typography variant="h5" sx={{ mb: 3 }}>
					{editNotice ? 'Edit Notice' : 'Create New Notice'}
				</Typography>

				<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
					{!disableCategory && (
						<FormControl sx={{ width: '30%' }} variant="outlined">
							<InputLabel id="category-label">Category</InputLabel>
							<Select
								labelId="category-label"
								name="noticeCategory"
								value={formData.noticeCategory}
								label="Category"
								onChange={handleCategoryChange}
								sx={{
									'& .MuiSelect-select': {
										padding: '14px',
									},
								}}
							>
								{Object.values(NoticeCategory).map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<TextField
						sx={{
							width: disableCategory ? '100%' : '70%',
							'& .MuiOutlinedInput-root': {
								'& input': {
									padding: '14px',
								},
							},
						}}
						variant="outlined"
						name="noticeTitle"
						label="Title"
						value={formData.noticeTitle}
						onChange={handleTextChange}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Box>

				<TextField
					fullWidth
					variant="outlined"
					sx={{
						mb: 3,
						'& .MuiOutlinedInput-root': {
							'& input': {
								padding: '14px',
							},
						},
					}}
					name="noticeContent"
					label="Content"
					value={formData.noticeContent}
					onChange={handleTextChange}
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
					<Button variant="outlined" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						sx={{
							'&:hover': {
								bgcolor: '#c82333',
							},
						}}
					>
						{editNotice ? 'Edit Notice' : 'Create Notice'}
					</Button>
				</Box>
			</Box>
		</Paper>
	);
};
