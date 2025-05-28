import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarLocation, CarType, CarFuelType, CarColor, CarTransmission, CarOptions } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { carMileage, carPrices, carYears } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

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

	const carLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('carLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('carTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const carFuelTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, fuelTypeList: [...(searchFilter?.search?.fuelTypeList || []), value] },
						})}`,
						undefined,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.fuelTypeList?.includes(value)) {
					await router.push(
						`/car?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								fuelTypeList: searchFilter?.search?.fuelTypeList?.filter((item: string) => item !== value),
							},
						})}`,
						undefined,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, carFuelTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

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

	const refreshHandler = async () => {
		setSearchText('');
		setSelectedBrand('');
		setSearchFilter(initialInput);
		await router.push(`/car?input=${JSON.stringify(initialInput)}`, `/car?input=${JSON.stringify(initialInput)}`, {
			scroll: false,
		});
	};

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
		await router.push(`/car?input=${JSON.stringify(clearedFilter)}`, undefined, { scroll: false });
	};

	if (device === 'mobile') {
		return <div>FILTER MOBILE</div>;
	}

	const yearStart = searchFilter?.search?.yearRange?.start ?? carYears[0];
	const yearEnd = searchFilter?.search?.yearRange?.end ?? carYears[carYears.length - 1];
	const mileageStart = searchFilter?.search?.mileageRange?.start ?? carMileage[0];
	const mileageEnd = searchFilter?.search?.mileageRange?.end ?? carMileage[carMileage.length - 1];

	return (
		<div className="filter-config">
			<div className="filter-main">
				<div className="find-your-home">
					<div className="title-main">
						Find Your Car
						<IconButton className="refresh-icon" onClick={clearAllHandler}>
							<RefreshIcon />
						</IconButton>
					</div>

					<div className="input-box-search">
						<input
							type="text"
							className="search-input"
							placeholder="Search by name..."
							value={searchText}
							onChange={(e) => {
								setSearchText(e.target.value);
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, text: e.target.value },
								});
							}}
						/>
						<img src="/img/icons/search.svg" alt="search" />
					</div>

					<div className="title">Location</div>
					<div className="filter-section">
						{carLocation.map((location) => (
							<div key={location} className="input-box">
								<Checkbox
									id={location}
									className="property-checkbox"
									checked={searchFilter?.search?.locationList?.includes(location)}
									onChange={() => updateArrayFilter('locationList', location)}
								/>
								<label htmlFor={location}>{location}</label>
							</div>
						))}
					</div>

					<div className="title">Car Type</div>
					<div className="filter-section">
						{carType.map((type) => (
							<div key={type} className="input-box">
								<Checkbox
									id={type}
									className="property-checkbox"
									checked={searchFilter?.search?.typeList?.includes(type)}
									onChange={() => updateArrayFilter('typeList', type)}
								/>
								<label htmlFor={type}>{type}</label>
							</div>
						))}
					</div>

					<div className="title">Brand</div>
					<div className="filter-section">
						<FormControl fullWidth>
							<Select
								displayEmpty
								value={selectedBrand || ''}
								onChange={(e: any) => {
									const brand = e.target.value;
									setSelectedBrand(brand);
									router.push(
										`/car?input=${JSON.stringify({
											...searchFilter,
											search: {
												...searchFilter.search,
												brandList: brand ? [brand] : [],
												modelList: [],
											},
										})}`,
										undefined,
										{ scroll: false },
									);
								}}
								sx={{ '.MuiSelect-select': { height: 'auto' } }}
							>
								<MenuItem disabled value="">
									Select a brand
								</MenuItem>
								{getCarBrandsData?.getCarBrandsByUser?.map((brand: any) => (
									<MenuItem key={brand._id} value={brand.carBrandName}>
										{brand.carBrandName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					{selectedBrand && (
						<>
							<div className="title">Model</div>
							<div className="filter-section">
								<FormControl fullWidth>
									<Select
										value={searchFilter.search.modelList?.[0] || ''}
										onChange={(e: any) => {
											const model = e.target.value;
											router.push(
												`/car?input=${JSON.stringify({
													...searchFilter,
													search: {
														...searchFilter.search,
														modelList: [model],
													},
												})}`,
												undefined,
												{ scroll: false },
											);
										}}
										sx={{ '.MuiSelect-select': { height: 'auto' } }}
									>
										<MenuItem disabled value="">
											Select a model
										</MenuItem>
										{getCarBrandsData?.getCarBrandsByUser
											?.find((b: any) => b.carBrandName === selectedBrand)
											?.carBrandModels?.map((model: string) => (
												<MenuItem key={model} value={model}>
													{model}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</div>
						</>
					)}

					<div className="title">Fuel Type</div>
					<div className="filter-section">
						{carFuelTypes.map((type) => (
							<div key={type} className="input-box">
								<Checkbox
									id={`fuel-${type}`}
									value={type}
									className="property-checkbox"
									checked={searchFilter?.search?.fuelTypeList?.includes(type)}
									onChange={(e) => {
										const newFilter = {
											...searchFilter,
											search: {
												...searchFilter.search,
												fuelTypeList: e.target.checked
													? [...(searchFilter?.search?.fuelTypeList || []), type]
													: searchFilter?.search?.fuelTypeList?.filter((item) => item !== type) || [],
											},
										};
										setSearchFilter(newFilter);
										router.push(`/car?input=${JSON.stringify(newFilter)}`, undefined, { scroll: false });
									}}
								/>
								<label htmlFor={`fuel-${type}`}>{type}</label>
							</div>
						))}
					</div>

					{showMore && (
						<>
							<div className="title">Transmission</div>
							<div className="filter-section">
								<div style={{ display: 'flex', gap: '20px' }}>
									{carTransmissions.map((trans) => (
										<div key={trans} className="input-box">
											<Checkbox
												id={trans}
												className="property-checkbox"
												checked={searchFilter?.search?.transmissionList?.includes(trans)}
												onChange={() => updateArrayFilter('transmissionList', trans)}
											/>
											<label htmlFor={trans}>{trans}</label>
										</div>
									))}
								</div>
							</div>

							<div className="title">Year Range</div>
							<div className="filter-section">
								<div className="range-group">
									<FormControl>
										<Select
											value={yearStart}
											onChange={(e) =>
												setSearchFilter({
													...searchFilter,
													search: {
														...searchFilter.search,
														yearRange: {
															...searchFilter.search.yearRange,
															start: Number(e.target.value),
														},
													},
												})
											}
											MenuProps={MenuProps}
										>
											{carYears.map((year) => (
												<MenuItem key={year} value={year} disabled={yearEnd <= year}>
													{year}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<div className="range-separator" />
									<FormControl>
										<Select
											value={yearEnd}
											onChange={(e) =>
												setSearchFilter({
													...searchFilter,
													search: {
														...searchFilter.search,
														yearRange: {
															...searchFilter.search.yearRange,
															end: Number(e.target.value),
														},
													},
												})
											}
											MenuProps={MenuProps}
										>
											{carYears.map((year) => (
												<MenuItem key={year} value={year} disabled={yearStart >= year}>
													{year}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>

							<div className="title">Price Range</div>
							<div className="filter-section">
								<div className="range-group">
									<FormControl>
										<Select
											value={searchFilter?.search?.pricesRange?.start ?? 0}
											onChange={(e) => carPriceHandler(Number(e.target.value), 'start')}
											MenuProps={MenuProps}
											sx={{ '.MuiSelect-select': { height: 'auto' } }}
										>
											{carPrices.map((price) => (
												<MenuItem
													key={price}
													value={price}
													disabled={(searchFilter?.search?.pricesRange?.end || 0) < price}
												>
													${price.toLocaleString()}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<div className="range-separator" />
									<FormControl>
										<Select
											value={searchFilter?.search?.pricesRange?.end ?? 500000}
											onChange={(e) => carPriceHandler(Number(e.target.value), 'end')}
											MenuProps={MenuProps}
											sx={{ '.MuiSelect-select': { height: 'auto' } }}
										>
											{carPrices.map((price) => (
												<MenuItem
													key={price}
													value={price}
													disabled={(searchFilter?.search?.pricesRange?.start || 0) > price}
												>
													${price.toLocaleString()}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>

							<div className="title">Mileage Range</div>
							<div className="filter-section">
								<div className="range-group">
									<FormControl>
										<Select
											value={mileageStart}
											onChange={(e) =>
												setSearchFilter({
													...searchFilter,
													search: {
														...searchFilter.search,
														mileageRange: {
															...searchFilter.search.mileageRange,
															start: Number(e.target.value),
														},
													},
												})
											}
											MenuProps={MenuProps}
											sx={{ '.MuiSelect-select': { height: 'auto' } }}
										>
											{carMileage.map((mileage) => (
												<MenuItem key={mileage} value={mileage} disabled={mileageEnd <= mileage}>
													{mileage}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<div className="range-separator" />
									<FormControl>
										<Select
											value={mileageEnd}
											onChange={(e) =>
												setSearchFilter({
													...searchFilter,
													search: {
														...searchFilter.search,
														mileageRange: {
															...searchFilter.search.mileageRange,
															end: Number(e.target.value),
														},
													},
												})
											}
											MenuProps={MenuProps}
											sx={{ '.MuiSelect-select': { height: 'auto' } }}
										>
											{carMileage.map((mileage) => (
												<MenuItem key={mileage} value={mileage} disabled={mileageStart >= mileage}>
													{mileage}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>

							<div className="title">Options</div>
							<div className="filter-section">
								<div style={{ display: 'flex', gap: '20px' }}>
									<div className="input-box">
										<Checkbox
											id="barter-option"
											className="property-checkbox"
											value="carBarter"
											checked={(searchFilter?.search?.carOptions || []).includes('carBarter')}
											onChange={carOptionSelectHandler}
										/>
										<label htmlFor="barter-option" style={{ cursor: 'pointer' }}>
											<Typography className="propert-type">Barter</Typography>
										</label>
									</div>
									<div className="input-box">
										<Checkbox
											id="rent-option"
											className="property-checkbox"
											value="carRent"
											checked={(searchFilter?.search?.carOptions || []).includes('carRent')}
											onChange={carOptionSelectHandler}
										/>
										<label htmlFor="rent-option" style={{ cursor: 'pointer' }}>
											<Typography className="propert-type">Rent</Typography>
										</label>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="filter-footer">
				<div className="show-more" onClick={() => setShowMore(!showMore)}>
					<span>{showMore ? 'Show Less' : 'Show More'}</span>
					<ExpandMoreIcon style={{ transform: showMore ? 'rotate(180deg)' : 'none' }} />
				</div>
				<div className="clear-filter" onClick={clearAllHandler}>
					<span>Clear All</span>
					<RefreshIcon />
				</div>
			</div>
		</div>
	);
};

export default Filter;
