import axios from 'axios';
import { BASE_URL } from './Constant';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("token");
        if(accessToken){
            config.headers.Authorization = `Headers ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;