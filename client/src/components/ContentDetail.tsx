import React from 'react';
import { imageUrl } from '../etc/config';

interface Props {
    additionalClass: string;
}

function ContentDetail ({ additionalClass } : Props) {
  return (
    <>
      <div className = 'block'>
          <div className = 'contentdetail'>
              <img className = 'memento_colon' src={imageUrl('memento_colon.png')} />
              <div className = 'detail'>
                  <div>이야기를 먼저 시청한 후, 이야기마다 쓰여있는 질문에</div>
                  <div>답변을 통하여 나의 유언을 남겨보세요</div>
              </div>
              <div className = 'subdetail'>
              주요 컨텐츠는 매주 월요일 정기적으로 업로드 됩니다.
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentDetail;
