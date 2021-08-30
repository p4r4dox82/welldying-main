import React from 'react';
import { imageUrl } from '../etc/config';
import { Content, Userdata, content_userdata } from '../etc/api/content';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';

import ReactPlayer from 'react-player';

interface Props {
  additionalClass: string;
  content: Content | null;
}

function Content_type (props : Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let content = props.content;
  let [id, setId] = React.useState<number>(1);
  let [userdata, setUserdata] = React.useState<Userdata>({ likes: [], bookmark: [], read: [] });
  let [share_container, setShare_container] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!content) return;
    setUserdata(content?.userdata);
    setId(content?.id);
  }, [content]);

  if(!content) return <></>;
  else return (
    <>
      <div className = 'block'>
          {props.additionalClass === '동영상' && <div className = 'videocontent'>
              <ReactPlayer width = {'769px'} height = '432px' url = 'https://www.youtube.com/watch?v=MONCv_l0Fxg' controls />
              <div className = 'cover'>
                  <div className = 'detail GB px14 op6'>영상의 한줄</div>
                  <div className = 'title GB px20 op9 line40'>{content.title}</div>
                  <div className = 'date GB px14 op9'>{'영상제작일 : ' + content.date}</div>
                  <div className = 'tag GB px14 op6'>{content.tag}</div>
                  <img className = 'like_button' src = {imageUrl('ContentPage/like_button.png')} onClick = {async () => {
                    let new_userdata = userdata;
                    if(userdata.likes.find((username) => (username === user.user!.username))) {
                      new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.likes.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    await content_userdata(id, new_userdata);
                  }}/>
                  <img className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} onClick = { () => {setShare_container(!share_container);}} />
                  <div className = 'more NS px12 bold op6'>{'원본파일 보기>'}</div>
                  {true && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark_white.png')} /> }
              </div>
              {share_container && <div className = 'share_container'>

              </div>}
          </div>}
          {props.additionalClass === '책' && <div className = 'bookcontent margin_base'>
              <div className = 'cover'>
                  <img className = 'cover_image' src = {imageUrl('ContentPage/cover_image.png')} />
                  <div className = 'cover_blur' />
                  <div className = 'detail GB px14 op6'>책의 한줄</div>
                  <div className = 'title GB px20 op9 line40'>{content.title}</div>
                  <div className = 'date GB px14 op9'>{'영상제작일 : ' + content.date}</div>
                  <div className = 'tag GB px14 op6'>{content.tag}</div>
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
