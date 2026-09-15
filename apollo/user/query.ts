import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
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

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *           CAR          *
 *************************/

export const GET_CAR = gql`
	query GetCar($input: String!) {
		getCar(carId: $input) {
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
	}
`;

export const GET_CARS = gql`
	query GetCars($input: CarsInquiry!) {
		getCars(input: $input) {
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

export const GET_AGENT_CARS = gql`
	query GetAgentCars($input: AgentCarsInquiry!) {
		getAgentCars(input: $input) {
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

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
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

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
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

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberRating
					memberReviews
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberRating
					memberReviews
					memberWarnings
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
				meFollowed {
					followingId
					followerId
					myFollowing
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

export const GET_CAR_BRAND_BY_USER = gql`
	query GetCarBrandByUser($input: String!) {
		getCarBrandByUser(input: $input) {
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

export const GET_CAR_BRANDS_BY_USER = gql`
	query GetCarBrandsByUser {
		getCarBrandsByUser {
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

export const GET_ALL_NOTICES = gql`
  query GetAllNotices($input: AllNoticesInquiry!) {
    getAllNotices(input: $input) {
      list {
        _id
        noticeCategory
        noticeStatus
        noticeTitle
        noticeContent
        memberId
        createdAt
        updatedAt
      }
      metaCounter {
        _id
        count
      }
    }
  }
`;

export const GET_NOTICE = gql`
  query GetNotice($noticeId: String!) {
    getNotice(noticeId: $noticeId) {
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
/**************************
 *         PROFILE        *
 *************************/

export const GET_MY_PROFILE = gql`
	query GetMyProfile {
		getMyProfile {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberEmail
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
			memberServiceJobs
			memberWarnings
			memberViews
			memberBlocks
			hasTelegram
			hasGoogle
			createdAt
			updatedAt
		}
	}
`;

export const GET_MECHANICS = gql`
	query GetMechanics($input: MechanicsInquiry!) {
		getMechanics(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberServiceJobs
				memberArticles
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				memberRank
				memberRating
				memberReviews
				createdAt
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
 *         REVIEW         *
 *************************/

export const GET_REVIEWS = gql`
	query GetReviews($input: ReviewsInquiry!) {
		getReviews(input: $input) {
			list {
				_id
				memberId
				carId
				sellerId
				orderId
				reviewRating
				reviewContent
				reviewImages
				reviewStatus
				createdAt
				carTitle
				carImage
				likesCount
				dislikesCount
				myReaction
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
					memberType
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_CAR_REVIEW_SUMMARY = gql`
	query GetCarReviewSummary($carId: String!) {
		getCarReviewSummary(carId: $carId) {
			averageRating
			totalReviews
			ratingDistribution {
				star
				count
			}
		}
	}
`;

export const GET_SELLER_REVIEW_SUMMARY = gql`
	query GetSellerReviewSummary($sellerId: String!) {
		getSellerReviewSummary(sellerId: $sellerId) {
			averageRating
			totalReviews
			ratingDistribution {
				star
				count
			}
		}
	}
`;

/**************************
 *         ORDER          *
 *************************/

const ORDER_FIELDS = `
	_id
	orderId
	memberId
	sellerId
	carId
	carSnapshot {
		carTitle
		carImage
		carPrice
		carBrand
		carModel
		manufacturedAt
		carMileage
	}
	orderStatus
	deliveryMethod
	deliveryInfo {
		fullName
		phone
		address
		city
		note
	}
	orderTotal
	orderDeposit
	orderDiscount
	orderCouponCode
	acceptedAt
	paidAt
	deliveredAt
	completedAt
	cancelledAt
	cancelReason
	returnRequestedAt
	returnReason
	returnedAt
	createdAt
	updatedAt
	reviewed
	memberData {
		_id
		memberNick
		memberFullName
		memberImage
		memberPhone
	}
	sellerData {
		_id
		memberNick
		memberFullName
		memberImage
		memberPhone
		memberAddress
		memberRating
		memberReviews
	}
`;

export const GET_ORDER_QUOTE = gql`
	query GetOrderQuote($carId: String!, $couponCode: String) {
		getOrderQuote(carId: $carId, couponCode: $couponCode) {
			carPrice
			discountAmount
			orderTotal
			orderDeposit
			depositRate
			couponCode
			couponMessage
		}
	}
`;

export const GET_MY_ORDERS = gql`
	query GetMyOrders($input: OrdersInquiry!) {
		getMyOrders(input: $input) {
			list { ${ORDER_FIELDS} }
			metaCounter { total }
		}
	}
`;

export const GET_SELLER_ORDERS = gql`
	query GetSellerOrders($input: OrdersInquiry!) {
		getSellerOrders(input: $input) {
			list { ${ORDER_FIELDS} }
			metaCounter { total }
		}
	}
`;

export const GET_ORDER_BY_ID = gql`
	query GetOrderById($orderId: String!) {
		getOrderById(orderId: $orderId) { ${ORDER_FIELDS} }
	}
`;

export const GET_MY_ACTIVE_ORDER = gql`
	query GetMyActiveOrder {
		getMyActiveOrder {
			_id
			orderId
			orderStatus
			carId
			carSnapshot {
				carTitle
				carImage
			}
			createdAt
		}
	}
`;

export const VALIDATE_COUPON = gql`
	query ValidateCoupon($code: String!, $orderTotal: Float!) {
		validateCoupon(code: $code, orderTotal: $orderTotal) {
			valid
			message
			discountAmount
			finalTotal
			couponCode
		}
	}
`;

/**************************
 *        MESSAGE         *
 *************************/

export const GET_MY_CONVERSATIONS = gql`
	query GetMyConversations {
		getMyConversations {
			conversationId
			kind
			carId
			carTitle
			carImage
			lastMessage
			lastMessageAt
			unreadCount
			partner {
				_id
				memberNick
				memberFullName
				memberImage
				memberType
			}
		}
	}
`;

export const GET_UNREAD_MESSAGE_COUNT = gql`
	query GetUnreadMessageCount {
		getUnreadMessageCount
	}
`;

export const GET_CONVERSATION = gql`
	query GetConversation($conversationId: String!) {
		getConversation(conversationId: $conversationId) {
			_id
			conversationId
			kind
			carId
			senderId
			receiverId
			message
			messageStatus
			createdAt
			senderData {
				_id
				memberNick
				memberImage
			}
		}
	}
`;

/**************************
 *      SERVICE JOB       *
 *************************/

const SERVICE_JOB_FIELDS = `
	_id
	serviceType
	serviceStatus
	serviceTitle
	serviceDesc
	carBrand
	carModel
	manufacturedAt
	servicePrice
	serviceDuration
	serviceImages
	serviceLocation
	serviceAddress
	serviceViews
	serviceLikes
	serviceComments
	serviceRank
	serviceTranslations {
		en { title desc }
		kr { title desc }
		ru { title desc }
		uz { title desc }
	}
	memberId
	createdAt
	updatedAt
	memberData {
		_id
		memberType
		memberNick
		memberFullName
		memberImage
		memberAddress
		memberDesc
		memberPhone
		memberServiceJobs
		memberLikes
		memberViews
		memberRating
		memberReviews
		memberFollowers
	}
	meLiked {
		memberId
		likeRefId
		myFavorite
	}
`;

export const GET_SERVICE_JOBS = gql`
	query GetServiceJobs($input: ServiceJobsInquiry!) {
		getServiceJobs(input: $input) {
			list { ${SERVICE_JOB_FIELDS} }
			metaCounter { total }
		}
	}
`;

export const GET_SERVICE_JOB = gql`
	query GetServiceJob($serviceJobId: String!) {
		getServiceJob(serviceJobId: $serviceJobId) { ${SERVICE_JOB_FIELDS} }
	}
`;

export const GET_MECHANIC_SERVICE_JOBS = gql`
	query GetMechanicServiceJobs($input: ServiceJobsInquiry!) {
		getMechanicServiceJobs(input: $input) {
			list { ${SERVICE_JOB_FIELDS} }
			metaCounter { total }
		}
	}
`;

/**************************
 *           AI           *
 *************************/

export const GET_AI_STATUS = gql`
	query GetAiStatus {
		getAiStatus {
			photoFinder
			priceCheck
			descriptionWriter
			remainingToday
		}
	}
`;

export const ESTIMATE_CAR_PRICE = gql`
	query EstimateCarPrice($input: CarPriceEstimateInput!) {
		estimateCarPrice(input: $input) {
			estimate
			low
			high
			sampleSize
			reasoning
			verdict
		}
	}
`;

export const GET_RECENT_ACTIVITY = gql`
	query GetRecentActivity($limit: Int) {
		getRecentActivity(limit: $limit) {
			type
			title
			subtitle
			carId
			image
			rating
			createdAt
		}
	}
`;
