import React from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import { Link, Redirect } from 'react-router-dom';
import MainLogo from '../components/MainLogo';
import { login, oauthLogin } from '../etc/api/user';
import { googleClientId, imageUrl, kakaoJskey } from '../etc/config';


function Login() {
    let [username, setUsername] = React.useState('');
    let [password, setPassword] = React.useState('');
    let [message, setMessage] = React.useState<string>();
    let [redirectTo, setRedirectTo] = React.useState<string>();
    let [redirectToConnect, setRedirectToConnect] = React.useState(false);

    const tryLogin = async () => {
        if (await login(username, password)) setRedirectTo('/');
        else setMessage('아이디 또는 비밀번호가 틀렸습니다.');
    }

    const tryOauthLogin = async (service: string, id: string, token: string) => {
        let response = await oauthLogin(service, id, token);
        if (response === false) setMessage(`${service}를 이용해 로그인하는 데에 문제가 발생했습니다.`);
        else {
            if (response.loggedIn) setRedirectTo('/');
            else setRedirectTo(`/login/connect/${service}/${id}/${token}`);
        }
    }

    if (redirectTo) return <Redirect to={ redirectTo }/>;
    else return (
        <>
            <MainLogo additionalClass='grey' />

            <div className='loginForm'>
                <form>
                    <input className='id' placeholder='아이디' autoComplete='username' onChange={(e) => setUsername(e.target.value)} value={username}/>
                    <input className='password' placeholder='비밀번호' type='password' autoComplete='current-password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <button className='loginButton' type='submit' onClick={(e) => { e.preventDefault(); tryLogin(); }}> 로그인 </button>
                </form>
                { message && (
                    <div className='subCommands'>
                        { message }
                    </div>
                )}
                <div className='subCommands'>
                    <span className='left'> 아이디 찾기 </span>
                    <span className='left'> {' / '} </span>
                    <span className='left'> 비밀번호 찾기 </span>
                    <Link to='/signup'><span className='right'> 회원가입 </span></Link>
                </div>
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
                    render={(props) => <span className='link' style={{backgroundImage: `url(${imageUrl('providers/all.png')})`, width: '39px', height: '39px', backgroundPosition: 'left', float: 'left', margin: '3px'}} onClick={props.onClick}/>}
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
                    render={(props) => <span className='link' style={{backgroundImage: `url(${imageUrl('providers/all.png')})`, width: '39px', height: '39px', backgroundPosition: 'right', float: 'left', margin: '3px'}} onClick={props.onClick}/>}
                />
            </div>
        </>
    )
}

export default Login;
