import { Router, Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import passport from "passport";
import { CommunityUserDocument, CommunityUser } from "../../models/community/communityUser";

export const onlyAuthCommunityUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export const onlyNotAuthCommunityUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(401);
    }
}

export default (CommunityUser: Model<CommunityUserDocument>) => {
    let router = Router();

    router.get('/', onlyAuthCommunityUser, (req, res) => {
        let communityUser: any = req.communityUser;

        res.send(req.communityUser);
    }) 

    router.post('/login', passport.authenticate('local'), (req, res) => {
        res.write('Logged in with ' + req.user!.username);
        res.end();
    });

    // Sign out
    router.post('/logout', onlyAuthCommunityUser, (req, res) => {
        req.logout();
        res.sendStatus(200);
    });

    router.put('/signup', async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        if(!await CommunityUser.findOneAndUpdate({ username: username }, { $set: { password: password } })) {
            const communityUser = new CommunityUser({ username, password });
            communityUser.save();
        }

        res.sendStatus(200);
        return;
    })

    router.post('/', async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let phoneNumber = req.body.phoneNumber;

        if(await CommunityUser.exists({ username: username })) {
            res.write("username duplicate");
            res.end(400);
            return;
        }
        if(await CommunityUser.exists({ phoneNumber: phoneNumber })) {
            res.write("phoneNumber duplicate");
            res.end(400);
            return;
        }

        let data : CommunityUser = {
            username: username,
            password: password,
            signIn: false,
            userInformation: {
                name: name,
                nickName: "",
                birth: "",
                sex: "male",
                phoneNumber: phoneNumber,
                profileImageUri: "",
                zipCode: 0,
                fullAddress: "",
                detailAddress: "",
                email: "",
            },
            answerIds: [],
            bookmarkedAnswerIds: [],
            personalTags: [],
            bookTitles: [],
            notices: [],
            questionsIds: [],
        };

        await new CommunityUser(data).save();

        res.write(`Now you can login`);
        res.end();
        return;
    })

    router.put('/', async(req, res) => {
        const username = req.body.username;
        if(!await CommunityUser.findOne({ username: username })) {
            res.sendStatus(500);
        }

        let name = req.body.name;
        let nickName = req.body.nickName;
        let birth = req.body.birth;
        let sex = req.body.sex;
        let phoneNumber = req.body.phoneNumber;
        let profileImageUri = req.body.profileImageUri;
        let zipCode = Number.parseInt(req.body.zipCode);
        let fullAddress = req.body.fullAddress;
        let detailAddress = req.body.detailAddress;
        let email = req.body.email;
        let personalTags = req.body.personalTags;

        let userInformation = { name, nickName, birth, sex, phoneNumber, profileImageUri, zipCode, fullAddress, detailAddress, email };

        await CommunityUser.findOneAndUpdate({ username: username }, {
            userInformation, personalTags
        });

        res.send(200);        
    })

    return router;
}