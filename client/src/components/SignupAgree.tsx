import React from 'react';
import { imageUrl } from '../etc/config';
import { signupText1, signupText2, signupText3, signupText4 } from '../etc/predefinedText';
import { SignupInfo1 } from '../pages/Signup';

interface Props {
    proceed: (info: SignupInfo1) => void;
};

function SignupAgree({ proceed } : Props) {
    let [check1, setCheck1] = React.useState(false);
    let [check2, setCheck2] = React.useState(false);
    let [check3, setCheck3] = React.useState(false);
    let [check4, setCheck4] = React.useState(false);

    let allCheck = React.useMemo(() => check1 && check2 && check3 && check4, [check1, check2, check3, check4]);

    return (
        <div className='signupForm'>
            <div className='row'>
                <div className='checkForm' onClick={() => { setCheck1(!allCheck); setCheck2(!allCheck); setCheck3(!allCheck); setCheck4(!allCheck); } }>
                    <div className='checkBox big'>
                        <img className={'checkSign' + (allCheck ? ' active' : '')} src={imageUrl('check.png')} />
                    </div>
                    <div className='checkLabel'>
                        메멘토 이용약관, 개인정보 취급 안내, 디지털 유언 이용약관, 웰다잉 체크리스트 서비스 이용 약관, 메멘토 메시지 정보 수신(선택)에 모두 동의합니다.
                    </div>
                </div>

                <div style={{borderBottom: '2px solid #D9D9D9', width: '100%', marginTop: '40px'}} />

                <div className='checkForm' onClick={() => setCheck1(!check1)}>
                    <div className='checkBox'>
                        <img className={'checkSign' + (check1 ? ' active' : '')} src={imageUrl('check.png')} />
                    </div>
                    <div className='checkLabel'>
                        메멘토 이용약관
                    </div>
                </div>
                <div className='textbox'>
                    { signupText1.split('\n').map((text) => <div> { text } </div>) }
                </div>

                <div className='checkForm' onClick={() => setCheck2(!check2)}>
                    <div className='checkBox'>
                        <img className={'checkSign' + (check2 ? ' active' : '')} src={imageUrl('check.png')} />
                    </div>
                    <div className='checkLabel'>
                        개인 정보 취급 방침
                    </div>
                </div>
                <div className='textbox'>
                    { signupText2.split('\n').map((text) => <div> { text } </div>) }
                </div>

                <div className='checkForm' onClick={() => setCheck3(!check3)}>
                    <div className='checkBox'>
                        <img className={'checkSign' + (check3 ? ' active' : '')} src={imageUrl('check.png')} />
                    </div>
                    <div className='checkLabel'>
                        디지털 유언 약관
                    </div>
                </div>
                <div className='textbox'>
                    { signupText3.split('\n').map((text) => <div> { text } </div>) }
                </div>

                <div className='checkForm' onClick={() => setCheck4(!check4)}>
                    <div className='checkBox'>
                        <img className={'checkSign' + (check4 ? ' active' : '')} src={imageUrl('check.png')} />
                    </div>
                    <div className='checkLabel'>
                        메멘토 메시지 정보 수신 (선택)
                    </div>
                </div>
                <div className='textbox'>
                    { signupText4.split('\n').map((text) => <div> { text } </div>) }
                </div>
            </div>

            <button style={{width: '200px', padding: '25px', fontSize: '24px', margin: '100px auto', marginLeft: '50%', transform: 'translateX(-50%)'}} onClick={() => { 
                if (check1 && check2 && check3) proceed({ agreeMessage: check4 });
            }}>
                다음
            </button>


        </div>
    )
}
export default SignupAgree;