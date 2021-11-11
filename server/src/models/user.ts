import { Schema, Document } from "mongoose";

export interface UserGiveInfo {
    username: string;
    name: string;
    phonenumber: string;
    accept: number;
}

export interface UserType {
    username: string;
    passwordHash: string;
    passwordSalt: string;
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDate: number;
    sex: string;
    email: string;
    cellphone: string;
    agreeMessage: boolean;
    showContent: string;
    phoneCodeDigest?: string;
    phoneUserDigest?: string;
    kakaoId?: string;
    googleId?: string;
};

export type UserDocument = Document & UserType;

export const userSchema = new Schema<UserDocument>({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    birthMonth: { type: Number, required: true },
    birthDate: { type: Number, required: true },
    sex: { type: String, required: true},
    email: String,
    cellphone: { type: String, required: true, unique: true },
    agreeMessage: { type: Boolean, default: true },
    showContent: { type: String },
    phoneUserDigest: { type: String, required: true, },
    kakaoId: String,
    googleId: String,
    bookname: [String],
    DeathInfo: { agree: Boolean, answerArray: [String] },
    UsersInfo: { give: [{ username: String, name: String, phonenumber: String, accept: Number }], get: [{ username: String, name: String, phonenumber: String, accept: Number }] },
    imageUri: String,
});

userSchema.set('timestamps', true);