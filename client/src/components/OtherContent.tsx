import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';

interface Props {
    additionalClass: string;
    title: string;
    tag: string;
}

function OtherContent (props : Props) {
  let [answer, setAnswer] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);
  let [, contents] = usePromise(getContents);
  let othercontents = contents?.slice(0, 3);

  return (
    <>
      <div className = 'othercontent margin_large'>
          <div className = 'cover'>
              <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} />
              <div className = 'cover_container'>
                  <div className = 'GB px16 line40'>같은 질문을 담은 또 다른 컨텐츠</div>
                  <div className = 'GB px12 op6'>어떤 글을 쓸지 떠오르지 않는다면 같은 질문이 담긴 컨텐츠를 보고 글을 적어보세요. </div>
                  <div className = 'othercontent_container'>
                  {othercontents?.map((content) => (
                    <div className = 'NS px13'>{'[' + content.type + ']' + content.title}</div>
                  ))}
                  </div>
              </div>
          </div>
          <img className = 'thumbnail' src = {imageUrl('ContentPage/other_content_image.png')} />
      </div>
    </>
  );
}

export default OtherContent;
