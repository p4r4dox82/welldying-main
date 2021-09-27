import React from 'react';
import { Redirect } from 'react-router-dom';
import SignupAgree from '../components/SignupAgree';
import SignupFill from '../components/SignupFill';
import { imageUrl } from '../etc/config';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { isMobile } from 'react-device-detect';
import { MementoLogo } from '../img/Vectors';

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

    if (state === 3) return <Redirect to={{
        pathname: '/signup/done',
        state: info2,
    }} />;
    if(isMobile) {
        return (
            <>
                <div className = 'signup_page'>
                    <div className = 'signup_background_1'>
                        <div className = 'signup_background_2'>
                            <div className = 'signup_form'>
                                <div className='signupLogo' style = {{width: '291px', left: 'calc(50vw - 291px/2)'}}>
                                    <Link to ='/'>
                                        <div className="MementoLogo">
                                            {MementoLogo}
                                        </div>
                                    </Link>
                                </div>
                                { (state === 1) && <SignupAgree proceed={(info: SignupInfo1) => { setInfo1(info); setState(2); } } /> }
                                { (state === 2) && <SignupFill givenInfo={info1!} proceed={(info: SignupInfo2) => { setInfo2(info); setState(3); } } /> }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className = 'signup_page'>
                <div className = 'signup_background_1'>
                    <div className = 'signup_background_2'>
                        <div className = 'signup_form'>
                            <div className='signupLogo'>
                                <Link to ='/'>
                                    <img src = {imageUrl('mainLogo.png')} />
                                </Link>
                            </div>
                            { (state === 1) && <SignupAgree proceed={(info: SignupInfo1) => { setInfo1(info); setState(2); } } /> }
                            { (state === 2) && <SignupFill givenInfo={info1!} proceed={(info: SignupInfo2) => { setInfo2(info); setState(3); } } /> }
                            <Footer additionalClass = 'no_background' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
