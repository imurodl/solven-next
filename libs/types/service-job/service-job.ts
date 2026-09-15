import { CarLocation } from '../../enums/car.enum';
import { ServiceJobStatus, ServiceType } from '../../enums/service-job.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../car/car';
import { Translations } from '../common';

export interface ServiceJob {
	_id: string;
	serviceType: ServiceType;
	serviceStatus: ServiceJobStatus;
	serviceTitle: string;
	serviceDesc?: string;
	carBrand: string;
	carModel: string;
	manufacturedAt?: number;
	servicePrice: number;
	serviceDuration: number;
	serviceImages: string[];
	serviceLocation: CarLocation;
	serviceAddress: string;
	serviceViews: number;
	serviceLikes: number;
	serviceComments: number;
	serviceRank: number;
	serviceTranslations?: Translations;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface ServiceJobs {
	list: ServiceJob[];
	metaCounter: TotalCounter[];
}

export interface ServiceJobInput {
	serviceType: ServiceType;
	serviceTitle: string;
	serviceDesc?: string;
	carBrand: string;
	carModel: string;
	manufacturedAt?: number;
	servicePrice: number;
	serviceDuration?: number;
	serviceImages: string[];
	serviceLocation: CarLocation;
	serviceAddress: string;
}

export interface ServiceJobsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: number;
	search: {
		memberId?: string;
		typeList?: ServiceType[];
		locationList?: CarLocation[];
		brandList?: string[];
		maxPrice?: number;
		text?: string;
	};
}
