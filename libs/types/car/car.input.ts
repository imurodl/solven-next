import {
	CarColor,
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
	carLocation: CarLocation;
	carAddress: string;
	carTitle: string;
	carPrice: number;
	carSquare: number;
	carBeds: number;
	carRooms: number;
	carImages: string[];
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	memberId?: string;
	manufacturedAt: number;
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
	carOptions?: CarOptions[];
	carListingptions?: string[];
	pricesRange?: Range;
	mileageRange?: Range;
	yearRange?: Range;
	text?: string;
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
