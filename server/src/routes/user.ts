import axios from "axios";
import { Router, Request, Response, NextFunction, IRouterMatcher } from "express";
import { OAuth2Client as GoogleOauthClient } from "google-auth-library";
import { Model } from "mongoose";
import passport from 'passport';
import config from "../config";
import { UserDocument, UserType } from "../models/user";
import crypto from 'crypto';
import rateLimiter from 'express-rate-limit';

export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user!.username === 'admin') {
        next();
    } else {
        res.sendStatus(401);
    }
}

export const onlyAuthUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export const onlyNotAuthUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}


// Allow 2 sign-up requests per IP per 30 minutes
const signupRateLimiter1 = rateLimiter({
    windowMs: 30 * 1000,
    max: 2,
    message: "Cannot create more than 2 accounts per 30 minutes.",
});


// Allow 5 sign-up requests per IP per 3 days
const signupRateLimiter2 = rateLimiter({
    windowMs: 3 * 24 * 60 * 1000,
    max: 5,
    message: "Cannot create more than 5 accounts per 3 days.",
});


// Allow 20 message queries per 1 day
const SNSRateLimiter = rateLimiter({
    windowMs: 24 * 60 * 1000,
    max: 100,
    message: "Cannot send more than 20 messages with SNS in a day",
});

export default (User: Model<UserDocument>, sns: AWS.SNS) => {
    let router = Router();

    // Get Session Information
    router.get('/', onlyAuthUser, (req, res) => {
        let user: any = req.user;
        if (user) {
            delete user.passwordHash;
            delete user.passwordSalt;
        }
        res.send(req.user);
    });

    // Sign in
    router.post('/login', passport.authenticate('local'), (req, res) => {
        res.write('Logged in with ' + req.user!.username);
        res.end();
    });

    // Sign out
    router.post('/logout', onlyAuthUser, (req, res) => {
        req.logout();
        res.sendStatus(200);
    });

    router.post('/connect/kakao', onlyAuthUser, async (req, res) => {
        const user = req.user!;
        const token: string = req.body.token;
        const id: string = req.body.id;

        let response = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.id.toString() === id && !user.kakaoId) {
            if (await User.findOneAndUpdate({ username: user.username }, { kakaoId: id })) {
                return res.sendStatus(200);
            }
        }
        res.sendStatus(401);
    });

    router.post('/login/kakao', async (req, res) => {
        const token: string = req.body.token;
        const id: string = req.body.id;

        let response = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.id.toString() === id) {
            let user = await User.findOne({ kakaoId: id });
            if (user) {
                req.session.passport.user = user.username;
                return res.status(200).send({
                    loggedIn: true,
                });
            } else {
                return res.status(200).send({
                    loggedIn: false,
                })
            }
        }
        res.sendStatus(401);
    });

    router.post('/connect/google', onlyAuthUser, async (req, res) => {
        const user = req.user!;
        const token: string = req.body.token;
        const id: string = req.body.id;


        let oauthClient = new GoogleOauthClient(config.googleClientId);

        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientId,
        });

        if (ticket.getUserId() === id && !user.googleId) {
            if (await User.findOneAndUpdate({ username: user.username }, { googleId: id })) {
                return res.sendStatus(200);
            }
        }
        res.sendStatus(401);
    })

    router.post('/login/google', async (req, res) => {
        const token: string = req.body.token;
        const id: string = req.body.id;

        let oauthClient = new GoogleOauthClient(config.googleClientId);

        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientId,
        });

        if (ticket.getUserId() === id) {
            let user = await User.findOne({ googleId: id });
            if (user) {
                req.session.passport.user = user.username;
                return res.status(200).send({
                    loggedIn: true,
                });
            } else {
                return res.status(200).send({
                    loggedIn: false,
                })
            }
        }

        res.sendStatus(401);
    })

    router.get('/findcellphone/:cellphone', async (req, res) => {
        let cellphone = '+82' + (req.params.cellphone.slice(1));
        let result = await User.findOne({ cellphone });
        res.json(result);
    });

    router.get('/findusername/:username', async (req, res) => {
        let username = req.params.username;
        let result = await User.findOne({ username });
        res.json(result);
    });

    // Sign up
    router.post('/', signupRateLimiter1, signupRateLimiter2, async (req, res) => {

        if (req.isAuthenticated()) req.logout();

        const password = req.body.password;

        const passwordSalt = crypto.randomBytes(32).toString('hex');
        const passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');

        let data : UserType = {
            username: req.body.username,
            passwordSalt, passwordHash,
            name: req.body.name,
            birthYear: Number.parseInt(req.body.birthYear),
            birthMonth: Number.parseInt(req.body.birthMonth),
            birthDate: Number.parseInt(req.body.birthDate),
            sex: req.body.sex,
            email: req.body.email || undefined,
            cellphone: req.body.cellphone,
            agreeMessage: req.body.agreeMessage,
            showContent: JSON.stringify(req.body.showContent),
        };

        let phoneCodeDigest = req.body.phoneCodeDigest, phoneVerifyData = req.session.verifyPhone;
        if (!phoneVerifyData)
            return res.status(401).send('There is no phone verify data on the session');
        if (phoneCodeDigest !== crypto.pbkdf2Sync(`${phoneVerifyData.phoneNumber}${phoneVerifyData.code}${phoneVerifyData.createdAt}`, config.adminSecret, 10000, 64, 'sha512').toString('hex'))
            return res.status(401).send('Phone number is not correctly verified');

        let phoneUserDigest = crypto.pbkdf2Sync(`${data.cellphone}${data.username}`, config.adminSecret, 10000, 64, 'sha512').toString('hex');

        data = Object.assign(data, { phoneUserDigest });


        // TODO: Validate other data (Is it really string? Does it contains prohibited characters? Is its length appropriate?)


        if (await User.exists({ username: data.username })) {
            res.write(`User with ID ${data.username} already exists.`);
            res.end(400);
            return;
        }

        if (await User.exists({ cellphone: data.cellphone })) {
            res.write(`User who uses cellphone ${data.cellphone} already exists.`);
            res.end(400);
            return;
        }

        await new User(data).save();

        res.write(`Now you can login with ID ${data.username}!`);
        res.end();
        return;
    });

    router.put('/', onlyAuthUser, async (req, res) => {
        let user = req.user!;
        let username: string = req.body.username;

        if (!await User.findOne({ username })) return res.sendStatus(500);

        let name: string = req.body.name;
        let birthYear: number = Number.parseInt(req.body.birthYear);
        let birthMonth: number = Number.parseInt(req.body.birthMonth);
        let birthDate: number = Number.parseInt(req.body.birthDate);
        let sex: string = req.body.sex;
        let email: string = req.body.email;

        if (user.username !== username) return res.sendStatus(401);

        const password = req.body.password;

        if (password) {
            const passwordSalt = crypto.randomBytes(32).toString('hex');
            const passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');

            await User.findOneAndUpdate({ username }, {
                passwordHash, passwordSalt,
            })
        }

        await User.findOneAndUpdate({ username }, {
            name, birthYear, birthMonth, birthDate, sex, email
        });

        res.send(200);
    })

    router.put('/password', onlyNotAuthUser, async (req, res) => {
      let username: string = req.body.username;

      if (!await User.findOne({ username })) return res.sendStatus(500);


      const password: string = req.body.password;

      if (password) {
          const passwordSalt = crypto.randomBytes(32).toString('hex');
          const passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');

          await User.findOneAndUpdate({ username }, {
              passwordHash, passwordSalt,
          })
      }

      res.send(200);
    })

    router.post('/duplicate', async (req, res) => {
        const username: string = req.body.username;
        res.send({
            duplicate: !!(await User.findOne({ username }))
        });
    })

    router.post('/duplicate/cellphone', async (req, res) => {
        const cellphone: string = req.body.cellphone;
        res.send({
            duplicate: !!(await User.findOne({ cellphone }))
        });
    })

    const sendSMS = async (message: string, phoneNumber: string) => {
        await sns.publish({
            Message: message,
            PhoneNumber: phoneNumber,
        }).promise();
    }

    router.post('/verify/phone', SNSRateLimiter, async (req, res) => {
        let phoneNumber = `+82${req.body.cellphoneFront.slice(1)}${req.body.cellphoneMiddle}${req.body.cellphoneRear}`;
        let code = Math.floor(Math.random() * 900000) + 100000;

        req.session.verifyPhone = {
            phoneNumber, code,
            createdAt: new Date().getTime(),
        };

        try {
            let data = await sendSMS(`[메멘토] 가입해주셔서 감사합니다. 인증번호는 ${code}입니다.`, phoneNumber);
            console.log("Success", data);
        } catch (err: any) {
            console.log("Failed", err.stack);
        }

        res.sendStatus(200);
    });

    router.post('/verify/phone/check', async (req, res) => {
        let phoneNumber = `+82${req.body.cellphoneFront.slice(1)}${req.body.cellphoneMiddle}${req.body.cellphoneRear}`;
        let userCode: number = req.body.code;

        let verifyData = req.session.verifyPhone;

        if (!verifyData) return res.sendStatus(401);
        let isVerified = verifyData.phoneNumber === phoneNumber
            && verifyData.code === userCode;
//            && verifyData.createdAt >= (new Date().getTime()) - 3000000;


        if (isVerified) {
            let phoneCodeDigest = crypto.pbkdf2Sync(`${phoneNumber}${userCode}${verifyData.createdAt}`, config.adminSecret, 10000, 64, 'sha512').toString('hex');
            res.json({
                isVerified,
                phoneCodeDigest,
            })
        } else {
            res.json({ isVerified });
        }
    });

    router.put('/bookname', onlyAuthUser, async (req, res, next) => {
        let user = req.user!;
        let username = req.body.username;
        
        if (!await User.findOne({ username })) return res.sendStatus(500);

        let bookname = req.body.bookname;

        if (user.username !== username) return res.sendStatus(401);

        if(await User.findOneAndUpdate({ username: username }, {
            bookname
        }))
        res.send(200);
    });

    router.put('/deathinfo', onlyAuthUser, async (req, res, next) => {
        let user = req.user!;
        let username = req.body.username;

        if (!await User.findOne({ username })) return res.sendStatus(500);

        let DeathInfo = req.body.DeathInfo;

        if(user.username !== username) return res.sendStatus(401);

        if(await User.findOneAndUpdate({ username: username }, {
            DeathInfo
        }))
        res.send(200);
    });

    router.put('/users', onlyAuthUser, SNSRateLimiter, async (req, res, next) => {
        let username = req.body.username;
        let name = req.body.name;
        let code = Math.floor(Math.random() * 900000) + 100000;

        if (!await User.findOne({ username })) return res.sendStatus(500);

        let UsersInfo = req.body.UsersInfo;
        let sendmessage: boolean = req.body.sendmessage;
        let status = 0;
        
        if(await User.findOneAndUpdate({ username: username }, {
            UsersInfo
        })) status = 200;   
        
        if(sendmessage) {
            let position = Number.parseInt(req.body.userposition);
            let phoneNumber: string = UsersInfo.give[position - 1].phonenumber;
            try {await sendSMS(`${name}님께서 메멘토 북 수령 요청을 보내셨습니다. 메멘토에 가입하신 후 ${name}님의 이야기를 확인해보세요!`, phoneNumber)} catch (err) {
                status = 400;
            }
        }
        
        res.send(200);
    });

    router.get('/usersInfo', async (req, res) => {
        let result = await User.find().sort({'username': 'asc'});
        res.json(result);
        res.end();
    });

    router.put('/profile', async (req, res) => {
        let user = req.user!;
        let username: string = req.body.username;

        if (!await User.findOne({ username })) return res.sendStatus(500);

        let imageUri = req.body.imageUri;
        let name = req.body.name;
        let sex = req.body.sex;
        let birthYear = req.body.birthYear;
        let birthMonth = req.body.birthMonth;
        let birthDate = req.body.birthDate;

        if (user.username !== username) return res.sendStatus(401);

        await User.findOneAndUpdate({ username: username }, {
            imageUri, name, sex, birthYear, birthMonth, birthDate
        })

        res.send(200);
    })

    return router;
};
