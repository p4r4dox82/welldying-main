import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';

function ContentSlide2 () {
  let [, contents] = usePromise(getContents);
  let [slide_number, setSlide_number] = React.useState<number>(0);
  let [content_id, setContent_id] = React.useState<number>(0);
  const maxslide_number = 5;
  let start_number = slide_number;
  let end_number = ((slide_number + maxslide_number) <= maxslide_number ? slide_number + maxslide_number : slide_number + maxslide_number - maxslide_number);
  let new_slide_contents = (end_number > start_number ? contents?.slice(start_number, end_number) : contents?.slice(start_number, maxslide_number).concat(contents?.slice(0, end_number)));
  let slide_contents_1 = contents?.filter((content) => content.id === 5);
  slide_contents_1 = slide_contents_1?.concat(contents?.filter((content) => ((content.id >=1 && content.id <=2))));
  let slide_contents_2 = contents?.filter((content) => (content.id >=3 && content.id <=5));
  let content = slide_contents_1?.find((content, key) => key === 0);

  let slide_container_dom_1 = React.useRef<any>(null);
  let slide_container_dom_2 = React.useRef<any>(null);
  let left_button_dom = React.useRef<any>(null);
  let right_button_dom = React.useRef<any>(null);
  let like_button_dom = React.useRef<any>(null);
  let [button_function, setButton_function] = React.useState<boolean>(false);

  let left_button_click = () => {let new_slide_number = slide_number === 0 ? (maxslide_number - 1) : ((slide_number - 1)%5); setSlide_number(new_slide_number); moveRight(new_slide_number); console.log(new_slide_number);};
  let right_button_click = () => {let new_slide_number = (slide_number + 1)%5; setSlide_number(new_slide_number); moveLeft(new_slide_number); console.log(new_slide_number);};


  const moveLeft = (position: number) => {
    setButton_function(true);
    setTimeout(() => {setButton_function(false);}, 1100);
    slide_container_dom_2.current.style.transform = `translateX(${-708 * position + 'px'})`;
    if(position >= 4) {
      slide_container_dom_1.current.style.transform = `translateX(${708 * (5 - position) + 'px'})`;
      slide_container_dom_1.current.style.transitionDelay = '0s, 0s';
      slide_container_dom_1.current.style.opacity = '1';
    }
    else if(position === 3) {
      slide_container_dom_1.current.style.transitionDelay = '0s, 1s';
      slide_container_dom_1.current.style.opacity = '0';
      slide_container_dom_1.current.style.transform = `translateX(${-708 * position + 'px'})`;
      setTimeout(() => {slide_container_dom_1.current.style.transitionDuration = '0s, 0s'; slide_container_dom_1.current.style.transform = `translateX(${708 * (5 - position) + 'px'})`;}, 1000);
      setTimeout(() => {slide_container_dom_1.current.style.transitionDuration = '1s, 0s';}, 1050);
    }
    else {
      slide_container_dom_1.current.style.transform = `translateX(${-708 * position + 'px'})`;
      slide_container_dom_1.current.style.transitionDelay = '0s, 0s';
      slide_container_dom_1.current.style.opacity = '1';
    }
    if(position === 0) {
      slide_container_dom_2.current.style.transitionDelay = '0s, 1s';
      slide_container_dom_2.current.style.opacity = '0';
      slide_container_dom_2.current.style.transform = `translateX(${-708 * 5 + 'px'})`;
      setTimeout(() => {slide_container_dom_2.current.style.transitionDuration = '0s, 0s'; slide_container_dom_2.current.style.transform = `translateX(${-708 * position + 'px'})`;}, 1000);
      setTimeout(() => {slide_container_dom_2.current.style.transitionDuration = '1s, 0s';}, 1050);
    }
    else {
      slide_container_dom_2.current.style.transitionDelay = '0s, 0s';
      slide_container_dom_2.current.style.opacity = '1';
    }
  };

  const moveRight = (position: number) => {
    setButton_function(true);
    setTimeout(() => {setButton_function(false);}, 1100);
    slide_container_dom_2.current.style.transform = `translateX(${-708 * position + 'px'})`;
    if(position >= 4) {
      slide_container_dom_1.current.style.transform = `translateX(${708 * (5 - position) + 'px'})`;
    }
    else {
      slide_container_dom_1.current.style.transform = `translateX(${-708 * position + 'px'})`;
    }
    if(position === 3) {
      slide_container_dom_1.current.style.transitionDelay = '0s, 1s';
      slide_container_dom_1.current.style.opacity = '0';
      slide_container_dom_1.current.style.transform = `translateX(${708 * (5 - position) + 'px'})`;
      setTimeout(() => {slide_container_dom_1.current.style.transitionDuration = '0s, 0s'; slide_container_dom_1.current.style.transform = `translateX(${708 * (0 - position) + 'px'})`;}, 1000);
      setTimeout(() => {slide_container_dom_1.current.style.transitionDuration = '1s, 0s';}, 1050);
    }
    else {
      slide_container_dom_1.current.style.transitionDelay = '0s, 0s';
      slide_container_dom_1.current.style.opacity = '1'
    }
    if(position === 0) {
      slide_container_dom_2.current.style.transitionDelay = '0s, 1s';
      slide_container_dom_2.current.style.opacity = '0';
      setTimeout(() => {slide_container_dom_2.current.style.transitionDuration = '0s, 0s'; slide_container_dom_2.current.style.transform = `translateX(${-708 * 5 + 'px'})`;}, 1000);
      setTimeout(() => {slide_container_dom_2.current.style.transitionDuration = '1s, 0s';}, 1050);
    }
    else {
      slide_container_dom_2.current.style.transitionDelay = '0s, 0s';
      slide_container_dom_2.current.style.opacity = '1';
    }
  }

  return (
    <>
      <div className = 'block'>
          <div className = 'contentslide2'>
              <div className = 'selector_container'>
                  {[...Array(maxslide_number).keys()].map((i) => (
                      <img className = {i === start_number ? '' : 'opacity'} src = {imageUrl('ContentPage/selector_select.png')} />
                  ))}
              </div>
              <div className = 'slide_content_container flex'>
                  <div className = 'container_1' ref = {slide_container_dom_1}>
                  {slide_contents_1?.map((content, key) => (
                    <div className = {'slide_content'}>
                        <div className = 'slide_image'>
                            <img src = {imageUrl('ContentPage/video_content_image.png')}/>
                        </div>
                    </div>
                  ))}
                  </div>
                  <div className = 'container_2' ref = {slide_container_dom_2}>
                  {slide_contents_2?.map((content, key) => (
                    <div className = {'slide_content'}>
                        <div className = 'slide_image'>
                            <img src = {imageUrl('ContentPage/video_content_image.png')}/>
                        </div>
                    </div>
                  ))}
                  </div>
              </div>
              <div className = 'blur left' />
              <div className = 'blur right' />
              <div className = 'slide_content_title'>
                  <div className = 'question'>
                      {content?.title}
                  </div>
                  <div className = 'tag'>
                      {content?.tag}
                  </div>
                  <div className = 'title'>
                      {'[' + content?.type + ']' + content?.title}
                  </div>
                  <button className = 'left_button' onClick = {left_button_click} ref = {left_button_dom} disabled = {button_function}>
                      <img className = 'left_button' src = {imageUrl('ContentPage/video_left_button.png')}/>
                  </button>
                  <button className = 'right_button' onClick = {right_button_click} ref = {right_button_dom} disabled = {button_function}>
                      <img  src = {imageUrl('ContentPage/video_right_button.png')} />
                  </button>
                  <button className = 'like_button' ref = {like_button_dom} disabled = {button_function}>
                      <img  src = {imageUrl('ContentPage/video_like_button.png')}/>
                  </button>
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentSlide2;