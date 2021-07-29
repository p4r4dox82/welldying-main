import React from 'react';
import { match, Redirect } from 'react-router-dom';
import MainLogo from '../components/MainLogo';

interface MatchParams {
    name: string;
}

interface Props {
    match: match<MatchParams>;
    location: any;
}

function SignupDone({ match, location }: Props) {
    let [redirectToMain, setRedirectToMain] = React.useState(false);
    let name = location.state.name;

    React.useEffect(() => {
        if (!name) setRedirectToMain(true);
        setTimeout(() => {
            setRedirectToMain(true);
        }, 3000);
    });

    if (redirectToMain) return <Redirect push to='/' />;

    return (
        <>
            <MainLogo additionalClass='grey' />
            <form className='signupForm'>
                { `${name}님, 가입이 완료되었습니다. 잠시 후 메인 화면으로 이동합니다.` }
            </form>
        </>
    );
}

export default SignupDone;