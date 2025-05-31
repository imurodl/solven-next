import { NoticeCategory, NoticeStatus } from "../../enums/notice.enum";

export interface typeNotice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface NoticeInquiry {
	page?: number;
	limit?: number;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	search?: string;
}

export interface AllNoticesInquiry {
	page?: number;
	limit?: number;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	search?: string;
}