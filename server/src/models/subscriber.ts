import { Schema, Document } from "mongoose";

export interface SubscriberType {
    emailFront: string,
    emailBack: string,
};

export type SubscriberDocument = Document & SubscriberType;

export const subscriberSchema = new Schema<SubscriberDocument>({
    emailFront: String,
    emailBack: String,
});

subscriberSchema.set('timestamps', true);
subscriberSchema.index({emailFront: true, emailBack: true}, {unique: true});