import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { onError } from '@apollo/client/link/error';
import { getJwtToken, isTokenExpired, refreshTokens } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders(): Record<string, string> {
	const headers: Record<string, string> = {};
	const token = getJwtToken();
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		const token = getJwtToken();
		if (!token) return true;
		return !isTokenExpired(token);
	},
	fetchAccessToken: () => {
		return refreshTokens() as Promise<any>;
	},
	handleFetch: () => {},
	handleError: (err: Error) => {
		console.error('Token refresh error:', err);
	},
});

// Real-time socket for chat/notifications (raw WS to the Nest gateway, not a
// GraphQL subscription). Published to socketVar for Top/Chat/NotificationModal.
function connectWebSocket() {
	if (typeof window === 'undefined') return;
	const url = process.env.REACT_APP_API_WS ?? 'ws://127.0.0.1:4007';
	const socket = new WebSocket(`${url}?token=${getJwtToken()}`);
	socketVar(socket);
}

function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			return forward(operation);
		});

		const link = createUploadLink({
			uri: process.env.REACT_APP_API_GRAPHQL_URL,
		});

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message }) => {
					if (!message.includes('input')) sweetErrorAlert(message);
				});
			}
			if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
				refreshTokens();
			}
		});

		return from([errorLink, tokenRefreshLink, authLink.concat(link)]);
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) {
		apolloClient = _apolloClient;
		connectWebSocket();
	}

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
