import Axios from 'axios';
import { apiAddress } from '../config';

export const uploadImage = async (image: Blob) => {
    let form = new FormData();
    form.append('image', image);
    
    let response = await Axios.post(`${apiAddress}/aws/image`, form, { withCredentials: true });

    return response.data.location as string;
}