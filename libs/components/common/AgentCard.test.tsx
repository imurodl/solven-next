import { render, screen, fireEvent } from '@testing-library/react';
import AgentCard from './AgentCard';

jest.mock('next/link', () => ({ __esModule: true, default: ({ children }: any) => children }));
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({ src, alt }: any) => <img src={typeof src === 'string' ? src : ''} alt={alt} />,
}));

const baseAgent: any = {
	_id: 'ag-1',
	memberNick: 'AgentSmith',
	memberPhone: '010-1234',
	memberCars: 3,
	memberFollowers: 10,
	memberFollowings: 5,
	memberViews: 20,
	memberLikes: 7,
	memberDesc: 'Top seller',
	memberImage: 'uploads/a.jpg',
	meLiked: [],
};

describe('AgentCard', () => {
	it('renders the agent nick, phone, and description', () => {
		render(<AgentCard agent={baseAgent} likeMemberHandler={jest.fn()} />);

		expect(screen.getByText('AgentSmith')).toBeInTheDocument();
		expect(screen.getByText('010-1234')).toBeInTheDocument();
		expect(screen.getByText('Top seller')).toBeInTheDocument();
	});

	it('falls back to placeholder text when contact and description are missing', () => {
		const bare = { ...baseAgent, memberPhone: undefined, memberDesc: undefined };
		render(<AgentCard agent={bare} likeMemberHandler={jest.fn()} />);

		expect(screen.getByText('No contact info')).toBeInTheDocument();
		expect(screen.getByText('No description available')).toBeInTheDocument();
	});

	it('shows the outlined heart when the agent is not liked', () => {
		render(<AgentCard agent={baseAgent} likeMemberHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
		expect(screen.queryByTestId('FavoriteIcon')).not.toBeInTheDocument();
	});

	it('shows the filled heart when the agent is already liked', () => {
		const liked = { ...baseAgent, meLiked: [{ myFavorite: true }] };
		render(<AgentCard agent={liked} likeMemberHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
	});

	it('invokes likeMemberHandler with the agent id when the heart is clicked', () => {
		const likeMemberHandler = jest.fn();
		render(<AgentCard agent={baseAgent} likeMemberHandler={likeMemberHandler} />);

		fireEvent.click(screen.getByTestId('FavoriteBorderIcon'));

		expect(likeMemberHandler).toHaveBeenCalledWith(expect.anything(), 'ag-1');
	});
});
