import React from 'react';
import { Stack, Box, Typography, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { format } from 'date-fns';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Register to use and get discounts',
			date: '2024-03-01',
			type: 'promotion',
		},
		{
			no: 2,
			title: "It's absolutely free to upload and trade properties",
			date: '2024-03-31',
			type: 'info',
		},
	];

	const getChipColor = (type: string) => {
		switch (type) {
			case 'promotion':
				return {
					bg: '#FEF3C7',
					color: '#D97706',
				};
			case 'info':
				return {
					bg: '#EFF6FF',
					color: '#3B82F6',
				};
			default:
				return {
					bg: '#F3F4F6',
					color: '#6B7280',
				};
		}
	};

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
					<Typography variant="h4" component="h1" className={'title'} sx={{ mb: 0 }}>
						Notice
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
						Stay updated with our latest announcements and news
					</Typography>
				</Box>

				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Typography variant="subtitle2" sx={{ width: 80 }}>
								Number
							</Typography>
							<Typography variant="subtitle2" sx={{ flex: 1 }}>
								Title
							</Typography>
							<Typography variant="subtitle2" sx={{ width: 100 }}>
								Date
							</Typography>
						</Box>
					</Box>

					<Stack className={'bottom'}>
						{data.map((notice) => (
							<Box
								key={notice.title}
								className={`notice-card ${notice.event ? 'event' : ''}`}
								sx={{
									'&:hover': {
										'& .notice-title': {
											color: '#3B82F6',
										},
									},
								}}
							>
								{notice.event ? (
									<Chip
										icon={<NotificationsActiveIcon />}
										label={notice.type}
										size="small"
										sx={{
											backgroundColor: getChipColor(notice.type).bg,
											color: getChipColor(notice.type).color,
											fontWeight: 600,
											textTransform: 'capitalize',
										}}
									/>
								) : (
									<Typography className={'notice-number'} variant="body2">
										{notice.no.toString().padStart(2, '0')}
									</Typography>
								)}

								<Typography className={'notice-title'} sx={{ transition: 'color 0.2s ease' }}>
									{notice.title}
								</Typography>

								<Typography className={'notice-date'}>{format(new Date(notice.date), 'MMM dd, yyyy')}</Typography>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
