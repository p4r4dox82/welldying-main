import React from 'react';
import { imageUrl } from '../etc/config';
import FileSelector from '../components/FileSelector';

interface Props {
    additionalClass: string;
    title: string;
    tag: string;
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
  let [answer, setAnswer] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);


  return (
    <>
      <div className = 'content_question'>
          <img className = 'background' src = {imageUrl('ContentPage/question_background.png')} />
          <img className ='memento_colon' src = {imageUrl('memento_colon.png')} />
          <div className = 'question_container'>
              <div className ='question GB px20 line40'>{props.title}</div>
              <div className = 'tag GB px14'>{props.tag}</div>
              <textarea className = 'answer_area GB px14 line47 op7' value={answer} onChange={(e) => {setAnswer(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
              <div className = 'characternumbers NS px12 bold op6'>
              {characternumbers + ' / 550 자'}
              </div>
              <div className = 'image_uploader'>
              </div>
              <div className = 'bottom_container'>
                  <div className = 'more'>
                      <div className = 'NS px12 op9'>같은 질문에 사람들은 어떻게 답변했을까요?</div>
                      <div className = 'NS px12 op9 bold'>{'소통공간 바로가기>'}</div>
                  </div>
                  <button className = 'white NS px13 op9'>소통공간에 게시하기</button>
                  <button className = 'green NS px13 op9'>나의 메멘토 책에 저장하기</button>
              </div>
          </div>
      </div>
    </>
  );
};

export default ContentQuestion;
