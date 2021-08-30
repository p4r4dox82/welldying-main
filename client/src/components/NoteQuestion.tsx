import React from 'react';
import { imageUrl } from '../etc/config';
import { getContent, contentComment, Content } from '../etc/api/content';
import { Question } from '../etc/api/question';
import { uploadImage } from '../etc/api/image';
import { getAnswers, writeAnswer } from '../etc/api/answer';
import FileSelector from '../components/FileSelector';
import usePromise from '../etc/usePromise';
import { parseDate } from '../etc/index';

interface Props {
  question: Question | undefined;
  written: boolean;
}

const checkline = (data: string) => {
  let str = data;
  let str_len = str.length;
  let data_fixed;
  if(str_len >= 550) {
    data_fixed = str.slice(0, -1);
  }
  else {
    data_fixed = str;
  }
  return data_fixed;
}

function NoteQuestion(props: Props) {
  let question = props.question;
  let [show_answer, setShow_answer] = React.useState<boolean>(false);
  let [answer_type, setAnswer_type] = React.useState<string>('');

  let id = React.useMemo(() => question?.id, [question]);
  let [message, setMessage] = React.useState<string>('');
  let [imageUri, setImageUri] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);

  let [save, setSave] = React.useState<boolean>(false);
  let [upload, setUpload] = React.useState<boolean>(false);

  let [, answers] = usePromise(getAnswers);
  let answer = React.useMemo(() => answers?.find((answer) => answer.questionId === id), [answers, id]);

  React.useEffect(() => {
    if(!answer) return;
    setMessage(answer.message);
    setImageUri(answer.imageUrl);
  }, [answer]);

  React.useEffect(() => {

  }, [question]);

  if(!question) return <></>;
  else return (
    <div>
        {props.written && <div className = 'questionBox' onClick = {() => {setShow_answer(!show_answer); setAnswer_type('written');}}>
            <div className = 'title GB px20 line40' style = {{margin: '0px'}}>{question.title}</div>
            <div className = 'answerdate GB px13'>{'답변일 : ' + String(parseDate(new Date(Number(answer?.updatedAt))))}</div>
            <div className = 'write_button NS px12'>
                답변보기
                <img src = {imageUrl('NotePage/down_image.png')} />
            </div>
            <img className = 'delete_button' src = {imageUrl('NotePage/delete_button.png')} />
            <button className = 'content_button white GB px12'>대표 컨텐츠 바로가기</button>
            <div className = 'left_vector' >
                <div className = 'angle' />
                <div className = 'round' />
            </div>
        </div>}
        {!props.written && <div className = 'questionBox unwritten' onClick = {() => {setShow_answer(!show_answer); setAnswer_type('unwritten');}}>
            <div className = 'title GB px20 line40' style = {{margin: '0px'}}>{question.title}</div>
            <button className = 'content_button white GB px12'>대표 컨텐츠 바로가기</button>
            <img className = 'delete_button' src = {imageUrl('NotePage/delete_button.png')} />
        </div>}
        {show_answer && <div className = {'note_question ' + answer_type}>
            <img className = 'background' src = {imageUrl('ContentPage/question_background.png')} />
            <div className = 'question_container'>
                <textarea className = 'answer_area GB px15 line40 op7' value={message} onChange={(e) => {setMessage(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
                <div className = 'characternumbers NS px12 bold op6'>
                {characternumbers + ' / 550 자'}
                </div>
                <div className = 'image_uploader'>
                    <FileSelector setImageUri = {setImageUri} imageUri = {imageUri}/>
                </div>
                <div className = 'bottom_container'>
                    <div className = 'more'>
                        <div className = 'NS px12 op9'>같은 질문에 사람들은 어떻게 답변했을까요?</div>
                        <div className = 'NS px12 op9 bold'>{'소통공간 바로가기>'}</div>
                    </div>
                    <button className = 'white NS px13 op9' onClick = {() => setUpload(!upload)}>소통공간에 게시하기</button>
                    <button className = 'green NS px13 op9' onClick = {() => setSave(!save)}>저장하기</button>
                    {save && <div className = 'save_container'>
                        <div className = 'text GB px14'>이대로 저장하시겠습니까?</div>
                        <button className = 'rec white NS px12' onClick = {() => setSave(false)}>돌아가기</button>
                        <button className = 'rec green NS px12' onClick = {async () => {
                            if(await writeAnswer(id!, message, characternumbers, imageUri))
                                console.log('success');
                            setSave(false);
                        }}>저장하기</button>
                    </div>}
                    {upload && <div className = 'upload_container'>
                        <div className = 'text GB px14'>이대로 게시하시겠습니까?</div>
                        <button className = 'rec white NS px12' onClick = {() => setUpload(false)}>돌아가기</button>
                        <button className = 'rec green NS px12' >게시하기</button>
                    </div>}
                </div>
            </div>
        </div>}
    </div>
  );
};

export default NoteQuestion;
