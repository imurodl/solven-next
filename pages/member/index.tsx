import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import SEO from '../../libs/components/SEO';
import { Stack } from '@mui/material';
import MemberMenu from '../../libs/components/member/MemberMenu';
import MemberProperties from '../../libs/components/member/MemberCars';
import { useRouter } from 'next/router';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberArticles from '../../libs/components/member/MemberArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDeviceType } from '../../libs/utils';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';

export const getServerSideProps = async ({ locale, req, query }: any) => {
	const translations = await serverSideTranslations(locale, ['common']);
	let initialMember = null;
	const id = query?.memberId;
	if (id) {
		try {
			const GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL || 'https://api.solven.uz/graphql';
			const res = await fetch(GRAPHQL_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `query GetMember($input: String!) { getMember(memberId: $input) { _id memberNick memberFullName memberImage memberDesc } }`,
					variables: { input: id },
				}),
			});
			const json = await res.json();
			initialMember = json?.data?.getMember ?? null;
		} catch {
			initialMember = null;
		}
	}
	return { props: { deviceType: getDeviceType(req), initialMember, ...translations } };
};

const MemberPage: NextPage = ({ initialMember }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category;
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		if (!category) {
			router.replace(
				{
					pathname: router.pathname,
					query: { ...router.query, category: 'properties' },
				},
				undefined,
				{ shallow: true },
			);
		}
	}, [category, router]);

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
			await sweetTopSmallSuccessAlert('Followed!', 800);
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
			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
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
			await sweetTopSmallSuccessAlert('Success!', 800);
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

	const seoMember = initialMember;
	const seoMemberName = seoMember?.memberFullName || seoMember?.memberNick;
	const seoMemberImage = seoMember?.memberImage
		? `${process.env.REACT_APP_API_URL}/${seoMember.memberImage}`
		: undefined;
	const memberSeo = (
		<SEO
			canonical={seoMember?._id ? `/member/?memberId=${seoMember._id}` : undefined}
			title={seoMemberName ? `${seoMemberName} — Member` : 'Member Profile'}
			description={
				seoMember?.memberDesc
					? String(seoMember.memberDesc).slice(0, 160)
					: `View ${seoMemberName || 'this Solven member'}'s car listings, followers and activity on Solven.`
			}
			image={seoMemberImage}
			type="profile"
			jsonLd={
				seoMember
					? {
							'@context': 'https://schema.org',
							'@type': 'ProfilePage',
							mainEntity: {
								'@type': 'Person',
								name: seoMemberName,
								...(seoMemberImage ? { image: seoMemberImage } : {}),
								...(seoMember.memberDesc ? { description: String(seoMember.memberDesc).slice(0, 300) } : {}),
								url: `https://solven.uz/member/?memberId=${seoMember._id}`,
							},
					  }
					: undefined
			}
		/>
	);

	if (device === 'mobile') {
		return (
			<div id="member-page-mobile">
				{memberSeo}
				<MemberMenu subscribeHandler={subscribeHandler} unsubscribeHandler={unsubscribeHandler} />
				<Stack className="member-content">
					{category === 'properties' && <MemberProperties />}
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
					{category === 'articles' && <MemberArticles />}
				</Stack>
			</div>
		);
	} else {
		return (
			<div id="member-page" style={{ position: 'relative' }}>
				{memberSeo}
				<div className="container">
					<Stack className={'member-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MemberMenu subscribeHandler={subscribeHandler} unsubscribeHandler={unsubscribeHandler} />
							</Stack>
							<Stack className="main-config">
								<Stack className={'list-config'}>
									{category === 'properties' && <MemberProperties />}
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
									{category === 'articles' && <MemberArticles />}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MemberPage);
