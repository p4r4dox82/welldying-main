import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents, Content, content_userdata } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';

interface Props {
    additionalClass: string;
    content: Content | null;
}

function Contentbox(props: Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let content = props.content;
  let id = props.content!.id;
  let [userdata, setUserdata] = React.useState<{ likes: string[], bookmark: string[], read: string[] }>({ likes: [], bookmark: [], read: [] });
  let [small_more, setSmall_more] = React.useState<boolean>(false);
  let [big_more, setBig_more] = React.useState<boolean>(false);
  let [big_type2, setBig_type2] = React.useState<boolean>(props.additionalClass === 'big type2');

  React.useEffect(() => {
    if(!content) return;
    setUserdata(content?.userdata);
  }, [content]);

  if(!content) return <></>;
  else return (
    <>
      {(props.additionalClass === 'big' || props.additionalClass === 'big type2') && <div className = 'big_content'>
          <img className = 'thumbnail' src = {imageUrl('ContentPage/big_content_image.png')} onClick = {async () => {
            let new_userdata = userdata;
            if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
              new_userdata.read.push(user.user!.username);
              setUserdata(new_userdata);
              await content_userdata(id, new_userdata);
            }
          }}/>
          <div className = 'cover'>
              {!big_type2 && <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} />}
              <div className = 'type'>{content.type === '책' ? 'book' : (content.type === '동영상' ? 'video' : '')}</div>
              <div className = 'title' onClick = {async () => {
                let new_userdata = userdata;
                if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
                  new_userdata.read.push(user.user!.username);
                  setUserdata(new_userdata);
                  await content_userdata(id, new_userdata);
                }
              }}>{'[' + content.type + ']' + content.title}</div>
              <div className = 'tag'>{content.tag}</div>
              <div className = 'likes_container'>
                  <img className = 'likes_image' src = {imageUrl('content_like.png')} />
                  <span>{content.userdata.likes.length}</span>
              </div>
          </div>
          {content.userdata.read.find((username) => username === user.user!.username) && <div className = 'read'/>}
          {content.userdata.bookmark.find((username) => username === user.user!.username) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
      {(props.additionalClass === 'small' || props.additionalClass === 'small wide') && <div className = {'small_content ' + props.additionalClass}>
          <img className = 'thumbnail' src = {imageUrl(props.additionalClass === 'small' ? 'ContentPage/small_content_image.png' : 'ContentPage/big_content_image.png')} onClick = {async () => {
            let new_userdata = userdata;
            if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
              new_userdata.read.push(user.user!.username);
              setUserdata(new_userdata);
              await content_userdata(id, new_userdata);
            }
          }}/>
          <div className = 'cover'>
              <div className = 'tag'>{content.tag}</div>
              <div className = 'more' onClick = {() => {setSmall_more(!small_more);}}>
                  {[...Array(3).keys()].map((i) => (<div className = 'dot' />))}
              </div>
              {small_more && <div className = 'more_container big'>
                  <div style = {{display: 'flex', alignItems: 'center', gap: '11px'}} onClick = {async () => {
                    let new_userdata = userdata;
                    if(userdata.likes.find((username) => (username === user.user!.username))) {
                      new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.likes.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    await content_userdata(id, new_userdata);
                  }}>
                      <img className = 'like_button' src = {imageUrl('ContentPage/small_content_like.png')} />
                      <span className = 'label NS px13 nospacing'>좋아요</span>
                  </div>
                  <div style = {{display: 'flex', alignItems: 'center', gap: '11px'}} onClick = {async () => {
                    let new_userdata = userdata;
                    if(userdata.bookmark.find((username) => (username === user.user!.username))) {
                      new_userdata.bookmark.splice(Number(userdata.bookmark.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.bookmark.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    await content_userdata(id, new_userdata);
                  }}>
                      <img className = 'bookmark_button' src = {imageUrl('ContentPage/small_content_bookmark.png')} />
                      <span className = 'label NS px13 nospacing'>책갈피 남기기</span>
                  </div>
              </div>}
              <div className = 'title' onClick = {async () => {
                let new_userdata = userdata;
                if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
                  new_userdata.read.push(user.user!.username);
                  setUserdata(new_userdata);
                  await content_userdata(id, new_userdata);
                }
              }}>{'[' + content.type + ']' + content.title}</div>
              <div className = 'date'>{'2021.08.03'}</div>
          </div>
          {content.userdata.read.find((username) => username === user.user!.username) && <div className = 'read'/>}
          {content.userdata.bookmark.find((username) => username === user.user!.username) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
      {props.additionalClass === 'question' && <div className = 'question_content'>
          <img className = 'thumbnail' src = {imageUrl('ContentPage/question_content_image.png')} />
          <button className = 'question' disabled>
              <div>당신의 삶에서</div>
              <div>가장 중요한 사람은 누구인가요?</div>
          </button>
          <div className = 'cover'>
              <div className = 'title'>{'[' + content.type + ']' + content.title}</div>
          </div>
          {content.userdata.bookmark.find((username) => username === user.user!.username) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
    </>
  );
}

export default Contentbox;
