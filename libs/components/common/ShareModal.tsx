import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useTranslation } from 'next-i18next';

interface ShareModalProps {
	open: boolean;
	onClose: () => void;
	url: string;
	title: string;
	text?: string;
}

// Native share sheet when available, otherwise deep links + copy.
const ShareModal = ({ open, onClose, url, title, text }: ShareModalProps) => {
	const { t } = useTranslation('common');
	const [copied, setCopied] = useState(false);
	const encodedUrl = encodeURIComponent(url);
	const encodedText = encodeURIComponent(text || title);
	const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// clipboard unavailable
		}
	};

	const nativeShare = async () => {
		try {
			await navigator.share({ title, text, url });
			onClose();
		} catch {
			// user dismissed
		}
	};

	const targets = [
		{ key: 'telegram', label: 'Telegram', icon: <TelegramIcon />, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
		{ key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon />, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
		{ key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
		{ key: 'x', label: 'X', icon: <TwitterIcon />, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
	];

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" className="share-modal">
			<DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				{t('Share')}
				<IconButton onClick={onClose} size="small" aria-label="Close">
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body2" sx={{ color: 'var(--text-2)', mb: 2 }} noWrap>
					{title}
				</Typography>
				<Stack direction="row" spacing={1.5} justifyContent="center" className="share-targets" sx={{ mb: 2 }}>
					{targets.map((tg) => (
						<a key={tg.key} href={tg.href} target="_blank" rel="noopener noreferrer" className={`share-target ${tg.key}`} aria-label={tg.label}>
							{tg.icon}
							<span>{tg.label}</span>
						</a>
					))}
				</Stack>
				<Stack direction="row" spacing={1}>
					<TextField value={url} size="small" fullWidth InputProps={{ readOnly: true }} />
					<Button onClick={copy} variant="contained" startIcon={<ContentCopyIcon />} className="btn-primary" sx={{ whiteSpace: 'nowrap' }}>
						{copied ? t('Copied') : t('Copy')}
					</Button>
				</Stack>
				{canNativeShare && (
					<Button onClick={nativeShare} startIcon={<IosShareIcon />} fullWidth sx={{ mt: 1.5 }} className="btn-outline">
						{t('More options')}
					</Button>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ShareModal;
