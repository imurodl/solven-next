export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['carBarter', 'carRent'];

const thisYear = new Date().getFullYear();

export const propertyYears: any = [];

for (let i = 1990; i <= thisYear; i++) {
	propertyYears.push(String(i));
}

export const propertySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

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
export const carPrices: number[] = [0, 1000, 3000, 5000, 10000, 20000, 30000, 50000, 100000];

// Mileage range (in kilometers)
export const carMileage: number[] = [0, 10000, 30000, 50000, 70000, 100000, 150000, 200000];