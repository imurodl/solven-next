import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RatingStarsProps {
	value: number;
	count?: number;
	size?: 'small' | 'medium' | 'large';
	onChange?: (value: number) => void;
	showValue?: boolean;
	className?: string;
}

const RatingStars = ({ value, count, size = 'small', onChange, showValue = false, className = '' }: RatingStarsProps) => {
	const stars = [1, 2, 3, 4, 5];
	const rounded = Math.round(value * 2) / 2;
	return (
		<span className={`slv-stars ${size} ${onChange ? 'interactive' : ''} ${className}`} aria-label={`${value} out of 5`}>
			{stars.map((s) => {
				const filled = rounded >= s;
				const half = !filled && rounded + 0.5 === s;
				const Icon = filled ? StarIcon : half ? StarHalfIcon : StarBorderIcon;
				return (
					<Icon
						key={s}
						className={`star ${filled || half ? 'on' : ''}`}
						fontSize={size}
						onClick={onChange ? () => onChange(s) : undefined}
						role={onChange ? 'button' : undefined}
						aria-label={onChange ? `${s} stars` : undefined}
					/>
				);
			})}
			{showValue && value > 0 && <b className="value">{value.toFixed(1)}</b>}
			{count !== undefined && <span className="count">({count})</span>}
		</span>
	);
};

export default RatingStars;
