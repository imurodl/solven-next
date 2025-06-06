import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarLocation, CarTransmission, CarColor, CarFuelType, CarType, CarOptions } from '../../enums/car.enum';
import { REACT_APP_API_URL } from '../../config';
import { CarInput } from '../../types/car/car.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_CAR, UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_CAR, GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';

const AddCar = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertCarData, setInsertCarData] = useState<CarInput>(initialValues);
	const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const currentYear = new Date().getFullYear();
	const carYears = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i).reverse();
	const carOptionList = Object.values(CarOptions);

	/** APOLLO REQUESTS **/
	const [createCar] = useMutation(CREATE_CAR);
	const [updateCar] = useMutation(UPDATE_CAR);

	const {
		loading: getCarBrandsLoading,
		data: getCarBrandsData,
		error: getCarBrandsError,
		refetch: getCarBrandsRefetch,
	} = useQuery(GET_CAR_BRANDS_BY_USER, {
		fetchPolicy: 'network-only',
	});

	const {
		loading: getCarLoading,
		data: getCarData,
		error: getCarError,
		refetch: getCarRefetch,
	} = useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		variables: {
			input: router.query.carId,
		},
		skip: !router.query.carId,
		onError: (error) => {
			console.error('Error fetching car:', error);
			sweetErrorHandling(error).then();
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (getCarData?.getCar) {
			console.log('Setting car data:', getCarData.getCar);
			setInsertCarData({
				carTitle: getCarData.getCar.carTitle || '',
				carBrand: getCarData.getCar.carBrand || '',
				carModel: getCarData.getCar.carModel || '',
				carPrice: getCarData.getCar.carPrice || 0,
				carType: getCarData.getCar.carType || '',
				carLocation: getCarData.getCar.carLocation || '',
				carAddress: getCarData.getCar.carAddress || '',
				carFuelType: getCarData.getCar.carFuelType || '',
				carTransmission: getCarData.getCar.carTransmission || '',
				carBarter: getCarData.getCar.carBarter || false,
				carRent: getCarData.getCar.carRent || false,
				carOptions: getCarData.getCar.carOptions || [],
				carColor: getCarData.getCar.carColor || '',
				carMileage: getCarData.getCar.carMileage || 0,
				carSeats: getCarData.getCar.carSeats || 0,
				carDesc: getCarData.getCar.carDesc || '',
				carImages: getCarData.getCar.carImages || [],
				manufacturedAt: getCarData.getCar.manufacturedAt || 0,
			});
		}
	}, [getCarData]);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			// Create array of nulls matching the number of files being uploaded
			const nullArray = Array(selectedFiles.length).fill(null);

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: nullArray,
						target: 'car',
					},
				}),
			);

			// Create map for each file
			const map: Record<string, string[]> = {};
			for (let i = 0; i < selectedFiles.length; i++) {
				map[i.toString()] = [`variables.files.${i}`];
			}
			formData.append('map', JSON.stringify(map));

			// Append each file with its corresponding index
			for (let i = 0; i < selectedFiles.length; i++) {
				formData.append(i.toString(), selectedFiles[i]);
			}

			console.log('Uploading files:', selectedFiles);
			console.log('FormData map:', map);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;
			console.log('Upload response:', responseImages);

			// Combine existing images with new ones
			const updatedImages = [...insertCarData.carImages, ...responseImages].slice(0, 5);
			setInsertCarData({ ...insertCarData, carImages: updatedImages });
		} catch (err: any) {
			console.log('Upload error:', err);
			await sweetMixinErrorAlert(err.message);
		}
	}

	const doDisabledCheck = () => {
		console.log('Form data:', insertCarData);
		return (
			!insertCarData.carTitle ||
			!insertCarData.carBrand ||
			!insertCarData.carModel ||
			!insertCarData.carPrice ||
			!insertCarData.carType ||
			!insertCarData.carLocation ||
			!insertCarData.carFuelType ||
			!insertCarData.carTransmission ||
			!insertCarData.carColor ||
			!insertCarData.carMileage ||
			!insertCarData.carSeats ||
			!insertCarData.carDesc ||
			insertCarData.carImages.length === 0 ||
			!insertCarData.manufacturedAt
		);
	};

	const insertPropertyHandler = useCallback(async () => {
		try {
			console.log('Submitting car data:', insertCarData);

			const carInput = {
				carTitle: insertCarData.carTitle,
				carBrand: insertCarData.carBrand,
				carModel: insertCarData.carModel,
				carPrice: Number(insertCarData.carPrice),
				carType: insertCarData.carType,
				carLocation: insertCarData.carLocation,
				carAddress: insertCarData.carAddress,
				carFuelType: insertCarData.carFuelType,
				carTransmission: insertCarData.carTransmission,
				carColor: insertCarData.carColor,
				carBarter: Boolean(insertCarData.carBarter),
				carRent: Boolean(insertCarData.carRent),
				carMileage: Number(insertCarData.carMileage),
				carSeats: Number(insertCarData.carSeats),
				carDesc: insertCarData.carDesc,
				carImages: insertCarData.carImages,
				manufacturedAt: Number(insertCarData.manufacturedAt),
				carOptions: insertCarData.carOptions || [],
			};

			console.log('Formatted car input:', carInput);

			const result = await createCar({
				variables: {
					input: carInput,
				},
			});

			await sweetMixinSuccessAlert('This car listing has been created successfully.');
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myProperties',
				},
			});
		} catch (err: any) {
			console.error('Create car error:', err);
			sweetErrorHandling(err).then();
		}
	}, [insertCarData]);

	const updatePropertyHandler = useCallback(async () => {
		try {
			if (!router.query.carId) {
				throw new Error('Car ID is missing');
			}

			// Only include fields that are defined in CarUpdate interface
			const updateData = {
				_id: router.query.carId as string,
				carType: insertCarData.carType,
				carLocation: insertCarData.carLocation,
				carAddress: insertCarData.carAddress,
				carFuelType: insertCarData.carFuelType,
				carColor: insertCarData.carColor,
				carTransmission: insertCarData.carTransmission,
				carOptions: insertCarData.carOptions,
				carTitle: insertCarData.carTitle,
				carPrice: insertCarData.carPrice,
				carMileage: insertCarData.carMileage,
				carSeats: insertCarData.carSeats,
				carImages: insertCarData.carImages,
				carDesc: insertCarData.carDesc,
				carBarter: insertCarData.carBarter,
				carRent: insertCarData.carRent,
				manufacturedAt: insertCarData.manufacturedAt,
			};

			console.log('Updating car with data:', updateData);

			const result = await updateCar({
				variables: {
					input: updateData,
				},
			});

			if (result.data?.updateCar) {
				await sweetMixinSuccessAlert('This car listing has been updated successfully.');
				await router.push({
					pathname: '/mypage',
					query: {
						category: 'myProperties',
					},
				});
			}
		} catch (err: any) {
			console.error('Error updating car:', err);
			sweetErrorHandling(err).then();
		}
	}, [insertCarData, router.query.carId]);

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	console.log('+insertCarData', insertCarData);

	if (device === 'mobile') {
		return <div>ADD NEW CAR MOBILE PAGE</div>;
	} else {
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
	}
};

AddCar.defaultProps = {
	initialValues: {
		carTitle: '',
		carBrand: '',
		carModel: '',
		carPrice: 0,
		carType: '',
		carLocation: '',
		carAddress: '',
		carFuelType: '',
		carTransmission: '',
		carOptions: [],
		carColor: '',
		carBarter: false,
		carRent: false,
		carMileage: 0,
		carSeats: 0,
		carDesc: '',
		carImages: [],
		manufacturedAt: 0,
	},
};

export default AddCar;
