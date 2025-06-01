import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
			memberFullName: user.memberFullName || '',
			memberDesc: user.memberDesc || '',
		});
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+responseImage: ', responseImage);
			updateData.memberImage = responseImage;
			setUpdateData({ ...updateData });

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const updatePropertyHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			updateData._id = user._id;
			const result = await updateMember({
				variables: {
					input: updateData,
				},
			});

			// @ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert('information updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData]);

	const doDisabledCheck = () => {
		if (
			updateData.memberNick === '' ||
			updateData.memberPhone === '' ||
			updateData.memberAddress === '' ||
			updateData.memberImage === '' ||
			updateData.memberFullName === '' ||
			updateData.memberDesc === ''
		) {
			return true;
		}
	};

	if (device === 'mobile') {
		return <div>MY PROFILE PAGE MOBILE</div>;
	} else {
		return (
			<div id="my-profile-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Profile</Typography>
						<Typography className="sub-title">Manage your profile information</Typography>
					</Stack>
				</Stack>

				<Stack className="profile-content">
					<Stack className="profile-sidebar">
						<Stack className="photo-box">
							<div className="image-box">
								<img
									src={
										updateData?.memberImage
											? `${REACT_APP_API_URL}/${updateData?.memberImage}`
											: `/img/profile/defaultUser.svg`
									}
									alt=""
								/>
							</div>
							<div className="upload-box">
								<label htmlFor="hidden-input" className="upload-button">
									<p>Upload Profile Image</p>
									<input
										type="file"
										hidden
										id="hidden-input"
										onChange={uploadImage}
										accept="image/jpg, image/jpeg, image/png"
									/>
								</label>
								<p className="upload-hint">A photo must be in JPG, JPEG or PNG format!</p>
							</div>
						</Stack>

						<Stack className="profile-stats">
							<Stack className="stat-item">
								<div className="icon">
									<PersonIcon />
								</div>
								<Stack className="stat-content">
									<Typography className="stat-label">Username</Typography>
									<Typography className="stat-value">{updateData.memberNick || 'Not set'}</Typography>
								</Stack>
							</Stack>
							<Stack className="stat-item">
								<div className="icon">
									<PhoneIcon />
								</div>
								<Stack className="stat-content">
									<Typography className="stat-label">Phone</Typography>
									<Typography className="stat-value">{updateData.memberPhone || 'Not set'}</Typography>
								</Stack>
							</Stack>
							<Stack className="stat-item">
								<div className="icon">
									<LocationOnIcon />
								</div>
								<Stack className="stat-content">
									<Typography className="stat-label">Location</Typography>
									<Typography className="stat-value">{updateData.memberAddress || 'Not set'}</Typography>
								</Stack>
							</Stack>
						</Stack>
					</Stack>

					<Stack className="profile-main">
						<Stack className="form-section">
							<Typography className="section-title">Personal Information</Typography>
							<Stack className="input-grid">
								<Stack className="input-group">
									<Typography className="input-label">Username</Typography>
									<input
										type="text"
										placeholder="Your username"
										value={updateData.memberNick}
										onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
									/>
								</Stack>
								<Stack className="input-group">
									<Typography className="input-label">Full Name</Typography>
									<input
										type="text"
										placeholder="Your full name"
										value={updateData.memberFullName}
										onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberFullName: value })}
									/>
								</Stack>
								<Stack className="input-group">
									<Typography className="input-label">Phone</Typography>
									<input
										type="text"
										placeholder="Your Phone"
										value={updateData.memberPhone}
										onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
									/>
								</Stack>
								<Stack className="input-group">
									<Typography className="input-label">Address</Typography>
									<input
										type="text"
										placeholder="Your address"
										value={updateData.memberAddress}
										onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
									/>
								</Stack>
							</Stack>
						</Stack>

						<Stack className="form-section">
							<Typography className="section-title">About Me</Typography>
							<Stack className="input-grid">
								<Stack className="input-group" sx={{ gridColumn: '1 / -1' }}>
									<Typography className="input-label">Bio</Typography>
									<textarea
										placeholder="Tell us about yourself"
										value={updateData.memberDesc}
										onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberDesc: value })}
									/>
								</Stack>
							</Stack>
						</Stack>

						<Stack className="form-actions">
							<Button className="update-button" onClick={updatePropertyHandler} disabled={doDisabledCheck()}>
								<span className="button-content">
									<SaveIcon />
									Update Profile
								</span>
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
		memberFullName: '',
		memberDesc: '',
	},
};

export default MyProfile;
