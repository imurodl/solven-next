import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, Paper } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_CAR_BRAND, UPDATE_CAR_BRAND, DELETE_CAR_BRAND_MODEL } from '../../../../apollo/admin/mutation';
import { GET_CAR_BRANDS } from '../../../../apollo/admin/query';
import { CarBrand, CarBrandInput } from '../../../types/car/car-brand';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import axios from 'axios';
import { getJwtToken } from '../../../auth';

interface CarBrandCreateProps {
	onClose: () => void;
	editBrand?: CarBrand;
}

export const CarBrandCreate = ({ onClose, editBrand }: CarBrandCreateProps) => {
	const [brandInput, setBrandInput] = useState<CarBrandInput>({
		carBrandName: '',
		carBrandModels: [],
		carBrandImg: '',
	});

	const token = getJwtToken();

	useEffect(() => {
		if (editBrand) {
			setBrandInput({
				carBrandName: editBrand.carBrandName,
				carBrandModels: editBrand.carBrandModels,
				carBrandImg: editBrand.carBrandImg,
			});
		}
	}, [editBrand]);

	const [createCarBrand] = useMutation(CREATE_CAR_BRAND, {
		refetchQueries: [{ query: GET_CAR_BRANDS }],
	});

	const [updateCarBrand] = useMutation(UPDATE_CAR_BRAND, {
		refetchQueries: [{ query: GET_CAR_BRANDS }],
	});

	const [deleteCarBrandModel] = useMutation(DELETE_CAR_BRAND_MODEL, {
		refetchQueries: [{ query: GET_CAR_BRANDS }],
	});

	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'car-brand',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			setBrandInput({ ...brandInput, carBrandImg: responseImage });
		} catch (err) {
			console.log('Error, uploadImage:', err);
			await sweetMixinErrorAlert('Failed to upload image');
		}
	};

	const handleCreateBrand = async () => {
		try {
			await createCarBrand({
				variables: {
					input: brandInput,
				},
			});
			onClose();
			await sweetTopSmallSuccessAlert('Brand created successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, handleCreateBrand:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const handleUpdateBrand = async () => {
		try {
			// Get new models that don't exist in the original brand
			const existingModels = editBrand?.carBrandModels || [];
			const newModels = brandInput.carBrandModels.filter((model) => model && !existingModels.includes(model));

			// Get models to remove
			const modelsToRemove = existingModels.filter((model) => !brandInput.carBrandModels.includes(model));

			// First update the image if changed
			if (brandInput.carBrandImg !== editBrand?.carBrandImg) {
				await updateCarBrand({
					variables: {
						input: {
							carBrandName: editBrand?.carBrandName,
							carBrandImg: brandInput.carBrandImg,
						},
					},
				});
			}

			// Remove models that are no longer in the list
			for (const model of modelsToRemove) {
				await deleteCarBrandModel({
					variables: {
						input: {
							carBrandName: editBrand?.carBrandName,
							carBrandModel: model,
						},
					},
				});
			}

			// Then add each new model one by one
			for (const model of newModels) {
				await updateCarBrand({
					variables: {
						input: {
							carBrandName: editBrand?.carBrandName,
							carBrandModel: model,
						},
					},
				});
			}

			onClose();
			await sweetTopSmallSuccessAlert('Brand updated successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, handleUpdateBrand:', err);
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<Paper sx={{ p: 3, maxWidth: 800, margin: '24px auto' }}>
			<Box component="form">
				<Typography variant="h5" sx={{ mb: 3 }}>
					{editBrand ? 'Edit Brand' : 'Create New Brand'}
				</Typography>

				<Stack spacing={2}>
					<TextField
						label="Brand Name"
						value={brandInput.carBrandName}
						onChange={(e) => setBrandInput({ ...brandInput, carBrandName: e.target.value })}
						fullWidth
						disabled={!!editBrand}
						variant="outlined"
						sx={{
							'& .MuiOutlinedInput-root': {
								'& input': {
									padding: '14px',
								},
							},
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<Box sx={{ mb: 2 }}>
						<Typography variant="subtitle1" sx={{ mb: 1, color: '#000', fontWeight: 400 }}>
							Brand Image
						</Typography>
						{brandInput.carBrandImg && (
							<Box
								component="img"
								src={`${process.env.REACT_APP_API_URL}/${brandInput.carBrandImg}`}
								alt="Brand preview"
								sx={{
									width: '100%',
									height: '120px',
									objectFit: 'contain',
									borderRadius: '4px',
									border: '1px solid rgba(0, 0, 0, 0.12)',
									mb: 1,
								}}
							/>
						)}
						<label
							htmlFor="brand-image-upload"
							style={{
								display: 'inline-block',
								color: '#1e40af',
								fontSize: '16px',
								cursor: 'pointer',
								margin: '4px 0',
								fontWeight: 500,
							}}
						>
							{brandInput.carBrandImg ? 'Change Image' : 'Upload Image'}
							<input
								type="file"
								id="brand-image-upload"
								hidden
								onChange={uploadImage}
								accept="image/jpg, image/jpeg, image/png"
							/>
						</label>
						<Typography variant="caption" sx={{ display: 'block', color: '#64748b', mt: 0.5 }}>
							Image must be in JPG, JPEG or PNG format
						</Typography>
					</Box>

					<Box sx={{ m: 3 }}>
						<Typography variant="subtitle1" sx={{ mb: 1, color: '#000', fontWeight: 400 }}>
							Models (comma-separated)
						</Typography>
						<TextField
							fullWidth
							variant="outlined"
							value={brandInput.carBrandModels.join(', ')}
							onChange={(e) => {
								const value = e.target.value;
								const models = value.endsWith(',')
									? [
											...value
												.split(',')
												.map((s) => s.trim())
												.filter(Boolean),
											'',
									  ]
									: value
											.split(',')
											.map((s) => s.trim())
											.filter(Boolean);
								setBrandInput({ ...brandInput, carBrandModels: models });
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									'& input': {
										padding: '14px',
									},
								},
							}}
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Box>
				</Stack>

				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
					<Button variant="outlined" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={editBrand ? handleUpdateBrand : handleCreateBrand}
						sx={{
							'&:hover': {
								bgcolor: '#c82333',
							},
						}}
					>
						{editBrand ? 'Update' : 'Create'}
					</Button>
				</Box>
			</Box>
		</Paper>
	);
};
