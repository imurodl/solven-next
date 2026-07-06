import React from 'react';
import { Stack, Typography } from '@mui/material';
import { CarOptions } from '../../../enums/car.enum';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SunroofIcon from '@mui/icons-material/Brightness5';

interface CarSpecsProps {
	car: any;
}

const carFeaturesList = [
	{ id: CarOptions.HEATED_SEATS, icon: AirlineSeatReclineExtraIcon, label: 'Heated Seats' },
	{ id: CarOptions.VENTILATED_SEATS, icon: AirlineSeatReclineExtraIcon, label: 'Ventilated Seats' },
	{ id: CarOptions.POWER_SEATS, icon: AirlineSeatReclineExtraIcon, label: 'Power Seats' },
	{ id: CarOptions.LEATHER_SEATS, icon: AirlineSeatReclineExtraIcon, label: 'Leather Seats' },
	{ id: CarOptions.HEATED_STEERING, icon: DirectionsCarIcon, label: 'Heated Steering' },
	{ id: CarOptions.SMART_KEY, icon: SecurityIcon, label: 'Smart Key' },
	{ id: CarOptions.CRUISE_CONTROL, icon: SpeedIcon, label: 'Cruise Control' },
	{ id: CarOptions.NAVIGATION, icon: GpsFixedIcon, label: 'Navigation' },
	{ id: CarOptions.PARKING_SENSOR_REAR, icon: LocalParkingIcon, label: 'Rear Parking Sensor' },
	{ id: CarOptions.PARKING_SENSOR_FRONT, icon: LocalParkingIcon, label: 'Front Parking Sensor' },
	{ id: CarOptions.REAR_CAMERA, icon: CameraAltIcon, label: 'Rear Camera' },
	{ id: CarOptions.CAMERA_360, icon: CameraAltIcon, label: '360° Camera' },
	{ id: CarOptions.SUNROOF, icon: SunroofIcon, label: 'Sunroof' },
	{ id: CarOptions.BLACK_BOX, icon: SecurityIcon, label: 'Black Box' },
	{ id: CarOptions.LANE_KEEP_ASSIST, icon: DirectionsCarIcon, label: 'Lane Keep Assist' },
	{ id: CarOptions.BLIND_SPOT_WARNING, icon: RemoveRedEyeIcon, label: 'Blind Spot Warning' },
];

const CarSpecs = (props: CarSpecsProps) => {
	const { car } = props;

	return (
		<>
			<Stack className="specs-grid">
				<Stack className="spec-item">
					<Stack className="icon-box">
						<DirectionsCarIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Car Type</Typography>
						<Typography className="spec-value">{car?.carType}</Typography>
					</Stack>
				</Stack>
				<Stack className="spec-item">
					<Stack className="icon-box">
						<SpeedIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Mileage</Typography>
						<Typography className="spec-value">{car?.carMileage} km</Typography>
					</Stack>
				</Stack>
				<Stack className="spec-item">
					<Stack className="icon-box">
						<LocalGasStationIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Fuel Type</Typography>
						<Typography className="spec-value">{car?.carFuelType}</Typography>
					</Stack>
				</Stack>
				<Stack className="spec-item">
					<Stack className="icon-box">
						<ColorLensIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Color</Typography>
						<Typography className="spec-value">{car?.carColor}</Typography>
					</Stack>
				</Stack>
				<Stack className="spec-item">
					<Stack className="icon-box">
						<AirlineSeatReclineNormalIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Seats</Typography>
						<Typography className="spec-value">{car?.carSeats} seats</Typography>
					</Stack>
				</Stack>
				<Stack className="spec-item">
					<Stack className="icon-box">
						<SettingsIcon />
					</Stack>
					<Stack className="spec-content">
						<Typography className="spec-label">Transmission</Typography>
						<Typography className="spec-value">{car?.carTransmission}</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack className="car-features">
				<Typography className="section-title">Car Features</Typography>
				<Stack className="features-grid">
					{carFeaturesList.map((feature) => {
						const isAvailable = car?.carOptions?.includes(feature.id);
						const IconComponent = feature.icon;
						return (
							<Stack className={`feature-item ${isAvailable ? 'available' : 'unavailable'}`} key={feature.id}>
								<IconComponent className="feature-icon" />
								<Typography className="feature-text">{feature.label}</Typography>
							</Stack>
						);
					})}
				</Stack>
			</Stack>
		</>
	);
};

export default CarSpecs;
