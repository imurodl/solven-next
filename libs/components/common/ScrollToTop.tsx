import { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 300);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Zoom in={visible}>
			<Fab
				onClick={scrollToTop}
				size="small"
				sx={{
					width: '40px',
					height: '40px',
					position: 'fixed',
					bottom: 40, // placed 60px below the chat button
					right: 35,
					zIndex: 998, // slightly lower than chat button
					bgcolor: '#fff',
					color: '#000',
					boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
					'&:hover': {
						cursor: 'pointer',
						transform: 'scale(1.1)',
						bgcolor: '#405ff2',
						color: '#fff',
						transition: 'all 0.5s linear',
					},
				}}
			>
				<KeyboardArrowUpIcon />
			</Fab>
		</Zoom>
	);
};

export default ScrollToTop;
