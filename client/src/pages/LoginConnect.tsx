import React from 'react';
import { Link, match, Redirect } from 'react-router-dom';
import { login, oauthConnect } from '../etc/api/user';


interface MatchParams {
    service: string;
    id: string;
    token: string;
};

interface Props {
    match: match<MatchParams>;
};

function LoginConnect({ match } : Props) {
    let service = match.params.service;
    let id = match.params.id;
    let token = match.params.token;

    let [username, setUsername] = React.useState('');
    let [password, setPassword] = React.useState('');
    let [message, setMessage] = React.useState<string>();
    let [redirectToMain, setRedirectToMain] = React.useState(false);

    const tryLogin = async () => {
        if (await login(username, password)) {
            if (await oauthConnect(service, id, token)) setRedirectToMain(true);
            else setMessage('연결에 실패했습니다.');
        }
        else setMessage('아이디 또는 비밀번호가 틀렸습니다.');
    }

    if (service !== 'kakao' && service !== 'google') return <Redirect to='/' />;
    else if (redirectToMain) return <Redirect to='/'/>;
    else return (
        <>

            <div className='loginForm'>
                아직 웰다잉 서비스에 연결되어 있지 않은 계정입니다.
                <br/>
                아이디와 비밀번호를 입력해서 웰다잉 서비스에 연결해주세요!
                <form>
                    <input className='id' placeholder='아이디' autoComplete='username' onChange={(e) => setUsername(e.target.value)} value={username}/>
                    <input className='password' placeholder='비밀번호' type='password' autoComplete='current-password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                </form>
                <button className='loginButton' onClick={() => tryLogin()}> 로그인 </button>
                { message && (
                    <div className='subCommands'>
                        { message }
                    </div>
                )}
                <div> 아직 웰다잉 계정이 없다면, <br/> 아래 버튼을 눌러 회원가입해주세요! </div>
                <Link to='/signup'><button> 회원 가입 </button></Link>
            </div>
        </>
    )
}

export default LoginConnect;
