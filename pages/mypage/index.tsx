import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import MyCars from '../../libs/components/mypage/MyCars';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddCar from '../../libs/components/mypage/AddNewCar';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyOrders from '../../libs/components/mypage/MyOrders';
import MyMessages from '../../libs/components/mypage/MyMessages';
import MyReviews from '../../libs/components/mypage/MyReviews';
import MyServiceJobs from '../../libs/components/mypage/MyServiceJobs';
import AddServiceJob from '../../libs/components/mypage/AddServiceJob';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDeviceType } from '../../libs/utils';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import SEO from '../../libs/components/SEO';
import { getJwtToken } from '../../libs/auth';

export const getServerSideProps = async ({ locale, req }: any) => ({
	props: {
		deviceType: getDeviceType(req),
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = (props: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		// On a full page load the session is restored by _app after this effect runs,
		// so only bounce when there is no token at all (or it was cleared as invalid).
		if (!user._id && !getJwtToken()) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribe', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribe', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Success!', 808);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		return (
			<div id="my-page-mobile">
				<SEO title="My Page" noindex={true} />
				<MyMenu />
				<Stack className="my-content">
					{category === 'addCar' && <AddCar />}
					{category === 'myProperties' && <MyCars />}
					{category === 'myFavorites' && <MyFavorites />}
					{category === 'recentlyVisited' && <RecentlyVisited />}
					{category === 'myArticles' && <MyArticles />}
					{category === 'writeArticle' && <WriteArticle />}
					{category === 'myProfile' && <MyProfile />}
					{category === 'myOrders' && <MyOrders mode="buyer" />}
					{category === 'deals' && <MyOrders mode="seller" />}
					{category === 'messages' && <MyMessages />}
					{category === 'myReviews' && <MyReviews />}
					{category === 'myServiceJobs' && <MyServiceJobs />}
					{category === 'addServiceJob' && <AddServiceJob />}
					{category === 'followers' && (
						<MemberFollowers
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
							likeMemberHandler={likeMemberHandler}
							redirectToMemberPageHandler={redirectToMemberPageHandler}
						/>
					)}
					{category === 'followings' && (
						<MemberFollowings
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
							likeMemberHandler={likeMemberHandler}
							redirectToMemberPageHandler={redirectToMemberPageHandler}
						/>
					)}
				</Stack>
			</div>
		);
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<SEO title="My Page" noindex={true} />
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config">
								<Stack className={'list-config'}>
									{category === 'addCar' && <AddCar />}
									{category === 'myProperties' && <MyCars />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'myOrders' && <MyOrders mode="buyer" />}
									{category === 'deals' && <MyOrders mode="seller" />}
									{category === 'messages' && <MyMessages />}
									{category === 'myReviews' && <MyReviews />}
									{category === 'myServiceJobs' && <MyServiceJobs />}
									{category === 'addServiceJob' && <AddServiceJob />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
