import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarCard } from './CarCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Car } from '../../types/car/car';
import { AgentCarsInquiry } from '../../types/car/car.input';
import { T } from '../../types/common';
import { CarStatus } from '../../enums/car.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_AGENT_CARS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyCars: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentCarsInquiry>(initialInput);
	const [agentCars, setAgentCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateCar] = useMutation(UPDATE_CAR);

	const {
		loading: getAgentCarsLoading,
		data: getAgentCarsData,
		error: getAgentCarsError,
		refetch: getAgentCarsRefetch,
	} = useQuery(GET_AGENT_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setAgentCars(data?.getAgentCars?.list);
			setTotal(data?.getAgentCars?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: CarStatus) => {
		setSearchFilter({ ...searchFilter, search: { carStatus: value } });
	};

	const deleteCarHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this listing?')) {
				await updateCar({
					variables: {
						input: {
							_id: id,
							carStatus: 'DELETE',
						},
					},
				});
			}
			await getAgentCarsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateCarHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateCar({
					variables: {
						input: {
							_id: id,
							carStatus: status,
						},
					},
				});
			}
			await getAgentCarsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>NESTAR CAR LISTINGS MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Cars</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(CarStatus.ACTIVE)}
							className={searchFilter.search.carStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(CarStatus.SOLD)}
							className={searchFilter.search.carStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.carStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography>}
						</Stack>

						{agentCars?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Car found!</p>
							</div>
						) : (
							agentCars.map((car: Car) => {
								return <CarCard car={car} deleteCarHandler={deleteCarHandler} updateCarHandler={updateCarHandler} />;
							})
						)}

						{agentCars.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} cars available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			carStatus: 'ACTIVE',
		},
	},
};

export default MyCars;
