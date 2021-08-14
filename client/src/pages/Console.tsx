import React from 'react';
import Dropzone from 'react-dropzone';
interface EntryType {
    name: string;
    body: JSX.Element;
    message: string;
    validate: () => boolean | PromiseLike<boolean>;
    noBorderBottom?: boolean;
}

function Console() {
    let [name, setName] = React.useState('');
    let [nameMessage, setNameMessage] = React.useState('');
    let validateName = () => {
        if (name.length < 1) {
            setNameMessage('이름을 적어주세요.');
            return false;
        }
        if (name.length > 100) {
            setNameMessage('이름은 100글자 이내로 해 주세요.');
            return false;
        }
        setNameMessage('');
        return true;
    }

    let [birthYear, setBirthYear] = React.useState(0);
    let [birthMonth, setBirthMonth] = React.useState(0);
    let [birthDate, setBirthDate] = React.useState(0);
    let [birthMessage, setBirthMessage] = React.useState('');
    let validateBirth = () => {
        if (birthYear === 0 || birthMonth === 0 || birthDate === 0) {
            setBirthMessage('생년월일을 적어주세요.');
            return false;
        }
        if (birthYear < 1800 || birthYear > (new Date()).getFullYear() || birthMonth < 1 || birthMonth > 12 || birthDate < 1 || birthDate > [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][birthMonth] || (birthMonth === 2 && birthDate === 29 && (birthYear % 4 !== 0 || (birthYear % 100 === 0 && birthYear % 400 !== 0)))) {
            setBirthMessage('올바른 생년월일을 적어주세요.');
            return false;
        }
        setBirthMessage('');
        return true;
    }

    let [myName, setMyName] = React.useState('');
    let [myNameMessage, setMyNameMessage] = React.useState('');
    let validateMyName = () => {
        if (myName.length < 1) {
            setMyNameMessage('이름을 적어주세요.');
            return false;
        }
        if (myName.length > 100) {
            setMyNameMessage('이름은 100글자 이내로 해 주세요.');
            return false;
        }
        setMyNameMessage('');
        return true;
    }

    let [idFront, setIdFront] = React.useState('');
    let [idBack, setIdBack] = React.useState('');
    let [idMessage, setIdMessage] = React.useState('');
    let validateId = () => {
        if (!/[0-9]{6}/.test(idFront) || !/[0-9]{7}/.test(idBack)) {
            setIdMessage('올바른 주민등록번호를 적어주세요.');
            return false;
        }

        setIdMessage('');
        return true;
    }

    let [email, setEmail] = React.useState('');
    let [emailMessage, setEmailMessage] = React.useState('');
    let validateEmail = () => {
        if (!email) {
            setEmailMessage('이메일을 입력해주세요.');
            return false;
        }

        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            setEmailMessage('이메일의 형식이 올바르지 않습니다.');
            return false;
        }
        setEmailMessage('');
        return true;
    }

    let [file, setFile] = React.useState<File>();
    let [fileMessage, setFileMessage] = React.useState('');
    let validateFile = () => {
        if (!file) {
            setFileMessage('사망증명서를 업로드해주세요.');
            return false;
        }

        setFileMessage('');
        return true;
    }

    let entries = React.useMemo<EntryType[]>(() => {
        let result: EntryType[] =  [
        {
            name: '고인의 이름',
            body: (
                <>
                    <input onChange={(e) => setName(e.target.value)} value={name}/>
                </>
            ),
            message: nameMessage,
            validate: validateName,
        }, {
           name: '고인의 생년월일',
           body: (
                <>
                    <input style={{width: '100px', textAlign: 'right'}} type='number' autoComplete='bday-year' onChange={(e) => setBirthYear(Math.min((new Date()).getFullYear(), Number.parseInt(e.target.value)))} value={birthYear}/>
                    <span> 년 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-month' onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number.parseInt(e.target.value))))} value={birthMonth}/>
                    <span> 월 </span>
                    <input style={{width: '70px', textAlign: 'right'}} type='number' autoComplete='bday-day' onChange={(e) => setBirthDate(Math.min(31, Math.max(1, Number.parseInt(e.target.value))))} value={birthDate}/>
                    <span> 일 </span>
                </>
           ),
           message: birthMessage,
           validate: validateBirth,
        }, {
            name: '본인의 이름',
            body: (
                <>
                    <input autoComplete='name' onChange={(e) => setMyName(e.target.value)} value={myName}/>
                </>
            ),
            message: myNameMessage,
            validate: validateMyName,
        }, {
            name: '본인 주민등록번호',
            body: (
                <>
                    <input style={{width: '150px', textAlign: 'right'}} type='number' onChange={(e) => setIdFront(e.target.value) } value={idFront}/>
                    <span> - </span>
                    <input style={{width: '160px', textAlign: 'right'}} type='number' onChange={(e) => setIdBack(e.target.value)} value={idBack}/>
                </>
            ),
            message: idMessage,
            validate: validateId,
        }, {
            name: '본인 이메일',
            body: (
                <>
                    <input type='email' autoComplete='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                </>
            ),
            message: emailMessage,
            validate: validateEmail,
        }, {
            name: '사망증명서 업로드',
            body: (
                <Dropzone onDrop={ acceptedFiles => {
                    if (acceptedFiles.length == 0) return;
                    setFile(acceptedFiles[0]);
                }}>
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()} className='dropzone'>
                            <input {...getInputProps()} />
                            <p> { file ? file.name : '파일 업로드' } </p>
                        </div>
                    )}
                </Dropzone>
            ),
            message: fileMessage,
            validate: validateFile,
            noBorderBottom: true,
        }];

        return result;
    }, [birthDate, birthMessage, birthMonth, birthYear, email, emailMessage, name, nameMessage, validateBirth, validateEmail, validateName]);

    let validateAll = async () => {
        let result = true;

        for (let { validate } of entries) {
            if (!await validate()) result = false;
        }

        return result;
    }

    return (
        <>

            <form className='signupForm'>
                { entries.map(({name, body, message, noBorderBottom = false }) => (
                    <>
                        <div className={'row' + (noBorderBottom ? ' noBorderBottom' : '') }>
                            <div className='label'> { name } </div>
                            { body }
                        </div>
                        { message && <div> { message } </div> }
                    </>
                ))}

                { entries.map(({ name, message } ) => {
                    if (message) return <p style={{marginBottom: '8px'}}> { `${name}: ${message}` } </p>
                    else return undefined;
                }) }
                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!await validateAll()) return false;
                }}>
                    열람 요청
                </button>
            </form>
        </>
    );
}

export default Console;
