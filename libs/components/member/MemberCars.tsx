import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CarCard } from '../mypage/CarCard';
import { Car } from '../../types/car/car';
import { CarsInquiry } from '../../types/car/car.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';

const MyCars: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>({ ...initialInput });
	const [agentCars, setAgentCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setAgentCars(data?.getCars?.list);
			setTotal(data?.getCars?.metaCounter[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		getCarsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>SOLVEN CARS MOBILE</div>;
	} else {
		return (
			<div id="member-properties-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Car Listings</Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{agentCars?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentCars?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Car found!</p>
							</div>
						)}
						{agentCars?.map((car: Car) => {
							return <CarCard car={car} memberPage={true} key={car?._id} />;
						})}

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
			memberId: '',
		},
	},
};

export default MyCars;
