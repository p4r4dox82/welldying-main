import Axios from 'axios';
import { apiAddress } from '../config';

export const postSubscriber = async (emailFront: string, emailBack: string) => {
    let response = await Axios.post(`${apiAddress}/subscriber`, {
        emailFront, emailBack,
    }, { withCredentials: true });

    return response.status === 200;
}

export const downloadSubscribers = async () => {
    window.location.assign(`${apiAddress}/subscriber/download`);
}