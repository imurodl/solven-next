import React, { useEffect, useRef, useState } from 'react';
import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { GET_CONVERSATION, GET_MY_CONVERSATIONS } from '../../../apollo/user/query';
import { REPLY_MESSAGE } from '../../../apollo/user/mutation';
import { socketVar, unreadMessagesVar, userVar } from '../../../apollo/store';
import { Conversation, Message } from '../../types/message/message';
import { ConversationKind } from '../../enums/message.enum';
import UserAvatar from '../common/UserAvatar';
import { REACT_APP_API_URL } from '../../config';
import { timeAgo } from '../../utils/format';
import { sweetErrorHandling } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// Inbox: conversation list (left) + thread (right). On mobile the two panes
// stack and a back button toggles between them.
const MyMessages = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const [active, setActive] = useState<string | null>(typeof router.query.conversation === 'string' ? router.query.conversation : null);
	const [text, setText] = useState('');
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data: convData, refetch: refetchConversations } = useQuery(GET_MY_CONVERSATIONS, { fetchPolicy: 'network-only', pollInterval: 30000 });
	const {
		data: threadData,
		refetch: refetchThread,
		loading: threadLoading,
	} = useQuery(GET_CONVERSATION, { skip: !active, variables: { conversationId: active }, fetchPolicy: 'network-only' });
	const [reply, { loading: sending }] = useMutation(REPLY_MESSAGE);

	const conversations: Conversation[] = convData?.getMyConversations ?? [];
	const thread: Message[] = threadData?.getConversation ?? [];
	const current = conversations.find((c) => c.conversationId === active);

	// Opening a thread marks it read server-side; reflect that in the badge.
	useEffect(() => {
		if (!active) return;
		refetchConversations().then((res) => {
			const list: Conversation[] = res?.data?.getMyConversations ?? [];
			unreadMessagesVar(list.reduce((sum, c) => sum + (c.unreadCount || 0), 0));
		});
	}, [threadData]);

	useEffect(() => {
		if (typeof router.query.conversation === 'string') setActive(router.query.conversation);
	}, [router.query.conversation]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ block: 'end' });
	}, [thread.length]);

	useEffect(() => {
		if (!socket) return;
		const onMessage = (msg: MessageEvent) => {
			try {
				const d = JSON.parse(msg.data);
				if (d.event !== 'dm') return;
				refetchConversations();
				if (d.payload?.conversationId === active) refetchThread();
			} catch {
				// ignore
			}
		};
		socket.addEventListener('message', onMessage);
		return () => socket.removeEventListener('message', onMessage);
	}, [socket, active, refetchConversations, refetchThread]);

	const send = async () => {
		const body = text.trim();
		if (!body || !active) return;
		try {
			await reply({ variables: { input: { conversationId: active, message: body } } });
			setText('');
			await refetchThread();
			await refetchConversations();
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	const showList = device !== 'mobile' || !active;
	const showThread = device !== 'mobile' || !!active;

	return (
		<div id="my-messages-page" className="mypage-panel">
			<Stack className="main-title-box">
				<Typography className="main-title">{t('Messages')}</Typography>
				<Typography className="sub-title">{t('Conversations with buyers, sellers and mechanics')}</Typography>
			</Stack>
			<Stack direction="row" className="messages-layout">
				{showList && (
					<Stack className="conversation-list">
						{conversations.length === 0 && <Typography className="muted empty">{t('No conversations yet')}</Typography>}
						{conversations.map((c) => (
							<div
								key={c.conversationId}
								className={`conversation ${c.conversationId === active ? 'active' : ''} ${c.unreadCount ? 'unread' : ''}`}
								onClick={() => setActive(c.conversationId)}
							>
								<UserAvatar image={c.partner?.memberImage} name={c.partner?.memberNick} size={44} />
								<div className="body">
									<div className="line">
										<b>{c.partner?.memberNick ?? t('Member')}</b>
										<span className="muted">{timeAgo(c.lastMessageAt)}</span>
									</div>
									<span className="topic">{c.kind === ConversationKind.SERVICE ? `🔧 ${t('Service request')}` : c.carTitle}</span>
									<span className="preview">{c.lastMessage.split('\n')[0]}</span>
								</div>
								{!!c.unreadCount && <b className="unread-badge">{c.unreadCount}</b>}
							</div>
						))}
					</Stack>
				)}
				{showThread && (
					<Stack className="thread">
						{!active && <Typography className="muted empty">{t('Select a conversation')}</Typography>}
						{active && (
							<>
								<Stack direction="row" className="thread-head" alignItems="center" spacing={1}>
									{device === 'mobile' && (
										<IconButton onClick={() => setActive(null)} aria-label="Back">
											<ArrowBackIcon />
										</IconButton>
									)}
									<UserAvatar image={current?.partner?.memberImage} name={current?.partner?.memberNick} size={36} />
									<div className="who">
										<b>{current?.partner?.memberNick}</b>
										{current?.carId && current.kind === ConversationKind.CAR && (
											<Button className="btn-text" onClick={() => router.push({ pathname: '/car/detail', query: { id: current.carId } })}>
												{current.carTitle}
											</Button>
										)}
									</div>
									{current?.carImage && <img className="thread-car" src={`${REACT_APP_API_URL}/${current.carImage}`} alt="" />}
								</Stack>
								<div className="thread-body">
									{threadLoading && thread.length === 0 && <Typography className="muted">{t('Loading...')}</Typography>}
									{thread.map((m) => {
										const mine = m.senderId === user._id;
										return (
											<div key={m._id} className={`bubble-row ${mine ? 'mine' : ''}`}>
												{!mine && <UserAvatar image={m.senderData?.memberImage} name={m.senderData?.memberNick} size={28} />}
												<div className="bubble">
													<p>{m.message}</p>
													<span className="time">
														{new Date(m.createdAt).toLocaleString()}
														{mine && <i className={`tick ${m.messageStatus === 'READ' ? 'read' : ''}`}>{m.messageStatus === 'READ' ? '✓✓' : '✓'}</i>}
													</span>
												</div>
											</div>
										);
									})}
									<div ref={bottomRef} />
								</div>
								<Stack direction="row" className="composer" spacing={1}>
									<TextField
										value={text}
										onChange={(e) => setText(e.target.value)}
										placeholder={t('Write a message...') as string}
										size="small"
										fullWidth
										multiline
										maxRows={4}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												send();
											}
										}}
									/>
									<IconButton className="send-btn" onClick={send} disabled={sending || !text.trim()} aria-label="Send">
										<SendIcon />
									</IconButton>
								</Stack>
							</>
						)}
					</Stack>
				)}
			</Stack>
		</div>
	);
};

export default MyMessages;
