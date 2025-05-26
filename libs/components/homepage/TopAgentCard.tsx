'use client';

import { useRouter } from 'next/router';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import type { Member } from '../../types/member/member';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import member from '../../../pages/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Link from 'next/link';

interface TopAgentProps {
	agent: Member;
	likeMemberHandler: any;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const handleLike = () => {
		// Handle like functionality
	};

	const handleFollow = () => {
		// Handle follow functionality
	};

	const handleView = () => {
		// Handle view profile functionality
		router.push(`/agent/${agent._id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<div className="agent-header">
					<img src={agentImage || '/placeholder.svg'} alt={agent?.memberNick} />
					<div className="agent-info">
						<div className="name-section">
							<PersonIcon />
							<strong>{agent?.memberNick}</strong>
						</div>
						<div className="phone-section">
							<PhoneIcon />
							<span>{agent?.memberPhone || 'No contact info'}</span>
						</div>
					</div>
				</div>

				<div className="agent-stats">
					<Tooltip title="Cars Listed" arrow>
						<div className="stat-item">
							<DirectionsCarIcon />
							<span>{agent?.memberCars || 0}</span>
						</div>
					</Tooltip>
					<Tooltip title="Followers" arrow>
						<div className="stat-item">
							<PeopleIcon />
							<span>{agent?.memberFollowers || 0}</span>
						</div>
					</Tooltip>
					<Tooltip title="Likes Received" arrow>
						<div className="stat-item">
							<FavoriteIcon />
							<span>{agent?.memberLikes || 0}</span>
						</div>
					</Tooltip>
				</div>

				<div className="agent-description">
					<p>{agent?.memberDesc || 'No description available'}</p>
				</div>

				<div className="agent-actions">
					<button className="action-btn like-btn" onClick={handleLike}>
						<FavoriteBorderIcon />
						Like
					</button>
					<button className="action-btn follow-btn" onClick={handleFollow}>
						Follow
					</button>
					<button className="action-btn view-btn" onClick={handleView}>
						<VisibilityIcon />
						View
					</button>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<div className="agent-header">
					<img src={agentImage || '/placeholder.svg'} alt={agent?.memberNick} />
					<div className="agent-info">
						<div className="name-section">
							<PersonIcon />
							<strong>{agent?.memberNick}</strong>
						</div>
						<div className="phone-section">
							<PhoneIcon />
							<span>{agent?.memberPhone || 'No contact info'}</span>
						</div>
					</div>
				</div>

				<div className="agent-stats">
					<Stack gap={'5px'}>
						<div className="stat-item">
							<DirectionsCarIcon />
							<span>{agent?.memberCars || 0}</span>
						</div>
						<Typography component={'p'}>Listings</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<PeopleIcon />
							<span>{agent?.memberFollowers || 0}</span>
						</div>
						<Typography component={'p'}>Followers</Typography>
					</Stack>
					<Stack gap={'5px'}>
						<div className="stat-item">
							<PeopleIcon />
							<span>{agent?.memberFollowings || 0}</span>
						</div>
						<Typography component={'p'}>Followings</Typography>
					</Stack>
				</div>

				<div className="agent-description">
					<p>{agent?.memberDesc || 'No description available'}</p>
				</div>

				<div className="agent-actions">
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<Button startIcon={<ArrowOutwardIcon />} className={'view-btn'}>
							View
						</Button>
					</Link>
					{/* Like Button with Count */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							cursor: 'pointer',
						}}
						onClick={() => likeMemberHandler(user, agent?._id)}
					>
						{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon sx={{ color: 'red', fontSize: 24 }} />
						) : (
							<FavoriteBorderIcon sx={{ color: '#666', fontSize: 24 }} />
						)}
						<Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
							{agent.memberLikes}
						</Typography>
					</Box>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;
