import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';

interface Props {
    additionalClass: string;
    title: string;
    type: string;
    category: number;
    likes: number;
    tag: string;
}

function Contentbox(props: Props) {
  return (
    <>
      {props.additionalClass === 'big' && <div className = 'big_content'>
          <img className = 'thumbnail' src = {imageUrl('ContentPage/big_content_image.png')} />
          <div className = 'cover'>
              <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} />
              <div className = 'type'>{props.type}</div>
              <div className = 'title'>{'[' + props.type + ']' + props.title}</div>
              <div className = 'tag'>{props.tag}</div>
              <div className = 'likes_container'>
                  <img className = 'likes_image' src = {imageUrl('content_like.png')} />
                  <span>{props.likes}</span>
              </div>
          </div>
      </div>}
      {props.additionalClass === 'small' && <div className = 'small_content'>

      </div>}
    </>
  );
}

export default Contentbox;
