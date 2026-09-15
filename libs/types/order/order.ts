import { DeliveryMethod, OrderStatus } from '../../enums/order.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../car/car';

export interface CarSnapshot {
	carTitle: string;
	carImage?: string;
	carPrice: number;
	carBrand?: string;
	carModel?: string;
	manufacturedAt?: number;
	carMileage?: number;
}

export interface DeliveryInfo {
	fullName: string;
	phone: string;
	address?: string;
	city?: string;
	note?: string;
}

export interface Order {
	_id: string;
	orderId: string;
	memberId: string;
	sellerId: string;
	carId: string;
	carSnapshot: CarSnapshot;
	orderStatus: OrderStatus;
	deliveryMethod: DeliveryMethod;
	deliveryInfo: DeliveryInfo;
	orderTotal: number;
	orderDeposit: number;
	orderDiscount: number;
	orderCouponCode?: string;
	acceptedAt?: string;
	paidAt?: string;
	deliveredAt?: string;
	completedAt?: string;
	cancelledAt?: string;
	cancelReason?: string;
	returnRequestedAt?: string;
	returnReason?: string;
	returnedAt?: string;
	createdAt: string;
	updatedAt: string;
	memberData?: Member;
	sellerData?: Member;
	reviewed?: boolean;
}

export interface Orders {
	list: Order[];
	metaCounter: TotalCounter[];
}

export interface OrderQuote {
	carPrice: number;
	discountAmount: number;
	orderTotal: number;
	orderDeposit: number;
	depositRate: number;
	couponCode?: string;
	couponMessage?: string;
}

export interface OrderInput {
	carId: string;
	deliveryMethod: DeliveryMethod;
	deliveryInfo: DeliveryInfo;
	couponCode?: string;
}

export interface OrdersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: number;
	search?: { orderStatus?: OrderStatus; statusList?: OrderStatus[]; carId?: string };
}
