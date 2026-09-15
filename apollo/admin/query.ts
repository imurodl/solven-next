import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
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
				memberWarnings
				memberBlocks
				memberCars
				memberRank
				memberRating
				memberReviews
				memberArticles
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          CAR           *
 *************************/

export const GET_ALL_CARS_BY_ADMIN = gql`
	query GetAllCarsByAdmin($input: AllCarsInquiry!) {
		getAllCarsByAdmin(input: $input) {
			list {
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
				carSalePrice
				carIsOnSale
				carSaleStartsAt
				carSaleExpiresAt
				carAvailability
				carCondition
				carRating
				carReviews
				carSoldCount
				carImageCredits
				car3dModel
				carTranslations {
					en { title desc }
					kr { title desc }
					ru { title desc }
					uz { title desc }
				}
				memberId
				soldAt
				deletedAt
				manufacturedAt
				createdAt
				updatedAt
				memberData {
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
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberComments
					memberRank
					memberRating
					memberReviews
					memberWarnings
					memberViews
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
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
				memberData {
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
					memberWarnings
					memberBlocks
					memberCars
					memberRank
					memberRating
					memberReviews
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
					memberWarnings
					memberBlocks
					memberCars
					memberRank
					memberRating
					memberReviews
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        CAR BRAND       *
 *************************/

export const GET_CAR_BRAND = gql`
	query GetCarBrand($input: String!) {
		getCarBrand(input: $input) {
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

export const GET_CAR_BRANDS = gql`
	query GetCarBrands {
		getCarBrands {
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

export const GET_ALL_ORDERS_BY_ADMIN = gql`
	query GetAllOrdersByAdmin($input: OrdersInquiry!) {
		getAllOrdersByAdmin(input: $input) {
			list {
				_id
				orderId
				memberId
				sellerId
				carId
				carSnapshot {
					carTitle
					carImage
					carPrice
				}
				orderStatus
				deliveryMethod
				deliveryInfo {
					fullName
					phone
					address
					city
				}
				orderTotal
				orderDeposit
				orderDiscount
				orderCouponCode
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
				sellerData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_COUPONS_BY_ADMIN = gql`
	query GetAllCouponsByAdmin {
		getAllCouponsByAdmin {
			_id
			couponCode
			couponType
			couponValue
			couponStatus
			maxUses
			usedCount
			minOrderAmount
			validUntil
			createdAt
		}
	}
`;

export const GET_ALL_REVIEWS_BY_ADMIN = gql`
	query GetAllReviewsByAdmin($input: ReviewsInquiry!) {
		getAllReviewsByAdmin(input: $input) {
			list {
				_id
				memberId
				carId
				reviewRating
				reviewContent
				reviewImages
				reviewStatus
				createdAt
				carTitle
				likesCount
				dislikesCount
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_SERVICE_JOBS_BY_ADMIN = gql`
	query GetAllServiceJobsByAdmin($input: AllServiceJobsInquiry!) {
		getAllServiceJobsByAdmin(input: $input) {
			list {
				_id
				serviceType
				serviceStatus
				serviceTitle
				carBrand
				carModel
				servicePrice
				serviceImages
				serviceLocation
				serviceViews
				serviceLikes
				createdAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
