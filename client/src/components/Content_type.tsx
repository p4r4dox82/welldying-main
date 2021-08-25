import React from 'react';
import { imageUrl } from '../etc/config';

import ReactPlayer from 'react-player';

interface Props {
  additionalClass: string;
  title: string;
  tag: string;
  date: string;
  source: string;
}

function Content_type (props : Props) {
  return (
    <>
      <div className = 'block'>
          {props.additionalClass === '동영상' && <div className = 'videocontent'>
              <ReactPlayer width = {'769px'} height = '432px' url = 'https://www.youtube.com/watch?v=MONCv_l0Fxg' controls />
              <div className = 'cover'>
                  <div className = 'detail GB px14 op6'>영상의 한줄</div>
                  <div className = 'title GB px20 op9 line40'>{props.title}</div>
                  <div className = 'date GB px14 op9'>{'영상제작일 : ' + props.date}</div>
                  <div className = 'tag GB px14 op6'>{props.tag}</div>
                  <img className = 'like_button' src = {imageUrl('ContentPage/like_button.png')} />
                  <img className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} />
                  <div className = 'more NS px12 bold op6'>{'원본파일 보기>'}</div>
              </div>
          </div>}
          {props.additionalClass === '책' && <div className = 'bookcontent margin_base'>
              <div className = 'cover'>
                  <img className = 'cover_image' src = {imageUrl('ContentPage/cover_image.png')} />
                  <div className = 'cover_blur' />
                  <div className = 'detail GB px14 op6'>책의 한줄</div>
                  <div className = 'title GB px20 op9 line40'>{props.title}</div>
                  <div className = 'date GB px14 op9'>{'영상제작일 : ' + props.date}</div>
                  <div className = 'tag GB px14 op6'>{props.tag}</div>
                  <img className = 'like_button' src = {imageUrl('ContentPage/like_button.png')} />
                  <img className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} />
                  <div className = 'more NS px12 bold op6'>{'책 구매하기>'}</div>
              </div>
              <div className = 'vector' />
              
          </div>}
      </div>
    </>
  );
}

export default Content_type;
