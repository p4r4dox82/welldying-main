import React from 'react';
import { match, Redirect } from 'react-router-dom';
import { login } from '../etc/api/user';

interface MatchParams {
    name: string;
    username: string;
    password: string;
}

interface Props {
    match: match<MatchParams>;
    location: any;
}



function SignupDone({ match, location }: Props) {
    let [redirectToMain, setRedirectToMain] = React.useState(false);
    let name = location.state.name;
    let username = location.state.username;
    let password = location.state.password;
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let trylogin = async () => {
        if (await login(username, password)) setRedirectTo('/');
    }

    React.useEffect(() => {
        if (!name) setRedirectToMain(true);
        setTimeout(() => {
            trylogin();
        }, 1000);
    });

    if (redirectTo) return <Redirect to={ redirectTo }/>;

    return (
        <>
            <form className='signupForm'>
                { `${name}님, 가입이 완료되었습니다. 잠시 후 메인 화면으로 이동합니다.` }
            </form>
        </>
    );
}

export default SignupDone;
