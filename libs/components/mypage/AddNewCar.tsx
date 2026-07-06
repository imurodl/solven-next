import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarLocation, CarType, CarOptions } from '../../enums/car.enum';
import { CarInput } from '../../types/car/car.input';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_CAR, UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_CAR, GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import AddCarMobileForm from './addcar/AddCarMobileForm';
import AddCarDesktopForm from './addcar/AddCarDesktopForm';

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

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;

			// Combine existing images with new ones
			const updatedImages = [...insertCarData.carImages, ...responseImages].slice(0, 5);
			setInsertCarData({ ...insertCarData, carImages: updatedImages });
		} catch (err: any) {
			console.log('Upload error:', err);
			await sweetMixinErrorAlert(err.message);
		}
	}

	const doDisabledCheck = () => {
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

	useEffect(() => {
		// Only agents may list a car. Guard in an effect (not during render) so a
		// direct/SSR load of ?category=addCar doesn't call the client-only router.
		// Wait for userVar to hydrate before redirecting so a real agent isn't bounced.
		if (user?.memberType && user.memberType !== 'AGENT') {
			router.back();
		}
	}, [user?.memberType, router]);

	if (device === 'mobile') {
		return (
			<AddCarMobileForm
				insertCarData={insertCarData}
				setInsertCarData={setInsertCarData}
				carType={carType}
				carLocation={carLocation}
				carYears={carYears}
				carOptionList={carOptionList}
				getCarBrandsData={getCarBrandsData}
				inputRef={inputRef}
				uploadImages={uploadImages}
				doDisabledCheck={doDisabledCheck}
				insertPropertyHandler={insertPropertyHandler}
				updatePropertyHandler={updatePropertyHandler}
			/>
		);
	} else {
		return (
			<AddCarDesktopForm
				insertCarData={insertCarData}
				setInsertCarData={setInsertCarData}
				carType={carType}
				carLocation={carLocation}
				carYears={carYears}
				carOptionList={carOptionList}
				getCarBrandsData={getCarBrandsData}
				inputRef={inputRef}
				uploadImages={uploadImages}
				doDisabledCheck={doDisabledCheck}
				insertPropertyHandler={insertPropertyHandler}
				updatePropertyHandler={updatePropertyHandler}
			/>
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
