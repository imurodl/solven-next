import React from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import { CarLocation, CarTransmission, CarColor, CarFuelType, CarType, CarOptions } from '../../../enums/car.enum';
import { REACT_APP_API_URL } from '../../../config';
import { CarInput } from '../../../types/car/car.input';

interface AddCarMobileFormProps {
	insertCarData: CarInput;
	setInsertCarData: (data: CarInput) => void;
	carType: CarType[];
	carLocation: CarLocation[];
	carYears: number[];
	carOptionList: CarOptions[];
	getCarBrandsData: any;
	inputRef: any;
	uploadImages: () => Promise<void | boolean>;
	doDisabledCheck: () => boolean;
	insertPropertyHandler: () => Promise<void>;
	updatePropertyHandler: () => Promise<void>;
}

const AddCarMobileForm = (props: AddCarMobileFormProps) => {
	const {
		insertCarData,
		setInsertCarData,
		carType,
		carLocation,
		carYears,
		carOptionList,
		getCarBrandsData,
		inputRef,
		uploadImages,
		doDisabledCheck,
		insertPropertyHandler,
		updatePropertyHandler,
	} = props;
	const router = useRouter();

	return (
		<div id="add-car-mobile">
			<Typography className="page-title">{router.query.carId ? 'Edit Car' : 'Add New Car'}</Typography>

			<Stack className="form-group">
				<Typography className="group-title">Basic Information</Typography>
				<Stack className="field">
					<Typography className="label">Car Title</Typography>
					<input
						type="text"
						placeholder="Enter car title"
						value={insertCarData.carTitle}
						onChange={(e) => setInsertCarData({ ...insertCarData, carTitle: e.target.value })}
					/>
				</Stack>
				<Stack className="field">
					<Typography className="label">Car Brand</Typography>
					<select
						value={insertCarData.carBrand}
						onChange={(e) => setInsertCarData({ ...insertCarData, carBrand: e.target.value, carModel: '' })}
					>
						<option value="">Select Brand</option>
						{getCarBrandsData?.getCarBrandsByUser?.map((brand: any) => (
							<option key={brand._id} value={brand.carBrandName}>
								{brand.carBrandName}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Car Model</Typography>
					<select
						value={insertCarData.carModel}
						onChange={(e) => setInsertCarData({ ...insertCarData, carModel: e.target.value })}
					>
						<option value="">Select Model</option>
						{getCarBrandsData?.getCarBrandsByUser
							?.find((brand: any) => brand.carBrandName === insertCarData.carBrand)
							?.carBrandModels?.map((model: string) => (
								<option key={model} value={model}>
									{model}
								</option>
							))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Price</Typography>
					<input
						type="number"
						placeholder="Enter price"
						value={insertCarData.carPrice}
						onChange={(e) => setInsertCarData({ ...insertCarData, carPrice: Number(e.target.value) })}
					/>
				</Stack>
				<Stack className="field">
					<Typography className="label">Car Type</Typography>
					<select
						value={insertCarData.carType}
						onChange={(e) => setInsertCarData({ ...insertCarData, carType: e.target.value as CarType })}
					>
						<option value="">Select Type</option>
						{carType.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Location</Typography>
					<select
						value={insertCarData.carLocation}
						onChange={(e) => setInsertCarData({ ...insertCarData, carLocation: e.target.value as CarLocation })}
					>
						<option value="">Select Location</option>
						{carLocation.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Address</Typography>
					<input
						type="text"
						placeholder="Enter detailed address"
						value={insertCarData.carAddress}
						onChange={(e) => setInsertCarData({ ...insertCarData, carAddress: e.target.value })}
					/>
				</Stack>
			</Stack>

			<Stack className="form-group">
				<Typography className="group-title">Car Details</Typography>
				<Stack className="field">
					<Typography className="label">Manufactured Year</Typography>
					<select
						value={insertCarData.manufacturedAt}
						onChange={(e) => setInsertCarData({ ...insertCarData, manufacturedAt: Number(e.target.value) })}
					>
						<option value="">Select Year</option>
						{carYears.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Mileage (km)</Typography>
					<input
						type="number"
						placeholder="Enter mileage"
						value={insertCarData.carMileage}
						onChange={(e) => setInsertCarData({ ...insertCarData, carMileage: Number(e.target.value) })}
					/>
				</Stack>
				<Stack className="field">
					<Typography className="label">Transmission</Typography>
					<select
						value={insertCarData.carTransmission}
						onChange={(e) => setInsertCarData({ ...insertCarData, carTransmission: e.target.value as CarTransmission })}
					>
						<option value="">Select Transmission</option>
						{Object.values(CarTransmission).map((transmission) => (
							<option key={transmission} value={transmission}>
								{transmission}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Fuel Type</Typography>
					<select
						value={insertCarData.carFuelType}
						onChange={(e) => setInsertCarData({ ...insertCarData, carFuelType: e.target.value as CarFuelType })}
					>
						<option value="">Select Fuel Type</option>
						{Object.values(CarFuelType).map((fuelType) => (
							<option key={fuelType} value={fuelType}>
								{fuelType}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Color</Typography>
					<select
						value={insertCarData.carColor}
						onChange={(e) => setInsertCarData({ ...insertCarData, carColor: e.target.value as CarColor })}
					>
						<option value="">Select Color</option>
						{Object.values(CarColor).map((color) => (
							<option key={color} value={color}>
								{color}
							</option>
						))}
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Number of Seats</Typography>
					<input
						type="number"
						placeholder="Enter number of seats"
						value={insertCarData.carSeats}
						onChange={(e) => setInsertCarData({ ...insertCarData, carSeats: Number(e.target.value) })}
					/>
				</Stack>
			</Stack>

			<Stack className="form-group">
				<Typography className="group-title">Car Options</Typography>
				<Stack className="field">
					<Typography className="label">Available for Rent</Typography>
					<select
						value={insertCarData.carRent ? 'true' : 'false'}
						onChange={(e) => setInsertCarData({ ...insertCarData, carRent: e.target.value === 'true' })}
					>
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Open to Barter</Typography>
					<select
						value={insertCarData.carBarter ? 'true' : 'false'}
						onChange={(e) => setInsertCarData({ ...insertCarData, carBarter: e.target.value === 'true' })}
					>
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</Stack>
				<Stack className="field">
					<Typography className="label">Car Features</Typography>
					<div className="features-grid">
						{carOptionList.map((option) => (
							<label key={option} className="feature-item">
								<input
									type="checkbox"
									checked={insertCarData.carOptions?.includes(option) || false}
									onChange={(e) => {
										const options = e.target.checked
											? [...(insertCarData.carOptions || []), option]
											: (insertCarData.carOptions || []).filter((o) => o !== option);
										setInsertCarData({ ...insertCarData, carOptions: options });
									}}
								/>
								<span>{option}</span>
							</label>
						))}
					</div>
				</Stack>
			</Stack>

			<Stack className="form-group">
				<Typography className="group-title">Description</Typography>
				<textarea
					placeholder="Enter detailed description of the car"
					value={insertCarData.carDesc}
					onChange={(e) => setInsertCarData({ ...insertCarData, carDesc: e.target.value })}
				/>
			</Stack>

			<Stack className="form-group">
				<Typography className="group-title">Car Images</Typography>
				<div className="images-box">
					{insertCarData.carImages.map((image, index) => (
						<div key={index} className="image-preview">
							<img src={`${REACT_APP_API_URL}/${image}`} alt={`Car image ${index + 1}`} />
							<div
								className="remove-button"
								onClick={() =>
									setInsertCarData({
										...insertCarData,
										carImages: insertCarData.carImages.filter((_, i) => i !== index),
									})
								}
							>
								×
							</div>
						</div>
					))}
					<div className="upload-box" onClick={() => inputRef.current?.click()}>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={uploadImages}
							ref={inputRef}
							style={{ display: 'none' }}
						/>
						<Typography className="drag-title">Upload Images</Typography>
					</div>
				</div>
			</Stack>

			<Stack className="buttons-row">
				<Button
					className="prev-button"
					onClick={() => router.push({ pathname: '/mypage', query: { category: 'myProperties' } })}
				>
					Cancel
				</Button>
				<Button
					className="next-button"
					onClick={router.query.carId ? updatePropertyHandler : insertPropertyHandler}
					disabled={doDisabledCheck()}
				>
					{router.query.carId ? 'Update Car' : 'Add Car'}
				</Button>
			</Stack>
		</div>
	);
};

export default AddCarMobileForm;
