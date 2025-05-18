import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React from 'react';

// Form field data for mapping
const formFields = [
	{
		id: 'price',
		label: 'Price ($)',
		value: '10000',
		gridPosition: { xs: 12, sm: 6 },
	},
	{
		id: 'interestRate',
		label: 'Interest Rate',
		value: '10',
		gridPosition: { xs: 12, sm: 6 },
	},
	{
		id: 'loanTerm',
		label: 'Loan Term (year)',
		value: '3',
		gridPosition: { xs: 12, sm: 6 },
	},
	{
		id: 'downPayment',
		label: 'Down Payment',
		value: '5000',
		gridPosition: { xs: 12, sm: 6 },
	},
];

const Background2 = () => {
	return (
		<Box
			sx={{
				width: '100%',
				height: '891px',
				background: 'url(img/banner/background-car-loan.jpg)',
				backgroundSize: 'cover',
				backgroundPosition: '50% 50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				pl: { xs: 2, md: 32 },
			}}
		>
			<Paper
				elevation={3}
				sx={{
					width: { xs: '90%', sm: '529px' },
					height: '491px',
					borderRadius: '16px',
					p: 6.25,
					position: 'relative',
				}}
			>
				<Typography
					variant="h4"
					sx={{
						fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
						fontWeight: 700,
						color: '#050b20',
						fontSize: '40px',
						lineHeight: '40px',
						mb: 3,
					}}
				>
					Auto Loan Calculator
				</Typography>

				<Typography
					variant="body1"
					sx={{
						fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
						fontWeight: 400,
						color: '#050b20',
						fontSize: '15px',
						lineHeight: '27.8px',
						mb: 4,
					}}
				>
					Use this car payment calculator to estimate monthly
					<br />
					payments on your next new or used auto loan.
				</Typography>

				<Grid container spacing={3.75}>
					{formFields.map((field) => (
						<Grid item key={field.id} {...field.gridPosition}>
							<TextField
								id={field.id}
								label={field.label}
								defaultValue={field.value}
								variant="outlined"
								fullWidth
								InputProps={{
									sx: {
										height: '60px',
										borderRadius: '12px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: '#e9e9e9',
										},
									},
								}}
								InputLabelProps={{
									shrink: true,
									sx: {
										color: '#818181',
										fontSize: '13px',
										lineHeight: '24px',
										fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
										fontWeight: 400,
									},
								}}
								sx={{
									'& .MuiInputBase-input': {
										fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
										fontWeight: 400,
										color: '#050b20',
										fontSize: '15px',
										lineHeight: '27.8px',
										pt: 3,
									},
								}}
							/>
						</Grid>
					))}
				</Grid>

				<Button
					variant="contained"
					fullWidth
					endIcon={<ArrowForwardIcon />}
					sx={{
						mt: 4,
						height: '56px',
						backgroundColor: '#405ff2',
						borderRadius: '16px',
						textTransform: 'none',
						fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
						fontWeight: 500,
						fontSize: '15px',
					}}
				>
					Calculate
				</Button>
			</Paper>
		</Box>
	);
};

export default Background2;
