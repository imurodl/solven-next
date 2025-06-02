import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { List, Stack, Typography, Box } from '@mui/material';
import { User, UserCircleGear, ChatsCircle, Headset, SignOut } from 'phosphor-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';

const AdminMenuList = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [mobileLayout, setMobileLayout] = useState(false);
	const user = useReactiveVar(userVar);
	const pathname = router.asPath;

	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) {
				logOut();
				router.push('/').then();
			}
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	const menu_sections = [
		{
			title: 'MANAGE USERS',
			items: [
				{
					title: 'User List',
					icon: <User size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/users',
				},
			],
		},
		{
			title: 'MANAGE LISTINGS',
			items: [
				{
					title: 'Car List',
					icon: <UserCircleGear size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/cars',
				},
				{
					title: 'Car Brands',
					icon: <UserCircleGear size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/cars/brands',
				},
			],
		},
		{
			title: 'COMMUNITY',
			items: [
				{
					title: 'Articles',
					icon: <ChatsCircle size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/community',
				},
			],
		},
		{
			title: 'HELP CENTER',
			items: [
				{
					title: 'FAQ',
					icon: <Headset size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/cs/faq',
				},
				{
					title: 'Terms',
					icon: <Headset size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/cs/terms',
				},
				{
					title: 'Notice',
					icon: <Headset size={20} weight="fill" className="menu-icon" />,
					url: '/_admin/cs/notice',
				},
			],
		},
	];

	if (device === 'mobile') {
		return <div>ADMIN MENU</div>;
	}

	return (
		<Stack className="admin-menu">
			{/* Profile Section */}
			<Stack className="profile">
				<Box component="div" className="profile-img">
					<img
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt="member-photo"
					/>
				</Box>
				<Stack className="user-info">
					<Typography className="user-name">{user?.memberNick || 'Admin'}</Typography>
					<Box component="div" className="user-phone">
						<img src="/img/icons/call.svg" alt="icon" />
						<Typography className="p-number">{user?.memberPhone || '01074864433'}</Typography>
					</Box>
					<Typography className="view-list">ADMIN</Typography>
				</Stack>
			</Stack>

			{/* Menu Sections */}
			<Stack className="sections">
				{menu_sections.map((section, index) => (
					<Stack key={index} className="section">
						<Typography className="title" variant="h5">
							{section.title}
						</Typography>
						<List className="sub-section">
							{section.items.map((item, i) => (
								<Link key={i} href={item.url} shallow={true} replace={true}>
									<div className={`flex-box ${pathname === item.url ? 'focus' : ''}`}>
										{item.icon}
										<Typography className="sub-title" variant="subtitle1" component="p">
											{item.title}
										</Typography>
									</div>
								</Link>
							))}
						</List>
					</Stack>
				))}

				{/* Logout Section */}
				<Stack className="section">
					<Typography className="title" variant="h5">
						MANAGE ACCOUNT
					</Typography>
					<List className="sub-section">
						<div className="flex-box" onClick={logoutHandler}>
							<SignOut size={20} weight="fill" className="menu-icon" />
							<Typography className="sub-title" variant="subtitle1" component="p">
								Logout
							</Typography>
						</div>
					</List>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withRouter(AdminMenuList);
function setLoading(arg0: boolean) {
	throw new Error('Function not implemented.');
}
