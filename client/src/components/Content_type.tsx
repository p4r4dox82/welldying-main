import React from 'react';
import { imageUrl } from '../etc/config';
import { Content, Userdata, content_userdata } from '../etc/api/content';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import { kakaoJskey } from '../etc/config';
import { like_vector } from '../img/like_vector';

import ReactPlayer from 'react-player';

interface Props {
  additionalClass: string;
  content: Content | null;
}

declare global {
  interface Window {
    Kakao: any;
    ClipboardJS: any;
  }
}

const { Kakao, ClipboardJS } = window;

function Content_type (props : Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let content = props.content;
  let [id, setId] = React.useState<number>(1);
  let [userdata, setUserdata] = React.useState<Userdata>({ likes: [], bookmark: [], read: [] });
  let [share_container, setShare_container] = React.useState<boolean>(false);
  let uri = `mymemento.kr/contentpage/${id}`;
  let [liked, setLiked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!content) return;
    setUserdata(content?.userdata);
    setId(content?.id);
    setLiked(content?.userdata.likes.find((username) => (username === user.user!.username)) ? true : false );
  }, [content]);

  React.useEffect(() => {
    Kakao.init(kakaoJskey);
  }, []);

  let kakaoShare = () => {
    Kakao.Link.createDefaultButton({
      container: '#kakao-link_btn',
      objectType: 'feed',
      content: {
        title: `${content?.title}`,
        description: `${content?.tag}`,
        imageUrl:
          'https://welldying.s3.ap-northeast-2.amazonaws.com/img/content_small.png',
        link: {
          mobileWebUrl: `https://mymemento.kr/contentpage/${id}`,
          webUrl: `https://mymemento.kr/contentpage/${id}`,
        },
      },
      social: {
        likeCount: content?.userdata.likes.length,
        commentCount: content?.comments.length,
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: `https://mymemento.kr/contentpage/${id}`,
            webUrl: `https://mymemento.kr/contentpage/${id}`,
          },
        },
        {
          title: '앱으로 보기',
          link: {
            mobileWebUrl: `https://mymemento.kr/contentpage/${id}`,
            webUrl: `https://mymemento.kr/contentpage/${id}`,
          },
        },
      ],
    });
  }

  let facebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=https://mymemento.kr/contentpage/${id}`);
  }

  let clipboard = new ClipboardJS('.clipboard_btn');

  clipboard.on('success', function(e: any) {
    console.info('Action:', e.action);
		console.info('Text:', e.text);
		console.info('Trigger:', e.trigger);
		
		e.clearSelection();
  });

  clipboard.on('error', function(e: any) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	});

  if(!content) return <></>;
  else return (
    <>
      <div className = 'block'>
          {props.additionalClass === '동영상' && <div className = 'videocontent'>
              <ReactPlayer width = {'769px'} height = {'432px'} url = {'https://www.youtube.com/watch?v=MONCv_l0Fxg'} controls />
              <div className = 'cover'>
                  <div className = 'detail GB px14 op6'>영상의 한줄</div>
                  <div className = 'title GB px20 op9 line40'>{content.title}</div>
                  <div className = 'date GB px14 op9'>{'영상제작일 : ' + content.date}</div>
                  <div className = 'tag GB px14 op6'>{content.tag}</div>
                  <div className={"vector_container like" + (liked ? ' liked' : '')} onClick = {async () => {
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
                  }}>{like_vector}</div>
                  <img className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} onClick = { () => {setShare_container(!share_container);}} />
                  <div className = 'more NS px12 bold op6'>{'원본파일 보기>'}</div>
                  {true && <img className = 'bookmark' src = {imageUrl('ContentPage/bookmark_white.png')} /> }
              </div>
              {share_container && <div className = 'share_container'>
                  <img id = 'kakao-link_btn' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick = {() => kakaoShare()} />
                  <img src={imageUrl('ContentPage/facebook.png')} onClick = {() => facebookShare()} />
                  <div className="shareLink">
                      <input type="text NS px11" value = {`mymemento.kr/contentpage/${id}`} disabled/>
                      <button className="clipboard_btn copy NS px12 whiteop10" data-clipboard-text = {uri} >링크 복사</button>
                  </div>
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
