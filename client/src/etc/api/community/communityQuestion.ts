import Axios from 'axios';
import { apiAddress } from '../../config';

export interface CommunityQuestion {
    id: number,
    question: string,
    tag: string,
}