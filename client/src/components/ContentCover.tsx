import React from 'react';
import { imageUrl } from '../etc/config';

interface Props {
    additionalClass: string;
    title: string;
    tag: string;
    date: string;
    source: string;
}

function ContentName (props : Props) {
  return (
    <>
      <div className = 'block'>
          <img className = 'background small' src = {imageUrl('ContentPage/content_background.png')} />
          <div className = 'background small' />
          <div className = 'contentname'>
              <div className = 'main_title'>
                  {props.title}
              </div>
              <div className = 'tag'>
                  {props.tag}
              </div>
              <div className = 'date'>
                  {'date : ' + props.date}
              </div>
              <div className = 'source' onClick = {() => window.open(props.source, '_blank')} style = {{cursor: 'pointer'}}>
                  {'출처 : ' + props.source}
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentName;
