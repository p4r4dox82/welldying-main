import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getSections } from '../etc/api/section';
import { modifyUserInfo, oauthConnect } from '../etc/api/user';
import { googleClientId, kakaoJskey } from '../etc/config';
import usePromise from '../etc/usePromise';
import useScroll from '../etc/useScroll';
import { RootReducer } from '../store';


import { MementoLogo } from '../img/Vectors';
import { imageUrl } from '../etc/config';

interface EntryType {
    name: string;
    body: JSX.Element;
    message: string;
    validate: () => boolean | PromiseLike<boolean>;
}

function Mypage() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, sections] = usePromise(getSections);
    let scroll = useScroll();

    let [editing, setEditing] = React.useState<boolean>(false);

    let [oldPassword, setOldPassword] = React.useState('');
    let [oldPasswordMessage, setOldPasswordMessage] = React.useState('');
    let validateOldPassword = () => {
        return true;
    }

    let [password, setPassword] = React.useState('');
    let [passwordMessage, setPasswordMessage] = React.useState('');
    let validatePassword = () => {
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
    }

    let [passwordConfirm, setPasswordConfirm] = React.useState('');
    let [passwordConfirmMessage, setPasswordConfirmMessage] = React.useState('');
    let validatePasswordConfirm = () => {
        let result = password === passwordConfirm;

        if (!result) {
            setPasswordConfirmMessage('비밀번호와 비밀번호 확인 란이 다릅니다.');
            return false;
        }
        setPasswordConfirmMessage('');
        return true;
    }

    let [name, setName] = React.useState('');
    let [nameMessage, setNameMessage] = React.useState('');
    let validateName = () => {
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
    }

    let [birthYear, setBirthYear] = React.useState(0);
    let [birthMonth, setBirthMonth] = React.useState(0);
    let [birthDate, setBirthDate] = React.useState(0);
    let [birthMessage, setBirthMessage] = React.useState('');
    let validateBirth = () => {
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
    }

    let [sex, setSex] = React.useState<'female' | 'male'>(Math.random() < 0.5 ? 'female' : 'male');
    let [sexMessage, ] = React.useState('');
    let validateSex = () => {
        return true;
    }

    let [email, setEmail] = React.useState('');
    let [emailMessage, setEmailMessage] = React.useState('');
    let validateEmail = () => {
        if (!email) {
            setEmailMessage('');
            return true;
        }

        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            setEmailMessage('이메일의 형식이 올바르지 않습니다.');
            return false;
        }
        setEmailMessage('');
        return true;
    }


    let validateAll = async () => {
        let result = true;

        for (let { validate } of entries) {
            if (!await validate()) result = false;
        }

        return result;
    }

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
                    <input autoComplete='name' onChange={(e) => setName(e.target.value)} value={name}/>
                </>
            ),
            message: nameMessage,
            validate: validateName,
        }, {
           name: '생년월일',
           body: (
                <>
                    <input style={{width: '100px', textAlign: 'right'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear}/>
                    <span> 년 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth}/>
                    <span> 월 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate}/>
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
            name: '이메일 (선택)',
            body: (
                <>
                    <input type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                </>
            ),
            message: emailMessage,
            validate: validateEmail,
        }];
    }, [birthDate, birthMessage, birthMonth, birthYear, email, emailMessage, name, nameMessage, oldPassword, oldPasswordMessage, validateOldPassword, password, passwordConfirm, passwordConfirmMessage, passwordMessage, sex, sexMessage, validateBirth, validateEmail, validateName, validatePassword, validatePasswordConfirm]);


    let content = React.useMemo(() => {
        if (editing) return (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { `${user.user?.name}님의 개인 설정 수정` }
                    </h1>
                    <form className='signupForm' style={{marginLeft: 0}}>
                        <ul>
                            <div className='row'>
                                <div className='label'> 아이디 </div>
                                <input readOnly value={user.user?.username}/>
                            </div>

                            { entries.map(({name, body, message}) => (
                                <>
                                    <div className='row'>
                                        <div className='label'> { name } </div>
                                        { body }
                                    </div>
                                    { message && <div> { message } </div> }
                                </>
                            ))}

                            <div className='row'>
                                <div className='label'> 전화번호 </div>
                                <input readOnly value={user.user?.cellphone}/>
                            </div>

                            <div className='row'>
                                <div className='label'> 카카오톡 계정 </div>
                                { user.user?.kakaoId
                                    ? <input readOnly value='연결됨'/>
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
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> 연결하기 </button>}
                                    />
                                }
                            </div>

                            <div className='row'>
                                <div className='label'> 구글 계정 </div>
                                { user.user?.googleId
                                    ? <input readOnly value='연결됨'/>
                                    : <GoogleLogin
                                        clientId={googleClientId}
                                        onSuccess={async (result) => {
                                            if (result.code) return;

                                            const token = (result as GoogleLoginResponse).tokenId;
                                            const id = (result as GoogleLoginResponse).googleId;

                                            await oauthConnect('google', id, token);
                                        }}
                                        onFailure={(result) => console.log(result)}
                                        render={(props) => <button onClick={(e) => { e.preventDefault(); props.onClick(); }}> 연결하기 </button>}
                                    />
                                }
                            </div>
                        </ul>
                    </form>

                    <button onClick={async (e) => {
                        e.preventDefault();
                        if (!await validateAll()) return false;
                        if (await modifyUserInfo({
                            username: user.user!.username,
                            password: password,
                            name, birthYear, birthMonth, birthDate, sex, email,
                        })) {
                            setEditing(false);
                        }
                    }}> 수정 완료 </button>
                </div>
            </>
        ); else return (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { `${user.user?.name}님의 개인 설정` }
                    </h1>
                    <form className='signupForm' style={{marginLeft: 0}}>
                        <div className='row'> <div className='label'> 아이디 </div> <input readOnly value={user.user?.username}/> </div>
                        <div className='row'> <div className='label'> 이름 </div> <input readOnly value={user.user?.name}/> </div>
                        <div className='row'> <div className='label'> 생일 </div> <input readOnly value={`${user.user?.birthYear}년 ${user.user?.birthMonth}월 ${user.user?.birthDate}일`}/> </div>
                        <div className='row'> <div className='label'> 성별 </div> <input readOnly value={user.user?.sex === 'male' ? '남성' : '여성'}/> </div>
                        <div className='row'> <div className='label'> 이메일 </div> <input readOnly value={user.user?.email ?? '입력하지 않음'}/> </div>
                        <div className='row'> <div className='label'> 전화번호 </div> <input readOnly value={user.user?.cellphone}/> </div>
                    </form>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setEditing(true);
                        setBirthYear(user.user!.birthYear);
                        setBirthMonth(user.user!.birthMonth);
                        setBirthDate(user.user!.birthDate);
                        setEmail(user.user!.email);
                        setName(user.user!.name);
                        setSex(user.user!.sex);
                    }}> 수정하기 </button>
                </div>
            </>
        )
    }, [editing, entries]);

    if (!user.loggedIn) return <Redirect to='/login' />;
    return (
        <>
            <Header additionalClass='grey borderBottom' />
            <div className="block" style = {{overflow: 'hidden', height: '223px'}}>
                <img src={imageUrl('NotePage/NoteMainBackground.png')} alt="" className="NoteMainBackground" style = {{position: 'absolute'}} />
                <div className="mixblend" style = {{background: 'rgba(230, 229, 226, 1)',mixBlendMode: 'soft-light', width: '100%', height: '223px', position: 'absolute', top: '0px'}}></div>
                <div className="MementoLogo">{MementoLogo}</div>
            </div>
            <div className='content'>
                <div className='row' style={{margin: 0}}>
                    <div className={'leftArea' + (scroll >= 138 ? ' fixed' : '')}>
                        <Link to='/checklist'>
                            <h1> { `${user.user!.name}님의`} </h1>
                            <h1> 웰다잉 체크리스트 </h1>
                        </Link>
                        <div className='submenuContainer'>
                            <h6> <Link to='/logout'> 로그아웃 </Link> </h6>
                            <h6> <Link to='/mypage'> 개인 설정 </Link> </h6>
                        </div>

                        <div className='navigationMenu'>
                            { sections?.map((section) => (
                                <Link to={`/checklist/${section.id}`}>
                                    <div>
                                        { section.title }
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                { content }
            </div>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default Mypage;
