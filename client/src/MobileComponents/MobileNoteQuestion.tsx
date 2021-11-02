import React from 'react';
import { Link } from 'react-router-dom';
import { parseDate } from '../etc';
import { Answer, writeAnswer } from '../etc/api/answer';
import { uploadImage_formdata } from '../etc/api/image';
import { Question } from '../etc/api/question';
import { Colon, PlusVector } from '../img/Vectors';

interface Props {
    question: Question;
    answer: Answer | null;
    written: boolean;
}

function MobileNoteQuestion(props: Props) {
    let [width, setWidth] = React.useState<number>(0);
    let [answerCol, setAnswerCol] = React.useState<number>(0);
    let [answerRow, setAnswerRow] = React.useState<number>(5);
    let [answerLength, setAnswerLength] = React.useState<number>(0);
    let [answerByteLength, setAnswerByteLength] = React.useState<number>(0);
    let [answer, setAnswer] = React.useState<string>('');
    let [imageUri, setImageUri] = React.useState<string>('');
    let userAnswer = props.answer;
    let question = props.question;
    React.useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
            setAnswerCol(((window.innerWidth - 80) - (window.innerWidth - 80)%7)/7);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    })
    let setAnswerRowCalculate = (message: string) =>  { 
        let bytemessage = message.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1");
        let bytelength = bytemessage.length;
        let bytemessageArray = bytemessage.split('\n');
        let newRow = 0;
        bytemessageArray.map((byte) => {
            let bytelen = byte.length;
            newRow += (bytelen - bytelen/answerCol)/answerCol + 1;
            newRow = parseInt(String(newRow));
        })
        setAnswerByteLength(bytelength);
        setAnswerRow(Math.max(5, newRow));
    }
    React.useEffect(() => {
        if(!userAnswer) {
            setAnswer('');
            setAnswerLength(0);
        } else {
            setAnswer(userAnswer.message);
            setAnswerLength(userAnswer.message.length);
            let bytemessage = userAnswer.message.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1");
            let bytelength = bytemessage.length;
            let bytemessageArray = bytemessage.split('\n');
            let newRow = 0;
            bytemessageArray.map((byte: any) => {
                let bytelen = byte.length;
                newRow += (bytelen - bytelen/answerCol)/answerCol + 1;
                newRow = parseInt(String(newRow));
            })
            setAnswerByteLength(bytelength);
            setAnswerRow(Math.max(5, newRow));
            if(!userAnswer.imageData || userAnswer.imageData.imageUrl === '')
                setImageUri('');
            else setImageUri(userAnswer.imageData.imageUrl);
        }
    }, [userAnswer, props])

    let [save, setSave] = React.useState<boolean>(false);
    let [editanswer, setEditanswer] = React.useState<boolean>(false);
    let [editImage, setEditImage] = React.useState<boolean>(false);
    let [showanswer, setShowanswer] = React.useState<boolean>(false);
    let input_file = React.useRef<any>(null);
    let [state, setState] = React.useState<any>({ image: '', imageLoaded: false });
    let [cropImage, setCropImage] = React.useState<boolean>(false);
    let [save_success, setSave_success] = React.useState<boolean>(false);
    let handleFileinput  = async (e: any) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0]);

        const s3Uri = await uploadImage_formdata(formData);
        console.log(s3Uri);
        setImageUri(s3Uri);
        if(s3Uri === undefined) {
            setImageUri('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
        }
        return s3Uri;
    }
    let handleClick = () => {
        input_file.current.click();
    };
    if(!question) return <></>;
    return (
        <>
        <div>
            <div className="question" onClick = {() => setShowanswer(!showanswer)}>
                <div className="Colon">{Colon}</div>
                <div className="title">
                    <div>{question?.title.split('\n')[0]}</div>
                    <div>{question?.title.split('\n')[1]}</div>
                </div>
            </div>
            {showanswer && props.written && <div className="answer" style = {{background : editanswer ? 'rgba(239, 238, 238, 0.3)' : ''}}>
                {userAnswer && <div className="date">{'답변일 : ' + parseDate(new Date(userAnswer.updatedAt))}</div>}
                <div className="close" onClick = {() => setShowanswer(false)}>{PlusVector}</div>
                <textarea name="" id="" cols={answerCol} rows={answerRow} value = {answer} onChange = {(e) => {
                    console.log(answerCol);
                    setAnswer(e.target.value.slice(0, 549));
                    setAnswerLength(Math.min(550, e.target.value.length))
                    setAnswerRowCalculate(e.target.value.slice(0, 549));
                }} readOnly = {!editanswer}></textarea>
                <div className="answerlength">
                    {answerLength + ' / 550 자'}
                </div>
                <div className="imageContainer" >
                    <img src = {(imageUri === '' ? 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' : imageUri)} alt="" style = {{width: (imageUri === '' || imageUri === undefined) ? 50 : Math.min(400, width - 108), height: (imageUri === '' || imageUri === undefined) ? 50 : Math.min(400, width - 108)}} onClick = {editanswer ? ((imageUri === '' || imageUri === undefined) ? () => {handleClick(); setCropImage(true);} : () => {setEditImage(!editImage);}) : () => {}}/>
                    {editImage && <div className="editImage">
                        <button className="edit" onClick = {() => {handleClick(); setCropImage(true); setEditImage(false);}}>수정하기</button>
                        <button className="delete" onClick = {() => {setImageUri(''); setEditImage(false);}}>삭제하기</button>
                    </div>}
                    <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
                </div>
                <div className="saveContainer">
                    {(save && editanswer) && <div className = 'saveConfirm'>
                        <div className="text">안전하게 저장되었습니다.</div>
                        <div className="button" onClick = {() => {
                            setSave(false);
                            setEditanswer(false);
                            setEditImage(false);
                        }}>확인</div>
                    </div>}
                    <div className="editanswer" onClick = {editanswer ? async () => {
                    if(await writeAnswer(question.id, answer, answer.length, { imageUrl: imageUri, cropX: 0, cropY: 0 }))
                        setSave(true);
                    } : () => setEditanswer(!editanswer)}>{editanswer ? '저장하기' : '내용 수정하기'}
                    </div>
                    {question.contents[0] && <Link to ={`/contentpage/${question.contents[0]}`}><div className="morecontent">대표 컨텐츠 바로가기</div></Link>}
                </div>
            </div>}
            {showanswer && !props.written && <div className="answer" style = {{background : 'rgba(243, 243, 243, 0.9)'}}>
                <div className="textarea">
                    <textarea name="" id="" cols={answerCol} rows={answerRow} value = {answer} onChange = {(e) => {
                        setAnswer(e.target.value.slice(0, 549));
                        setAnswerLength(Math.min(550, e.target.value.length))
                        setAnswerRowCalculate(e.target.value.slice(0, 549));
                    }} placeholder = "질문에 대한 생각을 적어주세요."></textarea>
                    <div className="lineContainer">
                        {[...Array(answerRow).keys()].map(() => {
                            return (
                                <div className="line"></div>
                            )
                        })}
                    </div>
                </div>
                <div className="answerlength">
                    {answerLength + ' / 550 자'}
                </div>
                <div className="imageContainer" onClick = {() => {handleClick(); setCropImage(true);}}>
                    <img src = {(imageUri === '' ? 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' : imageUri)} alt="" style = {{width: (imageUri === '' || imageUri === undefined) ? 50 : width - 108, height: (imageUri === '' || imageUri === undefined) ? 50 : width - 108}}/>
                    <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
                </div>
                <div className="saveContainer">
                    {(save) && <div className = 'saveConfirm'>
                        <div className="text">안전하게 저장되었습니다.</div>
                        <div className="button" onClick = {() => {
                            setSave(false);
                            setEditanswer(false);
                        }}>확인</div>
                    </div>}
                    <div className="editanswer" onClick = {async () => {
                    if(await writeAnswer(question.id, answer, answer.length, { imageUrl: imageUri, cropX: 0, cropY: 0 }))
                        setSave(true);
                    }}>{'저장하기'}
                    </div>
                    {question.contents[0] && <Link to ={`/contentpage/${question.contents[0]}`}><div className="morecontent">대표 컨텐츠 바로가기</div></Link>}
                </div>
            </div>}
        </div>
        </>
    )   
}

export default MobileNoteQuestion;