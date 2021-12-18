import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { Link } from 'react-router-dom';

import { leftVector, rightVector } from '../img/Vectors';
import { getQuestions } from '../etc/api/question';

function ContentSlide () {
  let [, contents] = usePromise(getContents);
  let SlideContents = React.useMemo(() => contents?.filter((content) => [1, 13, 21, 23, 47].includes(content.id)), [contents]);
  let [, questions] = usePromise(getQuestions);
  let [slide_number, setSlide_number] = React.useState<number>(0);
  const maxslide_number = 5;
  let start_number = slide_number;
  let slide_contents = React.useMemo(() => SlideContents?.filter((content, key) => key < 5), [SlideContents]);

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

  let link_content = React.useRef<any>(null);
  let LinkClick = () => {
    link_content.current.click();
  }
  let id = React.useMemo(() => {
    if(!slide_contents) return;
    return slide_contents[slide_number].id;
  }, [slide_contents, slide_number]);

  return (
    <>
      <Link to={`/contentpage/${id}`} ref = {link_content} style = {{display: 'none'}} />
      <div className = 'block overflow_hidden'>
          <div className = 'contentslide'>
              <div className = 'selector_container'>
                  {[...Array(maxslide_number).keys()].map((i) => (
                      <img alt = "" className = {i === start_number ? '' : 'opacity'} src = {imageUrl('ContentPage/selector_select.png')} />
                  ))}
              </div>
              <div className = 'slide_content_container' onClick = {() => LinkClick()} style = {{cursor: 'pointer'}}>
                  <div className = 'left'>
                  {slide_contents?.map((content, key) => {
                    let question = questions?.find((question) => question.id === content.question);
                    return (
                      <div className = {('slide_content absolute' + ((key === slide_number || key === slide_after(slide_number, 1)) ? ' animate' : ''))} ref = {(key === slide_number ? slide_dom_left : (key === slide_after(slide_number, 1) ? slide_dom_right : (key === slide_before(slide_number, 1) ? slide_dom_left_hidden : (key === slide_before(slide_number, 2) ? slide_dom_right_hidden : other_slide_dom))))} style = {{left: ((key === 0 || key === 4) ? '0px' : '1062px'), zIndex: parseInt((slide_number === 4 && key < 3) ? `${-1 - key}` : `${0 - abs(key, slide_number)}`)}}>
                          <div className = 'slide_image'>
                              <img alt = "" src = {((content.imageData && content.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} style = {{width: '1032px', height: '458px', objectFit: 'cover', borderRadius: '5px'}} />
                          </div>
                          <div className = {'title_background' + ((key === slide_number || key === slide_after(slide_number, 1)) ? ' shadow' : '')} />
                          <div className = 'tag'>
                          {content.tag.split('#').slice(1).map((tag) => <div>{'#' + tag}</div>)}
                          </div>
                          <div className = 'question'>
                              <div>{question?.title.split('\n')[0]}</div>
                              <div>{question?.title.split('\n')[1]}</div>
                          </div>
                          <div className = 'title'>
                          {content.title}
                          </div>
                          <div className = 'more' style = {{cursor: 'pointer'}}>
                          {'컨텐츠 바로가기 >'}
                          </div>
                          <div className = 'source' style = {{cursor: 'pointer'}} onClick = {() => window.open(content.source, '_blank')}>
                          {'출처 : ' + content.source}
                          </div>
                      </div>
                    );
                  })}
                  </div>
              </div>
              <div className = 'slide_content_title'>
                  <div className = 'title' onClick = {() => LinkClick()}>
                      <div>당신의</div>
                      <div>행복한 이야기를</div>
                      <div>상상해봅시다</div>
                  </div>
                  <div className = 'date'>
                  {'2021.09'}
                  </div>
                  <img alt = "" className = 'memento_logo' src = {imageUrl('ContentPage/mainLogo.png')} />
              </div>
              <button className = 'slide_right_button' onClick = {() => {let new_slide_number = slide_number === 0 ? (maxslide_number - 1) : ((slide_number - 1)%5); setSlide_number(new_slide_number); moveRight(slide_number); console.log(new_slide_number);}}>{rightVector}</button>
              <button className = 'slide_left_button' onClick = {() => {let new_slide_number = (slide_number + 1)%5; setSlide_number(new_slide_number); moveLeft(slide_number); console.log(new_slide_number);}}>{leftVector}</button>
          </div>
      </div>
    </>
  );
}

export default ContentSlide;
