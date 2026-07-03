import { useContext, useEffect, useState } from 'react';
import { DeviceContext } from './DeviceContext';

const useDeviceDetect = (): string => {
	const ssrDevice = useContext(DeviceContext);
	const [device, setDevice] = useState<string>(ssrDevice ?? 'desktop');

	useEffect(() => {
		if (ssrDevice) return;
		const userAgent = navigator.userAgent;
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		setDevice(isMobile ? 'mobile' : 'desktop');
	}, [ssrDevice]);

	return device;
};

export default useDeviceDetect;
