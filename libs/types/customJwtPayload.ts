import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	memberType: string;
	memberStatus: string;
	memberAuthType: string;
	memberPhone?: string;
	memberEmail?: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberCars: number;
	memberRank: number;
	memberArticles: number;
	memberPoints: number;
	memberLikes: number;
	memberViews: number;
	memberWarnings: number;
	memberBlocks: number;
	memberRating?: number;
	memberReviews?: number;
	memberServiceJobs?: number;
	hasTelegram?: boolean;
	hasGoogle?: boolean;
}
