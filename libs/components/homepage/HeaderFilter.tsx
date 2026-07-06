import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { a11yClickProps } from '../../utils';
import { CarFuelType, CarLocation, CarType } from '../../enums/car.enum';
import { CarsInquiry } from '../../types/car/car.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GET_CAR_BRANDS_BY_USER } from '../../../apollo/user/query';
import { CarBrand } from '../../types/car/car-brand';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import HeaderFilterDropdowns from './headerfilter/HeaderFilterDropdowns';
import AdvancedFilterModal from './headerfilter/AdvancedFilterModal';

const carTypeOptions: CarType[] = [
	CarType.LIGHT,
	CarType.COMPACT,
	CarType.MIDSIZE,
	CarType.LARGE,
	CarType.SUV,
	CarType.TRUCK,
	CarType.OTHER,
];

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
						mileageRange: { start: value, end: searchFilter.search.mileageRange?.end ?? 500000 },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						mileageRange: { start: searchFilter.search.mileageRange?.start ?? 0, end: value },
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
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler} {...a11yClickProps(locationStateChangeHandler)}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler} {...a11yClickProps(typeStateChangeHandler)}>
							<span> {searchFilter?.search?.brandList?.[0] || t('Brand')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openRooms ? 'on' : ''}`} onClick={roomStateChangeHandler} {...a11yClickProps(roomStateChangeHandler)}>
							<span>{searchFilter?.search?.modelList ? searchFilter?.search?.modelList[0] : t('Model')}</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'search-btn'} onClick={pushSearchHandler} {...a11yClickProps(pushSearchHandler)}>
							<img src="/img/icons/search_white.svg" alt="" />
							<p>{t('Search Cars')}</p>
						</Box>
					</Stack>

					<HeaderFilterDropdowns
						openLocation={openLocation}
						openType={openType}
						openRooms={openRooms}
						locationRef={locationRef}
						typeRef={typeRef}
						roomsRef={roomsRef}
						carLocation={carLocation}
						carBrands={carBrands}
						searchFilter={searchFilter}
						propertyLocationSelectHandler={propertyLocationSelectHandler}
						propertyTypeSelectHandler={propertyTypeSelectHandler}
						propertyRoomSelectHandler={propertyRoomSelectHandler}
					/>
				</Stack>

				<AdvancedFilterModal
					openAdvancedFilter={openAdvancedFilter}
					advancedFilterHandler={advancedFilterHandler}
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
					carType={carType}
					carFuelType={carFuelType}
					carTypeSelectHandler={carTypeSelectHandler}
					carFuelTypeSelectHandler={carFuelTypeSelectHandler}
					optionCheck={optionCheck}
					propertyOptionSelectHandler={propertyOptionSelectHandler}
					yearCheck={yearCheck}
					yearStartChangeHandler={yearStartChangeHandler}
					yearEndChangeHandler={yearEndChangeHandler}
					mileageHandler={mileageHandler}
					resetFilterHandler={resetFilterHandler}
					pushSearchHandler={pushSearchHandler}
				/>
			</>
		);
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler} {...a11yClickProps(locationStateChangeHandler)}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler} {...a11yClickProps(typeStateChangeHandler)}>
							<span> {searchFilter?.search?.brandList?.[0] || t('Brand')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openRooms ? 'on' : ''}`} onClick={roomStateChangeHandler} {...a11yClickProps(roomStateChangeHandler)}>
							<span>{searchFilter?.search?.modelList ? searchFilter?.search?.modelList[0] : t('Model')}</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)} {...a11yClickProps(() => advancedFilterHandler(true))}>
							<span>{t('Advanced Search')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler} {...a11yClickProps(pushSearchHandler)}>
							<img src="/img/icons/search_white.svg" alt="" />
							<p>{t('Search Cars')}</p>
						</Box>
					</Stack>

					<HeaderFilterDropdowns
						openLocation={openLocation}
						openType={openType}
						openRooms={openRooms}
						locationRef={locationRef}
						typeRef={typeRef}
						roomsRef={roomsRef}
						carLocation={carLocation}
						carBrands={carBrands}
						searchFilter={searchFilter}
						propertyLocationSelectHandler={propertyLocationSelectHandler}
						propertyTypeSelectHandler={propertyTypeSelectHandler}
						propertyRoomSelectHandler={propertyRoomSelectHandler}
					/>
				</Stack>

				<AdvancedFilterModal
					openAdvancedFilter={openAdvancedFilter}
					advancedFilterHandler={advancedFilterHandler}
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
					carType={carType}
					carFuelType={carFuelType}
					carTypeSelectHandler={carTypeSelectHandler}
					carFuelTypeSelectHandler={carFuelTypeSelectHandler}
					optionCheck={optionCheck}
					propertyOptionSelectHandler={propertyOptionSelectHandler}
					yearCheck={yearCheck}
					yearStartChangeHandler={yearStartChangeHandler}
					yearEndChangeHandler={yearEndChangeHandler}
					mileageHandler={mileageHandler}
					resetFilterHandler={resetFilterHandler}
					pushSearchHandler={pushSearchHandler}
				/>
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
