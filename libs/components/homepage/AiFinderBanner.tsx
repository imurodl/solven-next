import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useTranslation } from 'next-i18next';

const AiFinderBanner = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	return (
		<Stack className="ai-banner">
			<Stack className="container">
				<div className="ai-banner-card">
					<div className="text">
						<span className="eyebrow">
							<AutoAwesomeIcon fontSize="inherit" /> {t('Powered by AI')}
						</span>
						<Typography className="title">{t('Find the car you saw on the street')}</Typography>
						<Typography className="sub">{t('ai.banner.sub')}</Typography>
						<Stack direction="row" spacing={1.5} className="actions" flexWrap="wrap">
							<Button className="btn-light" variant="contained" startIcon={<PhotoCameraOutlinedIcon />} onClick={() => router.push('/ai-finder')}>
								{t('Search by photo')}
							</Button>
							<Button
								className="btn-ghost"
								startIcon={<ChatBubbleOutlineIcon />}
								onClick={() => document.querySelector<HTMLButtonElement>('.ai-chat-button')?.click()}
							>
								{t('Ask the assistant')}
							</Button>
						</Stack>
					</div>
					<div className="art">
						<div className="ring r1" />
						<div className="ring r2" />
						<PhotoCameraOutlinedIcon className="cam" />
					</div>
				</div>
			</Stack>
		</Stack>
	);
};

export default AiFinderBanner;
