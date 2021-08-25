import React from 'react';
import { register, checkUsernameDuplicate, verifyPhone, verifyPhoneCheck, checkCellphoneDuplicate } from '../etc/api/user';
import { SignupInfo1, SignupInfo2 } from '../pages/Signup';

interface EntryType {
    name: string;
    body: JSX.Element;
    message: string;
    validate: () => boolean | PromiseLike<boolean>;
}

interface Props {
    givenInfo: SignupInfo1;
    proceed: (info: SignupInfo2) => void;
}

const contentShower = ['아버지', '어머니', '조부모님', '형제/자매', '자녀', '배우자'] as const;
export type ShowContentType = { [k in typeof contentShower[number]]: boolean };

function SignupFill({ givenInfo, proceed } : Props) {

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    let [username, setUsername] = React.useState('');
    let [usernameMessage, setUsernameMessage] = React.useState('');
    let [usernameValidated, setUsernameValidated] = React.useState(false);
    let validateUsername = async () => {
        const regex1 = /^[ -~]{5,100}$/;

        if (!regex1.test(username)) {
            setUsernameMessage('아이디는 5글자 이상으로 설정해주세요.');
            return false;
        }

        let duplicate = await checkUsernameDuplicate(username);

        if (duplicate) {
            setUsernameMessage('중복된 아이디가 존재합니다.');
            return false;
        }

        setUsernameValidated(true);
        setUsernameMessage('');
        return true;
    }

    let [password, setPassword] = React.useState('');
    let [passwordMessage, setPasswordMessage] = React.useState('');
    let validatePassword = () => {
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
            setPasswordConfirmMessage('위의 비밀번호와 일치하지 않습니다.');
            return false;
        }
        setPasswordConfirmMessage('');
        return true;
    }

    let [name, setName] = React.useState('');
    let [nameMessage, setNameMessage] = React.useState('');
    let validateName = () => {
        if (name.length < 1) {
            setNameMessage('성명을 입력해주세요.');
            return false;
        }
        if (name.length > 100) {
            setNameMessage('성명은 100글자 이내로 해 주세요.');
            return false;
        }
        setNameMessage('');
        return true;
    }

    let [birthYear, setBirthYear] = React.useState(2000);
    let [birthMonth, setBirthMonth] = React.useState(1);
    let [birthDate, setBirthDate] = React.useState(1);
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

    let [sex, setSex] = React.useState<'female' | 'male'>('male');
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

    let [cellPhoneFront, ] = React.useState('010');
    let [cellPhoneNumber, setCellPhoneNumber] = React.useState('');
    let [cellPhoneMiddle, setCellPhoneMiddle] = React.useState('');
    let [cellPhoneRear, setCellPhoneRear] = React.useState('');
    let [cellPhoneMessage, setCellPhoneMessage] = React.useState('');
    let [phoneVerifyStarted, setPhoneVerifyStarted] = React.useState(false);
    let startPhoneVerify = async () => {
        if (phoneVerifyStarted) return false;
        if (!await checkCellPhone()) return false;
        let result = await verifyPhone(cellPhoneFront, cellPhoneMiddle, cellPhoneRear);
        if (result) {
            setPhoneVerifyStarted(true);
            setPhoneCode(undefined);
        }
        return result;
    }
    let checkCellPhone = async () => {
        if (cellPhoneMiddle.length < 4 || cellPhoneRear.length < 4) {
            setCellPhoneMessage('올바른 전화번호를 적어주세요.');
            return false;
        }
        if (await checkCellphoneDuplicate(`+82${cellPhoneFront.slice(1)}${cellPhoneMiddle}${cellPhoneRear}`)) {
            setCellPhoneMessage('이미 사용하고 있는 전화번호입니다.');
            return false;
        }
        setCellPhoneMessage('');
        return true;
    }

    let validateCellPhone = async () => {
        if (!await checkCellPhone()) return false;
        if (!phoneVerified) {
            setCellPhoneMessage('휴대전화를 인증해주세요.');
            return false;
        }
        setCellPhoneMessage('');
        return true;
    }

    let [phoneCodeDigest, setPhoneCodeDigest] = React.useState('');
    let [phoneCode, setPhoneCode] = React.useState<number>();
    let [phoneCodeMessage, setPhoneCodeMessage] = React.useState('');
    let [phoneVerified, setPhoneVerified] = React.useState(false);
    let endPhoneVerify = async () => {
        if (!phoneCode || !phoneVerifyStarted) return false;

        let result = await verifyPhoneCheck(cellPhoneFront, cellPhoneMiddle, cellPhoneRear, phoneCode);
        if (result.isVerified) {
            setPhoneVerified(true);
            setPhoneCodeMessage('');
            setPhoneCodeDigest(result.phoneCodeDigest);
            return true;
        }
        else {
            setPhoneCodeMessage('인증에 실패했습니다.');
            return false;
        }
    }
    let validatePhoneCode = () => {
        if (!phoneVerified) {
            setPhoneCodeMessage('인증번호를 입력하고 인증을 눌러주세요.');
            return false;
        }
        return true;
    }

    let [showContent, setShowContent] = React.useState<ShowContentType>({
        '아버지': false,
        '어머니': false,
        '조부모님': false,
        '형제/자매': false,
        '자녀': false,
        '배우자': false,
    })

    let entries = React.useMemo<EntryType[]>(() => {
        let result: EntryType[] = [];

        result.push({
            name: '아이디',
            body: (
                <div style={{display: 'flex'}}>
                    <input className = {usernameMessage ? 'error' : ''} autoComplete='username' onChange={(e) => { setUsernameValidated(false); setUsername(e.target.value) } } value={(usernameMessage ? usernameMessage : username)} placeholder = '아이디를 입력해주세요.' onClick = {() => {setUsernameMessage('');}}/>
                    <button style={{flex: '0 0 150px', margin:'0px 0px 0px 30px'}} className={usernameValidated ? 'inactive' : undefined} onClick={(e) => { e.preventDefault(); validateUsername(); } }>
                        { usernameValidated ? '중복 확인 완료' : '중복 확인' }
                    </button>
                </div>
            ),
            message: usernameMessage,
            validate: validateUsername,
        });

        result.push({
            name: '비밀번호',
            body: (
                <>
                    <input type={passwordMessage ? 'text' : 'password'} className = {passwordMessage ? 'error' : ''} autoComplete='new-password' onChange={(e) => setPassword(e.target.value) } value={(passwordMessage ? passwordMessage : password)} onClick = {() => {setPasswordMessage('');}} placeholder = '숫자, 영문자 조합으로 8~20자리 비밀번호를 입력해주세요.'/>
                </>
            ),
            message: passwordMessage,
            validate: validatePassword,
        });

        result.push({
            name: '비밀번호 확인',
            body: (
                <>
                    <input type={passwordConfirmMessage ? 'text' : 'password'} className = {passwordConfirmMessage ? 'error' : ''} autoComplete='new-password' onChange={(e) => { setPasswordConfirm(e.target.value); }} value={(passwordConfirmMessage ? passwordConfirmMessage : passwordConfirm)} onClick = {() => {setPasswordConfirmMessage('');}} placeholder = '위와 동일한 비밀번호를 다시 한 번 입력해주세요.' />
                </>
            ),
            message: passwordConfirmMessage,
            validate: validatePasswordConfirm,
        });

        result.push({
            name: '성명',
            body: (
                <>
                    <input className = {nameMessage ? 'error' : ''} autoComplete='name' onChange={(e) => setName(e.target.value)} value={(nameMessage ? nameMessage : name)} onClick = {() => {setNameMessage('');}} placeholder = '성명을 입력해주세요.'/>
                </>
            ),
            message: nameMessage,
            validate: validateName,
        });

        result.push({
          name: '성별',
          body: (
            <>
            <div className = 'sex_container'>
                <span className='checkForm span'>
                    <div className='checkBox' style={{margin: '0px 0px 0px 0px'}}onClick={(e) => {e.preventDefault(); setSex('male')}}>
                        <div className={'checkSign' + (sex === 'male' ? ' active' : '')} />
                    </div>
                    <div className='label' style={{margin: '0px 0px 0px 10px'}}>
                        남성
                    </div>
                </span>
                <span className='checkForm span'>
                    <div className='checkBox' onClick={(e) => {e.preventDefault(); setSex('female')}}>
                        <div className={'checkSign' + (sex === 'female' ? ' active' : '')} />
                    </div>
                    <div className='label' style={{margin: '0px 0px 0px 10px'}}>
                        여성
                    </div>
                </span>
            </div>
            </>
          ),
          message: sexMessage,
          validate: validateSex,
        });

        result.push({
           name: '생년월일',
           body: (
                <>
                    <input style={{width: '164px', textAlign: 'left', margin: '0px 16px 0px 0px'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear} placeholder = '출생년도(4자)'/>
                    <input style={{width: '156px', textAlign: 'left', margin: '0px 16px 0px 0px'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth} placeholder = '월'/>
                    <input style={{width: '147px', textAlign: 'left'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate} placeholder = '일'/>
                </>
           ),
           message: birthMessage,
           validate: validateBirth,
        });

        result.push({
            name: '이메일',
            body: (
                <>
                    <input type='email' className = {emailMessage ? 'error' : ''} autoComplete='email' onChange={(e) => setEmail(e.target.value)} value={emailMessage ? emailMessage : email} onClick = {() => {setEmailMessage('');}} placeholder = '이메일을 입력해주세요.'/>
                </>
            ),
            message: emailMessage,
            validate: validateEmail,
        });

        result.push({
            name: '휴대전화번호',
            body: (
              <>
                <div style={{display: 'flex'}}>
                    <input className = {cellPhoneMessage ? 'error' : ''} onChange={(e) => { setPhoneVerifyStarted(false); setCellPhoneNumber(e.target.value); setCellPhoneMiddle(e.target.value.slice(3, 7)); setCellPhoneRear(e.target.value.slice(7, 11));} } value={(cellPhoneMessage ? cellPhoneMessage : cellPhoneNumber)} placeholder = '- 없이 번호만 입락해주세요.' onClick = {() => {setCellPhoneMessage('');}}/>
                    <button style={{flex: '0 0 150px', margin:'0px 0px 0px 30px'}} onClick={(e) => { e.preventDefault(); startPhoneVerify(); } }>
                        { phoneVerifyStarted ? '전송 완료' : '인증번호전송' }
                    </button>
                </div>
              </>
            ),
            message: cellPhoneMessage,
            validate: validateCellPhone,
        });

        result.push({
            name: '인증번호 입력',
            body: (
                <div style={{display: 'flex'}}>
                    <input type='text' className = {phoneCodeMessage ? 'error' : ''} onChange={(e) => setPhoneCode(Number.parseInt(e.target.value))} value={phoneCodeMessage ? phoneCodeMessage : phoneCode} placeholder = '전송된 인증번호를 입력해주세요.' onClick = {() => {setPhoneCodeMessage('');}}/>
                    <button style={{flex: '0 0 150px', margin:'0px 0px 0px 30px'}} className={(phoneVerified ? 'inactive' : '')} onClick={(e) => { e.preventDefault(); endPhoneVerify(); } }>
                        { phoneVerified ? '인증 완료' : '인증확인' }
                    </button>
                </div>
            ),
            message: phoneCodeMessage,
            validate: validatePhoneCode,
        });

        return result;
    }, [phoneVerifyStarted, birthDate, birthMessage, birthMonth, birthYear, cellPhoneFront, cellPhoneMessage, cellPhoneMiddle, cellPhoneRear, email, emailMessage, endPhoneVerify, name, nameMessage, password, passwordConfirm, passwordConfirmMessage, passwordMessage, phoneCode, phoneCodeMessage, phoneVerified, sex, sexMessage, startPhoneVerify, username, usernameMessage, usernameValidated, validateBirth, validateCellPhone, validateEmail, validateName, validatePassword, validatePasswordConfirm, validateUsername]);

    let validateAll = async () => {
        let result = true;

        for (let { validate } of entries) {
            if (!await validate()) result = false;
        }

        return result;
    }

    return (
        <form className='signupForm margin_72px'>
            { entries.map(({name, body, message}) => (
                <>
                    <div className={'row'} style={{width: (name === '성명' ? '265px' : (name === '성별' ? '190px' : '100%')), margin: (name === '성별' ? '20px 0px 0px 45px' : '20px 0px 0px 0px')}}>
                        <div className='label'> { name } </div>
                        { body }
                        { (message && name === '생년월일') && <div className='message'> { message } </div> }
                    </div>
                </>
            ))}

            <button type='submit' className='signupButton' onClick={async (e) => {
                e.preventDefault();
                if (!await validateAll()) return false;
                if (await register({
                    username, password, name, birthYear, birthMonth, birthDate, sex, email,
                    cellphone: `+82${cellPhoneFront.slice(1)}${cellPhoneMiddle}${cellPhoneRear}`,
                    agreeMessage: givenInfo.agreeMessage,
                    phoneCodeDigest,
                    showContent,
                })) {
                    proceed({ name });
                }
            }}>
                가입 완료
            </button>
        </form>
    );
}

export default SignupFill;
