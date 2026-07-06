import React from 'react';
import { Typography, Checkbox, FormControl, Select, MenuItem, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CarLocation, CarType, CarFuelType, CarColor, CarTransmission } from '../../../enums/car.enum';
import { CarsInquiry } from '../../../types/car/car.input';
import { carMileage, carPrices, carYears } from '../../../config';
import { a11yClickProps } from '../../../utils';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterDesktopProps {
	searchFilter: CarsInquiry;
	setSearchFilter: any;
	carLocation: CarLocation[];
	carType: CarType[];
	carFuelTypes: CarFuelType[];
	carTransmissions: CarTransmission[];
	carColors: CarColor[];
	selectedBrand: string;
	setSelectedBrand: (value: string) => void;
	searchText: string;
	setSearchText: (value: string) => void;
	showMore: boolean;
	setShowMore: (value: boolean) => void;
	filterKey: number;
	getCarBrandsData: any;
	updateArrayFilter: (field: keyof CarsInquiry['search'], value: string) => void;
	carOptionSelectHandler: (e: any) => void;
	carPriceHandler: (value: number, type: string) => void;
	clearAllHandler: () => void;
	yearStart: number;
	yearEnd: number;
	mileageStart: number;
	mileageEnd: number;
}

const FilterDesktop = (props: FilterDesktopProps) => {
	const {
		searchFilter,
		setSearchFilter,
		carLocation,
		carType,
		carFuelTypes,
		carTransmissions,
		selectedBrand,
		setSelectedBrand,
		searchText,
		setSearchText,
		showMore,
		setShowMore,
		filterKey,
		getCarBrandsData,
		updateArrayFilter,
		carOptionSelectHandler,
		carPriceHandler,
		clearAllHandler,
		yearStart,
		yearEnd,
		mileageStart,
		mileageEnd,
	} = props;
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<div className="filter-config">
			<div className="filter-main" key={filterKey}>
				<div className="find-your-home">
					<div className="title-main">
						{t('filter.findYourCar')}
						<IconButton className="refresh-icon" onClick={clearAllHandler} aria-label="Reset filters">
							<RefreshIcon />
						</IconButton>
					</div>

					<div className="input-box-search">
						<input
							type="text"
							className="search-input"
							placeholder={t('filter.searchByName')}
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

					<div className="title">{t('filter.location')}</div>
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

					<div className="title">{t('filter.carType')}</div>
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

					<div className="title">{t('filter.brand')}</div>
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
									{t('filter.selectBrand')}
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

					<div className="title">{t('filter.fuelType')}</div>
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
							<div className="title">{t('filter.transmission')}</div>
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

							<div className="title">{t('filter.year')}</div>
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

							<div className="title">{t('filter.price')}</div>
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

							<div className="title">{t('filter.mileage')}</div>
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

							<div className="title">{t('filter.options')}</div>
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
				<div className="show-more" onClick={() => setShowMore(!showMore)} {...a11yClickProps(() => setShowMore(!showMore))}>
					<span>{showMore ? 'Show Less' : 'Show More'}</span>
					<ExpandMoreIcon style={{ transform: showMore ? 'rotate(180deg)' : 'none' }} />
				</div>
				<div className="clear-filter" onClick={clearAllHandler} {...a11yClickProps(clearAllHandler)}>
					<span>Clear All</span>
					<RefreshIcon />
				</div>
			</div>
		</div>
	);
};

export default FilterDesktop;
