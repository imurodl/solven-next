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
import { carMileage, carYears, propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
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
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
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

	// for CarFuelType, CarTransmission and CarColor
	const updateArrayFilter = async (field: keyof CarsInquiry['search'], value: string) => {
		const current = (searchFilter.search[field] as string[]) || [];
		const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];

		await router.push(
			`/car?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					[field]: updated.length > 0 ? updated : undefined,
				},
			})}`,
			undefined,
			{ scroll: false },
		);
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

				console.log('carOptionSelectHandler:', e.target.value);
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
		try {
			setSearchText('');
			await router.push(`/car?input=${JSON.stringify(initialInput)}`, `/car?input=${JSON.stringify(initialInput)}`, {
				scroll: false,
			});
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>CAR LISTINGS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Car</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`property-location`}
						// style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{carLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as CarLocation)}
										onChange={carLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Select Brand</Typography>
					<FormControl fullWidth>
						<Select
							value={selectedBrand}
							onChange={(e) => {
								const brand = e.target.value;
								setSelectedBrand(brand);
								router.push(
									`/car?input=${JSON.stringify({
										...searchFilter,
										search: {
											...searchFilter.search,
											brandList: [brand],
											modelList: [], // clear models
										},
									})}`,
									undefined,
									{ scroll: false },
								);
							}}
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
				</Stack>

				{selectedBrand && (
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Select Model</Typography>
						<FormControl fullWidth>
							<Select
								value={searchFilter.search.modelList?.[0] || ''}
								onChange={(e) => {
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
					</Stack>
				)}

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Car Type</Typography>
					{carType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={carTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as CarType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Fuel Type</Typography>
					{carFuelTypes.map((type) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								checked={(searchFilter?.search?.fuelTypeList || []).includes(type)}
								onChange={() => updateArrayFilter('fuelTypeList', type)}
							/>
							<label htmlFor={type} style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Barter'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'carBarter'}
							checked={(searchFilter?.search?.carOptions || []).includes('carBarter')}
							onChange={carOptionSelectHandler}
						/>
						<label htmlFor={'Barter'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Barter</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Rent'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'carRent'}
							checked={(searchFilter?.search?.carOptions || []).includes('carRent')}
							onChange={carOptionSelectHandler}
						/>
						<label htmlFor={'Rent'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Rent</Typography>
						</label>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Mileage range</Typography>
					<Stack className="square-year-input">
						<FormControl>
							<InputLabel id="demo-simple-select-label">Min</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.mileageRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => carMileageHandler(e, 'start')}
								MenuProps={MenuProps}
							>
								{carMileage.map((mileage: number) => (
									<MenuItem
										value={mileage}
										disabled={(searchFilter?.search?.mileageRange?.end || 0) < mileage}
										key={mileage}
									>
										{mileage}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className="central-divider"></div>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Max</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.mileageRange?.end ?? 500000}
								label="Max"
								onChange={(e: any) => carMileageHandler(e, 'end')}
								MenuProps={MenuProps}
							>
								{carMileage.map((mileage: number) => (
									<MenuItem
										value={mileage}
										disabled={(searchFilter?.search?.mileageRange?.start || 0) > mileage}
										key={mileage}
									>
										{mileage}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									carPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									carPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Year Range</Typography>
					<Stack className="square-year-input">
						{/* Start Year */}
						<FormControl>
							<InputLabel id="year-range-start-label">from</InputLabel>
							<Select
								labelId="year-range-start-label"
								id="year-range-start"
								value={searchFilter?.search?.yearRange?.start ?? 2000}
								label="Min"
								onChange={(e: any) => {
									const value = Number(e.target.value);
									router.push(
										`/car?input=${JSON.stringify({
											...searchFilter,
											search: {
												...searchFilter.search,
												yearRange: {
													...searchFilter.search.yearRange,
													start: value,
												},
											},
										})}`,
										undefined,
										{ scroll: false },
									);
								}}
								MenuProps={MenuProps}
							>
								{Array.from({ length: 35 }, (_, i) => {
									const year = 1990 + i;
									return (
										<MenuItem key={year} value={year} disabled={(searchFilter?.search?.yearRange?.end || 0) < year}>
											{year}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						<div className="central-divider"></div>

						{/* End Year */}
						<FormControl>
							<InputLabel id="year-range-end-label">to</InputLabel>
							<Select
								labelId="year-range-end-label"
								id="year-range-end"
								value={searchFilter?.search?.yearRange?.end ?? 2025}
								label="Max"
								onChange={(e: any) => {
									const value = Number(e.target.value);
									router.push(
										`/car?input=${JSON.stringify({
											...searchFilter,
											search: {
												...searchFilter.search,
												yearRange: {
													...searchFilter.search.yearRange,
													end: value,
												},
											},
										})}`,
										undefined,
										{ scroll: false },
									);
								}}
								MenuProps={MenuProps}
							>
								{Array.from({ length: 35 }, (_, i) => {
									const year = 1990 + i;
									return (
										<MenuItem key={year} value={year} disabled={(searchFilter?.search?.yearRange?.start || 0) > year}>
											{year}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Transmission</Typography>
					{carTransmissions.map((trans) => (
						<Stack className={'input-box'} key={trans}>
							<Checkbox
								id={trans}
								className="property-checkbox"
								color="default"
								size="small"
								value={trans}
								checked={(searchFilter?.search?.transmissionList || []).includes(trans)}
								onChange={() => updateArrayFilter('transmissionList', trans)}
							/>
							<label htmlFor={trans} style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{trans}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
