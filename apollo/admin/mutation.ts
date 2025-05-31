import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberCars
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *           CAR          *
 *************************/

export const UPDATE_CAR_BY_ADMIN = gql`
	mutation UpdateCarByAdmin($input: CarUpdate!) {
		updateCarByAdmin(input: $input) {
			_id
			carType
			carStatus
			carLocation
			carAddress
			carBrand
			carModel
			carTitle
			carPrice
			carFuelType
			carTransmission
			carOptions
			carColor
			carMileage
			carSeats
			carViews
			carLikes
			carComments
			carRank
			carImages
			carDesc
			carBarter
			carRent
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_CAR_BY_ADMIN = gql`
	mutation RemoveCarByAdmin($input: String!) {
		removeCarByAdmin(carId: $input) {
			_id
			carType
			carStatus
			carLocation
			carAddress
			carBrand
			carModel
			carTitle
			carPrice
			carFuelType
			carTransmission
			carOptions
			carColor
			carMileage
			carSeats
			carViews
			carLikes
			carComments
			carRank
			carImages
			carDesc
			carBarter
			carRent
			memberId
			soldAt
			deletedAt
			manufacturedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *        CAR BRAND       *
 *************************/

export const CREATE_CAR_BRAND = gql`
	mutation CreateCarBrand($input: CarBrandInput!) {
		createCarBrand(input: $input) {
			_id
			carBrandName
			carBrandImg
			carBrandModels
			carBrandStatus
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_CAR_BRAND = gql`
	mutation UpdateCarBrand($input: CarBrandUpdate!) {
		updateCarBrand(input: $input) {
			_id
			carBrandName
			carBrandImg
			carBrandModels
			carBrandStatus
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_CAR_BRAND_MODEL = gql`
	mutation DeleteCarBrandModel($input: CarBrandModelInput!) {
		deleteCarBrandModel(input: $input) {
			_id
			carBrandName
			carBrandModels
			carBrandImg
			carBrandStatus
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_CAR_BRAND = gql`
	mutation RemoveCarBrand($input: String!) {
		removeCarBrand(carBrandName: $input) {
			_id
			carBrandName
			carBrandImg
			carBrandModels
			carBrandStatus
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE_BY_ADMIN = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNotice($noticeId: String!, $input: NoticeUpdate!) {
		updateNotice(noticeId: $noticeId, input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNotice($input: String!) {
		removeNotice(noticeId: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;
