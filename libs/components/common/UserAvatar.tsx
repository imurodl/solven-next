import React, { useState } from 'react';
import { REACT_APP_API_URL } from '../../config';

interface UserAvatarProps {
	image?: string | null;
	name?: string;
	size?: number;
	className?: string;
}

const COLORS = ['#1e40af', '#0f766e', '#b45309', '#7c3aed', '#be123c', '#0369a1', '#4d7c0f', '#c026d3'];

const resolveSrc = (image?: string | null): string | null => {
	if (!image || image.includes('defaultUser')) return null;
	if (/^https?:\/\//.test(image)) return image;
	return `${REACT_APP_API_URL}/${image}`;
};

// Avatar with a coloured initial-letter fallback when the member has no photo
// or the photo fails to load (e.g. expired Telegram/Google CDN links).
const UserAvatar = ({ image, name = '', size = 40, className = '' }: UserAvatarProps) => {
	const [broken, setBroken] = useState(false);
	const src = resolveSrc(image);
	const initial = (name || '?').trim().charAt(0).toUpperCase();
	const color = COLORS[(name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
	const style: React.CSSProperties = { width: size, height: size, minWidth: size, fontSize: Math.max(12, size * 0.42) };

	if (src && !broken) {
		return <img className={`slv-avatar ${className}`} src={src} alt={name} style={style} onError={() => setBroken(true)} />;
	}
	return (
		<div className={`slv-avatar fallback ${className}`} style={{ ...style, background: color }} aria-label={name}>
			{initial}
		</div>
	);
};

export default UserAvatar;
