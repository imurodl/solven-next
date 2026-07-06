import {
	formatterStr,
	likeTargetPropertyHandler,
	likeTargetBoardArticleHandler,
	likeTargetMemberHandler,
	a11yClickProps,
} from './utils';
import { sweetMixinErrorAlert } from './sweetAlert';

jest.mock('./sweetAlert', () => ({
	sweetMixinErrorAlert: jest.fn().mockResolvedValue(undefined),
}));

describe('formatterStr', () => {
	it('formats a number with thousands separators', () => {
		expect(formatterStr(56800)).toBe('56,800');
	});

	it('formats large numbers', () => {
		expect(formatterStr(1500000)).toBe('1,500,000');
	});

	it('returns an empty string for zero', () => {
		expect(formatterStr(0)).toBe('');
	});

	it('returns an empty string for undefined', () => {
		expect(formatterStr(undefined)).toBe('');
	});
});

describe('like target handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<[string, (mutation: any, id: string) => Promise<void>]> = [
		['likeTargetPropertyHandler', likeTargetPropertyHandler],
		['likeTargetBoardArticleHandler', likeTargetBoardArticleHandler],
		['likeTargetMemberHandler', likeTargetMemberHandler],
	];

	it.each(cases)('%s calls the mutation with the id as input', async (_name, handler) => {
		const mutation = jest.fn().mockResolvedValue({});

		await handler(mutation, 'target-123');

		expect(mutation).toHaveBeenCalledWith({ variables: { input: 'target-123' } });
		expect(sweetMixinErrorAlert).not.toHaveBeenCalled();
	});

	it.each(cases)('%s surfaces an error alert and does not throw when the mutation fails', async (_name, handler) => {
		const mutation = jest.fn().mockRejectedValue(new Error('boom'));

		await expect(handler(mutation, 'target-123')).resolves.toBeUndefined();
		expect(sweetMixinErrorAlert).toHaveBeenCalledWith('boom');
	});
});

describe('a11yClickProps', () => {
	it('exposes button role and keyboard focusability', () => {
		const props = a11yClickProps(jest.fn());

		expect(props.role).toBe('button');
		expect(props.tabIndex).toBe(0);
		expect(typeof props.onKeyDown).toBe('function');
	});

	it('activates the handler on Enter', () => {
		const onActivate = jest.fn();
		const event = { key: 'Enter', preventDefault: jest.fn() };

		a11yClickProps(onActivate).onKeyDown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onActivate).toHaveBeenCalledWith(event);
	});

	it('activates the handler on Space', () => {
		const onActivate = jest.fn();
		const event = { key: ' ', preventDefault: jest.fn() };

		a11yClickProps(onActivate).onKeyDown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onActivate).toHaveBeenCalledTimes(1);
	});

	it('ignores other keys', () => {
		const onActivate = jest.fn();
		const event = { key: 'a', preventDefault: jest.fn() };

		a11yClickProps(onActivate).onKeyDown(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(onActivate).not.toHaveBeenCalled();
	});
});
