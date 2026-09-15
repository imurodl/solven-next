import { CarColor, CarType } from '../../enums/car.enum';
import { Car } from '../car/car';

export interface CarPhotoAnalysis {
	brand?: string;
	model?: string;
	bodyType?: CarType;
	color?: CarColor;
	yearGuess?: number;
	confidence: number;
	notes: string;
	matchedCars: Car[];
}

export interface CarPriceEstimate {
	estimate: number;
	low: number;
	high: number;
	sampleSize: number;
	reasoning: string;
	verdict?: 'FAIR' | 'GOOD_DEAL' | 'OVERPRICED' | 'UNKNOWN';
}

export interface AiStatus {
	photoFinder: boolean;
	priceCheck: boolean;
	descriptionWriter: boolean;
	remainingToday: number;
}

export interface AiChatProduct {
	_id: string;
	title: string;
	price: number;
	originalPrice?: number | null;
	image: string;
	subtitle?: string;
}

export interface AiChatAction {
	label: string;
	href: string;
}
