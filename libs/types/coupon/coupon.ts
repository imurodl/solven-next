import { CouponStatus, CouponType } from '../../enums/coupon.enum';

export interface Coupon {
	_id: string;
	couponCode: string;
	couponType: CouponType;
	couponValue: number;
	couponStatus: CouponStatus;
	maxUses: number;
	usedCount: number;
	minOrderAmount: number;
	validUntil?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CouponValidation {
	valid: boolean;
	message: string;
	discountAmount: number;
	finalTotal: number;
	couponCode?: string;
}
