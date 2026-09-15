import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton, Stack, TextField, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTranslation } from 'next-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { AiChatAction, AiChatProduct } from '../types/ai/ai';

interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
	cars?: AiChatProduct[];
	actions?: AiChatAction[];
}

const STORAGE_KEY = 'slv_ai_chat';

// Floating AI shopping assistant. Conversation is kept per browser so a page
// change does not lose context; the server route grounds every answer in the
// live catalog and only returns real listing ids.
const AiChat = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { formatPrice } = useCurrency();
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [unavailable, setUnavailable] = useState(false);
	const bodyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY);
			if (raw) setMessages(JSON.parse(raw));
		} catch {
			// ignore
		}
	}, []);

	useEffect(() => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
		} catch {
			// ignore
		}
		bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages, open]);

	const send = async () => {
		const text = input.trim();
		if (!text || loading) return;
		const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
		setMessages(next);
		setInput('');
		setLoading(true);
		try {
			const res = await fetch('/api/ai-chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next.slice(-10).map((m) => ({ role: m.role, content: m.content })), locale: router.locale || 'en' }),
			});
			const data = await res.json();
			if (res.status === 503) {
				setUnavailable(true);
				setMessages([...next, { role: 'assistant', content: t('ai.unavailable') }]);
				return;
			}
			if (!res.ok) throw new Error(data?.error || 'error');
			setMessages([...next, { role: 'assistant', content: data.reply, cars: data.cars, actions: data.actions }]);
		} catch {
			setMessages([...next, { role: 'assistant', content: t('ai.error') }]);
		} finally {
			setLoading(false);
		}
	};

	const suggestions = [t('ai.suggest.family'), t('ai.suggest.budget'), t('ai.suggest.ev')];

	return (
		<div className={`ai-chat ${open ? 'open' : ''}`}>
			{!open && (
				<Tooltip title={t('AI assistant') as string} placement="left">
					<button className="ai-chat-button" onClick={() => setOpen(true)} aria-label="Open AI assistant">
						<AutoAwesomeIcon />
					</button>
				</Tooltip>
			)}
			{open && (
				<div className="ai-chat-frame">
					<div className="ai-head">
						<div className="who">
							<span className="dot" />
							<div>
								<b>{t('Solven AI')}</b>
								<span>{t('Car-buying assistant')}</span>
							</div>
						</div>
						<IconButton size="small" onClick={() => setOpen(false)} aria-label="Close">
							<CloseIcon fontSize="small" />
						</IconButton>
					</div>
					<div className="ai-body" ref={bodyRef}>
						{messages.length === 0 && (
							<div className="ai-welcome">
								<p>{t('ai.welcome')}</p>
								<div className="suggestions">
									{suggestions.map((s) => (
										<button key={s} onClick={() => setInput(s)}>
											{s}
										</button>
									))}
								</div>
							</div>
						)}
						{messages.map((m, i) => (
							<div key={i} className={`ai-msg ${m.role}`}>
								<p>{m.content}</p>
								{m.cars && m.cars.length > 0 && (
									<div className="ai-cards">
										{m.cars.map((c) => (
											<div key={c._id} className="ai-card" onClick={() => router.push({ pathname: '/car/detail', query: { id: c._id } })}>
												{c.image ? <img src={c.image} alt={c.title} /> : <div className="ph" />}
												<div>
													<b>{c.title}</b>
													<span>{c.subtitle}</span>
													<em>
														{c.originalPrice ? <s>{formatPrice(c.originalPrice)}</s> : null} {formatPrice(c.price)}
													</em>
												</div>
											</div>
										))}
									</div>
								)}
								{m.actions && m.actions.length > 0 && (
									<div className="ai-actions">
										{m.actions.map((a) => (
											<button key={a.href} onClick={() => router.push(a.href)}>
												{a.label} →
											</button>
										))}
									</div>
								)}
							</div>
						))}
						{loading && (
							<div className="ai-msg assistant typing">
								<span />
								<span />
								<span />
							</div>
						)}
					</div>
					<Stack direction="row" className="ai-composer" spacing={1}>
						<TextField
							size="small"
							fullWidth
							value={input}
							placeholder={t('ai.placeholder') as string}
							disabled={unavailable}
							onChange={(e) => setInput(e.target.value.slice(0, 1000))}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									send();
								}
							}}
						/>
						<IconButton className="send-btn" onClick={send} disabled={loading || !input.trim() || unavailable} aria-label="Send">
							<SendIcon fontSize="small" />
						</IconButton>
					</Stack>
				</div>
			)}
		</div>
	);
};

export default AiChat;
