import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			refreshToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
			refreshToken
		}
	}
`;

export const REFRESH_TOKEN = gql`
	mutation RefreshToken($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
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
			refreshToken
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
			memberRating
			memberReviews
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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
`;

/**************************
 *          CAR           *
 *************************/

export const CREATE_CAR = gql`
	mutation CreateCar($input: CarInput!) {
		createCar(input: $input) {
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
		}
	}
`;

export const UPDATE_CAR = gql`
	mutation UpdateCar($input: CarUpdate!) {
		updateCar(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_CAR = gql`
	mutation LikeTargetCar($input: String!) {
		likeTargetCar(carId: $input) {
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

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         REVIEW         *
 *************************/

export const CREATE_REVIEW = gql`
	mutation CreateReview($input: ReviewInput!) {
		createReview(input: $input) {
			_id
			reviewRating
			reviewContent
			reviewImages
			createdAt
		}
	}
`;

export const TOGGLE_REVIEW_REACTION = gql`
	mutation ToggleReviewReaction($reviewId: String!, $reaction: ReviewReaction!) {
		toggleReviewReaction(reviewId: $reviewId, reaction: $reaction) {
			_id
			likesCount
			dislikesCount
			myReaction
		}
	}
`;

/**************************
 *         ORDER          *
 *************************/

const ORDER_RESULT = `
	_id
	orderId
	orderStatus
	carId
	orderTotal
	orderDeposit
	orderDiscount
	acceptedAt
	paidAt
	deliveredAt
	completedAt
	cancelledAt
`;

export const CREATE_ORDER = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) { ${ORDER_RESULT} }
	}
`;

export const RESPOND_ORDER = gql`
	mutation RespondOrder($orderId: String!, $accept: Boolean!, $reason: String) {
		respondOrder(orderId: $orderId, accept: $accept, reason: $reason) { ${ORDER_RESULT} }
	}
`;

export const PAY_ORDER_DEPOSIT = gql`
	mutation PayOrderDeposit($orderId: String!) {
		payOrderDeposit(orderId: $orderId) { ${ORDER_RESULT} }
	}
`;

export const MARK_ORDER_DELIVERED = gql`
	mutation MarkOrderDelivered($orderId: String!) {
		markOrderDelivered(orderId: $orderId) { ${ORDER_RESULT} }
	}
`;

export const CONFIRM_ORDER = gql`
	mutation ConfirmOrder($orderId: String!) {
		confirmOrder(orderId: $orderId) { ${ORDER_RESULT} }
	}
`;

export const CANCEL_ORDER = gql`
	mutation CancelOrder($orderId: String!, $reason: String) {
		cancelOrder(orderId: $orderId, reason: $reason) { ${ORDER_RESULT} }
	}
`;

export const REQUEST_RETURN = gql`
	mutation RequestReturn($orderId: String!, $reason: String) {
		requestReturn(orderId: $orderId, reason: $reason) { ${ORDER_RESULT} }
	}
`;

/**************************
 *        MESSAGE         *
 *************************/

export const SEND_MESSAGE = gql`
	mutation SendMessage($input: SendMessageInput!) {
		sendMessage(input: $input) {
			_id
			conversationId
			message
			createdAt
		}
	}
`;

export const REPLY_MESSAGE = gql`
	mutation ReplyMessage($input: ReplyMessageInput!) {
		replyMessage(input: $input) {
			_id
			conversationId
			message
			senderId
			receiverId
			messageStatus
			createdAt
		}
	}
`;

export const SEND_SERVICE_REQUEST = gql`
	mutation SendServiceRequest($input: SendServiceRequestInput!) {
		sendServiceRequest(input: $input) {
			_id
			conversationId
			message
			createdAt
		}
	}
`;

/**************************
 *      SERVICE JOB       *
 *************************/

export const CREATE_SERVICE_JOB = gql`
	mutation CreateServiceJob($input: ServiceJobInput!) {
		createServiceJob(input: $input) {
			_id
			serviceTitle
			serviceStatus
		}
	}
`;

export const UPDATE_SERVICE_JOB = gql`
	mutation UpdateServiceJob($input: ServiceJobUpdate!) {
		updateServiceJob(input: $input) {
			_id
			serviceTitle
			serviceStatus
			servicePrice
		}
	}
`;

export const LIKE_TARGET_SERVICE_JOB = gql`
	mutation LikeTargetServiceJob($serviceJobId: String!) {
		likeTargetServiceJob(serviceJobId: $serviceJobId) {
			_id
			serviceLikes
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *           AI           *
 *************************/

export const ANALYZE_CAR_PHOTO = gql`
	mutation AnalyzeCarPhoto($input: CarPhotoAnalysisInput!) {
		analyzeCarPhoto(input: $input) {
			brand
			model
			bodyType
			color
			yearGuess
			confidence
			notes
			matchedCars {
				_id
				carTitle
				carBrand
				carModel
				carPrice
				carSalePrice
				carIsOnSale
				carSaleStartsAt
				carSaleExpiresAt
				carAvailability
				carImages
				carMileage
				manufacturedAt
				carFuelType
				carTransmission
				carLocation
				carType
				carLikes
				carViews
				carRating
				carReviews
				carColor
				carStatus
				carAddress
				carSeats
				carOptions
				carComments
				carRank
				carBarter
				carRent
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
		}
	}
`;

export const GENERATE_CAR_DESCRIPTION = gql`
	mutation GenerateCarDescription($input: CarDescriptionInput!) {
		generateCarDescription(input: $input) {
			title
			desc
		}
	}
`;

export const MODEL_UPLOADER = gql`
	mutation ModelUploader($file: Upload!) {
		modelUploader(file: $file)
	}
`;
