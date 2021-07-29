import React from 'react';

interface Props {
    submit: (emailFront: string, emailBack: string) => void | PromiseLike<void>;
}

const defaultEmailBacks = [
    'gmail.com',
    'naver.com',
    'daum.net',

]

function EmailForm({ submit } : Props) {
    let [emailFront, setEmailFront] = React.useState<string>('');
    let [emailBack, setEmailBack] = React.useState<string>('gmail.com');

    return (
        <div style={{display: 'flex', maxWidth: '600px'}}>
            <input value={emailFront} onChange={(e) => setEmailFront(e.target.value)} style={{flex: '1 0 200px'}} />
            <span className='inputFont' style={{ color: 'black', fontWeight: 'bold', margin: '10px'}}> @ </span>
            { defaultEmailBacks.find((value) => value === emailBack) ?
                <select value={emailBack} onChange={(e) => setEmailBack(e.target.value)} style={{flex: '1 0 200px'}} >
                    { defaultEmailBacks.map((content) => <option value={content}> {content} </option>)}
                    <option value={''}> 직접 입력 </option>
                </select>
            : 
                <input value={emailBack} onChange={(e) => setEmailBack(e.target.value)} style={{flex: '1 0 200px'}} />
            }
            <button style={{margin: '10px', flex: '0 0 100px'}} onClick={(e) => {
                e.preventDefault();
                submit(emailFront, emailBack);
            }}>
                신청하기
            </button>
        </div>
    )
}

export default EmailForm;