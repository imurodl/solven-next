import {
	CarColor,
	CarFuelType,
	CarLocation,
	CarOptions,
	CarStatus,
	CarTransmission,
	CarType,
} from '../../enums/car.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Car {
	_id: string;
	carType: CarType;
	carStatus: CarStatus;
	carLocation: CarLocation;
	carAddress: string;
	carBrand: string;
	carModel: string;
	carTitle: string;
	carPrice: number;
	carFuelType: CarFuelType;
	carTransmission: CarTransmission;
	carOptions: CarOptions[];
	carColor: CarColor;
	carMileage: number;
	carSeats: number;
	carViews: number;
	carLikes: number;
	carComments: number;
	carRank: number;
	carImages: string[];
	carDesc?: string;
	carBarter: boolean;
	carRent: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	manufacturedAt: number;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Cars {
	list: Car[];
	metaCounter: TotalCounter[];
}
