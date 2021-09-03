import { Application } from "express";
import { Model } from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { UserDocument, UserType } from "../models/user";

function isPasswordValid(password: string, hash: string, salt: string) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

export default async (app: Application, User: Model<UserDocument>) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        let userType = user as UserType;

        done(null, userType.username);
    });

    passport.deserializeUser(async (username: string, done) => {
        let user = await User.findOne({ username });
        done(null, user);
    });

    passport.use(new LocalStrategy({
        session: true,
        passReqToCallback: false,
    }, async (username, password, done) => {
        User.findOne({ username: username }, function (err: any, user: any) {
            //DB 연결 실패 등의 에러
            if (err) { return done(err); }
            //username 자체가 DB에 없을 때
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            //username은 맞지만 비밀번호가 틀릴 때
            if (!isPasswordValid(password, user.passwordHash, user.passwordSalt)) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            //인증 성공
            return done(null, user);
          });
    }));
}

    