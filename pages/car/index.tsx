import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
	Box,
	Button,
	Menu,
	MenuItem,
	Pagination,
	Stack,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
} from '@mui/material';
import CarCard from '../../libs/components/car/CarCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/car/Filter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CarsInquiry } from '../../libs/types/car/car.input';
import { Car } from '../../libs/types/car/car';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { useTranslation } from 'next-i18next';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CarList: NextPage = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation();
	const device = useDeviceDetect();
	const router = useRouter();

	// Store translated strings
	const [filterSortKey, setFilterSortKey] = useState('newest');

	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterModalOpen, setFilterModalOpen] = useState(false);

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCars(data?.getCars?.list);
			setTotal(data?.getCars?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/

	const likeCarHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likePropertyHandler Mutation
			await likeTargetCar({ variables: { input: id } });

			//execute getPropertiesRefetch
			await getCarsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/car?input=${JSON.stringify(searchFilter)}`, `/car?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortKey('newest');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortKey('oldest');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'carPrice', direction: Direction.ASC });
				setFilterSortKey('lowestPrice');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'carPrice', direction: Direction.DESC });
				setFilterSortKey('highestPrice');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={`header-basic`}>
						<Stack className={'container'}>
							<strong>{t('carSearch')}</strong>
							<span>
								<Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
									{t('breadcrumb.home')}
								</Link>{' '}
								{t('breadcrumb.separator')} {t('breadcrumb.listings')}
							</span>
						</Stack>
					</Stack>
					<Box component={'div'} className={'actions'}>
						<Button className="filter-btn" onClick={() => setFilterModalOpen(true)} startIcon={<FilterListIcon />}>
							Filter
						</Button>
						<div className="sort-box">
							<span>{t('sortBy')}</span>
							<Button
								onClick={sortingClickHandler}
								endIcon={sortingOpen ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
								style={{
									border: sortingOpen ? '2px solid #1e40af' : '2px solid #e9e9e9',
								}}
							>
								{t(filterSortKey)}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									data-selected={filterSortKey === 'newest'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('newest')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'old'}
									disableRipple
									data-selected={filterSortKey === 'oldest'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('oldest')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									data-selected={filterSortKey === 'lowestPrice'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('lowestPrice')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									data-selected={filterSortKey === 'highestPrice'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('highestPrice')}
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'property-list'}>
							{getCarsLoading ? (
								<Stack className={'loading-box'}>
									{[1, 2, 3, 4].map((item) => (
										<Stack key={item} className={'loading-card'} />
									))}
								</Stack>
							) : (
								<>
									<Stack className={'card-list'}>
										{cars?.map((car: any) => (
											<CarCard key={car._id} car={car} likeCarHandler={likeCarHandler} />
										))}
									</Stack>
									{total > 0 && (
										<Stack className={'pagination'}>
											<Pagination
												count={Math.ceil(total / 12)}
												page={currentPage}
												onChange={handlePaginationChange}
												color="primary"
												shape="rounded"
											/>
										</Stack>
									)}
								</>
							)}
						</Stack>
					</Stack>
				</div>

				{/* Filter Modal */}
				<Dialog fullScreen open={filterModalOpen} onClose={() => setFilterModalOpen(false)} className="filter-modal">
					<DialogTitle className="modal-header">
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="h6">Filter</Typography>
							<IconButton edge="end" onClick={() => setFilterModalOpen(false)}>
								<CloseIcon />
							</IconButton>
						</Stack>
					</DialogTitle>
					<DialogContent className="modal-content">
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</DialogContent>
					<DialogActions className="modal-footer">
						<Button onClick={() => setFilterModalOpen(false)} variant="contained" fullWidth>
							{t('showResults')} ({total})
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={`header-basic`}>
						<Stack className={'container'}>
							<strong>{t('carSearch')}</strong>
							<span>
								<Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
									{t('breadcrumb.home')}
								</Link>{' '}
								{t('breadcrumb.separator')} {t('breadcrumb.listings')}
							</span>
						</Stack>
					</Stack>
					<Box component={'div'} className={'right'}>
						<span>{t('sortBy')}</span>
						<div>
							<Button
								onClick={sortingClickHandler}
								endIcon={sortingOpen ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
								style={{
									border: sortingOpen ? '2px solid #1e40af' : '2px solid #e9e9e9',
								}}
							>
								{t(filterSortKey)}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									data-selected={filterSortKey === 'newest'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('newest')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'old'}
									disableRipple
									data-selected={filterSortKey === 'oldest'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('oldest')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									data-selected={filterSortKey === 'lowestPrice'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('lowestPrice')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									data-selected={filterSortKey === 'highestPrice'}
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('highestPrice')}
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config">
							<Stack className={'list-config'}>
								{cars?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Cars found!</p>
									</div>
								) : (
									cars.map((car: Car) => {
										return <CarCard car={car} likeCarHandler={likeCarHandler} key={car?._id} />;
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{cars.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{cars.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} car{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

CarList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			locationList: [],
			typeList: [],
			fuelTypeList: [],
			transmissionList: [],
			colorList: [],
			brandList: [],
			modelList: [],
			carOptions: [],
			carListingOptions: [],
			pricesRange: {
				start: 0,
				end: 1000000, // adjust if needed
			},
			mileageRange: {
				start: 0,
				end: 300000, // adjust if needed
			},
			yearRange: {
				start: 1990,
				end: new Date().getFullYear(),
			},
			text: '',
		},
	},
};

export default withLayoutBasic(CarList);
