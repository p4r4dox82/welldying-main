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
            setPasswordMessage('??????????????? 8?????? ????????????, ????????? ????????? ??????????????? ??? ?????????.');
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
            setPasswordConfirmMessage('??????????????? ???????????? ?????? ?????? ????????????.');
            return false;
        }
        setPasswordConfirmMessage('');
        return true;
    }, [password, passwordConfirm])

    let [name, setName] = React.useState('');
    let [nameMessage, setNameMessage] = React.useState('');
    let validateName = React.useCallback(() => {
        if (name.length < 1) {
            setNameMessage('????????? ???????????????.');
            return false;
        }
        if (name.length > 100) {
            setNameMessage('????????? 100?????? ????????? ??? ?????????.');
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
            setBirthMessage('??????????????? ???????????????.');
            return false;
        }
        if (birthYear < 1800 || birthYear > (new Date()).getFullYear() || birthMonth < 1 || birthMonth > 12 || birthDate < 1 || birthDate > [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][birthMonth] || (birthMonth === 2 && birthDate === 29 && (birthYear % 4 !== 0 || (birthYear % 100 === 0 && birthYear % 400 !== 0)))) {
            setBirthMessage('????????? ??????????????? ???????????????.');
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
            setEmailMessage('???????????? ????????? ???????????? ????????????.');
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
            name: '?????? ???????????? (????????? ???????????? ???????????????.)',
            body: (
                <>
                    <input type='password' autoComplete='old-password' onChange={(e) => setOldPassword(e.target.value) } value={oldPassword}/>
                </>
            ),
            message: oldPasswordMessage,
            validate: validateOldPassword,
        }, {
            name: '??? ???????????? (????????? ???????????? ???????????????.)',
            body: (
                <>
                    <input type='password' autoComplete='new-password' onChange={(e) => setPassword(e.target.value) } value={password}/>
                </>
            ),
            message: passwordMessage,
            validate: validatePassword,
        }, {
            name: '???????????? ?????? (????????? ???????????? ???????????????.)',
            body: (
                <>
                    <input type='password' autoComplete='new-password' onChange={(e) => { setPasswordConfirm(e.target.value); }} value={passwordConfirm}/>
                </>
            ),
            message: passwordConfirmMessage,
            validate: validatePasswordConfirm,
        }, {
            name: '??????',
            body: (
                <>
                    <input autoComplete='name' onChange={(e) => setName(e.target.value)} value={name} />
                </>
            ),
            message: nameMessage,
            validate: validateName,
        }, {
           name: '????????????',
           body: (
                <>
                    <input style={{width: '100px', textAlign: 'right'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear} />
                    <span> ??? </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth} />
                    <span> ??? </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate} />
                    <span> ??? </span>
                </>
           ),
           message: birthMessage,
           validate: validateBirth,
        }, {
            name: '??????',
            body: (
                <>
                    <button className={'selectButton' + (sex === 'male' ? '' : ' inactive')} onClick={(e) => {e.preventDefault(); setSex('male')}}> ??? </button>
                    <span> / </span>
                    <button className={'selectButton' + (sex === 'female' ? '' : ' inactive')} onClick={(e) => {e.preventDefault(); setSex('female')}}> ??? </button>
                </>
            ),
            message: sexMessage,
            validate: validateSex,
        }, {
            name: '?????????',
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
                                <div className="text NS px12 ">?????? ?????? ?????? ????????????</div>
                            </>}
                        </div>
                        <div className="InfoContainer">
                            <div className="element">
                                <div className="title">??????</div>
                                <input type="text" value = {name} onChange = {(e) => setName(e.target.value)} style = {{width: '177px'}}/>
                            </div>
                            <div className="element" style = {{marginLeft: '27px'}}>
                                <div className="checkbox" onClick = {() => setSex('male')}>
                                    <div className={sex === 'male' ? "checked" : ''}></div>
                                </div>
                                <span className="subtitle">??????</span>
                                <div className="checkbox" onClick = {() => setSex('female')}>
                                    <div className={sex === 'female' ? "checked" : ''}></div>
                                </div>
                                <span className="subtitle">??????</span>
                            </div>
                            <div className="element">
                                <div className="title">????????????</div>
                                <input type="text" className="name" value = {birthYear} onChange = {(e) => setBirthYear(Number.parseInt(e.target.value))} style = {{width: '89px'}}/>  
                                <div className="subtitle">???</div>
                                <input type="text" className="name" value = {birthMonth} onChange = {(e) => setBirthMonth(Number.parseInt(e.target.value))} style = {{width: '51px'}}/>  
                                <div className="subtitle">???</div>
                                <input type="text" className="name" value = {birthDate} onChange = {(e) => setBirthDate(Number.parseInt(e.target.value))} style = {{width: '51px'}}/>  
                                <div className="subtitle">???</div>
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
                        }}>????????????</button>
                    </div>
                )
            case 1:
                return (
                    <div className="ModifyContent"style = {{justifyContent: 'center'}}>
                        <div className="InfoContainer type2" style = {{marginTop: '92px'}}>
                            <div className="element">
                                <div className="title" >?????????</div>
                                <input type="text" value = {user.user?.username} readOnly style = {{width: '130px'}}/>
                            </div>
                            <div className="element">
                                { user.user?.kakaoId 
                                    ? <button className = 'connected'>????????? ?????????</button>
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
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> ????????? ?????? </button>}
                                    />
                                }
                            </div>
                            <div className="element">
                                { user.user?.googleId 
                                    ? <button className = 'connected'>?????? ?????????</button> 
                                    : <GoogleLogin
                                        clientId={googleClientId}
                                        onSuccess={async (result) => {
                                            if (result.code) return;
                                            
                                            const token = (result as GoogleLoginResponse).tokenId;
                                            const id = (result as GoogleLoginResponse).googleId;
                    
                                            await oauthConnect('google', id, token);
                                        }}
                                        onFailure={(result) => console.log(result)}
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> ?????? ?????? </button>}
                                    />
                                }
                            </div>
                            <div className="element">
                                <div className="title">????????? ??????</div>
                                <input type="text" value = {'0' + user.user?.cellphone.slice(3)} readOnly style = {{width: '410px'}}/>
                            </div>
                            <div className="element">
                                <div className="title">????????? ??????</div>
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
                        }}>????????????</button>
                    </div>
                )
            case 2: 
                return (
                    <div className="ModifyContent"style = {{justifyContent: 'center'}}>
                        <div className="InfoContainer type2" style = {{marginTop: '92px'}}>
                            <div className="element">
                                <div className="title" >?????? ????????????</div>
                                <input type="password" value = {oldPassword} onChange = {(e) => setOldPassword(e.target.value)} style = {{width: '410px'}} placeholder = '?????? ??????????????? ?????????????????????'/>
                            </div>
                            <div className="element">
                                <div className="title">????????? ????????????</div>
                                <input type="password" value = {password} onChange = {(e) => setPassword(e.target.value)} style = {{width: '410px'}} placeholder = '???????????? ?????? ??????????????? ??????????????????.'/>
                            </div>
                            <div className="element">
                                <div className="title">???????????? ??????</div>
                                <input type="password" value = {passwordConfirm} onChange = {(e) => setPasswordConfirm(e.target.value)}style = {{width: '410px'}} placeholder = '?????? ??????????????? ????????? ??????????????? ??????????????????.'/>
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
                        }}>????????????</button>
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
                        <span style = {{opacity: (modifynumber === 0 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(0)} >????????????</span>
                    </div>
                    <div>
                        <span style = {{opacity: (modifynumber === 1 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(1)} >????????????</span>
                    </div>
                    <div>
                        <span style = {{opacity: (modifynumber === 2 ? '0.8' : '0.3'), cursor: 'pointer'}}onClick = {() => setModifyNumber(2)} >???????????? ??????</span>
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
                                    <div className="email NS px15 line25 bold op6" style ={{width: '230px', letterSpacing: '0em'}}>{(giveuser?.name === undefined ? UserInfo.name : giveuser?.name) + '?????? ????????? ??????????????????.'}</div>
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
                        <div className="text GB px20 line40" style = {{marginTop: '94px', textAlign: 'center'}}>????????? ????????? ????????? ?????? ?????? ?????? ??????</div>
                    </div>
                    <div className="text GB px15 line40 op7" style = {{marginTop: '54px', textAlign: 'center'}}>
                        <div>?????? ????????? ??????, ??????, ???????????? ???????????? ????????? ????????? ????????? ???????????? ?????? ?????? ???????????????. </div>
                        <div>???????????? ?????? ????????? ?????? ????????? ?????? ???????????? ????????? ????????????, ????????????????????????(1393), </div>
                        <div>??????????????? ??????(1588-9191) ????????? ????????? ?????? ????????? ?????????????????????.</div>
                    </div>
                    <div className="element">
                        <div className="AgreeContainer" onClick = {() => {setAgree(true); setDeathInfo({...DeathInfo!, agree: true})}}>
                            {!agree && <>
                                <div className="NS px12 bold"  style = {{cursor: 'pointer'}}>??? ???????????? ???????????????.</div>
                                <button className="agree"></button>
                            </>}
                            {agree && <div className="NS px12 bold op3">{`???, ??? ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '???' : '???')} ?????? ?????? ???????????????.`}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="DeathInfoContainer margin_base">
                    <img src={imageUrl('MyPageBackground.png')} alt="" className = 'background'/>
                    <div className="title GB px25 line40">?????? ?????? ?????? & ????????????, ???????????? ?????????</div>
                    <div className="detail NS px15 line30">
                        <div>????????? ????????? ????????? ???, ???????????? ?????????????????? ????????? ??? ?????? ??????????????????. </div>
                        <div>???????????? ????????? ?????? ????????? ????????? ??? ?????? ?????????????????? ???????????????.</div>
                    </div>
                    <div className="vector" style = {{marginTop: '43px'}}></div>
                    <div className = 'type_container'>
                    </div>
                    {Questions}
                    <div className="vector" style = {{marginTop: '70px'}}></div>
                    <button className="submit NS px18 bold" onClick = {async () => {
                        if(!checkDeathInfoAnswerFilled(DeathInfo!)) alert('?????? ????????? ???????????????');
                        else if(await setUserDeathInfo(user.user!.username, DeathInfo!)) {
                            alert('?????????????????????.');
                            window.scrollTo(0, 0);
                        }
                        else alert('?????????????????????');
                    }}>????????????</button>
                </div>
            </div>
            <div className="block" style = {{overflow: 'hidden'}}>
                <div className="UsersInfo margin_base">
                    <div className="element">
                        <div className="title GB px20 line40">????????? ??????, ????????? ?????? ?????? ?????????</div>
                    </div>
                    <div className="element" style ={{marginTop: '10px'}}>
                        <div className="detail GB px14 line25 op5">
                            <div>?????? ????????? ????????? ?????????, ????????? ????????? ????????? ????????? ???????????????.</div>
                            <div>????????? ????????? ?????? ?????? ?????? ??? ?????? ????????? ????????? ???????????????.</div>
                        </div>
                    </div>
                    <div className="element" style ={{marginTop: '27px'}}>
                        <div className="more NS px12 bold" onClick = {() => LinkNoteClick()} style = {{cursor: 'pointer'}}>{`??????????????? ????????????>`}</div>
                    </div>
                    <div className="userscontainer" style = {{paddingTop: '78px'}}>
                        <div>
                            <div className="title GB px16 line20 bold">?????? ????????? ??? ??????</div>
                            {GiveBookContainer}
                        </div>
                        <div style = {{marginTop: '104px', width: '1032px', paddingBottom: '30px'}}>
                            <div className="title GB px16 line20 bold">????????? ????????? ???????????? ?????????</div>
                            <div style ={{width: '100vw', height: '441px', background: 'rgba(248, 247, 246, 1)', position: 'absolute', top: '46px', left: 'calc(50% - 50vw)'}}></div>
                            {GetBookContainer}
                        </div>
                    </div>
                </div>
            </div>
            {false && <div className="block" style = {{overflow: 'hidden'}}>
                <div className="contents_bookmark margin_base" style = {{marginTop: '115px', textAlign: 'center', paddingBottom: '105px'}}>
                    <div className="title GB px20 line40">????????? ???????????? ???????????? ?????????</div>
                    <div className="message GB px14 line25 op5 " style = {{marginTop: '10px'}}>
                        <div>?????? ???, ?????? ????????? ?????? ??? ?????????? ?????? ?????? ????????? ?????? ?????? ????????? ?????????</div>
                        <div>?????? ????????? ???????????????? ?????????? ???. ????????? ?????????</div>
                    </div>
                    <div className="more NS px12 line15 bold" style = {{marginTop: '27px', color: 'rgba(79, 84, 80, 0.6)'}}>{'?????? ????????? ????????????>'}</div>
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
