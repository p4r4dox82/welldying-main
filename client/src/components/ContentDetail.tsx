import React from 'react';
import { imageUrl } from '../etc/config';
import { getSection } from '../etc/api/section';
import usePromise from '../etc/usePromise';

import { Link } from 'react-router-dom';

interface Props {
    additionalClass: string;
    border: string;
    margin: string;
}

function ContentDetail (props : Props) {
  let [, section] = usePromise(() => getSection(parseInt(props.additionalClass)));

  let LinkNote = React.useRef<any>(null);
  let LinkNoteClick = () => LinkNote.current.click();
  return (
    <>
    <Link to = {'/note/1'} ref = {LinkNote} style = {{display: 'none'}} />
    <div className = 'block'>
          <div className = {'contentdetail' + props.border + props.margin}>
              <img alt = "" className = 'memento_colon' src={imageUrl('memento_colon.png')} />
              <div className = 'detail'>
                  <div>이야기를 먼저 시청한 후, 이야기마다 쓰여있는 질문에</div>
                  <div>답변을 통하여 나의 유언을 남겨보세요</div>
              </div>
              {props.additionalClass !== '0' && <>
                  <div className = 'tag'>
                  {section?.tag}
                  </div>
                  <div className = 'more' onClick = {() => LinkNoteClick()} style = {{cursor: 'pointer'}}>
                  {'나의 메멘토 노트 바로가기 >'}
                  </div>
              </>}
              <div className = 'subdetail'>
              주요 컨텐츠는 매주 월요일 정기적으로 업로드 됩니다.
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentDetail;
