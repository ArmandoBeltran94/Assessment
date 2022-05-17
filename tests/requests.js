import axios from "axios";
const deviceRoute = 'http://localhost:3000/devices'

export const getDevices = async () => {
	try {
			const { data } = await axios.get(deviceRoute);
			return data
	} catch (error) {
			console.error(error);
	}
}

export const updateDevice = async (deviceId, payload) => {
	try {
			const { data } = await axios.put(`${deviceRoute}/${deviceId}`, payload);
			return data
	} catch (error) {
			console.error(error);
	}
}

export const deleteDevice = async deviceId => {
	try {
			const { data } = await axios.delete(`${deviceRoute}/${deviceId}`);
			return data
	} catch (error) {
			console.error(error);
	}
}

export const createDevice = async payload => {
	try {
			const { data } = await axios.post(`${deviceRoute}`, payload);
			return data
	} catch (error) {
			console.error(error);
	}
}