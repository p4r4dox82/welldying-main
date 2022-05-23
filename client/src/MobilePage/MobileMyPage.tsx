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
            setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '올바른 전화번호를 적어주세요.'});
            return false;
        }
        if (await checkCellphoneDuplicate(personalData.cellphone)) {
            setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '이미 사용하고 있는 전화번호입니다.'});
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
                setPersonalDataValidateMessage({...personalDataValidateMessage, cellphone: '휴대전화를 인증해주세요.'});
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
                setPersonalDataValidateMessage({...personalDataValidateMessage, phoneValidateCode: '인증번호를 입력하고 인증을 눌러주세요.'});
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
                setPersonalDataValidateMessage({...personalDataValidateMessage, newPassword: '비밀번호는 8글자 이상으로, 영문과 숫자를 포함하도록 해 주세요.'});
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
            setPersonalDataValidateMessage({...personalDataValidateMessage, newPasswordConfirm: '비밀번호가 일치하지 않습니다.'});
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
                            <div className="message">{(givenUser?.name === undefined ? userinfo.name : givenUser?.name) + '님의 승인을 대기중입니다.'}</div>
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
        let answer1Array = ['불교 형식', '기독교 형식', '카톨릭 형식', '전통 장례', '기타'];
        let answer2Array = ['화장 형식', '매장 형식', '기타'];
        let answer3Array = ['지인 모두 참석', '가족만 참석', '기타'];
        let answer4Array = ['예, 희망합니다.', '아니오, 희망하지 않습니다'];
        let answer5Array = ['예, 희망합니다.', '아니오, 희망하지 않습니다'];
        let result = [];
        result.push({title: '원하시는 장례 진행 방법이 있나요?', answer: answer1Array});
        result.push({title: '어떤 장법을 원하시나요?', answer: answer2Array});
        result.push({title: '장례식의 규모는 어떻게 하시겠습니까?', answer: answer3Array});
        result.push({title: '장기기증을 희망하십니까?', answer: answer4Array});
        result.push({title: '연명 치료를 희망하십니까?', answer: answer5Array});

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
                                    <div className = 'checkBox' onClick = {answer === '기타' ? () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, '', key)})} : () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, answer, key)})}}>
                                        <div className = {isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? (DeathInfo?.answerArray[key] === answer ? 'checked' : '') : (answer === '기타' ? 'checked' : '')} />
                                    </div>
                                    <div className = {'name' + (answer === '기타' ? ' minWidthZero' : '')}>
                                    {answer}
                                    </div>
                                    {answer === '기타' && <input type='text' autoComplete='password' onChange={(e) => setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, e.target.value, key)})} value={(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? '' : DeathInfo?.answerArray[key])} placeholder = '25자 이하로 작성해주세요.' disabled = {(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? true : false)}/>}
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
                                <div className="title">이름</div>
                                <input type="text" className="text" value = {personalData.name} onChange = {(e) => setPersonalData({...personalData!, name: e.target.value})} style = {{width: '80px'}} />
                            </div>
                            <div className="editInfoElement inline">
                                <div className="title">성별</div>
                                <div className="checkAnswerElement" onClick = {() => setPersonalData({...personalData!, sex: 'male'})}>
                                    <div className="checkBox">
                                        <div className={personalData.sex === 'male' ? "checked" : ''}></div>
                                    </div>
                                    <div className="name">남성</div>
                                </div>
                                <div className="checkAnswerElement" style = {{marginLeft: '16px'}} onClick = {() => setPersonalData({...personalData!, sex: 'female'})}>
                                    <div className="checkBox">
                                        <div className={personalData.sex === 'female' ? "checked" : ''}></div>
                                    </div>
                                    <div className="name">여성</div>
                                </div>
                            </div>
                            <div className="editInfoElement">
                                <div className="title">생년월일</div>
                                <input type="text" className="text" value = {personalData.birthYear} onChange = {(e) => setPersonalData({...personalData!, birthYear: Number(e.target.value)})} style = {{width: '60px'}} />
                                <span className="yearMonthDate">년</span>
                                <input type="text" className="text" value = {personalData.birthMonth} onChange = {(e) => setPersonalData({...personalData!, birthMonth: Number(e.target.value)})}style = {{width: '40px', marginLeft: '14px'}} />
                                <span className="yearMonthDate">월</span>
                                <input type="text" className="text" value = {personalData.birthDate} onChange = {(e) => setPersonalData({...personalData!, birthDate: Number(e.target.value)})}style = {{width: '40px', marginLeft: '14px'}} />
                                <span className="yearMonthDate">일</span>
                            </div>
                        </div>
                )
            case 1:
                return (
                    <div className="editInfoContainer">
                        <div className="editInfoElement">
                            <div className="title">아이디</div>
                            <input type="text" className="text" value = {personalData.username} disabled />
                        </div>
                        <div className="editInfoElement">
                            <div className="title">이메일</div>
                            <input type="text" className="text" value = {personalData.email} onChange = {(e) => setPersonalData({...personalData!, email: e.target.value})} />
                        </div>
                        <div className="editInfoElement">
                            <div className="title">휴대전화</div>
                            <div className="buttonInputAnswerElement">
                                <input type="text" className="text" value = {'0' + personalData.cellphone.slice(3, 13)} onChange = {(e) => setPersonalData({...personalData!, cellphone: '+82' + e.target.value.slice(1,11)})} />
                                <button className="sendCode">인증번호 전송</button>
                            </div>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">인증번호 입력</div>
                            <div className="buttonInputAnswerElement">
                                <input type="text" className="text" value = {phoneValidateCode} onChange = {(e) => setPhoneValidateCode(Number(e.target.value))} placeholder = '인증번호를 입력해주세요.'/>
                                <button className="confirmCode">인증확인</button>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="editInfoContainer">
                        <div className="editInfoElement">
                            <div className="title">현재 비밀번호</div>
                            <input type="password" className="text" value = {currentPassword} onChange = {(e) => setCurrentPassword(e.target.value)} placeholder = '현재 비밀번호를 입력해주세요.'/>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">변경할 비밀번호</div>
                            <input type="password" className="text" value = {personalData.password} onChange = {(e) => setPersonalData({...personalData!, password: e.target.value})} placeholder = '8~20자리 비밀번호를 입력해주세요.'/>
                        </div>
                        <div className="editInfoElement">
                            <div className="title">비밀번호 확인</div>
                            <input type="password" className="text" value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)} placeholder = '위와 동일한 비밀번호를 다시 한 번 입력해주세요.'/>
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
                        <div className="title" >당신은 죽음을 받아들일 준비가 되어 있는 사람인가요?</div>
                        <div className="message">
                            <div>나는 유언을 작성, 전달, 사용하는 과정에서 절대로 자해나 자살을 시도하지 않을 것을 서약합니다. </div>
                            <div>자살하고 싶은 생각이 들면 반드시 주위 사람에게 도움을 청하거나, 중앙자살예방센터(1393), </div>
                            <div>한국생명의 전화(1588-9191) 등으로 전화를 걸어 도움을 요청하겠습니다.</div>
                        </div>
                        <div className="AgreeContainer" onClick = {async () => {
                            if(await setUserDeathInfo(user.user!.username, {...DeathInfo!, agree: true})) {
                                setDeathInfo({...DeathInfo!, agree: true})
                            }
                            }}>
                            {!DeathInfo?.agree && <>
                                <button className="agreeButton"></button>
                                <div className="agreeText"  style = {{cursor: 'pointer'}}>네 이해하고 동의합니다.</div>
                            </>}
                            {DeathInfo?.agree && <div className="agreeText agreed">{`네, 저 ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '은' : '는')} 위와 같이 서약합니다.`}</div>}
                        </div>
                    </div>
                    <div className="DeathInfoContainer">
                        <img src={imageUrl('MyPageBackground.png')} alt="" className = 'background'/>
                        <div className="title">나의 사전 장례 & 연명의료, 장기기증 의향서</div>
                        <div className="detail">
                            <div>급박한 상황이 생겼을 때, 스스로의 자기결정권을 실현할 수 있는 질문들입니다. </div>
                            <div>작성하신 답변은 사망 전에도 열람할 수 있는 오픈프로필에 반영됩니다.</div>
                        </div>
                        <div className="vector upward"></div>
                        {Questions}
                        <div className="vector downward"></div>
                        <button className="submit NS px18 bold" onClick = {async () => {
                            if(!checkDeathInfoAnswerFilled(DeathInfo!)) alert('모든 항목을 채워주세요');
                            else if(await setUserDeathInfo(user.user!.username, DeathInfo!)) {
                                alert('저장되었습니다.');
                                setEditPledge(false);
                                window.scrollTo(0, 0);
                            }
                            else alert('실패하였습니다');
                        }}>저장하기</button>
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
                    {false && <div className="addUserImage">{'나의 기본 사진 추가하기 >'}</div>}
                    <div className="personalDataContainer">
                        <div className="categoryContainer">
                            <div className={"category" + (currentEditPersonalDataNumber === 0 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(0)}>기본정보</div>
                            <div className="border">|</div>
                            <div className={"category" + (currentEditPersonalDataNumber === 1 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(1)}>계정정보</div>
                            <div className="border">|</div>
                            <div className={"category" + (currentEditPersonalDataNumber === 2 ? ' selected' : '')} onClick = {() => setCurrentEditPersonalDataNumber(2)}>비밀번호 변경</div>
                        </div>
                        {editPersonalDataContainerCases()}
                        <button className="submit" onClick = {async(e) => {
                            e.preventDefault();
                            if(!await ValidateAllPersonalData()) {
                                alert("입력하신 정보가 잘못되었습니다.");
                                return false;
                            }
                                
                            if (await modifyUserInfo(personalData!)) {
                                alert("저장되었습니다.");
                                setEditPersonalData(false);
                            }
                        }}>저장하기</button>
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
                            {'나의 서약 바로가기 >'}
                        </div>
                    </div>
                    <div className="myBookBlock">
                        <div className="background"></div>
                        <div className="vector"></div>
                        <div className="textContainer">
                            <div className="title">나에게 남긴, 그리고 내가 남긴 기록들</div>
                            <div className="detail">
                                <div>내가 기록을 남겨둔 이들과, 나에게 기록을 남겨둔 이들의 목록입니다.</div>
                                <div>각각의 기록은 사망 사실 확인 후 열람 가능한 상태로 변경됩니다.</div>
                            </div>
                            <Link to = {'/note'} ><div className="goNotePage">{'작성 페이지 바로가기 >'}</div></Link>
                        </div>
                        <div className="divider"></div>
                        <div className="myBookContainer">
                            <div className="title">나의 유언 자서전 전달</div>
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
                        <div className="title">나에게 기록을 남겨놓은 사람들</div>
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

