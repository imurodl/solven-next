import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
export const themeVar = makeVar({});

export const emptyUser: CustomJwtPayload = {
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberEmail: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberCars: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
	memberRating: 0,
	memberReviews: 0,
	memberServiceJobs: 0,
	hasTelegram: false,
	hasGoogle: false,
};

export const userVar = makeVar<CustomJwtPayload>({ ...emptyUser });

export const socketVar = makeVar<WebSocket | null>(null);

// Unread direct messages (badge in navbar / mypage menu); refreshed on WS 'dm' events.
export const unreadMessagesVar = makeVar<number>(0);

// Most recent open deal of the signed-in buyer (navbar pill); null when none.
export const activeOrderVar = makeVar<{ _id: string; orderId: string; orderStatus: string; carTitle?: string } | null>(null);
