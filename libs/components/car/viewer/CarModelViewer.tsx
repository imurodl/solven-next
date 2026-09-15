import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import { useTranslation } from 'next-i18next';

// <model-viewer> is loaded from a vendored bundle: the npm build imports its own
// three.js version and the custom element must only register in the browser.
const MODEL_VIEWER_SRC = '/vendor/model-viewer.min.js';

type ModelViewerElement = HTMLElement & { activateAR: () => Promise<void>; canActivateAR: boolean };

interface CarModelViewerProps {
	src: string;
	poster?: string;
	title?: string;
}

const CarModelViewer = ({ src, poster, title }: CarModelViewerProps) => {
	const { t } = useTranslation('common');
	const ref = useRef<ModelViewerElement | null>(null);
	const [ready, setReady] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [arAvailable, setArAvailable] = useState(false);
	const [rotate, setRotate] = useState(true);

	useEffect(() => {
		if (customElements.get('model-viewer')) {
			setReady(true);
			return;
		}
		const existing = document.querySelector<HTMLScriptElement>(`script[src="${MODEL_VIEWER_SRC}"]`);
		const script = existing ?? document.createElement('script');
		const onLoad = () => setReady(true);
		script.addEventListener('load', onLoad);
		if (!existing) {
			script.type = 'module';
			script.src = MODEL_VIEWER_SRC;
			document.head.appendChild(script);
		}
		return () => script.removeEventListener('load', onLoad);
	}, []);

	useEffect(() => {
		if (!ready || !ref.current) return;
		const viewer = ref.current;
		const onLoad = () => {
			setLoaded(true);
			setArAvailable(Boolean(viewer.canActivateAR));
		};
		viewer.addEventListener('load', onLoad);
		return () => viewer.removeEventListener('load', onLoad);
	}, [ready]);

	const viewerProps: Record<string, any> = {
		src,
		poster,
		alt: title || '3D car model',
		'camera-controls': '',
		'touch-action': 'pan-y',
		'shadow-intensity': '1',
		exposure: '1',
		ar: '',
		'ar-modes': 'scene-viewer webxr quick-look',
	};
	if (rotate) viewerProps['auto-rotate'] = '';

	return (
		<Stack className="car-model-viewer">
			<div className="viewer-box">
				{ready ? React.createElement('model-viewer', { ref, ...viewerProps }) : null}
				{!loaded && (
					<div className="viewer-loading">
						<CircularProgress size={28} />
						<Typography>{t('Loading 3D model')}</Typography>
					</div>
				)}
			</div>
			<Stack direction="row" spacing={1} className="viewer-actions" flexWrap="wrap">
				<Button className="btn-outline" startIcon={<ThreeDRotationIcon />} onClick={() => setRotate((r) => !r)}>
					{rotate ? t('Stop rotation') : t('Auto rotate')}
				</Button>
				{arAvailable && (
					<Button className="btn-primary" startIcon={<ViewInArIcon />} onClick={() => ref.current?.activateAR()}>
						{t('View in your space')}
					</Button>
				)}
			</Stack>
			<Typography className="muted hint">{t('Drag to orbit, scroll to zoom. AR is available on supported phones.')}</Typography>
		</Stack>
	);
};

export default CarModelViewer;
