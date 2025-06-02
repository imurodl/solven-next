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
import { CarBrand } from '../../../libs/types/car/car-brand';
import { CarBrandStatus } from '../../../libs/enums/car.enum';
import {
	Box,
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Select,
	MenuItem,
	IconButton,
	Paper,
} from '@mui/material';
import { PencilSimple, Plus } from 'phosphor-react';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { CarBrandCreate } from '../../../libs/components/admin/cars/CarBrandCreate';

const AdminCarBrands: NextPage = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editBrand, setEditBrand] = useState<CarBrand | null>(null);

	// Queries
	const { data: carBrandsData, refetch: refetchCarBrands } = useQuery(GET_CAR_BRANDS);

	// Mutations
	const [updateCarBrand] = useMutation(UPDATE_CAR_BRAND);

	// Handlers
	const handleStatusChange = async (brand: CarBrand, newStatus: CarBrandStatus) => {
		const confirmMessage =
			newStatus === CarBrandStatus.DELETE
				? 'Do you want to delete this brand?'
				: `Do you want to change the status to ${newStatus}?`;

		if (await sweetConfirmAlert(confirmMessage)) {
			try {
				await updateCarBrand({
					variables: {
						input: {
							carBrandName: brand.carBrandName,
							carBrandStatus: newStatus,
						},
					},
				});

				await refetchCarBrands();
				await sweetTopSmallSuccessAlert('Status updated successfully!', 800);
			} catch (err: any) {
				console.error('ERROR, handleStatusChange:', err);
				await sweetMixinErrorAlert(err.message);
			}
		}
	};

	const handleEdit = (brand: CarBrand) => {
		setEditBrand(brand);
		setShowCreateForm(true);
	};

	const handleCloseForm = () => {
		setShowCreateForm(false);
		setEditBrand(null);
	};

	return (
		<div id="admin-car-brands-page">
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1">
					Car Brands
				</Typography>
				{!showCreateForm && (
					<Button
						variant="contained"
						color="primary"
						startIcon={<Plus weight="bold" />}
						onClick={() => setShowCreateForm(true)}
					>
						Add Brand
					</Button>
				)}
			</Stack>

			{showCreateForm && <CarBrandCreate onClose={handleCloseForm} editBrand={editBrand || undefined} />}

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
								<TableCell>
									<Select
										size="small"
										value={brand.carBrandStatus}
										onChange={(e) => handleStatusChange(brand, e.target.value as CarBrandStatus)}
										disabled={brand.carBrandStatus === CarBrandStatus.DELETE}
										sx={{
											minWidth: 100,
											'& .MuiSelect-select': {
												color: brand.carBrandStatus === CarBrandStatus.DELETE ? '#dc3545' : 'inherit',
											},
										}}
									>
										<MenuItem value={CarBrandStatus.ACTIVE}>Active</MenuItem>
										<MenuItem value={CarBrandStatus.PAUSED}>Paused</MenuItem>
										<MenuItem value={CarBrandStatus.DELETE} sx={{ color: '#dc3545' }}>
											Delete
										</MenuItem>
									</Select>
								</TableCell>
								<TableCell>
									<IconButton
										color="primary"
										onClick={() => handleEdit(brand)}
										disabled={brand.carBrandStatus === CarBrandStatus.DELETE}
									>
										<PencilSimple weight="bold" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default withAdminLayout(AdminCarBrands);
