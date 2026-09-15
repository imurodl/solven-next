import { ReviewReaction, ReviewStatus } from '../../enums/review.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../car/car';

export interface Review {
	_id: string;
	memberId: string;
	carId: string;
	sellerId: string;
	orderId: string;
	reviewRating: number;
	reviewContent: string;
	reviewImages: string[];
	reviewStatus: ReviewStatus;
	createdAt: string;
	updatedAt: string;
	memberData?: Member;
	carTitle?: string;
	carImage?: string;
	likesCount?: number;
	dislikesCount?: number;
	myReaction?: ReviewReaction | null;
}

export interface Reviews {
	list: Review[];
	metaCounter: TotalCounter[];
}

export interface RatingCount {
	star: number;
	count: number;
}

export interface ReviewSummary {
	averageRating: number;
	totalReviews: number;
	ratingDistribution: RatingCount[];
}

export interface ReviewInput {
	carId: string;
	orderId: string;
	reviewRating: number;
	reviewContent: string;
	reviewImages?: string[];
}

export interface ReviewsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: number;
	search: { carId?: string; sellerId?: string; memberId?: string };
}
