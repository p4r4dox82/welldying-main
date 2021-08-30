import React from 'react';
import { imageUrl } from '../etc/config';
import FileSelector from '../components/FileSelector';
import { Content } from '../etc/api/content';
import { writeAnswer, getAnswers } from '../etc/api/answer';
import { getQuestions } from '../etc/api/question';
import usePromise from '../etc/usePromise';

interface Props {
    additionalClass: string;
    content: Content | null;
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

function ContentQuestion (props : Props) {
  let content = props.content;
  let [id, setId] = React.useState<number>(1);
  let [message, setMessage] = React.useState<string>('');
  let [imageUri, setImageUri] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);

  let [save, setSave] = React.useState<boolean>(false);
  let [upload, setUpload] = React.useState<boolean>(false);

  let [, answers] = usePromise(getAnswers);
  let [, questions] = usePromise(getQuestions);
  let answer = answers?.find((answer) => answer.questionId === content!.question);
  let question = React.useMemo(() => questions?.find((question) => question.id === content!.question), [content, questions]);

  React.useEffect(() => {
    if(!content) return;
    setId(content.id);
  }, [content]);

  React.useEffect(() => {
    if(!answer) return;
    setMessage(answer.message);
    setImageUri(answer.imageUrl);
  }, [answer]);

  React.useEffect(() => {

  }, [question]);


  if (!content) return <></>;
  else return (
    <>
      <div className = 'content_question'>
          <img className = 'background' src = {imageUrl('ContentPage/question_background.png')} />
          <img className ='memento_colon' src = {imageUrl('memento_colon.png')} />
          <div className = 'question_container'>
              <div className ='question GB px20 line40'>{question?.title}</div>
              <div className = 'tag GB px14'>{content.tag}</div>
              <textarea className = 'answer_area GB px14 line47 op7' value={message} onChange={(e) => {setMessage(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
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
                  <button className = 'green NS px13 op9' onClick = {() => setSave(!save)}>나의 메멘토 책에 저장하기</button>
                  {save && <div className = 'save_container'>
                      <div className = 'text GB px14'>이대로 저장하시겠습니까?</div>
                      <button className = 'rec white NS px12' onClick = {() => setSave(false)}>돌아가기</button>
                      <button className = 'rec green NS px12' onClick = {async () => {
                          if(await writeAnswer(content!.question, message, characternumbers, imageUri))
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
      </div>
    </>
  );
};

export default ContentQuestion;
