export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['carBarter', 'carRent'];

const thisYear = new Date().getFullYear();

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topCarRank: number = 2;

// Years for filtering
export const carYears: number[] = [];
for (let i = 1990; i <= thisYear; i++) {
	carYears.push(i);
}

// Prices range (example values, adjust as needed)
export const carPrices = [
	0, 1000, 3000, 5000, 7000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 70000, 80000, 100000,
	125000, 150000, 175000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000,
];

// Mileage range (in kilometers)
export const carMileage = [
	0, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000, 180000, 200000, 250000,
	300000,
];
