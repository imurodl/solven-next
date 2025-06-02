import React, { useState } from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import {
	CREATE_CAR_BRAND,
	UPDATE_CAR_BRAND,
	DELETE_CAR_BRAND_MODEL,
	REMOVE_CAR_BRAND,
} from '../../../apollo/admin/mutation';
import { GET_CAR_BRANDS } from '../../../apollo/admin/query';
import { CarBrand, CarBrandInput } from '../../../libs/types/car/car-brand';
import { CarBrandStatus } from '../../../libs/enums/car.enum';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { PencilSimple, Plus, Trash } from 'phosphor-react';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import axios from 'axios';
import { getJwtToken } from '../../../libs/auth';
import { REACT_APP_API_URL } from '../../../libs/config';

const AdminCarBrands: NextPage = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [editBrand, setEditBrand] = useState<CarBrand | null>(null);
	const [brandInput, setBrandInput] = useState<CarBrandInput>({
		carBrandName: '',
		carBrandModels: [],
		carBrandImg: '',
	});

	const token = getJwtToken();

	// Queries
	const { data: carBrandsData, refetch: refetchCarBrands } = useQuery(GET_CAR_BRANDS);

	// Mutations
	const [createCarBrand] = useMutation(CREATE_CAR_BRAND);
	const [updateCarBrand] = useMutation(UPDATE_CAR_BRAND);
	const [deleteCarBrandModel] = useMutation(DELETE_CAR_BRAND_MODEL);
	const [removeCarBrand] = useMutation(REMOVE_CAR_BRAND);

	// Handlers
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

	const handleOpenDialog = (brand?: CarBrand) => {
		if (brand) {
			setEditBrand(brand);
			setBrandInput({
				carBrandName: brand.carBrandName,
				carBrandModels: brand.carBrandModels,
				carBrandImg: brand.carBrandImg,
			});
		} else {
			setEditBrand(null);
			setBrandInput({
				carBrandName: '',
				carBrandModels: [],
				carBrandImg: '',
			});
		}
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setEditBrand(null);
		setBrandInput({
			carBrandName: '',
			carBrandModels: [],
			carBrandImg: '',
		});
	};

	const handleCreateBrand = async () => {
		try {
			await createCarBrand({
				variables: {
					input: brandInput,
				},
			});
			await refetchCarBrands();
			handleCloseDialog();
			await sweetTopSmallSuccessAlert('Brand created successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, handleCreateBrand:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const handleUpdateBrand = async () => {
		try {
			await updateCarBrand({
				variables: {
					input: {
						carBrandName: editBrand?.carBrandName,
						carBrandModel: brandInput.carBrandModels.join(','),
						carBrandImg: brandInput.carBrandImg,
					},
				},
			});
			await refetchCarBrands();
			handleCloseDialog();
			await sweetTopSmallSuccessAlert('Brand updated successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, handleUpdateBrand:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const handleDeleteBrand = async (brandName: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure you want to delete this brand?')) {
				await removeCarBrand({
					variables: {
						input: brandName,
					},
				});
				await refetchCarBrands();
				await sweetTopSmallSuccessAlert('Brand deleted successfully!', 800);
			}
		} catch (err: any) {
			console.error('ERROR, handleDeleteBrand:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<div id="admin-car-brands-page">
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1">
					Car Brands
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<Plus weight="bold" />}
					onClick={() => handleOpenDialog()}
				>
					Add Brand
				</Button>
			</Stack>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Brand Name</TableCell>
							<TableCell>Models</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{carBrandsData?.getCarBrands.map((brand: CarBrand) => (
							<TableRow key={brand.carBrandName}>
								<TableCell>
									<Stack direction="row" alignItems="center" spacing={2}>
										{brand.carBrandImg && (
											<Box
												component="img"
												src={`${process.env.REACT_APP_API_URL}/${brand.carBrandImg}`}
												alt={brand.carBrandName}
												sx={{ width: 40, height: 40, objectFit: 'contain' }}
											/>
										)}
										{brand.carBrandName}
									</Stack>
								</TableCell>
								<TableCell>{brand.carBrandModels.join(', ')}</TableCell>
								<TableCell>{brand.carBrandStatus}</TableCell>
								<TableCell>
									<IconButton color="primary" onClick={() => handleOpenDialog(brand)}>
										<PencilSimple weight="bold" />
									</IconButton>
									<IconButton color="error" onClick={() => handleDeleteBrand(brand.carBrandName)}>
										<Trash weight="bold" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth="sm"
				fullWidth
				sx={{
					'& .MuiDialog-paper': {
						'& .MuiDialogTitle-root': {
							fontSize: '24px',
							padding: '24px 24px 0',
							fontWeight: 500,
						},
						'& .MuiDialogContent-root': {
							padding: '24px',
							'& .MuiStack-root': {
								gap: '32px',
							},
							'& .MuiTextField-root .MuiOutlinedInput-root': {
								background: 'white',
							},
							'& .image-upload-section': {
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								'& .section-title': {
									fontSize: '16px',
									color: '#000',
									fontWeight: 400,
								},
								'& .upload-button': {
									display: 'inline-block',
									color: '#1e40af',
									fontSize: '16px',
									cursor: 'pointer',
									margin: '4px 0',
									fontWeight: 500,
								},
								'& .upload-hint': {
									color: '#64748b',
									fontSize: '14px',
									marginTop: '4px',
								},
							},
							'& .models-input-section': {
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								'& .section-title': {
									fontSize: '16px',
									color: '#000',
									fontWeight: 400,
								},
								'& .custom-input': {
									width: '100%',
									height: '56px',
									padding: '16px 14px',
									border: '1px solid rgba(0, 0, 0, 0.23)',
									borderRadius: '0.5rem',
									fontFamily: 'inherit',
									fontSize: '16px',
									lineHeight: 1.5,
									color: '#334155',
									transition: 'all 0.2s',
									background: 'white',
									resize: 'vertical',
									'&:hover': {
										borderColor: '#1e40af',
									},
									'&:focus': {
										outline: 'none',
										borderColor: '#1e40af',
										borderWidth: '2px',
										padding: '15px 13px',
									},
								},
							},
						},
						'& .MuiDialogActions-root': {
							padding: '16px 24px',
							borderTop: '1px solid #e2e8f0',
							'& .MuiButton-root': {
								textTransform: 'none',
								fontSize: '16px',
								padding: '8px 16px',
								minWidth: '100px',
								'&.MuiButton-contained': {
									background: '#ef4444',
									'&:hover': {
										background: '#dc2626',
									},
								},
							},
						},
					},
				}}
			>
				<DialogTitle>{editBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
				<DialogContent>
					<Stack spacing={3} mt={2}>
						<TextField
							label="Brand Name"
							value={brandInput.carBrandName}
							onChange={(e) => setBrandInput({ ...brandInput, carBrandName: e.target.value })}
							fullWidth
							disabled={!!editBrand}
						/>
						<div className="image-upload-section">
							<Typography className="section-title">Brand Image</Typography>
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
										marginBottom: '8px',
									}}
								/>
							)}
							<label htmlFor="brand-image-upload" className="upload-button">
								{brandInput.carBrandImg ? 'Change Image' : 'Upload Image'}
								<input
									type="file"
									id="brand-image-upload"
									hidden
									onChange={uploadImage}
									accept="image/jpg, image/jpeg, image/png"
								/>
							</label>
							<Typography className="upload-hint">Image must be in JPG, JPEG or PNG format</Typography>
						</div>
						<div className="models-input-section">
							<Typography className="section-title">Models (comma-separated)</Typography>
							<input
								type="text"
								className="custom-input"
								value={brandInput.carBrandModels.join(', ')}
								onChange={(e) =>
									setBrandInput({ ...brandInput, carBrandModels: e.target.value.split(',').map((s) => s.trim()) })
								}
							/>
						</div>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button variant="contained" color="primary" onClick={editBrand ? handleUpdateBrand : handleCreateBrand}>
						{editBrand ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default withAdminLayout(AdminCarBrands);
