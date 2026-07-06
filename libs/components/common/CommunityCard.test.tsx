import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import CommunityCard from './CommunityCard';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({ src, alt }: any) => <img src={typeof src === 'string' ? src : ''} alt={alt} />,
}));

const push = jest.fn();

const baseArticle: any = {
	_id: 'art-1',
	articleTitle: 'Hello World',
	articleImage: 'uploads/a.jpg',
	articleCategory: 'FREE',
	articleViews: 5,
	articleLikes: 3,
	createdAt: '2024-01-01T00:00:00Z',
	memberData: { memberNick: 'author1', _id: 'mem-1' },
	meLiked: [],
};

describe('CommunityCard', () => {
	beforeEach(() => {
		push.mockClear();
		(useRouter as jest.Mock).mockReturnValue({ push });
	});

	it('renders the title, author nick, and like count', () => {
		render(<CommunityCard boardArticle={baseArticle} likeArticleHandler={jest.fn()} />);

		expect(screen.getByText('Hello World')).toBeInTheDocument();
		expect(screen.getByText('author1')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('shows the outlined heart when the article is not liked', () => {
		render(<CommunityCard boardArticle={baseArticle} likeArticleHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
		expect(screen.queryByTestId('FavoriteIcon')).not.toBeInTheDocument();
	});

	it('shows the filled heart when the article is already liked', () => {
		const liked = { ...baseArticle, meLiked: [{ myFavorite: true }] };
		render(<CommunityCard boardArticle={liked} likeArticleHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
	});

	it('invokes likeArticleHandler with the article id when the heart is clicked', () => {
		const likeArticleHandler = jest.fn();
		render(<CommunityCard boardArticle={baseArticle} likeArticleHandler={likeArticleHandler} />);

		fireEvent.click(screen.getByTestId('FavoriteBorderIcon').closest('button') as HTMLButtonElement);

		expect(likeArticleHandler).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'art-1');
	});

	it('renders the title as a crawlable link to the article detail page', () => {
		render(<CommunityCard boardArticle={baseArticle} likeArticleHandler={jest.fn()} />);

		const link = screen.getByText('Hello World').closest('a') as HTMLAnchorElement;
		expect(link).toBeInTheDocument();
		const href = link.getAttribute('href') ?? '';
		expect(href).toContain('/community/detail');
		expect(href).toContain('id=art-1');
	});

	it('navigates to the article detail page when the card body is clicked', () => {
		render(<CommunityCard boardArticle={baseArticle} likeArticleHandler={jest.fn()} />);

		// Clicking a non-link area of the card still uses the wrapper router.push.
		fireEvent.click(screen.getByAltText('Hello World'));

		expect(push).toHaveBeenCalledWith(
			expect.objectContaining({
				pathname: '/community/detail',
				query: { articleCategory: 'FREE', id: 'art-1' },
			}),
			undefined,
			{ shallow: true },
		);
	});
});
