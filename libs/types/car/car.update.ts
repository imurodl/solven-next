import {
	CarColor,
	CarFuelType,
	CarLocation,
	CarOptions,
	CarStatus,
	CarTransmission,
	CarType,
} from '../../enums/car.enum';

export interface CarUpdate {
	_id: string;
	carType?: CarType;
	carStatus?: CarStatus;
	carLocation?: CarLocation;
	carAddress?: string;
	carFuelType?: CarFuelType;
	carColor?: CarColor;
	carTransmission?: CarTransmission;
	carOptions?: CarOptions[];
	carTitle?: string;
	carPrice?: number;
	carMileage?: number;
	carSeats?: number;
	carImages?: string[];
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	manufacturedAt?: number;
}
