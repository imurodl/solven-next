import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar, socketVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationModal from './common/NotificationModal';
import { IconButton, Badge } from '@mui/material';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
	const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
	const notificationOpen = Boolean(notificationAnchor);
	const isFullWidthPage = router.pathname === '/mypage' || router.pathname.startsWith('/member');

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/car/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		if (socket && user?._id) {
			console.log('TopBasic: Setting up notification listener', {
				socketState: socket.readyState,
				userId: user._id,
			});

			socket.onmessage = (msg) => {
				try {
					const data = JSON.parse(msg.data);
					console.log('TopBasic: Received message:', data);

					if (data.event === 'notification') {
						console.log('TopBasic: Received notification:', data.payload);
						// Update badge state for new notifications
						if (data.payload.status === 'WAIT') {
							setHasUnreadNotifications(true);
						}
					} else if (data.event === 'unreadNotifications') {
						console.log('TopBasic: Received initial unread notifications:', data.payload);
						// If there are any unread notifications, show the badge
						if (data.payload && data.payload.length > 0) {
							setHasUnreadNotifications(true);
						}
					}
				} catch (error) {
					console.error('TopBasic: Error processing message:', error);
				}
			};

			socket.onerror = (error) => {
				console.error('TopBasic: WebSocket error:', error);
			};
		}

		return () => {
			if (socket) {
				console.log('TopBasic: Cleaning up notification listener');
				socket.onmessage = null;
				socket.onerror = null;
			}
		};
	}, [socket, user]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	const handleUnreadCountChange = (count: number) => {
		setHasUnreadNotifications(count > 0);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/car'}>
					<div>{t('Listings')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/help'}>
					<div> Help </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-basic`}>
					<Stack
						className="container"
						style={{
							width: isFullWidthPage ? '100%' : '1300px',
						}}
					>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img
									src="/img/logo/solven.png"
									alt=""
									style={{
										marginLeft: isFullWidthPage ? '80px' : '0',
									}}
								/>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''}>{t('Home')}</div>
							</Link>
							<Link href={'/car'}>
								<div className={router.pathname.startsWith('/car') ? 'active' : ''}>{t('Listings')}</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname.startsWith('/agent') ? 'active' : ''}>{t('Agents')}</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={router.pathname.startsWith('/community') ? 'active' : ''}>{t('Community')}</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div className={router.pathname.startsWith('/mypage') ? 'active' : ''}>{t('My Page')}</div>
								</Link>
							)}
							<Link href={'/help'}>
								<div className={router.pathname.startsWith('/help') ? 'active' : ''}>Help</div>
							</Link>
						</Box>
						<Box
							component={'div'}
							className={'user-box'}
							style={{
								marginRight: isFullWidthPage ? '50px' : '0',
							}}
						>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<PersonOutlineOutlinedIcon />
										<span>Sign in</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<>
										<IconButton onClick={handleNotificationClick} size="small" sx={{ mr: 2 }}>
											<Badge color="error" variant="dot" invisible={!hasUnreadNotifications}>
												<NotificationsOutlinedIcon className={'notification-icon'} />
											</Badge>
										</IconButton>
										<NotificationModal
											anchorEl={notificationAnchor}
											open={notificationOpen}
											onClose={handleNotificationClose}
											onUnreadCountChange={handleUnreadCountChange}
										/>
									</>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
