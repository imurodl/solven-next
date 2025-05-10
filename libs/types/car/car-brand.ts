import { CarBrandStatus } from '../../enums/car.enum';

export interface CarBrand {
	_id: string;
	carBrandName: string;
	carBrandModels: string[];
	carBrandStatus: CarBrandStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface CarBrandInput {
	carBrandName: string;
	carBrandModels: string[];
}

export interface CarBrandUpdate {
	carBrandName: string;
	carBrandModel?: string;
	carBrandStatus?: CarBrandStatus;
}

export interface CarBrandModelInput {
	carBrandName: string;
	carBrandModel: string;
}
