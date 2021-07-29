import React from 'react';
import { Redirect } from 'react-router-dom';
import SignupAgree from '../components/SignupAgree';
import SignupFill from '../components/SignupFill';
import { imageUrl } from '../etc/config';

export interface SignupInfo1 {
    agreeMessage: boolean;
}

export interface SignupInfo2 {
    name: string;
}

function Signup() {
    let [state, setState] = React.useState(1);
    let [info1, setInfo1] = React.useState<SignupInfo1>();
    let [info2, setInfo2] = React.useState<SignupInfo2>();

    if (state == 3) return <Redirect to={{
        pathname: '/signup/done',
        state: info2,
    }} />;
    return (
        <>
            <div className='signupLogo'>
                <img src={imageUrl('textlogo.png')} />
            </div>
            { (state == 1) && <SignupAgree proceed={(info: SignupInfo1) => { setInfo1(info); setState(2); } } /> }
            { (state == 2) && <SignupFill givenInfo={info1!} proceed={(info: SignupInfo2) => { setInfo2(info); setState(3); } } /> }
        </>
    );
}

export default Signup;