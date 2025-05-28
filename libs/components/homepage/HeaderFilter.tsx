import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button, Typography, Checkbox } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { carMileage, carYears, REACT_APP_API_URL } from '../../config';
import { CarFuelType, CarLocation, CarType } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { CarBrand } from '../../types/car/car-brand';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';

const carTypeOptions: CarType[] = [
	CarType.LIGHT,
	CarType.COMPACT,
	CarType.MIDSIZE,
	CarType.LARGE,
	CarType.SUV,
	CarType.TRUCK,
	CarType.OTHER,
];

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: CarsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const roomsRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openRooms, setOpenRooms] = useState(false);
	const [carLocation, setCarLocation] = useState<CarLocation[]>(Object.values(CarLocation));
	const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
	const [carFuelType, setCarFuelType] = useState<CarFuelType[]>(Object.values(CarFuelType));
	const [yearCheck, setYearCheck] = useState({ start: 1900, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');
	const [carBrands, setCarBrands] = useState<CarBrand[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getCarBrandsLoading,
		data: getCarBrandsData,
		error: getCarBrandsError,
		refetch: getCarBrandsRefetch,
	} = useQuery(GET_CAR_BRANDS_BY_USER, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCarBrands(data?.getCarBrandsByUser);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!roomsRef?.current?.contains(event.target)) {
				setOpenRooms(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenRooms(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenRooms(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenRooms(false);
	};

	const roomStateChangeHandler = () => {
		setOpenRooms((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenRooms(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const propertyLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						brandList: [value], // ✅ THIS IS THE BRAND
					},
				});
				roomStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyRoomSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						modelList: [value], // ✅ THIS IS THE MODEL
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, propertyRoomSelectHandler:', err);
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
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
					});
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
						},
					});
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
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, fuelTypeList: [...(searchFilter?.search?.fuelTypeList || []), value] },
					});
				} else if (searchFilter?.search?.fuelTypeList?.includes(value)) {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							fuelTypeList: searchFilter?.search?.fuelTypeList?.filter((item: string) => item !== value),
						},
					});
				}

				console.log('carFuelTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, carFuelTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							carListingOptions: [value],
						},
					});
				} else {
					delete searchFilter.search.carListingOptions;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, propertyOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const mileageHandler = useCallback(
		async (e: any, type: string) => {
			const value = parseInt(e.target.value);

			if (type === 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						mileageRange: { ...searchFilter.search.mileageRange, start: value },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						mileageRange: { ...searchFilter.search.mileageRange, end: value },
					},
				});
			}
		},
		[searchFilter],
	);

	const yearStartChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, start: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				yearRange: { start: Number(event.target.value), end: yearCheck.end },
			},
		});
	};

	const yearEndChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, end: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				yearRange: { start: yearCheck.start, end: Number(event.target.value) },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.brandList?.length == 0) {
				delete searchFilter.search.brandList;
			}

			if (searchFilter?.search?.modelList?.length == 0) {
				delete searchFilter.search.modelList;
			}

			if (searchFilter?.search?.carListingOptions?.length == 0) {
				delete searchFilter.search.carListingOptions;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			await router.push(`/car?input=${JSON.stringify(searchFilter)}`, `/car?input=${JSON.stringify(searchFilter)}`);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.brandList?.[0] || t('Brand')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openRooms ? 'on' : ''}`} onClick={roomStateChangeHandler}>
							<span>{searchFilter?.search?.modelList ? searchFilter?.search?.modelList[0] : t('Model')}</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<span>Advanced Search</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
							<p>Search Cars</p>
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{carLocation.map((location: string) => {
							return (
								<div onClick={() => propertyLocationSelectHandler(location)} key={location}>
									<img src={`img/banner/cities/${location}.webp`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{carBrands.map((carBrand: CarBrand) => {
							return (
								<div onClick={() => propertyTypeSelectHandler(carBrand.carBrandName)} key={carBrand._id}>
									<img src={`${REACT_APP_API_URL}/${carBrand.carBrandImg}`} alt={carBrand.carBrandName} />
									<span>{carBrand.carBrandName}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-rooms ${openRooms ? 'on' : ''}`} ref={roomsRef}>
						{(() => {
							const selectedBrand = carBrands.find((b) => b.carBrandName === searchFilter.search.brandList?.[0]);
							const availableModels = selectedBrand?.carBrandModels || [];

							return availableModels.map((model: string) => (
								<span onClick={() => propertyRoomSelectHandler(model)} key={model}>
									{model}
								</span>
							));
						})()}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Car Type</span>
										{carType.map((type: string) => (
											<Stack
												className={'input-box'}
												key={type}
												flexDirection={'row'}
												width={'100%'}
												alignItems={'center'}
												gap={'4px'}
											>
												<label style={{ cursor: 'pointer' }} htmlFor={type}>
													<Typography className="property-type">{type}</Typography>
												</label>
												<Checkbox
													id={type}
													className="property-checkbox"
													color="default"
													value={type}
													onChange={carTypeSelectHandler}
													checked={(searchFilter?.search?.typeList || []).includes(type as CarType)}
												/>
											</Stack>
										))}
									</div>
									<div className={'box'}>
										<span>Car Fuel Type</span>
										{carFuelType.map((type: string) => (
											<Stack className={'input-box'} key={type} flexDirection={'row'}>
												<label style={{ cursor: 'pointer' }} htmlFor={type}>
													<Typography className="property-type">{type}</Typography>
												</label>
												<Checkbox
													id={type}
													className="property-checkbox"
													color="default"
													value={type}
													onChange={carFuelTypeSelectHandler}
													checked={(searchFilter?.search?.fuelTypeList || []).includes(type as CarFuelType)}
												/>
											</Stack>
										))}
									</div>
								</div>
								<div className="row-box">
									<div className={'box'}>
										<span>options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={propertyOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'carBarter'}>Barter</MenuItem>
													<MenuItem value={'carRent'}>Rent</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{carYears?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{carYears
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>mileage range</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.mileageRange?.start}
													onChange={(e: any) => mileageHandler(e, 'start')}
													inputProps={{ 'aria-label': 'Mileage Start' }}
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
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.mileageRange?.end}
													onChange={(e: any) => mileageHandler(e, 'end')}
													inputProps={{ 'aria-label': 'Mileage End' }}
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
										</div>
									</div>
								</div>
							</div>
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset All filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 500000000, // adjust if needed
			},
			mileageRange: {
				start: 0,
				end: 500000, // adjust if needed
			},
			yearRange: {
				start: 1990,
				end: new Date().getFullYear(),
			},
		},
	},
};

export default HeaderFilter;
