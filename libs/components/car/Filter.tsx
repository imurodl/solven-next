import React, { useCallback, useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarLocation, CarType, CarFuelType, CarColor, CarTransmission, CarOptions } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import { carMileage, carPrices, carYears } from '../../config';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import FilterMobile from './filter/FilterMobile';
import FilterDesktop from './filter/FilterDesktop';

interface FilterType {
	searchFilter: CarsInquiry;
	setSearchFilter: any;
	initialInput: CarsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [selectedBrand, setSelectedBrand] = useState<string>('');
	const [carFuelTypes, setCarFuelTypes] = useState<CarFuelType[]>(Object.values(CarFuelType));
	const [carTransmissions, setCarTransmissions] = useState<CarTransmission[]>(Object.values(CarTransmission));
	const [carColors, setCarColors] = useState<CarColor[]>(Object.values(CarColor));
	const [carListingOptions, setCarListingOptions] = useState<CarOptions[]>(Object.values(CarOptions));
	const [filterKey, setFilterKey] = useState(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getCarBrandsLoading,
		data: getCarBrandsData,
		error: getCarBrandsError,
		refetch: getCarBrandsRefetch,
	} = useQuery(GET_CAR_BRANDS_BY_USER, {
		fetchPolicy: 'network-only',
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const brandFromSearch = searchFilter?.search?.brandList?.[0] ?? '';
		setSelectedBrand(brandFromSearch);
	}, [searchFilter?.search?.brandList]);

	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.carListingOptions?.length == 0) {
			delete searchFilter.search.carListingOptions;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.brandList?.length == 0) {
			delete searchFilter.search.brandList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.modelList?.length == 0) {
			delete searchFilter.search.modelList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.colorList?.length == 0) {
			delete searchFilter.search.colorList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.fuelTypeList?.length == 0) {
			delete searchFilter.search.fuelTypeList;
			router
				.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/

	// for CarFuelType, CarTransmission and CarColor
	const updateArrayFilter = async (field: keyof CarsInquiry['search'], value: string) => {
		const currentList = Array.isArray(searchFilter?.search?.[field]) ? (searchFilter.search[field] as string[]) : [];

		const newList = currentList.includes(value)
			? currentList.filter((item: string) => item !== value)
			: [...currentList, value];

		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				[field]: newList,
			},
		};

		setSearchFilter(newFilter);
		await router.push(`/car?input=${JSON.stringify(newFilter)}`, `/car?input=${JSON.stringify(newFilter)}`, {
			scroll: false,
		});
	};

	const carOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								carOptions: [...(searchFilter?.search?.carOptions || []), value],
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								carOptions: [...(searchFilter?.search?.carOptions || []), value],
							},
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.carOptions?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								carOptions: searchFilter?.search?.carOptions?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								carOptions: searchFilter?.search?.carOptions?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, carOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carMileageHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							mileageRange: { ...searchFilter.search.mileageRange, start: value },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							mileageRange: { ...searchFilter.search.mileageRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							mileageRange: { ...searchFilter.search.mileageRange, end: value },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							mileageRange: { ...searchFilter.search.mileageRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const carPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const carYearHandler = useCallback(
		async (e: any, type: string) => {
			const value = parseInt(e.target.value, 10);
			if (type === 'start') {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, start: value },
						},
					})}`,
					undefined,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/car?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							yearRange: { ...searchFilter.search.yearRange, end: value },
						},
					})}`,
					undefined,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const clearAllHandler = async () => {
		// Reset text search and brand
		setSearchText('');
		setSelectedBrand('');
		setShowMore(false);

		// Reset all filter states
		const clearedFilter = {
			...initialInput,
			search: {
				pricesRange: {
					start: 0,
					end: 500000000,
				},
				mileageRange: {
					start: 0,
					end: 500000,
				},
				yearRange: {
					start: 1990,
					end: new Date().getFullYear(),
				},
				locationList: [],
				typeList: [],
				brandList: [],
				modelList: [],
				fuelTypeList: [],
				transmissionList: [],
				colorList: [],
				carListingOptions: [],
				text: '',
			},
		};

		setSearchFilter(clearedFilter);
		setFilterKey((prev) => prev + 1);
		await router.push(`/car?input=${JSON.stringify(clearedFilter)}`, undefined, { scroll: false });
	};

	const yearStart = searchFilter?.search?.yearRange?.start ?? carYears[0];
	const yearEnd = searchFilter?.search?.yearRange?.end ?? carYears[carYears.length - 1];
	const mileageStart = searchFilter?.search?.mileageRange?.start ?? carMileage[0];
	const mileageEnd = searchFilter?.search?.mileageRange?.end ?? carMileage[carMileage.length - 1];

	if (device === 'mobile') {
		return (
			<FilterMobile
				searchFilter={searchFilter}
				setSearchFilter={setSearchFilter}
				carLocation={carLocation}
				carType={carType}
				carFuelTypes={carFuelTypes}
				carTransmissions={carTransmissions}
				carColors={carColors}
				selectedBrand={selectedBrand}
				setSelectedBrand={setSelectedBrand}
				searchText={searchText}
				setSearchText={setSearchText}
				filterKey={filterKey}
				getCarBrandsData={getCarBrandsData}
				updateArrayFilter={updateArrayFilter}
				carOptionSelectHandler={carOptionSelectHandler}
				carPriceHandler={carPriceHandler}
				clearAllHandler={clearAllHandler}
				yearStart={yearStart}
				yearEnd={yearEnd}
				mileageStart={mileageStart}
				mileageEnd={mileageEnd}
			/>
		);
	} else {
		return (
			<FilterDesktop
				searchFilter={searchFilter}
				setSearchFilter={setSearchFilter}
				carLocation={carLocation}
				carType={carType}
				carFuelTypes={carFuelTypes}
				carTransmissions={carTransmissions}
				carColors={carColors}
				selectedBrand={selectedBrand}
				setSelectedBrand={setSelectedBrand}
				searchText={searchText}
				setSearchText={setSearchText}
				showMore={showMore}
				setShowMore={setShowMore}
				filterKey={filterKey}
				getCarBrandsData={getCarBrandsData}
				updateArrayFilter={updateArrayFilter}
				carOptionSelectHandler={carOptionSelectHandler}
				carPriceHandler={carPriceHandler}
				clearAllHandler={clearAllHandler}
				yearStart={yearStart}
				yearEnd={yearEnd}
				mileageStart={mileageStart}
				mileageEnd={mileageEnd}
			/>
		);
	}
};

export default Filter;
