import {
	getJwtToken,
	setJwtToken,
	getRefreshToken,
	setRefreshToken,
	isTokenExpired,
	logIn,
	signUp,
	updateUserInfo,
} from './index';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { sweetMixinErrorAlert } from '../sweetAlert';

jest.mock('../../apollo/client', () => ({
	initializeApollo: jest.fn(),
}));

jest.mock('../../apollo/store', () => ({
	userVar: jest.fn(),
}));

jest.mock('../sweetAlert', () => ({
	sweetMixinErrorAlert: jest.fn().mockResolvedValue(undefined),
}));

const base64Url = (obj: any) =>
	Buffer.from(JSON.stringify(obj))
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

const makeJwt = (payload: Record<string, any>) => `${base64Url({ alg: 'HS256', typ: 'JWT' })}.${base64Url(payload)}.signature`;

const mockedInitializeApollo = initializeApollo as jest.Mock;
const mockedUserVar = userVar as unknown as jest.Mock;
const mockedErrorAlert = sweetMixinErrorAlert as jest.Mock;

// logOut redirects via window.location.href, which jsdom cannot navigate; stub it.
const originalLocation = window.location;

beforeAll(() => {
	delete (window as any).location;
	(window as any).location = { href: '' } as any;
});

afterAll(() => {
	(window as any).location = originalLocation;
});

beforeEach(() => {
	jest.clearAllMocks();
	localStorage.clear();
});

describe('token storage helpers', () => {
	it('returns stored access and refresh tokens', () => {
		setJwtToken('access-123');
		setRefreshToken('refresh-456');

		expect(getJwtToken()).toBe('access-123');
		expect(getRefreshToken()).toBe('refresh-456');
		expect(localStorage.getItem('accessToken')).toBe('access-123');
		expect(localStorage.getItem('refreshToken')).toBe('refresh-456');
	});

	it('returns an empty string when no token is stored', () => {
		expect(getJwtToken()).toBe('');
		expect(getRefreshToken()).toBe('');
	});
});

describe('isTokenExpired', () => {
	it('returns false for a token whose exp is in the future', () => {
		const future = Math.floor(Date.now() / 1000) + 3600;
		expect(isTokenExpired(makeJwt({ exp: future }))).toBe(false);
	});

	it('returns true for a token whose exp is in the past', () => {
		const past = Math.floor(Date.now() / 1000) - 3600;
		expect(isTokenExpired(makeJwt({ exp: past }))).toBe(true);
	});

	it('returns true for an empty token', () => {
		expect(isTokenExpired('')).toBe(true);
	});

	it('returns true for a malformed token', () => {
		expect(isTokenExpired('not-a-real-jwt')).toBe(true);
	});

	it('returns true for a token without an exp claim', () => {
		expect(isTokenExpired(makeJwt({ _id: 'abc' }))).toBe(true);
	});
});

describe('updateUserInfo', () => {
	it('decodes the token and populates userVar', () => {
		const token = makeJwt({ _id: 'member-1', memberNick: 'maxdriver', memberImage: 'uploads/me.jpg' });

		updateUserInfo(token);

		expect(mockedUserVar).toHaveBeenCalledTimes(1);
		const claims = mockedUserVar.mock.calls[0][0];
		expect(claims._id).toBe('member-1');
		expect(claims.memberNick).toBe('maxdriver');
		expect(claims.memberImage).toBe('uploads/me.jpg');
	});

	it('falls back to the default avatar when memberImage is missing', () => {
		updateUserInfo(makeJwt({ _id: 'member-2' }));

		const claims = mockedUserVar.mock.calls[0][0];
		expect(claims.memberImage).toBe('/img/profile/defaultUser.svg');
	});

	it('returns false and does not touch userVar for an empty token', () => {
		expect(updateUserInfo('')).toBe(false);
		expect(mockedUserVar).not.toHaveBeenCalled();
	});
});

describe('logIn', () => {
	it('stores tokens and updates user info on success', async () => {
		const accessToken = makeJwt({ _id: 'member-1', memberNick: 'maxdriver' });
		const mutate = jest.fn().mockResolvedValue({ data: { login: { accessToken, refreshToken: 'refresh-1' } } });
		mockedInitializeApollo.mockReturnValue({ mutate });

		await logIn('maxdriver', 'secret');

		expect(localStorage.getItem('accessToken')).toBe(accessToken);
		expect(localStorage.getItem('refreshToken')).toBe('refresh-1');
		expect(localStorage.getItem('login')).not.toBeNull();
		expect(mockedUserVar).toHaveBeenCalledTimes(1);
	});

	it('surfaces an error alert on a wrong-password failure', async () => {
		const mutate = jest.fn().mockRejectedValue({
			graphQLErrors: [{ message: 'Definer: login and password do not match' }],
		});
		mockedInitializeApollo.mockReturnValue({ mutate });

		await logIn('maxdriver', 'wrong');

		expect(mockedErrorAlert).toHaveBeenCalledWith('Please check your password again');
		expect(localStorage.getItem('accessToken')).toBeNull();
	});
});

describe('signUp', () => {
	it('stores tokens and updates user info on success', async () => {
		const accessToken = makeJwt({ _id: 'member-9', memberNick: 'newbie' });
		const mutate = jest.fn().mockResolvedValue({ data: { signup: { accessToken, refreshToken: 'refresh-9' } } });
		mockedInitializeApollo.mockReturnValue({ mutate });

		await signUp('newbie', 'secret', '01000000000', 'USER');

		expect(localStorage.getItem('accessToken')).toBe(accessToken);
		expect(localStorage.getItem('refreshToken')).toBe('refresh-9');
		expect(mockedUserVar).toHaveBeenCalledTimes(1);
	});
});
