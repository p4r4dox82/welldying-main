import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPhone, verifyPhoneCheck, checkCellphoneDuplicate } from '../etc/api/user';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import { getUser } from '../etc/api/user';
import usePromise from '../etc/usePromise';
import { MementoLogo } from '../img/Vectors';

interface EntryType {
    name: string;
    body: JSX.Element;
    message: string;
    validate: () => boolean | PromiseLike<boolean>;
}

function Findid() {

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    let [cellPhoneFront, ] = React.useState('010');
    let [cellphone, setCellphone] = React.useState('');
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

    let [userLoading, user] = usePromise(() => getUser(cellphone), [cellphone]);
    let [error, setError] = React.useState<string>('');
    let [finded, setFinded] = React.useState<boolean>(false);

    return (
      <>
        <div className = 'signup_page'>
            <div className = 'signup_background_1'>
                <div className = 'signup_background_2'>
                    <div className = 'signup_form'>
                        <div className='signupLogo'>
                            <Link to ='/'>
                                <div className="MementoLogo">
                                    {MementoLogo}
                                </div>
                            </Link>
                        </div>
                        <div className = 'info'>
                            <div className = 'title'>
                            {!finded ? '아이디 찾기' : '아이디 확인'}
                            </div>
                            <div className = 'detail'>
                                {!finded && <>
                                  <div>아이디가 기억나지 않으시나요?</div>
                                  <div>본인인증을 통해 가입하신 아이디를 확인하실 수 있습니다.</div>
                                </>}
                                {finded && <div>가입하신 정보와 일치하는 아이디 정보를 확인해주세요.</div>}
                            </div>
                        </div>
                        <form className='signupForm margin_33px'>
                            {!finded &&
                            <>
                            <div className = 'name'>사용자 정보</div>
                            <div className={'row'} style={{display: 'flex', margin: '17px 0px 0px 0px'}}>
                                <div className='label flex'>성명</div>
                                <input className = {(nameMessage ? 'error' : '') + 'small_padding'} style = {{width: '412px', margin: '0px'}} autoComplete='name' onChange={(e) => setName(e.target.value)} value={(nameMessage ? nameMessage : name)} onClick = {() => {setNameMessage('');}} placeholder = '성명을 입력해주세요.'/>
                            </div>
                            <div className={'row'} style={{display: 'flex', margin: '12px 0px 0px 0px'}}>
                                <div className='label flex'>생년월일</div>
                                <input className = 'small_padding' style={{width: '135px', textAlign: 'left', margin: '0px 16px 0px 0px'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear} placeholder = '출생년도(4자)'/>
                                <input className = 'small_padding' style={{width: '126px', textAlign: 'left', margin: '0px 16px 0px 0px'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth} placeholder = '월'/>
                                <input className = 'small_padding' style={{width: '119px', textAlign: 'left'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate} placeholder = '일'/>
                            </div>
                            <div className = 'name' style={{margin: '37px 0px 0px 0px'}}>본인 인증 방법</div>
                            <div className={'row'} style={{display: 'flex', margin: '17px 0px 0px 0px'}}>
                                <div className='label flex'>휴대전화</div>
                                <div style={{display: 'flex', width: '437px', margin: '0px'}}>
                                    <input className = {(cellPhoneMessage ? 'error' : '') + 'small_padding'} onChange={(e) => { setPhoneVerifyStarted(false); setCellphone(e.target.value); setCellPhoneMiddle(e.target.value.slice(3, 7)); setCellPhoneRear(e.target.value.slice(7, 11));} } value={(cellPhoneMessage ? cellPhoneMessage : cellphone)} placeholder = '- 없이 번호만 입락해주세요.' onClick = {() => {setCellPhoneMessage('');}}/>
                                    <button style={{flex: '0 0 150px', margin:'0px 0px 0px 14px'}} onClick={(e) => { e.preventDefault(); startPhoneVerify(); } }>
                                        { phoneVerifyStarted ? '전송 완료' : '인증번호전송' }
                                    </button>
                                </div>
                            </div>
                            <div className={'row'} style={{display: 'flex', margin: '12px 0px 0px 0px'}}>
                                <div className='label flex'>인증번호</div>
                                <div style={{display: 'flex', width: '437px', margin: '0px'}}>
                                    <input type='text' className = {(phoneCodeMessage ? 'error' : '') + 'small_padding'} onChange={(e) => setPhoneCode(Number.parseInt(e.target.value))} value={phoneCodeMessage ? phoneCodeMessage : phoneCode} placeholder = '전송된 인증번호를 입력해주세요.' onClick = {() => {setPhoneCodeMessage('');}}/>
                                    <button style={{flex: '0 0 150px', margin:'0px 0px 0px 14px'}} className={(phoneVerified ? 'inactive' : '')} onClick={(e) => { e.preventDefault(); endPhoneVerify(); }}>
                                        { phoneVerified ? '인증 완료' : '인증확인' }
                                    </button>
                                </div>
                            </div>
                            {error && <div className = 'error'>{error}</div>}
                            <button type='submit' className='findButton' onClick={async (e) => {
                                e.preventDefault();
                                if(user && (user.name !== name || user.birthYear !== birthYear || user.birthMonth !== birthMonth || user.birthDate !== birthDate))
                                {setError('입력된 정보가 잘못되었습니다.'); setFinded(false);}
                                else if(user) {setError(''); setFinded(true);}
                            }}>
                                아이디 찾기
                            </button>
                            <div className = 'info bottom'>
                                <div className = 'detail bottom'>
                                    <div>&middot; 입력한 정보는 본인인증 용도 외 다른 용도로 이용되지 않습니다.</div>
                                    <div>&middot; 본인인증이 잘 되지 않으시면 메멘토 이메일로 문의해주세요.</div>
                                </div>
                            </div>
                            </>}
                            {finded && <>
                              <button className = 'id_verify' disabled>
                              {user && user.username}
                              </button>
                              <Link to='/login'><button className = 'findButton margin_23px'>
                              로그인하기
                              </button>
                              </Link>
                            </>}
                            <div className = 'info no_border'>
                                <div className = 'title'>
                                    비밀번호 찾기
                                </div>
                                <div className = 'detail'>
                                    <div>비밀번호가 기억나지 않으시나요?</div>
                                    <div>본인인증 후 비밀번호를 재 설정하실 수 있습니다.</div>
                                </div>
                            </div>
                            <Link to='/findpassword'>
                                <button className='findButton white'>
                                    비밀번호 찾기
                                </button>
                            </Link>
                        </form>
                        <Footer additionalClass = 'no_background' />
                    </div>
                </div>
            </div>
        </div>
      </>
    );
}

export default Findid;
