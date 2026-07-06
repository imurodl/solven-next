import React from 'react';
import { Stack, Box, Modal, Divider, Button, Typography, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { carMileage, carYears } from '../../../config';
import { a11yClickProps } from '../../../utils';
import { CarFuelType, CarType } from '../../../enums/car.enum';
import { CarsInquiry } from '../../../types/car/car.input';

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

interface AdvancedFilterModalProps {
	openAdvancedFilter: boolean;
	advancedFilterHandler: (status: boolean) => void;
	searchFilter: CarsInquiry;
	setSearchFilter: (value: CarsInquiry) => void;
	carType: CarType[];
	carFuelType: CarFuelType[];
	carTypeSelectHandler: (e: any) => void;
	carFuelTypeSelectHandler: (e: any) => void;
	optionCheck: string;
	propertyOptionSelectHandler: (e: any) => void;
	yearCheck: { start: number; end: number };
	yearStartChangeHandler: (event: any) => void;
	yearEndChangeHandler: (event: any) => void;
	mileageHandler: (e: any, type: string) => void;
	resetFilterHandler: () => void;
	pushSearchHandler: () => void;
}

const AdvancedFilterModal = (props: AdvancedFilterModalProps) => {
	const {
		openAdvancedFilter,
		advancedFilterHandler,
		searchFilter,
		setSearchFilter,
		carType,
		carFuelType,
		carTypeSelectHandler,
		carFuelTypeSelectHandler,
		optionCheck,
		propertyOptionSelectHandler,
		yearCheck,
		yearStartChangeHandler,
		yearEndChangeHandler,
		mileageHandler,
		resetFilterHandler,
		pushSearchHandler,
	} = props;

	return (
		<Modal
			open={openAdvancedFilter}
			onClose={() => advancedFilterHandler(false)}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<Box className={'advanced-filter-modal'}>
					<div className={'close'} onClick={() => advancedFilterHandler(false)} {...a11yClickProps(() => advancedFilterHandler(false))}>
						<CloseIcon />
					</div>
					<div className={'top'}>
						<div className={'search-input-box'}>
							<img src="/img/icons/search.svg" alt="" />
							<input
								value={searchFilter?.search?.text ?? ''}
								type="text"
								placeholder={'Search by name...'}
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
						<div onClick={resetFilterHandler} {...a11yClickProps(resetFilterHandler)}>
							<img src="/img/icons/reset.svg" alt="" />
							<span>Reset All filters</span>
						</div>
						<Button
							startIcon={<img src={'/img/icons/search.svg'} alt="" />}
							className={'search-btn'}
							onClick={pushSearchHandler}
						>
							Search
						</Button>
					</div>
				</Box>
			</Box>
		</Modal>
	);
};

export default AdvancedFilterModal;
