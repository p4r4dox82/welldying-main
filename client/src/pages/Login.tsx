import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import { Link, Redirect } from 'react-router-dom';
import { login, oauthLogin } from '../etc/api/user';
import { googleClientId, imageUrl, kakaoJskey } from '../etc/config';
import Footer from '../components/Footer';
import { MementoLogo } from '../img/Vectors';
import { Match } from '@testing-library/dom';
import { isMobile } from 'react-device-detect';
import MobileFooter from '../MobileComponents/MobileFooter';

interface Props {
    match: Match;
    location: any;
}


function Login({ match, location }: Props) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    let [username, setUsername] = React.useState('');
    let [password, setPassword] = React.useState('');
    let [message, setMessage] = React.useState<string>();
    let [redirectTo, setRedirectTo] = React.useState<string>();

    const tryLogin = async () => {
        if (await login(username, password)) {
            if (!location || !location.state || !location.state.from) {
                setRedirectTo('/');
            } else {
                setRedirectTo(String(location.state.from));
            }
        }
        else setMessage('가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.');
    }

    const tryOauthLogin = async (service: string, id: string, token: string) => {
        let response = await oauthLogin(service, id, token);
        if (response === false) {
            setMessage(`${service}를 이용해 로그인하는 데에 문제가 발생했습니다.`);
            alert(`${service}를 이용해 로그인하는 데에 문제가 발생했습니다.`);
        }
        else {
            if (response.loggedIn) {
                setRedirectTo('/');
            }
            else setRedirectTo(`/login/connect/${service}/${id}/${token}`);
        }
    }

    if (redirectTo) return <Redirect to={ redirectTo }/>;
    else return (
        <div className = {isMobile ? "Mobile" : ""}>
            <div className = 'login_background_1' />
            <div className = 'login_background_2' />
            <div className='loginForm'>
                <Link to ='/'>
                    <div className="MementoLogo">
                        {MementoLogo}
                    </div>
                </Link>
                <form>
                    <input className='id' placeholder='아이디' autoComplete='username' onChange={(e) => setUsername(e.target.value)} value={username}/>
                    <input className='password' placeholder='비밀번호' type='password' autoComplete='current-password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <button className='loginButton' type='submit' onClick={(e) => { e.preventDefault(); tryLogin(); }}> 메멘토 로그인 </button>
                </form>
                {isMobile ? <div className='subCommands'>
                    <Link to='/signup'><span>{`회원가입`}</span></Link>
                    <Link to='/findid'><span>아이디 찾기</span></Link>
                    <Link to='/findpassword'><span>비밀번호 찾기</span></Link>
                </div> : 
                <div className='subCommands'>
                    <Link to='/findid'><span className='left'> 아이디 찾기 </span></Link>
                    <span className='left'> {' / '} </span>
                    <Link to='/findpassword'><span className='left'> 비밀번호 찾기 </span></Link>
                    <Link to='/signup'><span className='right'> {`회원가입 >`} </span></Link>
                </div>}
                {false && <div className = 'other_login' style = {{cursor: 'pointer'}}>
                    <KakaoLogin
                        token={kakaoJskey}
                        onSuccess={async (result) => {
                            const token = result.response.access_token;
                            const id = result.profile?.id;
                            if (!id) return;

                            await tryOauthLogin('kakao', id.toString(), token);
                        }}
                        onFail={(result) => console.log(result)}
                        onLogout={(result) => console.log(result)}
                        render={(props) => <span className='link' style={{backgroundImage: `url(${imageUrl('providers/all.png')})`, width: '39px', height: '39px', backgroundPosition: 'left', float: 'left', margin: '5px'}} onClick={props.onClick}/>}
                    />
                    <GoogleLogin
                        clientId={googleClientId}
                        onSuccess={async (result) => {
                            if (result.code) return;

                            const token = (result as GoogleLoginResponse).tokenId;
                            const id = (result as GoogleLoginResponse).googleId;

                            await tryOauthLogin('google', id, token);
                        }}
                        onFailure={(result) => console.log(result)}
                        render={(props) => <span className='link' style={{backgroundImage: `url(${imageUrl('providers/all.png')})`, width: '39px', height: '39px', backgroundPosition: 'right', float: 'left', margin: '5px'}} onClick={props.onClick}/>}
                    />
                </div>}
                { message && (
                    <div className='login_error'>
                        { message }
                    </div>
                )}
            </div>
            {isMobile ? <MobileFooter /> : <Footer additionalClass = 'no_background floar one_page' />}
        </div>
    )
}

export default Login;
