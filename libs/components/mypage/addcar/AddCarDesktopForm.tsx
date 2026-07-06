import React from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import { CarLocation, CarTransmission, CarColor, CarFuelType, CarType, CarOptions } from '../../../enums/car.enum';
import { REACT_APP_API_URL } from '../../../config';
import { CarInput } from '../../../types/car/car.input';

interface AddCarDesktopFormProps {
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

const AddCarDesktopForm = (props: AddCarDesktopFormProps) => {
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
		<div id="add-property-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Add New Car</Typography>
					<Typography className="sub-title">List your car for sale or rent</Typography>
				</Stack>
			</Stack>

			<div className="config">
				<div className="description-box">
					<div className="config-column">
						<Typography className="property-title">Basic Information</Typography>
						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Car Title</Typography>
								<input
									type="text"
									className="description-input"
									placeholder="Enter car title"
									value={insertCarData.carTitle}
									onChange={(e) => setInsertCarData({ ...insertCarData, carTitle: e.target.value })}
								/>
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Car Brand</Typography>
								<select
									className="select-description"
									value={insertCarData.carBrand}
									onChange={(e) => {
										const selectedBrand = getCarBrandsData?.getCarBrandsByUser?.find(
											(brand: any) => brand.carBrandName === e.target.value,
										);
										setInsertCarData({
											...insertCarData,
											carBrand: e.target.value,
											carModel: '',
										});
									}}
								>
									<option value="">Select Brand</option>
									{getCarBrandsData?.getCarBrandsByUser?.map((brand: any) => (
										<option key={brand._id} value={brand.carBrandName}>
											{brand.carBrandName}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Car Model</Typography>
								<select
									className="select-description"
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
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Price</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Enter price"
									value={insertCarData.carPrice}
									onChange={(e) => setInsertCarData({ ...insertCarData, carPrice: Number(e.target.value) })}
								/>
							</div>
						</div>

						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Car Type</Typography>
								<select
									className="select-description"
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
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Location</Typography>
								<select
									className="select-description"
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
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Address</Typography>
								<input
									type="text"
									className="description-input"
									placeholder="Enter detailed address"
									value={insertCarData.carAddress}
									onChange={(e) => setInsertCarData({ ...insertCarData, carAddress: e.target.value })}
								/>
							</div>
						</div>
					</div>

					<div className="config-column">
						<Typography className="property-title">Car Details</Typography>
						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Manufactured Year</Typography>
								<select
									className="select-description"
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
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Mileage (km)</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Enter mileage"
									value={insertCarData.carMileage}
									onChange={(e) => setInsertCarData({ ...insertCarData, carMileage: Number(e.target.value) })}
								/>
							</div>
						</div>

						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Transmission</Typography>
								<select
									className="select-description"
									value={insertCarData.carTransmission}
									onChange={(e) =>
										setInsertCarData({ ...insertCarData, carTransmission: e.target.value as CarTransmission })
									}
								>
									<option value="">Select Transmission</option>
									{Object.values(CarTransmission).map((transmission) => (
										<option key={transmission} value={transmission}>
											{transmission}
										</option>
									))}
								</select>
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Fuel Type</Typography>
								<select
									className="select-description"
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
							</div>
						</div>

						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Color</Typography>
								<select
									className="select-description"
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
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Number of Seats</Typography>
								<input
									type="number"
									className="description-input"
									placeholder="Enter number of seats"
									value={insertCarData.carSeats}
									onChange={(e) => setInsertCarData({ ...insertCarData, carSeats: Number(e.target.value) })}
								/>
							</div>
						</div>
					</div>

					<div className="config-column">
						<Typography className="property-title">Car Options</Typography>
						<div className="config-row">
							<div className="price-year-after-price">
								<Typography className="title">Available for Rent</Typography>
								<select
									className="select-description"
									value={insertCarData.carRent ? 'true' : 'false'}
									onChange={(e) => setInsertCarData({ ...insertCarData, carRent: e.target.value === 'true' })}
								>
									<option value="false">No</option>
									<option value="true">Yes</option>
								</select>
							</div>
							<div className="price-year-after-price">
								<Typography className="title">Open to Barter</Typography>
								<select
									className="select-description"
									value={insertCarData.carBarter ? 'true' : 'false'}
									onChange={(e) => setInsertCarData({ ...insertCarData, carBarter: e.target.value === 'true' })}
								>
									<option value="false">No</option>
									<option value="true">Yes</option>
								</select>
							</div>
						</div>

						<div className="config-column">
							<Typography className="title">Car Features</Typography>
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
						</div>
					</div>

					<div className="config-column">
						<Typography className="property-title">Description</Typography>
						<textarea
							className="description-text"
							placeholder="Enter detailed description of the car"
							value={insertCarData.carDesc}
							onChange={(e) => setInsertCarData({ ...insertCarData, carDesc: e.target.value })}
						/>
					</div>

					<Typography className="upload-title">Car Images</Typography>
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
							<div className="text-box">
								<Typography className="drag-title">Upload Images</Typography>
								<Typography className="drag-description">Click to browse or drag images here</Typography>
							</div>
						</div>
					</div>

					<div className="buttons-row">
						<Button
							className="prev-button"
							onClick={() =>
								router.push({
									pathname: '/mypage',
									query: { category: 'myProperties' },
								})
							}
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddCarDesktopForm;
