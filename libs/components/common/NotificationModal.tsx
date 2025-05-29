import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../../apollo/store';
import ScrollableFeed from 'react-scrollable-feed';

interface Notification {
	id: string;
	title: string;
	desc?: string;
	type: string;
	status: string;
	createdAt: Date;
}

const NotificationModal = ({
	anchorEl,
	open,
	onClose,
	onUnreadCountChange,
}: {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	onUnreadCountChange?: (count: number) => void;
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const socket = useReactiveVar(socketVar);
	const user = useReactiveVar(userVar);

	console.log('NotificationModal: Rendering with state:', {
		notificationsCount: notifications.length,
		unreadCount,
		isOpen: open,
		hasAnchorEl: !!anchorEl,
		socketReady: socket?.readyState === WebSocket.OPEN,
		userId: user?._id,
	});

	// Update parent component with unread count
	useEffect(() => {
		onUnreadCountChange?.(unreadCount);
	}, [unreadCount, onUnreadCountChange]);

	// Fetch existing notifications when modal opens
	useEffect(() => {
		if (open && user?._id) {
			console.log('NotificationModal: Modal opened, fetching notifications');

			// Send a message to request notifications
			if (socket?.readyState === WebSocket.OPEN) {
				const requestMessage = {
					event: 'get_notifications',
					payload: {
						userId: user._id,
					},
				};
				console.log('NotificationModal: Requesting notifications:', requestMessage);
				socket.send(JSON.stringify(requestMessage));
			} else {
				console.error('NotificationModal: Socket not ready to request notifications');
			}
		}
	}, [open, user?._id]);

	useEffect(() => {
		console.log('NotificationModal: Socket state:', {
			socketExists: !!socket,
			userExists: !!user?._id,
			readyState: socket?.readyState,
			connectionState:
				socket?.readyState === WebSocket.OPEN
					? 'OPEN'
					: socket?.readyState === WebSocket.CONNECTING
					? 'CONNECTING'
					: socket?.readyState === WebSocket.CLOSED
					? 'CLOSED'
					: socket?.readyState === WebSocket.CLOSING
					? 'CLOSING'
					: 'UNKNOWN',
		});

		if (socket && user?._id) {
			socket.onmessage = (msg) => {
				try {
					const data = JSON.parse(msg.data);
					console.log('Received websocket message:', data);

					if (data.event === 'notification') {
						// Handle the notification payload from the backend
						const notification = data.payload;
						setNotifications((prev) => {
							// Check for duplicates
							const isDuplicate = prev.some((n) => n.id === notification.id);
							if (isDuplicate) return prev;

							// Add new notification at the beginning
							const newNotifications = [notification, ...prev];

							// Update unread count
							const newUnreadCount = newNotifications.filter((n) => n.status === 'WAIT').length;
							setUnreadCount(newUnreadCount);

							return newNotifications;
						});
					} else if (data.event === 'notifications_list') {
						console.log('NotificationModal: Received notifications list:', data.data);
						setNotifications(data.data);

						// Update unread count
						const newUnreadCount = data.data.filter((n: Notification) => n.status === 'WAIT').length;
						setUnreadCount(newUnreadCount);
					} else if (data.event === 'unreadNotifications') {
						console.log('NotificationModal: Received initial unread notifications:', data.payload);
						// Add unread notifications to the list
						setNotifications((prev) => {
							const newNotifications = [...data.payload];
							// Add existing notifications that aren't in the unread list
							prev.forEach((notification) => {
								if (!newNotifications.some((n) => n.id === notification.id)) {
									newNotifications.push(notification);
								}
							});

							// Update unread count
							const newUnreadCount = newNotifications.filter((n) => n.status === 'WAIT').length;
							setUnreadCount(newUnreadCount);

							return newNotifications;
						});
					}
				} catch (error) {
					console.error('Error processing notification:', error);
				}
			};

			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};
		}

		return () => {
			if (socket) {
				socket.onmessage = null;
				socket.onerror = null;
			}
		};
	}, [socket, user]);

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'LIKE':
				return '❤️';
			case 'COMMENT':
				return '💬';
			default:
				return '📢';
		}
	};

	const handleNotificationClick = async (notification: Notification) => {
		if (notification.status === 'WAIT') {
			try {
				// Update notification status locally
				setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, status: 'READ' } : n)));

				// Update unread count
				setUnreadCount((prev) => Math.max(0, prev - 1));

				// Send read status to server
				if (socket?.readyState === WebSocket.OPEN) {
					socket.send(
						JSON.stringify({
							event: 'mark_notification_read',
							payload: {
								notificationId: notification.id,
							},
						}),
					);
				}
			} catch (error) {
				console.error('Error marking notification as read:', error);
			}
		}

		// TODO: Handle navigation based on notification type
		onClose();
	};

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: '380px',
					maxHeight: '500px',
					borderRadius: '12px',
					boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
					'&::-webkit-scrollbar': {
						width: '4px',
					},
					'&::-webkit-scrollbar-track': {
						background: '#f1f1f1',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#888',
						borderRadius: '4px',
					},
				},
			}}
		>
			<Box
				sx={{
					p: 2,
					borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					Notifications
				</Typography>
				{unreadCount > 0 && (
					<Typography variant="caption" color="primary">
						{unreadCount} unread
					</Typography>
				)}
			</Box>

			<ScrollableFeed>
				<Stack sx={{ maxHeight: '400px', overflow: 'auto' }}>
					{notifications.length === 0 ? (
						<Box sx={{ p: 3, textAlign: 'center' }}>
							<Typography color="text.secondary">No notifications yet</Typography>
						</Box>
					) : (
						notifications.map((notification) => (
							<MenuItem
								key={notification.id}
								onClick={() => handleNotificationClick(notification)}
								sx={{
									py: 2,
									px: 3,
									borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
									backgroundColor: notification.status === 'WAIT' ? 'rgba(64, 95, 242, 0.05)' : 'transparent',
									'&:hover': {
										backgroundColor: 'rgba(64, 95, 242, 0.1)',
									},
								}}
							>
								<Stack spacing={1} sx={{ width: '100%' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography variant="body2" sx={{ fontSize: '20px' }}>
											{getNotificationIcon(notification.type)}
										</Typography>
										<Stack>
											<Typography variant="body1" sx={{ fontWeight: 500 }}>
												{notification.title}
											</Typography>
											{notification.desc && (
												<Typography variant="body2" color="text.secondary">
													{notification.desc}
												</Typography>
											)}
										</Stack>
									</Box>
									<Typography variant="caption" color="text.secondary">
										{format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
									</Typography>
								</Stack>
							</MenuItem>
						))
					)}
				</Stack>
			</ScrollableFeed>
		</Menu>
	);
};

export default NotificationModal;
