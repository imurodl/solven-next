import { render, screen, fireEvent } from '@testing-library/react';
import CarCard from './CarCard';

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({ children }: any) => children,
}));

jest.mock('next/image', () => ({
	__esModule: true,
	default: ({ src, alt }: any) => <img src={typeof src === 'string' ? src : ''} alt={alt} />,
}));

const baseCar: any = {
	_id: 'car-1',
	carTitle: 'Test Coupe',
	carPrice: 25000,
	carImages: ['uploads/car.jpg'],
	carAddress: 'Seoul',
	carLocation: 'KR',
	carFuelType: 'GASOLINE',
	carTransmission: 'AUTO',
	carMileage: undefined,
	carViews: 5,
	carLikes: 3,
	meLiked: [],
};

describe('CarCard', () => {
	it('renders the title, formatted price, and mileage fallback', () => {
		render(<CarCard car={baseCar} likeCarHandler={jest.fn()} />);

		expect(screen.getByText('Test Coupe')).toBeInTheDocument();
		expect(screen.getByText('$25,000')).toBeInTheDocument();
		// carMileage is undefined -> falls back to '50'
		expect(screen.getByText(/50 Miles/)).toBeInTheDocument();
	});

	it('shows the outlined heart when the car is not liked', () => {
		render(<CarCard car={baseCar} likeCarHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
		expect(screen.queryByTestId('FavoriteIcon')).not.toBeInTheDocument();
	});

	it('shows the filled heart when myFavorites is true', () => {
		render(<CarCard car={baseCar} likeCarHandler={jest.fn()} myFavorites />);

		expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
		expect(screen.queryByTestId('FavoriteBorderIcon')).not.toBeInTheDocument();
	});

	it('shows the filled heart when the car is already liked by the user', () => {
		const likedCar = { ...baseCar, meLiked: [{ myFavorite: true }] };
		render(<CarCard car={likedCar} likeCarHandler={jest.fn()} />);

		expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
	});

	it('invokes likeCarHandler with the car id when the heart is clicked', () => {
		const likeCarHandler = jest.fn();
		render(<CarCard car={baseCar} likeCarHandler={likeCarHandler} />);

		const heartButton = screen.getByTestId('FavoriteBorderIcon').closest('button');
		fireEvent.click(heartButton as HTMLButtonElement);

		expect(likeCarHandler).toHaveBeenCalledWith(expect.anything(), 'car-1');
	});

	it('hides the action buttons in recentlyVisited mode', () => {
		render(<CarCard car={baseCar} likeCarHandler={jest.fn()} recentlyVisited />);

		expect(screen.queryByTestId('FavoriteBorderIcon')).not.toBeInTheDocument();
		expect(screen.queryByTestId('RemoveRedEyeIcon')).not.toBeInTheDocument();
	});
});
