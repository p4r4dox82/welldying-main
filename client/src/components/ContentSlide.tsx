import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';

function ContentSlide () {
  let [, contents] = usePromise(getContents);
  let [slide_number, setSlide_number] = React.useState<number>(0);
  let maxslide_number = 5;
  let start_number = slide_number;
  let end_number = ((slide_number + 3) <= maxslide_number ? slide_number + 3 : slide_number + 3 - maxslide_number);
  let slide_contents = (end_number > start_number ? contents?.slice(start_number, end_number) : contents?.slice(start_number, maxslide_number).concat(contents?.slice(0, end_number)));
  return (
    <>
      <div className = 'block overflow_hidden'>
          <div className = 'contentslide'>
              <div className = 'slide_content_container'>
                  {slide_contents?.map((content, key) => (
                    <div className = {'slide_content' + (key === 0 ? ' first': (key === 1 ? ' second' : ' third'))}>
                        <div className = 'slide_image'>
                            <img src = {imageUrl('ContentPage/slide_image.png')} />
                        </div>
                        <div className = 'title_background' />
                        <div className = 'tag'>
                        {content.tag.split('#').slice(1).map((tag) => <div>{'#' + tag}</div>)}
                        </div>
                        <div className = 'question'>
                            <div>당신의 삶에서</div>
                            <div>가장 중요한 사람은 누구인가요?</div>
                        </div>
                        <div className = 'title'>
                        {content.title}
                        </div>
                        <div className = 'more'>
                        {'컨텐츠 바로가기 >'}
                        </div>
                        <div className = 'source'>
                        {'출처 : brunch.co.kr/@ssls1223/456'}
                        </div>
                    </div>
                  ))}
              </div>
              <div className = 'slide_content_title'>
                  <div className = 'title'>
                      <div>당신의</div>
                      <div>행복한 이야기를</div>
                      <div>영상에 담다.</div>
                  </div>
                  <div className = 'date'>
                  {'2021.07'}
                  </div>
                  <img className = 'memento_logo' src = {imageUrl('ContentPage/mainLogo.png')} />
              </div>
              <img className = 'slide_right_button' src = {imageUrl('ContentPage/slide_right_button.png')} onClick = {() => {setSlide_number((slide_number + 1)%5); console.log(start_number); console.log(end_number);}}/>
          </div>
      </div>
    </>
  );
}

export default ContentSlide;
