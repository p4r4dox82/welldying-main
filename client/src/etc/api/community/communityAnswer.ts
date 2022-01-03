import Axios from 'axios';
import { apiAddress } from '../../config';

export interface AnswerData {
    imageUri: string,
    answer: string
}

export interface Emotion {
    emotion: string,
    number: number,
}

export interface CommunityAnswer {
    id: number,
    userId: string,
    commentIds: number[],
    updatedDate: string,
    answerData: AnswerData,
    emotions: Emotion[],
    views: number,
}