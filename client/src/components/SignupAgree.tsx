import React from 'react';
import { signupText1, signupText2, signupText3, signupText4 } from '../etc/predefinedText';
import { SignupInfo1 } from '../pages/Signup';
import { isMobile } from 'react-device-detect';


interface Props {
    proceed: (info: SignupInfo1) => void;
};

function SignupAgree({ proceed } : Props) {
    let [check1, setCheck1] = React.useState(false);
    let [check2, setCheck2] = React.useState(false);
    let [check3, setCheck3] = React.useState(false);
    let [check4, setCheck4] = React.useState(false);

    let allCheck = React.useMemo(() => check1 && check2 && check3 && check4, [check1, check2, check3, check4]);

    let [message, setmessage] = React.useState<String>();

    if(isMobile) {
        return (
            <div className='signupForm margin_52px'>
                <div className='row' style = {{width: '291px', left: 'calc(50vw - 291px/2)'}}>
                    <div className='checkForm border' onClick={() => { setCheck1(!allCheck); setCheck2(!allCheck); setCheck3(!allCheck); setCheck4(!allCheck); } }>
                        <div className='checkBox' style = {{marginLeft: '5px'}}>
                            <div className={'checkSign' + (allCheck ? ' active' : '')} />
                        </div>
                        <div className='GB px13 bold' style = {{marginLeft: '15px'}}>
                            <div style = {{marginBottom: '10px'}}>{`메멘토 이용약관, 개인정보 취급 안내,`}</div>
                            <div>{`메멘토 메시지 수신에 모두 동의합니다.`}</div>
                        </div>
                    </div>

                    <div className='checkForm' onClick={() => setCheck1(!check1)}>
                        <div className='checkBox' style = {{marginLeft: '5px'}}>
                            <div className={'checkSign' + (check1 ? ' active' : '')}/>
                        </div>
                        <div className='NS px14 bold' style = {{marginLeft: '15px', width: '150px'}}>
                            메멘토 이용약관
                        </div>
                        <div className = 'more NotoSans' style = {{marginLeft: '10px'}}>
                            {`전체보기 >`}
                        </div>
                    </div>
                    <div className='textbox mobiletext'>
                        { signupText1.split('\n').map((text) => <div> { text } </div>) }
                    </div>

                    <div className='checkForm' onClick={() => setCheck2(!check2)}>
                        <div className='checkBox' style = {{marginLeft: '5px'}}>
                            <div className={'checkSign' + (check2 ? ' active' : '')}/>
                        </div>
                        <div className='NS px14 bold' style = {{marginLeft: '15px', width: '150px'}}>
                            개인 정보 취급 동의
                        </div>
                        <div className = 'more NotoSans' style = {{marginLeft: '10px'}}>
                            {`전체보기 >`}
                        </div>
                    </div>
                    <div className='textbox mobiletext'>
                        { signupText2.split('\n').map((text) => <div> { text } </div>) }
                    </div>

                    <div className='checkForm' onClick={() => setCheck4(!check4)}>
                        <div className='checkBox' style = {{marginLeft: '5px'}}>
                            <div className={'checkSign' + (check4 ? ' active' : '')}/>
                        </div>
                        <div className='NS px14 bold' style = {{marginLeft: '15px'}}>
                            메멘토 메시지 정보 수신 동의
                            <span className = 'select'>
                            {`(선택)`}
                            </span>
                        </div>
                    </div>
                    <div className='textbox noborder mobiletext' style = {{width: '261px'}}>
                        { signupText4.split('\n').map((text) => <div> { text } </div>) }
                    </div>
                </div>

                <div className = 'signupagree_bottom'>
                    {message && <div className = 'error_message'>{message}</div>}

                    <div className = 'button_container' style = {{display: 'flex', flexWrap: 'wrap', width: '291px', gap: '13px', left: 'calc(50vw - 291px/2)'}}>
                        <div className = 'next_button' onClick={() => {
                            if (check1 && check2) proceed({ agreeMessage: check4 }); else setmessage('이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요');
                        }} style = {{width: '291px'}}>
                            <div>다음으로</div>
                        </div>
                        <div className = 'cancel_button' style = {{width: '291px'}}>
                            <div>취소하기</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='signupForm margin_52px'>
            <div className='row'>
                <div className='checkForm border' onClick={() => { setCheck1(!allCheck); setCheck2(!allCheck); setCheck3(!allCheck); setCheck4(!allCheck); } }>
                    <div className='checkBox'>
                        <div className={'checkSign' + (allCheck ? ' active' : '')} />
                    </div>
                    <div className='checkLabel GyeonggiBatang'>
                        <div>{`메멘토 이용약관, 개인정보 취급 안내, `}</div>
                        <div>{`메멘토 메시지 정보 수신(선택)에 모두 동의합니다.`}</div>
                    </div>
                </div>

                <div className='checkForm' onClick={() => setCheck1(!check1)}>
                    <div className='checkBox'>
                        <div className={'checkSign' + (check1 ? ' active' : '')}/>
                    </div>
                    <div className='checkLabel NotoSans'>
                        메멘토 이용약관
                    </div>
                    <div className = 'more NotoSans'>
                        {`전체보기 >`}
                    </div>
                </div>
                <div className='textbox'>
                    { signupText1.split('\n').map((text) => <div> { text } </div>) }
                </div>

                <div className='checkForm' onClick={() => setCheck2(!check2)}>
                    <div className='checkBox'>
                        <div className={'checkSign' + (check2 ? ' active' : '')}/>
                    </div>
                    <div className='checkLabel NotoSans'>
                        개인 정보 취급 동의
                    </div>
                    <div className = 'more NotoSans'>
                        {`전체보기 >`}
                    </div>
                </div>
                <div className='textbox'>
                    { signupText2.split('\n').map((text) => <div> { text } </div>) }
                </div>

                <div className='checkForm' onClick={() => setCheck4(!check4)}>
                    <div className='checkBox'>
                        <div className={'checkSign' + (check4 ? ' active' : '')}/>
                    </div>
                    <div className='checkLabel NotoSans'>
                        메멘토 메시지 정보 수신 동의
                        <span className = 'select'>
                        {`(선택)`}
                        </span>
                    </div>
                </div>
                <div className='textbox noborder'>
                    { signupText4.split('\n').map((text) => <div> { text } </div>) }
                </div>
            </div>

            <div className = 'signupagree_bottom'>
                {message && <div className = 'error_message'>{message}</div>}

                <div className = 'button_container'>
                    <div className = 'cancel_button'>
                        <div>취소하기</div>
                    </div>
                    <div className = 'next_button' onClick={() => {
                        if (check1 && check2) proceed({ agreeMessage: check4 }); else setmessage('이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요');
                    }}>
                        <div>다음으로</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignupAgree;
