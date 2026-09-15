import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Box, Button, Chip, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminTable, { Column } from '../../../libs/components/admin/shared/AdminTable';
import { GET_ALL_SERVICE_JOBS_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_SERVICE_JOB_BY_ADMIN, UPDATE_SERVICE_JOB_BY_ADMIN } from '../../../apollo/admin/mutation';
import { ServiceJob } from '../../../libs/types/service-job/service-job';
import { ServiceJobStatus } from '../../../libs/enums/service-job.enum';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin } from '../../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../../libs/config';

const AdminService: NextPage = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [status, setStatus] = useState<string>('');
	const { data, loading, refetch } = useQuery(GET_ALL_SERVICE_JOBS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: { page: page + 1, limit: rowsPerPage, search: status ? { serviceStatus: status } : {} } },
	});
	const [updateJob] = useMutation(UPDATE_SERVICE_JOB_BY_ADMIN);
	const [removeJob] = useMutation(REMOVE_SERVICE_JOB_BY_ADMIN);
	const jobs: ServiceJob[] = data?.getAllServiceJobsByAdmin?.list ?? [];
	const total: number = data?.getAllServiceJobsByAdmin?.metaCounter?.[0]?.total ?? 0;

	const hide = async (j: ServiceJob) => {
		try {
			if (!(await sweetConfirmAlert('Mark this service job as deleted?'))) return;
			await updateJob({ variables: { input: { _id: j._id, serviceStatus: ServiceJobStatus.DELETE } } });
			await refetch();
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};
	const purge = async (j: ServiceJob) => {
		try {
			if (!(await sweetConfirmAlert('Permanently remove this deleted job?'))) return;
			await removeJob({ variables: { serviceJobId: j._id } });
			await refetch();
		} catch (err) {
			await sweetErrorHandlingForAdmin(err);
		}
	};

	const columns: Column<ServiceJob>[] = [
		{
			key: 'job',
			label: 'Job',
			render: (j) => (
				<Stack direction="row" spacing={1} alignItems="center">
					{j.serviceImages?.[0] && <img src={`${REACT_APP_API_URL}/${j.serviceImages[0]}`} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
					<span>{j.serviceTitle}</span>
				</Stack>
			),
		},
		{ key: 'type', label: 'Type', render: (j) => j.serviceType },
		{ key: 'car', label: 'Car', render: (j) => `${j.carBrand} ${j.carModel}` },
		{ key: 'mechanic', label: 'Mechanic', render: (j) => j.memberData?.memberNick ?? '-' },
		{ key: 'price', label: 'From', render: (j) => `$${j.servicePrice.toLocaleString()}` },
		{ key: 'loc', label: 'Location', render: (j) => j.serviceLocation },
		{ key: 'stats', label: 'Views / Likes', render: (j) => `${j.serviceViews} / ${j.serviceLikes}` },
		{ key: 'status', label: 'Status', render: (j) => <Chip size="small" label={j.serviceStatus} color={j.serviceStatus === 'ACTIVE' ? 'success' : 'default'} /> },
		{
			key: 'actions',
			label: '',
			render: (j) =>
				j.serviceStatus === ServiceJobStatus.ACTIVE ? (
					<Button size="small" color="error" variant="outlined" onClick={() => hide(j)}>
						Delete
					</Button>
				) : (
					<Button size="small" color="error" variant="contained" onClick={() => purge(j)}>
						Purge
					</Button>
				),
		},
	];

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Service Jobs</Typography>
				<Select size="small" value={status} displayEmpty onChange={(e) => { setStatus(String(e.target.value)); setPage(0); }} sx={{ minWidth: 160 }}>
					<MenuItem value="">All</MenuItem>
					<MenuItem value={ServiceJobStatus.ACTIVE}>Active</MenuItem>
					<MenuItem value={ServiceJobStatus.DELETE}>Deleted</MenuItem>
				</Select>
			</Box>
			<AdminTable columns={columns} rows={jobs} total={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }} loading={loading} rowKey={(j) => j._id} emptyText="No service jobs" />
		</Box>
	);
};

export default withAdminLayout(AdminService);
