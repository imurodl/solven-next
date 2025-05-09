import { CarLocation, CarStatus, PropertyType } from '../../enums/car.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: CarStatus;
	propertyLocation?: CarLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertySquare?: number;
	propertyBeds?: number;
	propertyRooms?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
