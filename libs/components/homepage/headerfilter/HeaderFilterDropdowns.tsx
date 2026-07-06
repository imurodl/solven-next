import React from 'react';
import Image from 'next/image';
import { a11yClickProps } from '../../../utils';
import { REACT_APP_API_URL } from '../../../config';
import { CarsInquiry } from '../../../types/car/car.input';
import { CarBrand } from '../../../types/car/car-brand';

interface HeaderFilterDropdownsProps {
	openLocation: boolean;
	openType: boolean;
	openRooms: boolean;
	locationRef: any;
	typeRef: any;
	roomsRef: any;
	carLocation: string[];
	carBrands: CarBrand[];
	searchFilter: CarsInquiry;
	propertyLocationSelectHandler: (value: any) => void;
	propertyTypeSelectHandler: (value: any) => void;
	propertyRoomSelectHandler: (value: any) => void;
}

const HeaderFilterDropdowns = (props: HeaderFilterDropdownsProps) => {
	const {
		openLocation,
		openType,
		openRooms,
		locationRef,
		typeRef,
		roomsRef,
		carLocation,
		carBrands,
		searchFilter,
		propertyLocationSelectHandler,
		propertyTypeSelectHandler,
		propertyRoomSelectHandler,
	} = props;

	return (
		<>
			{/*MENU */}
			<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
				{carLocation.map((location: string) => {
					return (
						<div onClick={() => propertyLocationSelectHandler(location)} key={location} {...a11yClickProps(() => propertyLocationSelectHandler(location))}>
							<img src={`img/banner/cities/${location}.webp`} alt="" />
							<span>{location}</span>
						</div>
					);
				})}
			</div>

			<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
				{carBrands.map((carBrand: CarBrand) => {
					return (
						<div onClick={() => propertyTypeSelectHandler(carBrand.carBrandName)} key={carBrand._id} {...a11yClickProps(() => propertyTypeSelectHandler(carBrand.carBrandName))}>
							<Image src={`${REACT_APP_API_URL}/${carBrand.carBrandImg}`} alt={carBrand.carBrandName} width={800} height={600} />
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
						<span onClick={() => propertyRoomSelectHandler(model)} key={model} {...a11yClickProps(() => propertyRoomSelectHandler(model))}>
							{model}
						</span>
					));
				})()}
			</div>
		</>
	);
};

export default HeaderFilterDropdowns;
