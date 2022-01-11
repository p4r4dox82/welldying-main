import Axios from 'axios';
import { apiAddress } from '../../config';

export interface CommunityRecomment {
    id: number,
    username: string,
    commentId: number,
    recomment: string,
}