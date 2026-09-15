import {
	CarAvailability,
	CarColor,
	CarCondition,
	CarFuelType,
	CarLocation,
	CarOptions,
	CarStatus,
	CarTransmission,
	CarType,
} from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';

export interface CarInput {
	carType: CarType;
	carBrand: string;
	carModel: string;
	carLocation: CarLocation;
	carAddress: string;
	carFuelType: CarFuelType;
	carTransmission: CarTransmission;
	carTitle: string;
	carPrice: number;
	carSeats: number;
	carOptions?: string[];
	carColor: CarColor;
	carMileage: number;
	carImages: string[];
	manufacturedAt: number;
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	carSalePrice?: number;
	carIsOnSale?: boolean;
	carSaleStartsAt?: Date | string;
	carSaleExpiresAt?: Date | string;
	carCondition?: CarCondition;
	carVin?: string;
	carImageCredits?: string[];
	car3dModel?: string;
}

interface CarsISearch {
	memberId?: string;
	locationList?: CarLocation[];
	typeList?: CarType[];
	fuelTypeList?: CarFuelType[];
	transmissionList?: CarTransmission[];
	colorList?: CarColor[];
	brandList?: string[];
	modelList?: string[];
	carOptions?: string[];
	carListingOptions?: CarOptions[];
	pricesRange?: Range;
	mileageRange?: Range;
	yearRange?: Range;
	text?: string;
	carIsOnSale?: boolean;
	conditionList?: CarCondition[];
	availabilityList?: CarAvailability[];
}

export interface CarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CarsISearch;
}

interface ACISearch {
	carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ACISearch;
}

interface ALCISearch {
	carStatus?: CarStatus;
	carLocationList?: CarLocation[];
}

export interface AllCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALCISearch;
}

interface Range {
	start: number;
	end: number;
}
