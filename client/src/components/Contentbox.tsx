import React from 'react';
import { imageUrl } from '../etc/config';
import { Link, Redirect } from 'react-router-dom';
import { Content, content_userdata } from '../etc/api/content';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import { like_vector } from '../img/Vectors';
import { bookmark_vector } from '../img/bookmark_vector';
import usePromise from '../etc/usePromise';
import { getQuestions } from '../etc/api/question';

interface Props {
    additionalClass: string;
    content: Content | null;
}

function Contentbox(props: Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let content = props.content;
  let [id, setId] = React.useState<number>(0);
  let [userdata, setUserdata] = React.useState<{ likes: string[], bookmark: string[], read: string[] }>({ likes: [], bookmark: [], read: [] });
  let [small_more, setSmall_more] = React.useState<boolean>(false);
  let [big_type2, setBig_type2] = React.useState<boolean>(props.additionalClass === 'big type2');
  let [liked, setLiked] = React.useState<boolean>(false);
  let [bookmarked, setBookmarked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!content) return;
    setId(content.id);
    setUserdata(content?.userdata);
    if(user.loggedIn) {
      setLiked(content?.userdata.likes.find((username) => (username === user.user!.username)) ? true : false );
      setBookmarked(content?.userdata.bookmark.find((username) => (username === user.user!.username)) ? true : false );
    } else {
      setLiked(false);
      setBookmarked(false);
    }
  }, [content]);

  let link_content = React.useRef<any>(null);
  let LinkClick = () => {
    link_content.current.click();
  }

  let [, questions] = usePromise(getQuestions);
  let question = React.useMemo(() => questions?.find((question) => question.id === content?.question), [questions, content]);

  if(!content) return <></>;
  else return (
    <>
      <Link to={`/contentpage/${id}`} ref = {link_content} style = {{display: 'none'}} />
      {(props.additionalClass === 'big' || props.additionalClass === 'big type2') && <div className = 'big_content'>
          <img className = 'thumbnail' src = {((content.imageData && content.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} onClick = {user.loggedIn ? async () => {
            let new_userdata = userdata;
            if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
              new_userdata.read.push(user.user!.username);
              setUserdata(new_userdata);
              await content_userdata(id, new_userdata);
            }
            LinkClick();
          } : () => {LinkClick();}} style = {{objectFit: 'cover', width: '100%', height: '190px', borderRadius: '5px'}}/>
          <div className = 'cover'>
              {!big_type2 && <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} />}
              <div className = 'type'>{content.type === '책' ? 'book' : (content.type === '동영상' ? 'video' : '')}</div>
              <div className = 'title' onClick = {user.loggedIn ? async () => {
                let new_userdata = userdata;
                if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
                  new_userdata.read.push(user.user!.username);
                  setUserdata(new_userdata);
                  await content_userdata(id, new_userdata);
                }
                LinkClick();
              } : () => {LinkClick();}}>{'[' + content.type + ']' + content.title}</div>
              <div className = 'tag'>{content.tag}</div>
              <div className = 'likes_container'>
                  <img className = 'likes_image' src = {imageUrl('content_like.png')} />
                  <span>{content.userdata.likes.length}</span>
              </div>
          </div>
          {(user.loggedIn && content.userdata.read.find((username) => username === user.user!.username)) && <div className = 'read'/>}
          {(user.loggedIn && content.userdata.bookmark.find((username) => username === user.user!.username)) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
      {(props.additionalClass === 'small' || props.additionalClass === 'small wide') && <div className = {'small_content ' + props.additionalClass}>
          <img className = 'thumbnail' src = {((content.imageData && content.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} style = {{width: (props.additionalClass === 'small' ? '236px' : '324px'), height: (props.additionalClass === 'small' ? '138px' : '190px')}} onClick = {user.loggedIn ? async () => {
            let new_userdata = userdata;
            if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
              new_userdata.read.push(user.user!.username);
              setUserdata(new_userdata);
              await content_userdata(id, new_userdata);
            }
            LinkClick();
          } : () => {LinkClick();}}/>
          <div className = 'cover'>
              <div className = 'tag'>{content.tag}</div>
              <div className = 'more' onClick = {() => {setSmall_more(!small_more);}}>
                  {[...Array(3).keys()].map((i) => (<div className = 'dot' />))}
              </div>
              {small_more && <div className = {'more_container' + ' ' + props.additionalClass}>
                  <div style = {{display: 'flex', alignItems: 'center', gap: '11px'}} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.likes.find((username) => (username === user.user!.username))) {
                      new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.likes.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setLiked(!liked);
                    await content_userdata(id, new_userdata);
                  } : () => {}}>
                      <div className={"vector_container like" + (liked ? ' liked' : '')}>{like_vector}</div>
                      <span className = 'label NS px13 nospacing'>좋아요</span>
                  </div>
                  <div style = {{display: 'flex', alignItems: 'center', gap: '11px'}} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.bookmark.find((username) => (username === user.user!.username))) {
                      new_userdata.bookmark.splice(Number(userdata.bookmark.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.bookmark.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setBookmarked(!bookmarked);
                    await content_userdata(id, new_userdata);
                  } : () => {}}>
                      <div className={"vector_container bookmark" + (bookmarked ? ' bookmarked' : '')}>{bookmark_vector}</div>
                      <span className = 'label NS px13 nospacing'>책갈피 남기기</span>
                  </div>
              </div>}
              <div className = 'title' onClick = {user.loggedIn ? async () => {
                let new_userdata = userdata;
                if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
                  new_userdata.read.push(user.user!.username);
                  setUserdata(new_userdata);
                  await content_userdata(id, new_userdata);
                }
                LinkClick();
              } : () => {LinkClick();}}>{'[' + content.type + ']' + content.title}</div>
              <div className = 'date'>{'2021.08.03'}</div>
          </div>
          {(user.loggedIn && content.userdata.read.find((username) => username === user.user!.username)) && <div className = 'read' style = {{top: (props.additionalClass === 'small' ? '134.5px' : '186.5px')}}/>}
          {(user.loggedIn && content.userdata.bookmark.find((username) => username === user.user!.username)) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
      {props.additionalClass === 'question' && <div className = 'question_content'>
          <img className = 'thumbnail' src = {((content.imageData && content.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} />
          <button className = 'question' disabled>
              <div>{question?.title.split('\n')[0]}</div>
              <div>{question?.title.split('\n')[1]}</div>
          </button>
          <div className = 'cover' onClick = {() => LinkClick()}>
              <div className = 'title'>{'[' + content.type + ']' + content.title}</div>
          </div>
          {(user.loggedIn && content.userdata.bookmark.find((username) => username === user.user!.username)) && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark.png')} />}
      </div>}
    </>
  );
}

export default Contentbox;
