import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { DeathInfo, getUsers, modifyUserInfo, oauthConnect, setUserDeathInfo } from '../etc/api/user';
import { googleClientId, kakaoJskey } from '../etc/config';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import MementoBook from '../components/MementoBook';


import { MementoLogo, UserImage, EditVector, leftVector, rightVector, PlusVector } from '../img/Vectors';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import Contentbox from '../components/Contentbox';


export interface EntryType {
    name: string;
    body: JSX.Element;
    message: string;
    validate: () => boolean | PromiseLike<boolean>;
}


export let checkBatchim = (word: string) => {
    let lastLetter = word[word.length - 1];
    let uni = lastLetter.charCodeAt(0);

    if((uni < 44032) || (uni > 55203)) return;

    return ((uni - 44032) % 28 !== 0);
};


function Mypage() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, AllUsers] = usePromise(getUsers);


    let [editing, setEditing] = React.useState<boolean>(false);

    let [oldPassword, setOldPassword] = React.useState('');
    let [oldPasswordMessage, ] = React.useState('');
    let validateOldPassword = React.useCallback(() => {
        return true;
    }, []);

    let [password, setPassword] = React.useState('');
    let [passwordMessage, setPasswordMessage] = React.useState('');
    let validatePassword = React.useCallback(() => {
        if (!password) {
            setPasswordMessage('');
            return true;
        }

        const regex1 = /^[ -~]{8,200}$/;
        const regex2 = /[a-zA-Z]/;
        const regex3 = /[0-9]/;

        if (!regex1.test(password) || !regex2.test(password) || !regex3.test(password)) {
            setPasswordMessage('비밀번호는 8글자 이상으로, 영문과 숫자를 포함하도록 해 주세요.');
            return false;
        }
        setPasswordMessage('');
        return true;
    }, [password]);

    let [passwordConfirm, setPasswordConfirm] = React.useState('');
    let [passwordConfirmMessage, setPasswordConfirmMessage] = React.useState('');
    let validatePasswordConfirm = React.useCallback(() => {
        let result = password === passwordConfirm;

        if (!result) {
            setPasswordConfirmMessage('비밀번호와 비밀번호 확인 란이 다릅니다.');
            return false;
        }
        setPasswordConfirmMessage('');
        return true;
    }, [password, passwordConfirm])

    let [name, setName] = React.useState('');
    let [nameMessage, setNameMessage] = React.useState('');
    let validateName = React.useCallback(() => {
        if (name.length < 1) {
            setNameMessage('이름을 적어주세요.');
            return false;
        }
        if (name.length > 100) {
            setNameMessage('이름은 100글자 이내로 해 주세요.');
            return false;
        }
        setNameMessage('');
        return true;
    }, [name.length])

    let [birthYear, setBirthYear] = React.useState(0);
    let [birthMonth, setBirthMonth] = React.useState(0);
    let [birthDate, setBirthDate] = React.useState(0);
    let [birthMessage, setBirthMessage] = React.useState('');
    let validateBirth = React.useCallback(() => {
        if (birthYear === 0 || birthMonth === 0 || birthDate === 0) {
            setBirthMessage('생년월일을 적어주세요.');
            return false;
        }
        if (birthYear < 1800 || birthYear > (new Date()).getFullYear() || birthMonth < 1 || birthMonth > 12 || birthDate < 1 || birthDate > [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][birthMonth] || (birthMonth === 2 && birthDate === 29 && (birthYear % 4 !== 0 || (birthYear % 100 === 0 && birthYear % 400 !== 0)))) {
            setBirthMessage('올바른 생년월일을 적어주세요.');
            return false;
        }
        setBirthMessage('');
        return true;
    }, [birthDate, birthMonth, birthYear])

    let [sex, setSex] = React.useState<'female' | 'male'>(Math.random() < 0.5 ? 'female' : 'male');
    let [sexMessage, ] = React.useState('');
    let validateSex = () => {
        return true;
    }

    let [email, setEmail] = React.useState('');
    let [emailMessage, setEmailMessage] = React.useState('');
    let validateEmail = React.useCallback(() => {
        if (!email) {
            setEmailMessage('');
            return true;
        }

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            setEmailMessage('이메일의 형식이 올바르지 않습니다.');
            return false;
        }
        setEmailMessage('');
        return true;
    }, [email])

    let [imageUri, setImageUri] = React.useState<string>('');

    React.useEffect(() => {
        if(!user || !user.user) return;
        setName(user.user?.name);
        setBirthYear(user.user?.birthYear);
        setBirthMonth(user.user?.birthMonth);
        setBirthDate(user.user.birthDate);
        setSex(user.user.sex);
        setEmail(user.user.email);
    }, [user]);

    let entries = React.useMemo<EntryType[]>(() => {
        return [ {
            name: '현재 비밀번호 (바꾸지 않으려면 비워두세요.)',
            body: (
                <>
                    <input type='password' autoComplete='old-password' onChange={(e) => setOldPassword(e.target.value) } value={oldPassword}/>
                </>
            ),
            message: oldPasswordMessage,
            validate: validateOldPassword,
        }, {
            name: '새 비밀번호 (바꾸지 않으려면 비워두세요.)',
            body: (
                <>
                    <input type='password' autoComplete='new-password' onChange={(e) => setPassword(e.target.value) } value={password}/>
                </>
            ),
            message: passwordMessage,
            validate: validatePassword,
        }, {
            name: '비밀번호 확인 (바꾸지 않으려면 비워두세요.)',
            body: (
                <>
                    <input type='password' autoComplete='new-password' onChange={(e) => { setPasswordConfirm(e.target.value); }} value={passwordConfirm}/>
                </>
            ),
            message: passwordConfirmMessage,
            validate: validatePasswordConfirm,
        }, {
            name: '이름',
            body: (
                <>
                    <input autoComplete='name' onChange={(e) => setName(e.target.value)} value={name} />
                </>
            ),
            message: nameMessage,
            validate: validateName,
        }, {
           name: '생년월일',
           body: (
                <>
                    <input style={{width: '100px', textAlign: 'right'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear} />
                    <span> 년 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth} />
                    <span> 월 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate} />
                    <span> 일 </span>
                </>
           ),
           message: birthMessage,
           validate: validateBirth,
        }, {
            name: '성별',
            body: (
                <>
                    <button className={'selectButton' + (sex === 'male' ? '' : ' inactive')} onClick={(e) => {e.preventDefault(); setSex('male')}}> 남 </button>
                    <span> / </span>
                    <button className={'selectButton' + (sex === 'female' ? '' : ' inactive')} onClick={(e) => {e.preventDefault(); setSex('female')}}> 여 </button>
                </>
            ),
            message: sexMessage,
            validate: validateSex,
        }, {
            name: '이메일',
            body: (
                <>
                    <input type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                </>
            ),
            message: emailMessage,
            validate: validateEmail,
        }];
    }, [birthDate, birthMessage, birthMonth, birthYear, email, emailMessage, name, nameMessage, oldPassword, oldPasswordMessage, validateOldPassword, password, passwordConfirm, passwordConfirmMessage, passwordMessage, sex, sexMessage, validateBirth, validateEmail, validateName, validatePassword, validatePasswordConfirm]);
    
    let validateAll = React.useCallback(async () => {
        let result = true;

        for (let { validate } of entries) {
            if (!await validate()) result = false;
        }

        return result;
    }, [entries])

    let [, contents] = usePromise(getContents);

    let [agree, setAgree] = React.useState<boolean>(false);
    
    
    
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

    let [DeathInfo, setDeathInfo] = React.useState<DeathInfo>();

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

    let [modifynumber, setModifyNumber] = React.useState<number>(0);

    let ModifyContent = React.useMemo(() => {
        switch(modifynumber) {
            case 0:
                return  (
                    <div className="ModifyContent">
                        <div className="imageContainer" style = {{cursor: 'pointer'}}>
                            <img src={user.user?.imageUri} alt="" className="profile" />
                            {user.user?.imageUri === '' && <>
                                <div className="addContainer">
                                    {PlusVector}
                                </div>
                                <div className="text NS px12 ">나의 기본 사진 추가하기</div>
                            </>}
                        </div>
                        <div className="InfoContainer">
                            <div className="element">
                                <div className="title">성함</div>
                                <input type="text" value = {name} onChange = {(e) => setName(e.target.value)} style = {{width: '177px'}}/>
                            </div>
                            <div className="element" style = {{marginLeft: '27px'}}>
                                <div className="checkbox" onClick = {() => setSex('male')}>
                                    <div className={sex === 'male' ? "checked" : ''}></div>
                                </div>
                                <span className="subtitle">남성</span>
                                <div className="checkbox" onClick = {() => setSex('female')}>
                                    <div className={sex === 'female' ? "checked" : ''}></div>
                                </div>
                                <span className="subtitle">여성</span>
                            </div>
                            <div className="element">
                                <div className="title">생년월일</div>
                                <input type="text" className="name" value = {birthYear} onChange = {(e) => setBirthYear(Number.parseInt(e.target.value))} style = {{width: '89px'}}/>  
                                <div className="subtitle">년</div>
                                <input type="text" className="name" value = {birthMonth} onChange = {(e) => setBirthMonth(Number.parseInt(e.target.value))} style = {{width: '51px'}}/>  
                                <div className="subtitle">월</div>
                                <input type="text" className="name" value = {birthDate} onChange = {(e) => setBirthDate(Number.parseInt(e.target.value))} style = {{width: '51px'}}/>  
                                <div className="subtitle">일</div>
                            </div>
                        </div>
                        <button className="submit" onClick={async (e) => { 
                            e.preventDefault();
                            if (!await validateAll()) {
                                return false;
                            }
                            if (await modifyUserInfo({
                                username: user.user!.username, 
                                password: password, 
                                name, birthYear, birthMonth, birthDate, sex, email, imageUri, cellphone : user.user!.cellphone
                            })) {
                                setEditing(false);
                            }
                        }}>저장하기</button>
                    </div>
                )
            case 1:
                return (
                    <div className="ModifyContent"style = {{justifyContent: 'center'}}>
                        <div className="InfoContainer type2" style = {{marginTop: '92px'}}>
                            <div className="element">
                                <div className="title" >아이디</div>
                                <input type="text" value = {user.user?.username} readOnly style = {{width: '130px'}}/>
                            </div>
                            <div className="element">
                                { user.user?.kakaoId 
                                    ? <button className = 'connected'>카카오 연동됨</button>
                                    : <KakaoLogin 
                                        token={kakaoJskey}
                                        onSuccess={async (result) => {
                                            const token = result.response.access_token;
                                            const id = result.profile?.id;
                                            if (!id) return;
                                            
                                            await oauthConnect('kakao', id.toString(), token);
                                        }}
                                        onFail={(result) => console.log(result)}     
                                        onLogout={(result) => console.log(result)}   
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> 카카오 연동 </button>}
                                    />
                                }
                            </div>
                            <div className="element">
                                { user.user?.googleId 
                                    ? <button className = 'connected'>구글 연동됨</button> 
                                    : <GoogleLogin
                                        clientId={googleClientId}
                                        onSuccess={async (result) => {
                                            if (result.code) return;
                                            
                                            const token = (result as GoogleLoginResponse).tokenId;
                                            const id = (result as GoogleLoginResponse).googleId;
                    
                                            await oauthConnect('google', id, token);
                                        }}
                                        onFailure={(result) => console.log(result)}
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> 구글 연동 </button>}
                                    />
                                }
                            </div>
                            <div className="element">
                                <div className="title">휴대폰 번호</div>
                                <input type="text" value = {'0' + user.user?.cellphone.slice(3)} readOnly style = {{width: '410px'}}/>
                            </div>
                            <div className="element">
                                <div className="title">이메일 주소</div>
                                <input type="text" value = {email} onChange = {(e) => setEmail(e.target.value)}style = {{width: '410px'}} />
                            </div>
                        </div>
                        <button className="submit" onClick={async (e) => { 
                            e.preventDefault();
                            if (!await validateAll()) {
                                console.log('asd');
                                return false;
                            }
                            if (await modifyUserInfo({
                                username: user.user!.username, 
                                password: password, 
                                name, birthYear, birthMonth, birthDate, sex, email, imageUri, cellphone : user.user!.cellphone
                            })) {
                                setEditing(false);
                            }
                        }}>저장하기</button>
                    </div>
                )
            case 2: 
                return (
                    <div className="ModifyContent"style = {{justifyContent: 'center'}}>
                        <div className="InfoContainer type2" style = {{marginTop: '92px'}}>
                            <div className="element">
                                <div className="title" >현재 비밀번호</div>
                                <input type="password" value = {oldPassword} onChange = {(e) => setOldPassword(e.target.value)} style = {{width: '410px'}} placeholder = '현재 비밀번호를 입력해주십시오'/>
                            </div>
                            <div className="element">
                                <div className="title">변경할 비밀번호</div>
                                <input type="password" value = {password} onChange = {(e) => setPassword(e.target.value)} style = {{width: '410px'}} placeholder = '변경하고 싶은 비밀번호를 입력해주세요.'/>
                            </div>
                            <div className="element">
                                <div className="title">비밀번호 확인</div>
                                <input type="password" value = {passwordConfirm} onChange = {(e) => setPasswordConfirm(e.target.value)}style = {{width: '410px'}} placeholder = '위의 비밀번호와 동일한 비밀번호를 입력해주세요.'/>
                            </div>
                        </div>
                        <button className="submit" onClick={async (e) => { 
                            e.preventDefault();
                            if (!await validateAll()) {
                                return false;
                            }
                            if (await modifyUserInfo({
                                username: user.user!.username, 
                                password: password, 
                                name, birthYear, birthMonth, birthDate, sex, email, imageUri, cellphone : user.user!.cellphone
                            })) {
                                setEditing(false);
                            }
                        }}>저장하기</button>
                    </div>
                )
        }
    }, [modifynumber, name, sex, birthYear, birthMonth, birthDate, email, oldPassword, password, passwordConfirm, imageUri, user.user, validateAll]);
    

    let ModifyInfo = React.useMemo(() => {
        return (
            <>
            <div className="ModifyContainer margin_base">
                <img src={imageUrl('ModifyBackground.png')} alt="" className = 'background'/>
                <div className="ModifySelectContainer NS px15 line25 op8 bold">
                    <div>
                        <span style = {{opacity: (modifynumber === 0 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(0)} >기본정보</span>
                    </div>
                    <div>
                        <span style = {{opacity: (modifynumber === 1 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(1)} >계정정보</span>
                    </div>
                    <div>
                        <span style = {{opacity: (modifynumber === 2 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(2)} >비밀번호 변경</span>
                    </div>
                </div>
                {ModifyContent}
            </div>
            </>
        )
    }, [modifynumber, ModifyContent]);

    React.useEffect(() => {
        if(!user) return;
        if(!user.user?.DeathInfo) return;
        setAgree(user.user?.DeathInfo.agree);
        setDeathInfo(user.user?.DeathInfo);
    }, [user]);

    let LinkNote = React.useRef<any>(null);
    let LinkNoteClick = () => LinkNote.current.click();

    let GiveBookContainer = React.useMemo(() => {
        if(!AllUsers) return<></>;
        return (
            <div className="BookContainer" style = {{paddingTop: '37px'}}>
                <MementoBook bookOwner = {user.user!} watchingBookUser = {user.user!} />
                <div className="vector"></div>
                <div className="giveuserscontainer">
                    {user.user?.UsersInfo.give.map((UserInfo) => {
                        let giveuser = AllUsers.find((user_) => user_.username === UserInfo.username);
                        return (
                            (UserInfo.accept !== 2) && <div className="GiveUsersElement">
                                <div className="UserImage">{UserImage}</div>
                                {(UserInfo.accept === 1) ? <div>
                                    <div className="namephone NS px15 line25 bold op6">{giveuser?.name + ' / 0' + giveuser?.cellphone.slice(3, 5) + '-' + giveuser?.cellphone.slice(5, 9) + '-' + giveuser?.cellphone.slice(9, 13)}</div>
                                    <div className="email NS px15 line25 bold op6">{giveuser?.email}</div>
                                </div> : <>
                                    <div className="email NS px15 line25 bold op6" style ={{width: '230px', letterSpacing: '0em'}}>{(giveuser?.name === undefined ? UserInfo.name : giveuser?.name) + '님의 승인을 대기중입니다.'}</div>
                                </>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [user, AllUsers]);

    let GetBookContainer = React.useMemo(() => {
        if(!AllUsers) return<></>;
        return (
            <div className="BookContainer" style = {{paddingTop: '37px'}}>
                {user.user?.UsersInfo.get.map((UserInfo, key) => {
                    let getuser = AllUsers.find((user_) => user_.cellphone === UserInfo.phonenumber);
                    return (
                        <Link to ={`/confirmbook/${key}`}>
                        <div style = {{width: '236px', height: '441px'}}>
                            <MementoBook bookOwner = {getuser!} watchingBookUser = {user.user!} />
                        </div>
                        </Link>
                    )
                })}
                
            </div>
        );
    }, [user, AllUsers]);
    

    if (!user.loggedIn) return <Redirect to='/login' />; 
    return (
        <>
        <Link to = {'/note/1'} ref = {LinkNote} style = {{display: 'none'}} />
        <div className = 'MyPage'>
            <Header additionalClass='grey borderBottom' />
            <div className="block" style = {{overflow: 'hidden', height: '223px'}}>
                <img src={imageUrl('NotePage/NoteMainBackground.png')} alt="" className="NoteMainBackground" style = {{position: 'absolute'}} />
                <div className="mixblend" style = {{background: 'rgba(230, 229, 226, 1)',mixBlendMode: 'soft-light', width: '100%', height: '223px', position: 'absolute', top: '0px'}}></div>
                <div className="MementoLogo" style = {{margin: '88px 0px 0px calc(50% - 205px/2)'}}>{MementoLogo}</div>
            </div>
            <div className="block">
                <div className="UserInfo margin_base">
                    <div className="element"><div className="UserImage">{UserImage}</div></div>
                    <div className="element">
                        <div className="UserData">
                            <div className="namephone NS px15 line25 bold op6">{user.user?.name + ' / 0' + user.user?.cellphone.slice(3, 5) + '-' + user.user?.cellphone.slice(5, 9) + '-' + user.user?.cellphone.slice(9, 13)}</div>
                            <div className="email NS px15 line25 bold op6">{user.user?.email}</div>
                            <button className="Edit" onClick = {(e) => {
                                e.preventDefault(); 
                                setEditing(!editing);
                                setBirthYear(user.user!.birthYear);
                                setBirthMonth(user.user!.birthMonth);
                                setBirthDate(user.user!.birthDate);
                                setEmail(user.user!.email);
                                setName(user.user!.name);
                                setSex(user.user!.sex);
                                setImageUri(user.user!.imageUri);
                            }}>{EditVector}</button>
                        </div>
                    </div>
                    {editing && ModifyInfo}
                    <div className="element">
                        <div className="text GB px20 line40" style = {{marginTop: '94px', textAlign: 'center'}}>건강한 서비스 이용을 위한 생명 존중 서약</div>
                    </div>
                    <div className="text GB px15 line40 op7" style = {{marginTop: '54px', textAlign: 'center'}}>
                        <div>나는 유언을 작성, 전달, 사용하는 과정에서 절대로 자해나 자살을 시도하지 않을 것을 서약합니다. </div>
                        <div>자살하고 싶은 생각이 들면 반드시 주위 사람에게 도움을 청하거나, 중앙자살예방센터(1393), </div>
                        <div>한국생명의 전화(1588-9191) 등으로 전화를 걸어 도움을 요청하겠습니다.</div>
                    </div>
                    <div className="element">
                        <div className="AgreeContainer" onClick = {() => {setAgree(true); setDeathInfo({...DeathInfo!, agree: true})}}>
                            {!agree && <>
                                <div className="NS px12 bold"  style = {{cursor: 'pointer'}}>네 이해하고 동의합니다.</div>
                                <button className="agree"></button>
                            </>}
                            {agree && <div className="NS px12 bold op3">{`네, 저 ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '은' : '는')} 위와 같이 서약합니다.`}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="DeathInfoContainer margin_base">
                    <img src={imageUrl('MyPageBackground.png')} alt="" className = 'background'/>
                    <div className="title GB px25 line40">나의 사전 장례 & 연명의료, 장기기증 의향서</div>
                    <div className="detail NS px15 line30">
                        <div>급박한 상황이 생겼을 때, 스스로의 자기결정권을 실현할 수 있는 질문들입니다. </div>
                        <div>작성하신 답변은 사망 전에도 열람할 수 있는 오픈프로필에 반영됩니다.</div>
                    </div>
                    <div className="vector" style = {{marginTop: '43px'}}></div>
                    <div className = 'type_container'>
                    </div>
                    {Questions}
                    <div className="vector" style = {{marginTop: '70px'}}></div>
                    <button className="submit NS px18 bold" onClick = {async () => {
                        if(!checkDeathInfoAnswerFilled(DeathInfo!)) alert('모든 항목을 채워주세요');
                        else if(await setUserDeathInfo(user.user!.username, DeathInfo!)) {
                            alert('저장되었습니다.');
                            window.scrollTo(0, 0);
                        }
                        else alert('실패하였습니다');
                    }}>저장하기</button>
                </div>
            </div>
            <div className="block" style = {{overflow: 'hidden'}}>
                <div className="UsersInfo margin_base">
                    <div className="element">
                        <div className="title GB px20 line40">나에게 남긴, 그리고 내가 남긴 기록들</div>
                    </div>
                    <div className="element" style ={{marginTop: '10px'}}>
                        <div className="detail GB px14 line25 op5">
                            <div>내가 기록을 남겨둔 이들과, 나에게 기록을 남겨둔 이들의 목록입니다.</div>
                            <div>각각의 기록은 사망 사실 확인 후 열람 가능한 상태로 변경됩니다.</div>
                        </div>
                    </div>
                    <div className="element" style ={{marginTop: '27px'}}>
                        <div className="more NS px12 bold" onClick = {() => LinkNoteClick()} style = {{cursor: 'pointer'}}>{`작성페이지 바로가기>`}</div>
                    </div>
                    <div className="userscontainer" style = {{paddingTop: '78px'}}>
                        <div>
                            <div className="title GB px16 line20 bold">나의 메멘토 북 전달</div>
                            {GiveBookContainer}
                        </div>
                        <div style = {{marginTop: '104px', width: '1032px', paddingBottom: '30px'}}>
                            <div className="title GB px16 line20 bold">나에게 기록을 남겨놓은 사람들</div>
                            <div style ={{width: '100vw', height: '441px', background: 'rgba(248, 247, 246, 1)', position: 'absolute', top: '46px', left: 'calc(50% - 50vw)'}}></div>
                            {GetBookContainer}
                        </div>
                    </div>
                </div>
            </div>
            {false && <div className="block" style = {{overflow: 'hidden'}}>
                <div className="contents_bookmark margin_base" style = {{marginTop: '115px', textAlign: 'center', paddingBottom: '105px'}}>
                    <div className="title GB px20 line40">당신을 의미있게 만들어준 책갈피</div>
                    <div className="message GB px14 line25 op5 " style = {{marginTop: '10px'}}>
                        <div>죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요</div>
                        <div>않은 감정이 있나요?죽기 전?죽기 전. 감정이 있나요</div>
                    </div>
                    <div className="more NS px12 line15 bold" style = {{marginTop: '27px', color: 'rgba(79, 84, 80, 0.6)'}}>{'나의 책갈피 전체보기>'}</div>
                    <div className="content_container" style = {{textAlign: 'left', flexWrap: 'nowrap', overflow: 'hidden', padding: '20px 20px', left: '-20px', top: '-20px', width: 'fit-content', boxSizing: 'content-box'}}>
                        {contents?.map((content) => <Contentbox additionalClass = 'big type2' content = {content}/>)}
                    </div>
                    <div className="buttoncontainer" style = {{display: 'flex', gap: '25px', top: '-23px', marginLeft: 'calc(1032px - 81px)'}}>
                        <div className="left button">{leftVector}</div>
                        <div className="right button">{rightVector}</div>
                    </div>
                </div>
            </div>}
            <Footer additionalClass= ' '/>
        </div>
        </>
    )
}

export default Mypage;
