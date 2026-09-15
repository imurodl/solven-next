import { Car } from '../types/car/car';
import { CarAvailability } from '../enums/car.enum';

type SaleFields = Partial<Pick<Car, 'carIsOnSale' | 'carSalePrice' | 'carSaleStartsAt' | 'carSaleExpiresAt' | 'carPrice'>>;

// A hot deal is only active inside its time window; listings without a start
// date (older records) count as started. Every price display goes through this.
export const isSaleActive = (car?: SaleFields | null, now = Date.now()): boolean => {
	if (!car?.carIsOnSale || !car.carSalePrice) return false;
	const startsAt = car.carSaleStartsAt ? new Date(car.carSaleStartsAt).getTime() : null;
	const expiresAt = car.carSaleExpiresAt ? new Date(car.carSaleExpiresAt).getTime() : null;
	if (startsAt !== null && startsAt > now) return false;
	if (expiresAt !== null && expiresAt <= now) return false;
	return true;
};

export const activeSalePrice = (car?: SaleFields | null): number | undefined =>
	isSaleActive(car) ? car?.carSalePrice : undefined;

// The price a buyer actually pays right now.
export const effectivePrice = (car?: SaleFields | null): number => activeSalePrice(car) ?? Number(car?.carPrice ?? 0);

export const discountPercent = (car?: SaleFields | null): number => {
	const sale = activeSalePrice(car);
	if (!sale || !car?.carPrice || car.carPrice <= sale) return 0;
	return Math.round(((car.carPrice - sale) / car.carPrice) * 100);
};

export const isReserved = (car?: Partial<Car> | null): boolean => car?.carAvailability === CarAvailability.RESERVED;
export const isSoldOut = (car?: Partial<Car> | null): boolean =>
	car?.carAvailability === CarAvailability.SOLD || car?.carStatus === 'SOLD';
export const isPurchasable = (car?: Partial<Car> | null): boolean =>
	!!car && car.carStatus === 'ACTIVE' && (!car.carAvailability || car.carAvailability === CarAvailability.AVAILABLE);
