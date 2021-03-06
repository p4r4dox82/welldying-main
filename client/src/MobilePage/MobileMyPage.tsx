import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MementoBook from '../components/MementoBook';
import { checkCellphoneDuplicate, DeathInfo, getUserid, getUsers, modifyUserInfo, setUserDeathInfo, UserPut } from '../etc/api/user';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { EditVector, leftVector, MementoDotVector, rightVector, UserImage } from '../img/Vectors';
import MobileFooter from '../MobileComponents/MobileFooter';
import MobileHeader from '../MobileComponents/MobileHeader';
import { checkBatchim } from '../pages/Mypage';
import { RootReducer } from '../store';
import crypto from 'crypto';

interface UserPutMessage {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
    name: string;
    birthYear: string;
    birthMonth: string;
    birthDate: string;
    email: string;
    imageUri: string;
    cellphone: string;
    phoneValidateCode: string;
}

function MobileMyPage() {
    let user = useSelector((state: RootReducer) => state.user);

    let [, AllUsers] = usePromise(getUsers);
    let [editPledge, setEditPledge] = React.useState<boolean>(false);
    let [editPersonalData, setEditPersonalData] = React.useState<boolean>(false);
    let [currentGetBooksNumber, setCurrentGetBooksNumber] = React.useState<number>(0);
    let totalGetBooksNumber = React.useMemo(() => user.user?.UsersInfo.get.filter((userInfo) => userInfo.accept !== 2).length, [user]);
    let [currentEditPersonalDataNumber, setCurrentEditPersonalDataNumber] = React.useState<number>(0);
    let [DeathInfo, setDeathInfo] = React.useState<DeathInfo>();

    let [personalData, setPersonalData] = React.useState<UserPut>();
    let [personalDataValidateMessage, setPersonalDataValidateMessage] = React.useState<UserPutMessage>();
    let [phoneValidateCode, setPhoneValidateCode] = React.useState<number>();
    let [phoneVerified, ] = React.useState<boolean>(false);
    let [currentPassword, setCurrentPassword] = React.useState<string>('');
    let [confirmPassword, setConfirmPassword] = React.useState<string>('');

    let [, User] = usePromise(() => getUserid(personalData!.username), [personalData]);

    React.useEffect(() => {
        if(user.user?.DeathInfo !== undefined)
            setDeathInfo(user.user?.DeathInfo);
        else 
            setDeathInfo({agree: false, answerArray: ['', '', '', '', '']});
        if(user)
            setPersonalData({ username: user.user!.username, password: '', name: user.user!.name, birthYear: user.user!.birthYear, birthMonth: user.user!.birthMonth, birthDate: user.user!.birthDate, sex: user.user!.sex, email: user.user!.email, imageUri: '', cellphone: user.user!.cellphone});
        setPersonalDataValidateMessage({oldPassword: '', newPassword: '', newPasswordConfirm: '', name: '', birthDate: '', birthMonth: '', birthYear: '', email: '', imageUri: '', cellphone: '', phoneValidateCode: ''})
    }, [user]);

    let ValidateBirthYear = React.useCallback(() => {
        if(!personalData) return false;
        else return (personalData!.birthYear < 2021 && personalData.birthYear > 1900);
    }, [personalData])
    let ValidateBirthMonth = React.useCallback(() => {
        if(!personalData) return false;
        else return (personalData.birthMonth <= 12 && personalData.birthMonth >=1);
    }, [personalData])
    let ValidateBirthDate = React.useCallback(() => {
        if(!personalData) return false;
        else {
            let birthDate = personalData.birthDate;
            let birthYear = personalData.birthYear;
            let birthMonth = personalData.birthMonth;
            return !(birthDate < 1 || birthDate > [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][birthMonth] || (birthMonth === 2 && birthDate === 29 && (birthYear % 4 !== 0 || (birthYear % 100 === 0 && birthYear % 400 !== 0))));
        }
    }, [personalData])
    let ValidateEmail = React.useCallback(() => {
        if(!personalData) return false;
        else {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!regex.test(personalData.email)) {
                return false;
            }
            else return true;
        }
    },[personalData])
    let checkCellPhone = React.useCallback(async () => {
        if(!personalData || !personalDataValidateMessage) return false;
        let cellPhoneMiddle = personalData?.cellphone.slice(6, 10);
        let cellPhoneRear = personalData?.cellphone.slice(10, 14);
        if (cellPhoneMiddle.length < 4 || cellPhoneRear.length < 4) {
            setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '????????? ??????????????? ???????????????.'});
            return false;
        }
        if (await checkCellphoneDuplicate(personalData.cellphone)) {
            setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '?????? ???????????? ?????? ?????????????????????.'});
            return false;
        }
        setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: ''});
        return true;
    }, [personalData, personalDataValidateMessage])
    let checkCellPhoneChanged = React.useCallback(() => {
        if(user.user?.cellphone === personalData?.cellphone) 
            return false;
        else 
            return true;
    }, [personalData, user])
    let ValidateCellphone = React.useCallback(async () => {
        if(!personalData || !personalDataValidateMessage) {
            return false;
        }
        if(checkCellPhoneChanged()) {
            if (!await checkCellPhone()) {
                return false;
            }
            if (!phoneVerified) {
                setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '??????????????? ??????????????????.'});
                return false;
            }
            setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: ''});
            return true;
        } 
        else 
            return true;
    }, [checkCellPhone, checkCellPhoneChanged, personalData, personalDataValidateMessage, phoneVerified])
    let validatePhoneCode = React.useCallback(() => {
        if(!personalData || !personalDataValidateMessage) return false;
        if(checkCellPhoneChanged()) {
            if (!phoneVerified) {
                setPersonalDataValidateMessage({...personalDataValidateMessage, phoneValidateCode: '??????????????? ???????????? ????????? ???????????????.'});
                return false;
            }
            return true;
        }
        else
            return true;
    }, [checkCellPhoneChanged, personalData, personalDataValidateMessage, phoneVerified])
    function isPasswordValid(password: string, hash: string, salt: string) {
        const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === hashVerify;
    }
    let ValidateCurrentPassword = React.useCallback(() => {
        if(!personalData) 
            return false;
        if(currentPassword === '' && personalData.password === '') 
            return true;
        else 
            return isPasswordValid(currentPassword, User!.passwordHash, User!.passwordSalt);
    }, [User, currentPassword, personalData])
    let ValidateNewPassword = React.useCallback(() => {
        if(!personalData || !personalDataValidateMessage)
            return false;
        if(currentPassword === '' && personalData.password === '')
            return true;
        else {
            const regex1 = /^[ -~]{8,200}$/;
            const regex2 = /[a-zA-Z]/;
            const regex3 = /[0-9]/;

            if (!regex1.test(personalData.password) || !regex2.test(personalData.password) || !regex3.test(personalData.password)) {
                setPersonalDataValidateMessage({...personalDataValidateMessage, newPassword: '??????????????? 8?????? ????????????, ????????? ????????? ??????????????? ??? ?????????.'});
                return false;
            }
            else
                return true;
        }
    }, [personalData, personalDataValidateMessage, currentPassword])
    let ValidateConfirmPassword = React.useCallback(() => {
        if(!personalData || !personalDataValidateMessage)
            return false;
        else {
            setPersonalDataValidateMessage({...personalDataValidateMessage, newPasswordConfirm: '??????????????? ???????????? ????????????.'});
            return true;
        }
    }, [personalData, personalDataValidateMessage])

    let ValidateFunctionAllPersonalData = React.useMemo(() => {
        return [ValidateBirthYear, ValidateBirthMonth, ValidateBirthDate, ValidateEmail, ValidateCellphone, validatePhoneCode, ValidateCurrentPassword, ValidateNewPassword, ValidateConfirmPassword];
    }, [ValidateBirthYear, ValidateBirthMonth, ValidateBirthDate, ValidateEmail, ValidateCellphone, validatePhoneCode, ValidateCurrentPassword, ValidateNewPassword, ValidateConfirmPassword]);

    let ValidateAllPersonalData = async () => {
        let result = true;

        for(let validate of ValidateFunctionAllPersonalData) {
            if(!await validate()) {
                result = false;
            }
        }
        return result;
    };

    let GivenUserInfoContainer = React.useCallback((userinfo: any) => {
        if(!AllUsers) return <></>;
        else {
            let givenUser = AllUsers.find((user) => user.username === userinfo.username);
            return (
                <>
                    {(userinfo.accept !== 2) && <div className="GivenUserInfoContainer">
                        <div className="userImage">{UserImage}</div>
                        {(userinfo.accept === 1) ? <div className = "message">
                                <div className="namephone">{givenUser?.name + ' / 0' + givenUser?.cellphone.slice(3, 5) + ' - ' + givenUser?.cellphone.slice(5, 9) + ' - ' + givenUser?.cellphone.slice(9, 13)}</div>
                                <div className="email">{givenUser?.email}</div>
                            </div> : <>
                            <div className="message">{(givenUser?.name === undefined ? userinfo.name : givenUser?.name) + '?????? ????????? ??????????????????.'}</div>
                        </>}
                    </div>}
                </>
            )

        }
    }, [AllUsers]);
    
    let GivenUsers = React.useMemo(() => {
        return (
            user.user?.UsersInfo.give.map((userinfo) => GivenUserInfoContainer(userinfo))
        )
    }, [user, GivenUserInfoContainer]);

    let GetBooks = React.useCallback((userinfo: any) => {
        if(!AllUsers) return <></>;
        else {
            let getBookUser = AllUsers.find((user) => user.username === userinfo.username);
            if(getBookUser)
                return (
                    <>
                        <MementoBook bookOwner = {getBookUser} watchingBookUser = {user.user!}></MementoBook>
                    </>
                )
        }
    }, [AllUsers, user]);

    let GetBooksContainer = React.useMemo(() => {
        return (
            user.user?.UsersInfo.get.map((userinfo) => {
                if(userinfo.accept !== 2) {
                    return GetBooks(userinfo);
                }
                return <></>;
            })
        )
    }, [user, GetBooks]);
    
    let answerArrays = React.useMemo(() => {    
        let answer1Array = ['?????? ??????', '????????? ??????', '????????? ??????', '?????? ??????', '??????'];
        let answer2Array = ['?????? ??????', '?????? ??????', '??????'];
        let answer3Array = ['?????? ?????? ??????', '????????? ??????', '??????'];
        let answer4Array = ['???, ???????????????.', '?????????, ???????????? ????????????'];
        let answer5Array = ['???, ???????????????.', '?????????, ???????????? ????????????'];
        let result = [];
        result.push({title: '???????????? ?????? ?????? ????????? ??????????', answer: answer1Array});
        result.push({title: '?????? ????????? ????????????????', answer: answer2Array});
        result.push({title: '???????????? ????????? ????????? ???????????????????', answer: answer3Array});
        result.push({title: '??????????????? ???????????????????', answer: answer4Array});
        result.push({title: '?????? ????????? ???????????????????', answer: answer5Array});

        return result;
    }, []);
    
    let isAnswerInArray = React.useCallback((answer: string, array: Array<string>) => {
        if(answer === undefined) return false;
        return array.includes(answer);
    }, [])

    let editDataOnArrayWithIndex = React.useCallback((array: Array<string>, data: string, index: number) => {
        let newarray = array;
        newarray[index] = data;
        return newarray;
    }, [])

    let checkDeathInfoAnswerFilled = (DeathInfo: DeathInfo) => {
        if(DeathInfo.answerArray.length !== 5)
            return false;
        if(DeathInfo.answerArray.includes(''))
            return false;
        for(let i = 0; i < 5; i ++)
            if(!DeathInfo.answerArray[i])
                return false;
        return true;
    }

    let Questions = React.useMemo(() => {
        if(!DeathInfo || !answerArrays) return <></>;
        return (
            <>
                {answerArrays.map((answerArray: any, key) => (
                    <div className = 'questionContainer'>
                        <div className = 'title'>
                            {key + 1}.{answerArray.title}
                        </div>
                        <div className = 'answerContainer'>
                            {answerArray.answer.map((answer: any) => (
                                <div className = 'answerElement'>
                                    <div className = 'checkBox' onClick = {answer === '??????' ? () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, '', key)})} : () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, answer, key)})}}>
                                        <div className = {isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? (DeathInfo?.answerArray[key] === answer ? 'checked' : '') : (answer === '??????' ? 'checked' : '')} />
                                    </div>
                                    <div className = {'name' + (answer === '??????' ? ' minWidthZero' : '')}>
                                    {answer}
                                    </div>
                                    {answer === '??????' && <input type='text' autoComplete='password' onChange={(e) => setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, e.target.value, key)})} value={(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? '' : DeathInfo?.answerArray[key])} placeholder = '25??? ????????? ??????????????????.' disabled = {(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? true : false)}/>}
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                )}
            </>
        )
    }, [DeathInfo, answerArrays, isAnswerInArray, editDataOnArrayWithIndex]);

    let editPersonalDataContainerCases = () => {
        if(!personalData) return <></>;
        switch(currentEditPersonalDataNumber) {
            case 0: 
                return (
                    <div className="editInfoContainer">
                            <div className="editInfoElement inline">
                                <div className="title">??????</div>
                                <input type="text" className="text" value = {personalData.name} onChange = {(e) => setPersonalData({...personalData!, name: e.target.value})} style = {{width: '80px'}} />
                            </div>
                            <div className="editInfoElement inline">
                                <div className="title">??????</div>
                                <div className="checkAnswerElement" onClick = {() => setPersonalData({...personalData!, sex: 'male'})}>
                                    <div className="checkBox">
                                        <div className={personalData.sex === 'male' ? "checked" : ''}></div>
                                    </div>
                                    <div className="name">??????</div>
                                </div>
                                <div className="checkAnswerElement" style = {{marginLeft: '16px'}} onClick = {() => setPersonalData({...personalData!, sex: 'female'})}>
                                    <div className="checkBox">
                                        <div className={personalData.sex === 'female' ? "checked" : ''}></div>
                                    </div>
                                    <div className="name">??????</div>
                                </div>
                            </div>
                            <div className="editInfoElement">
                                <div className="title">????????????</div>
                                <input type="text" className="text" value = {personalData.birthYear} onChange = {(e) => setPersonalData({...personalData!, birthYear: Number(e.target.value)})} style = {{width: '60px'}} />
                                <span className="yearMonthDate">???</span>
                                <input type="text" className="text" value = {personalData.birthMonth} onChange = {(e) => setPersonalData({...personalData!, birthMonth: Number(e.target.value)})}style = {{width: '40px', marginLeft: '14px'}} />
                                <span className="yearMonthDate">???</span>
                                <input type="text" className="text" value = {personalData.birthDate} onChange = {(e) => setPersonalData({...personalData!, birthDate: Number(e.target.value)})}style = {{width: '40px', marginLeft: '14px'}} />
                                <span className="yearMonthDate">???</span>
                            </div>
                        </div>
                )
            case 1:
                return (
                    <div className="editInfoContainer">
                        <div className="editInfoElement">
                            <div className="title">?????????</div>
                            <input type="text" className="text" value = {personalData.username} disabled />
                        </div>
                        <div className="editInfoElement">
                            <div className="title">?????????</div>
                            <input type="text" className="text" value = {personalData.email} onChange = {(e) => setPersonalData({...personalData!, email: e.target.value})} />
                        </div>
                        <div className="editInfoElement">
                            <div className="title">????????????</div>
                            <div className="buttonInputAnswerElement">
                                <input type="text" className="text" value = {'0' + personalData.cellphone.slice(3, 13)} onChange = {(e) => setPersonalData({...personalData!, cellphone: '+82' + e.target.value.slice(1,11)})} />
                                <button className="sendCode">???????????? ??????</button>
                            </div>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">???????????? ??????</div>
                            <div className="buttonInputAnswerElement">
                                <input type="text" className="text" value = {phoneValidateCode} onChange = {(e) => setPhoneValidateCode(Number(e.target.value))} placeholder = '??????????????? ??????????????????.'/>
                                <button className="confirmCode">????????????</button>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="editInfoContainer">
                        <div className="editInfoElement">
                            <div className="title">?????? ????????????</div>
                            <input type="password" className="text" value = {currentPassword} onChange = {(e) => setCurrentPassword(e.target.value)} placeholder = '?????? ??????????????? ??????????????????.'/>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">????????? ????????????</div>
                            <input type="password" className="text" value = {personalData.password} onChange = {(e) => setPersonalData({...personalData!, password: e.target.value})} placeholder = '8~20?????? ??????????????? ??????????????????.'/>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">???????????? ??????</div>
                            <input type="password" className="text" value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)} placeholder = '?????? ????????? ??????????????? ?????? ??? ??? ??????????????????.'/>
                        </div>
                    </div>
                )
        }
    }


    if(editPledge) return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'}></MobileHeader>
                <div className="MobileMyPageEditPledge">
                    <div className="background"></div>
                    <div className="userImage">
                        {UserImage}
                    </div>
                    <div className="PledgeContainer">
                        <div className="title" >????????? ????????? ???????????? ????????? ?????? ?????? ????????????????</div>
                        <div className="message">
                            <div>?????? ????????? ??????, ??????, ???????????? ???????????? ????????? ????????? ????????? ???????????? ?????? ?????? ???????????????. </div>
                            <div>???????????? ?????? ????????? ?????? ????????? ?????? ???????????? ????????? ????????????, ????????????????????????(1393), </div>
                            <div>??????????????? ??????(1588-9191) ????????? ????????? ?????? ????????? ?????????????????????.</div>
                        </div>
                        <div className="AgreeContainer" onClick = {async () => {
                            if(await setUserDeathInfo(user.user!.username, {...DeathInfo!, agree: true})) {
                                setDeathInfo({...DeathInfo!, agree: true})
                            }
                            }}>
                            {!DeathInfo?.agree && <>
                                <button className="agreeButton"></button>
                                <div className="agreeText"  style = {{cursor: 'pointer'}}>??? ???????????? ???????????????.</div>
                            </>}
                            {DeathInfo?.agree && <div className="agreeText agreed">{`???, ??? ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '???' : '???')} ?????? ?????? ???????????????.`}</div>}
                        </div>
                    </div>
                    <div className="DeathInfoContainer">
                        <img src={imageUrl('MyPageBackground.png')} alt="" className = 'background'/>
                        <div className="title">?????? ?????? ?????? & ????????????, ???????????? ?????????</div>
                        <div className="detail">
                            <div>????????? ????????? ????????? ???, ???????????? ?????????????????? ????????? ??? ?????? ??????????????????. </div>
                            <div>???????????? ????????? ?????? ????????? ????????? ??? ?????? ?????????????????? ???????????????.</div>
                        </div>
                        <div className="vector upward"></div>
                        {Questions}
                        <div className="vector downward"></div>
                        <button className="submit NS px18 bold" onClick = {async () => {
                            if(!checkDeathInfoAnswerFilled(DeathInfo!)) alert('?????? ????????? ???????????????');
                            else if(await setUserDeathInfo(user.user!.username, DeathInfo!)) {
                                alert('?????????????????????.');
                                setEditPledge(false);
                                window.scrollTo(0, 0);
                            }
                            else alert('?????????????????????');
                        }}>????????????</button>
                    </div>
                </div>
                <MobileFooter></MobileFooter>
            </div>
        </>
    )
    else if(editPersonalData && personalData) return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'}></MobileHeader>
                <div className="MobileMyPageEditPersonalData">
                    <div className="userImage">
                        {UserImage}
                    </div>
                    {false && <div className="addUserImage">{'?????? ?????? ?????? ???????????? >'}</div>}
                    <div className="personalDataContainer">
                        <div className="categoryContainer">
                            <div className={"category" + (currentEditPersonalDataNumber === 0 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(0)}>????????????</div>
                            <div className="border">|</div>
                            <div className={"category" + (currentEditPersonalDataNumber === 1 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(1)}>????????????</div>
                            <div className="border">|</div>
                            <div className={"category" + (currentEditPersonalDataNumber === 2 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(2)}>???????????? ??????</div>
                        </div>
                        {editPersonalDataContainerCases()}
                        <button className="submit" onClick = {async(e) => {
                            e.preventDefault();
                            if(!await ValidateAllPersonalData()) {
                                alert("???????????? ????????? ?????????????????????.");
                                return false;
                            }
                                
                            if (await modifyUserInfo(personalData!)) {
                                alert("?????????????????????.");
                                setEditPersonalData(false);
                            }
                        }}>????????????</button>
                    </div>
                </div>
                <MobileFooter></MobileFooter>
            </div>
        </>
    )
    else return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'} />
                <div className="MobileMyPage">
                    <div className="userInfoBlock">
                        <div className="userImage">
                            {UserImage}
                        </div>
                        <div className="userInfoContainer">
                            <div className="namephone NS px15 line25 bold op6">{user.user?.name + ' / 0' + user.user?.cellphone.slice(3, 5) + '-' + user.user?.cellphone.slice(5, 9) + '-' + user.user?.cellphone.slice(9, 13)}</div>
                            <div className="email NS px15 line25 bold op6">{user.user?.email}</div>
                            <button className="Edit" onClick = {() => {setEditPersonalData(!editPersonalData);
                            }}>{EditVector}</button>
                        </div>
                        <div className="goEditPledge" onClick = {() => setEditPledge(!editPledge)}>
                            {'?????? ?????? ???????????? >'}
                        </div>
                    </div>
                    <div className="myBookBlock">
                        <div className="background"></div>
                        <div className="vector"></div>
                        <div className="textContainer">
                            <div className="title">????????? ??????, ????????? ?????? ?????? ?????????</div>
                            <div className="detail">
                                <div>?????? ????????? ????????? ?????????, ????????? ????????? ????????? ????????? ???????????????.</div>
                                <div>????????? ????????? ?????? ?????? ?????? ??? ?????? ????????? ????????? ???????????????.</div>
                            </div>
                            <Link to = {'/note'} ><div className="goNotePage">{'?????? ????????? ???????????? >'}</div></Link>
                        </div>
                        <div className="divider"></div>
                        <div className="myBookContainer">
                            <div className="title">?????? ?????? ????????? ??????</div>
                            <div className="myBooks">
                                <MementoBook bookOwner = {user.user!} watchingBookUser = {user.user!} />
                            </div>
                            <div className="GivenUsersContainer">
                                {GivenUsers}
                            </div>
                        </div>
                    </div>
                    <div className="getBooksBlock">
                        <div className="background"></div>
                        <div className="title">????????? ????????? ???????????? ?????????</div>
                        <div className="getBooks" style = {{left: (-276 * currentGetBooksNumber + 'px')}}>
                            {GetBooksContainer}
                        </div>
                        <div className="buttonContainer">
                            <div className="cover left"></div>
                            <div className="cover right"></div>
                            <button className="left" onClick = {() => setCurrentGetBooksNumber(Math.max(0, currentGetBooksNumber - 1))}>{leftVector}</button>
                            <button className="right" onClick = {() => setCurrentGetBooksNumber(Math.min(totalGetBooksNumber! - 1, currentGetBooksNumber + 1))}>{rightVector}</button>
                        </div>
                        <div className="dotContainer">
                            {[...Array(totalGetBooksNumber).keys()].map((key) => {
                                return (
                                    <div className = {key === currentGetBooksNumber ? 'selected' : ''}>{MementoDotVector}</div>        
                                )
                            })}
                        </div>
                    </div>
                </div>
                <MobileFooter />
            </div>
        </>
    )
    
}

export default MobileMyPage;

