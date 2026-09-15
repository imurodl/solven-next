import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { sweetMixinErrorAlert } from '../sweetAlert';
import { LOGIN, SIGN_UP, REFRESH_TOKEN } from '../../apollo/user/mutation';
import { GET_MY_PROFILE } from '../../apollo/user/query';
import { emptyUser } from '../../apollo/store';

export function getJwtToken(): string {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
	return '';
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export function getRefreshToken(): string {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('refreshToken') ?? '';
	}
	return '';
}

export function setRefreshToken(token: string) {
	localStorage.setItem('refreshToken', token);
}

export function isTokenExpired(token: string): boolean {
	if (!token) return true;
	try {
		const claims = decodeJWT<CustomJwtPayload>(token);
		if (!claims.exp) return true;
		return claims.exp * 1000 < Date.now();
	} catch {
		return true;
	}
}

export async function refreshTokens(): Promise<string | null> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return null;

	try {
		const apolloClient = await initializeApollo();
		const result = await apolloClient.mutate({
			mutation: REFRESH_TOKEN,
			variables: { refreshToken },
			fetchPolicy: 'network-only',
		});

		const member = result?.data?.refreshToken;
		if (member?.accessToken) {
			setJwtToken(member.accessToken);
			if (member.refreshToken) setRefreshToken(member.refreshToken);
			updateUserInfo(member.accessToken);
			return member.accessToken;
		}
	} catch {
		logOut();
	}
	return null;
}

// Restore the signed-in state on page load. An expired access token is refreshed
// (if a refresh token exists); when that fails the stale tokens are cleared so the
// UI never shows a logged-in user whose every request would 401.
export async function restoreSession(): Promise<void> {
	if (typeof window === 'undefined') return;
	const token = getJwtToken();
	if (!token) return;
	if (isTokenExpired(token)) {
		const fresh = await refreshTokens();
		if (!fresh) clearSession();
		return;
	}
	updateUserInfo(token);
	await hydrateProfile();
}

// Private fields (phone, e-mail, linked accounts) are not in the JWT; fetch them
// once the token is known so MyProfile/checkout can prefill.
export async function hydrateProfile(): Promise<void> {
	try {
		const apolloClient = await initializeApollo();
		const result = await apolloClient.query({ query: GET_MY_PROFILE, fetchPolicy: 'network-only' });
		const me = result?.data?.getMyProfile;
		if (!me) return;
		userVar({
			...userVar(),
			memberPhone: me.memberPhone ?? '',
			memberEmail: me.memberEmail ?? '',
			memberFullName: me.memberFullName ?? userVar().memberFullName,
			memberImage: me.memberImage ? me.memberImage : userVar().memberImage,
			memberAddress: me.memberAddress ?? '',
			memberDesc: me.memberDesc ?? '',
			memberRating: me.memberRating ?? 0,
			memberReviews: me.memberReviews ?? 0,
			memberServiceJobs: me.memberServiceJobs ?? 0,
			hasTelegram: !!me.hasTelegram,
			hasGoogle: !!me.hasGoogle,
		});
	} catch {
		// non-fatal: JWT claims already populate the basics
	}
}

// Used after OAuth redirects (?token=&refresh=) and by the Telegram widget.
export async function loginWithTokens(jwtToken: string, refreshToken?: string): Promise<void> {
	updateStorage({ jwtToken, refreshToken });
	updateUserInfo(jwtToken);
	await hydrateProfile();
}

export const logIn = async (nick: string, password: string): Promise<void> => {
	try {
		const { jwtToken } = await requestJwtToken({ nick, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
			await hydrateProfile();
		}
	} catch {
		logOut();
	}
};

const requestJwtToken = async ({
	nick,
	password,
}: {
	nick: string;
	password: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberNick: nick, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		const { accessToken, refreshToken } = result?.data?.login;
		if (refreshToken) setRefreshToken(refreshToken);

		return { jwtToken: accessToken };
	} catch (err: any) {
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const signUp = async (nick: string, password: string, phone: string, type: string, email?: string): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({ nick, password, phone, type, email });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
			await hydrateProfile();
		}
	} catch {
		logOut();
	}
};

const requestSignUpJwtToken = async ({
	nick,
	password,
	phone,
	type,
	email,
}: {
	nick: string;
	password: string;
	phone: string;
	type: string;
	email?: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: {
					memberNick: nick,
					memberPassword: password,
					memberPhone: phone,
					memberType: type,
					...(email ? { memberEmail: email } : {}),
				},
			},
			fetchPolicy: 'network-only',
		});

		const { accessToken, refreshToken } = result?.data?.signup;
		if (refreshToken) setRefreshToken(refreshToken);

		return { jwtToken: accessToken };
	} catch (err: any) {
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const updateStorage = ({ jwtToken, refreshToken }: { jwtToken: string; refreshToken?: string }) => {
	setJwtToken(jwtToken);
	if (refreshToken) setRefreshToken(refreshToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: string) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	const current = userVar();
	const sameUser = current._id === claims._id;
	userVar({
		...emptyUser,
		// keep hydrated private fields when the same member's token is refreshed
		memberPhone: sameUser ? current.memberPhone : claims.memberPhone ?? '',
		memberEmail: sameUser ? current.memberEmail : '',
		hasTelegram: sameUser ? current.hasTelegram : false,
		hasGoogle: sameUser ? current.hasGoogle : false,
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType,
		memberNick: claims.memberNick ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined || claims.memberImage === ''
				? '/img/profile/defaultUser.svg'
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? '',
		memberDesc: claims.memberDesc ?? '',
		memberCars: claims.memberCars ?? 0,
		memberRank: claims.memberRank ?? 0,
		memberArticles: claims.memberArticles ?? 0,
		memberPoints: claims.memberPoints ?? 0,
		memberLikes: claims.memberLikes ?? 0,
		memberViews: claims.memberViews ?? 0,
		memberWarnings: claims.memberWarnings ?? 0,
		memberBlocks: claims.memberBlocks ?? 0,
		memberRating: claims.memberRating ?? 0,
		memberReviews: claims.memberReviews ?? 0,
		memberServiceJobs: claims.memberServiceJobs ?? 0,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.href = '/';
};

// Same as logOut but without navigation (used when a stale session is found on load).
export const clearSession = () => {
	deleteStorage();
	deleteUserInfo();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({ ...emptyUser });
};
