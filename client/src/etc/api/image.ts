import Axios from 'axios';
import { apiAddress } from '../config';

export const uploadImage = async (image: Blob) => {
    let form = new FormData();
    form.append('image', image);

    console.log('asd');

    let response = await Axios.post(`${apiAddress}/aws/image`, form, { withCredentials: true });

    return response.data.location as string;
}

export const uploadImage_formdata = async (image: FormData) => {
  let response = await Axios.post(`${apiAddress}/aws/image`, image, { withCredentials: true });

  return response.data.location as string;
}
