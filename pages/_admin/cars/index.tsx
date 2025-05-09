import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { PropertyPanelList } from '../../../libs/components/admin/cars/CarList';
import { AllCarsInquiry } from '../../../libs/types/car/car.input';
import { Car } from '../../../libs/types/car/car';
import { CarLocation, CarStatus } from '../../../libs/enums/car.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { CarUpdate } from '../../../libs/types/car/car.update';
import { REMOVE_CAR_BY_ADMIN, UPDATE_CAR_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_CARS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminProperties: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [carsInquiry, setCarsInquiry] = useState<AllCarsInquiry>(initialInquiry);
	const [cars, setCars] = useState<Car[]>([]);
	const [carsTotal, setCarsTotal] = useState<number>(0);
	const [value, setValue] = useState(carsInquiry?.search?.carStatus ? carsInquiry?.search?.carStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateCarByAdmin] = useMutation(UPDATE_CAR_BY_ADMIN);
	const [removeCarByAdmin] = useMutation(REMOVE_CAR_BY_ADMIN);

	const {
		loading: getAllCarsByAdminLoading,
		data: getAllCarsByAdminData,
		error: getAllCarsByAdminError,
		refetch: getAllCarsByAdminRefetch,
	} = useQuery(GET_ALL_CARS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: carsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCars(data?.getAllCarsByAdmin?.list);
			setCarsTotal(data?.getAllCarsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllCarsByAdminRefetch({ input: carsInquiry }).then();
	}, [carsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		carsInquiry.page = newPage + 1;
		await getAllCarsByAdminRefetch({ input: carsInquiry });
		setCarsInquiry({ ...carsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		carsInquiry.limit = parseInt(event.target.value, 10);
		carsInquiry.page = 1;
		getAllCarsByAdminRefetch({ input: carsInquiry });
		setCarsInquiry({ ...carsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setCarsInquiry({ ...carsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setCarsInquiry({ ...carsInquiry, search: { carStatus: CarStatus.ACTIVE } });
				break;
			case 'SOLD':
				setCarsInquiry({ ...carsInquiry, search: { carStatus: CarStatus.SOLD } });
				break;
			case 'DELETE':
				setCarsInquiry({ ...carsInquiry, search: { carStatus: CarStatus.DELETE } });
				break;
			default:
				delete carsInquiry?.search?.carStatus;
				setCarsInquiry({ ...carsInquiry });
				break;
		}
	};

	const removeCarHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeCarByAdmin({
					variables: {
						input: id,
					},
				});
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setCarsInquiry({
					...carsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...carsInquiry.search,
						carLocationList: [newValue as CarLocation],
					},
				});
			} else {
				delete carsInquiry?.search?.carLocationList;
				setCarsInquiry({ ...carsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateCarHandler = async (updateData: CarUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateCarByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllCarsByAdminRefetch({ input: carsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Car List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									className={value === 'SOLD' ? 'li on' : 'li'}
								>
									Sold
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(CarLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<PropertyPanelList
							cars={cars}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateCarHandler={updateCarHandler}
							removeCarHandler={removeCarHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={carsTotal}
							rowsPerPage={carsInquiry?.limit}
							page={carsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminProperties.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminProperties);
