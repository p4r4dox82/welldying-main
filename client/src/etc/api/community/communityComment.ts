import Axios from 'axios';
import { apiAddress } from '../../config';
import { Emotion } from './communityAnswer';

export interface CommunityComment {
    id: number,
    userId: string,
    comment: string,
    emotions: Emotion[],
    recommentIds: number[],
}