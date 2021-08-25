import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { css, keyframes } from '@emotion/react';

function ContentSlide () {
  let [, contents] = usePromise(getContents);
  let [slide_number, setSlide_number] = React.useState<number>(0);
  const maxslide_number = 5;
  let start_number = slide_number;
  let end_number = ((slide_number + 3) <= maxslide_number ? slide_number + 3 : slide_number + 3 - maxslide_number);
  let new_slide_contents = (end_number > start_number ? contents?.slice(start_number, end_number) : contents?.slice(start_number, maxslide_number).concat(contents?.slice(0, end_number)));
  let slide_contents = contents?.filter((content, key) => key < 5);

  const slide_dom_left = React.useRef<any>();
  const slide_dom_left_hidden = React.useRef<any>();
  const slide_dom_right = React.useRef<any>();
  const slide_dom_right_hidden = React.useRef<any>();
  const other_slide_dom = React.useRef<any>();

  const moveLeft = (slide_number: number) => {
      slide_dom_right.current.style.left = `0px`;
      slide_dom_left_hidden.current.style.left = `1062px`;
  }
  const moveRight = (slide_number: number) => {
      slide_dom_left.current.style.left = `1062px`;
      slide_dom_right_hidden.current.style.left = `0px`;
  }

  const slide_after = (slide_number: number, times: number) => {
    let new_slide_number = slide_number;
    for(let i = 0; i < times; i++)
        new_slide_number = (new_slide_number + 1)%maxslide_number;
    return new_slide_number;
  }
  const slide_before = (slide_number: number, times: number) => {
    let new_slide_number = slide_number;
    for(let i = 0; i < times; i++)
        new_slide_number = (new_slide_number === 0 ? maxslide_number - 1 : new_slide_number - 1);
    return new_slide_number;
  }

  const abs = (a: number, b: number) => {
    if(a > b)
      return a - b;
    else
      return b - a;
  }

  return (
    <>
      <div className = 'block overflow_hidden'>
          <div className = 'contentslide'>
              <div className = 'selector_container'>
                  {[...Array(maxslide_number).keys()].map((i) => (
                      <img className = {i === start_number ? '' : 'opacity'} src = {imageUrl('ContentPage/selector_select.png')} />
                  ))}
              </div>
              <div className = 'slide_content_container' >
                  <div className = 'left'>
                  {slide_contents?.map((content, key) => (
                    <div className = {('slide_content absolute' + ((key === slide_number || key === slide_after(slide_number, 1)) ? ' animate' : ''))} ref = {(key === slide_number ? slide_dom_left : (key === slide_after(slide_number, 1) ? slide_dom_right : (key === slide_before(slide_number, 1) ? slide_dom_left_hidden : (key === slide_before(slide_number, 2) ? slide_dom_right_hidden : other_slide_dom))))} style = {{left: ((key === 0 || key === 4) ? '0px' : '1062px'), zIndex: parseInt((slide_number === 4 && key < 3) ? `${-1 - key}` : `${0 - abs(key, slide_number)}`)}}>
                        <div className = 'slide_image'>
                            <img src = {imageUrl('ContentPage/slide_image.png')} />
                        </div>
                        <div className = {'title_background' + ((key === slide_number || key === slide_after(slide_number, 1)) ? ' shadow' : '')} />
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
              <img className = 'slide_right_button' src = {imageUrl('ContentPage/slide_right_button.png')} onClick = {() => {let new_slide_number = slide_number === 0 ? (maxslide_number - 1) : ((slide_number - 1)%5); setSlide_number(new_slide_number); moveRight(slide_number); console.log(new_slide_number);}}/>
              <img className = 'slide_left_button' src = {imageUrl('ContentPage/slide_left_button.png')} onClick = {() => {let new_slide_number = (slide_number + 1)%5; setSlide_number(new_slide_number); moveLeft(slide_number); console.log(new_slide_number);}}/>
          </div>
      </div>
    </>
  );
}

export default ContentSlide;