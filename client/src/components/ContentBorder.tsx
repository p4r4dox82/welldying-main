import React from 'react';
import { imageUrl } from '../etc/config';
import { getContent, contentComment, Content, content_userdata, Userdata } from '../etc/api/content';
import { getComments, writeComment } from '../etc/api/comment';
import usePromise from '../etc/usePromise';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import { parseDate } from '../etc';
import { like_vector } from '../img/Vectors';
import { kakaoJskey } from '../etc/config';

interface Props {
    content: Content | null;
}

let writeCommenttoContent = async (id: number, content_comments : number[]) => {
  await contentComment(id, content_comments);
};

declare global {
    interface Window {
        Kakao: any;
        ClipboardJS: any;
    }
}

const { Kakao, ClipboardJS } = window;

function ContentBorder (props : Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let username = React.useMemo(() => String(user.user?.username), [user]);
  let content = props.content;
  let [id, setId] = React.useState<number>(0);
  let [, comments] = usePromise(getComments);
  let [comment_write, setComment_write] = React.useState<string>('');
  let [date, setDate] = React.useState<number>();
  let [error, setError] = React.useState<string>('');
  let [maxCommentId, setMaxCommentId] = React.useState<number>(0);
  React.useEffect(() => setMaxCommentId(comments ? Math.max(...comments.map(comment => comment.id)) : 0), [comments]);
  let [content_comments, setContent_comments] = React.useState<number[]>([]);
  let [title, setTitle] = React.useState<string>('');
  let [update, setUpdate] = React.useState<number>(0);
  let [show_comment, setShow_comment] = React.useState<boolean>(false);
  let [contentUserdata, setContentUserdata] = React.useState<Userdata>({ likes: [], bookmark: [], read: [] });
  let [contentliked, setContentliked] = React.useState<boolean>(false);
  let [share_container, setShare_container] = React.useState<boolean>(false);
  let uri = `https://mymemento.kr/contentpage/${id}`;

  let comments_content = React.useMemo(() => comments?.filter((comment) => content_comments?.includes(comment.id))
  , [comments, id]);

  let [max_show_comments_number, setMax_show_comments_number] = React.useState<number>(0);
  React.useEffect (() => setMax_show_comments_number(comments_content?.length), [comments_content])
  let [show_comments_number, setShow_comments_number] = React.useState<number>(0);
  let show_comments = React.useMemo(() => comments_content?.slice(0, show_comments_number), [comments_content, show_comments_number]);

  React.useEffect(() => {
      if (!content) return;
      setContent_comments(content.comments || []);
      setTitle(content.title);
      setId(content.id);
      setContentUserdata(content.userdata);
      if(content.userdata.likes.find((username_) => username_ === username)) 
        setContentliked(true);
  }, [content, user]);

  React.useEffect(() => {
    writeCommenttoContent(id, content_comments);
  }, [update]);

  React.useEffect(() => {
    if(!Kakao.isInitialized())
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
        likeCount: (content?.userdata.likes ? (content?.userdata.likes.length) : 0),
        commentCount: (content?.comments ? (content?.comments?.length) : 0),
      },
      buttons: [
        {
          title: '웹으로 보기',
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

  let comment_container = React.useMemo(() => show_comments?.map((comment) => (
    <div className = 'comment_box'>
        <div className = 'user_icon'>
            <img className = 'user_icon' src = {imageUrl('user_login.png')}  alt = "profile"/>
        </div>
        <div className = 'writer NS px13 bold'>
        {comment.writer + ' 님'}
        </div>
        <textarea className = 'comment_area written NS px13 line25' placeholder = '메멘토에 댓글을 남겨보세요.' value = {comment.detail} disabled/>
        <img className = 'like_button' src = {imageUrl('ContentPage/like_button.png')} />
        <div className = 'likes NS px13 bold line25'>
        {comment.userdata.likes.length}
        </div>
        <div className = 'date_container'>
            <div className = 'date NS px12 bold op9'>{parseDate(new Date(comment.date))}</div>
            <div className = 'declare_button  NS px12 bold op9'>{'신고하기'}</div>
        </div>
    </div>
  )), [update, show_comments]);

  return (
    <>
      <div className = 'contentborder margin_base'>
          <div className = 'border_container'>
              <div style = {{width: '443px', height: '1px', background: 'rgba(39, 57, 47, 0.5)'}} />
              <img src = {imageUrl('ContentPage/comment_border_image.png')} />
              <div style = {{width: '443px', height: '1px', background: 'rgba(39, 57, 47, 0.5)'}} />
          </div>
          <div className = 'button_container'>
              <button className = {'like_button white NS px12 bold op9' + (contentliked ? ' liked' : '')} onClick = {user.loggedIn ? async () => {
                    let newuserdata = contentUserdata;
                    if(contentliked)
                        newuserdata.likes.splice(Number(newuserdata.likes.find((username_) => (username_ === username))), 1);
                    else
                        newuserdata.likes.push(username);
                    setContentUserdata(newuserdata);
                    setContentliked(!contentliked);
                    await content_userdata(id, newuserdata);
              } : () => {}}>
                  {like_vector}
                  {contentUserdata.likes.length}
              </button>
              <button className = 'share_button white NS px12 bold op9' onClick = {() => setShare_container(!share_container)}>
                  <img src = {imageUrl('ContentPage/share_image.png')} />
                  공유하기
              </button>
              {share_container && <div className = 'share_container' style = {{zIndex: 10}}>
                  <img id = 'kakao-link_btn' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick = {() => kakaoShare()} />
                  <img src={imageUrl('ContentPage/facebook.png')} onClick = {() => facebookShare()} />
                  <div className="shareLink">
                      <input type="text NS px11" value = {`mymemento.kr/contentpage/${id}`} disabled/>
                      <button className="clipboard_btn copy NS px12 whiteop10" data-clipboard-text = {uri} onClick = {() => alert('링크가 복사되었습니다.')}>링크 복사</button>
                  </div>
              </div>}
              <button className = 'comment_button white NS px12 bold op9' onClick = {() => {setShow_comment(!show_comment); setShow_comments_number(Math.min(4, max_show_comments_number));}}>
                  <img src = {imageUrl('ContentPage/comment_image.png')} />
                  댓글보기
              </button>
          </div>
          {show_comment && <div className = 'comment_container'>
              {comment_container}
              {user.loggedIn && <div className = 'comment_box'>
                  <div className = 'user_icon'>
                      <img className = 'user_icon' src = {imageUrl('user_login.png')}  alt = "profile"/>
                  </div>
                  <div className = 'writer NS px13 bold'>
                  {user.user!.name + ' 님'}
                  </div>
                  <textarea className = 'comment_area NS px13 line35' placeholder = '메멘토에 댓글을 남겨보세요.' value = {comment_write} onChange = {(e) => {setComment_write(e.target.value); }} />
                  <button className = 'green NS px13 bold' onClick={async (e) => {
                      e.preventDefault();
                      setDate(new Date().getTime());
                      if (!comment_write) alert('댓글을 작성해주세요.');
                      else if (await writeComment(maxCommentId + 1, user.user!.name, comment_write, Number(date), { likes: [] }, 'none')) {
                        setContent_comments(content_comments.concat([maxCommentId + 1])); alert('댓글이 작성되었습니다.'); comments_content.push({ id: maxCommentId + 1, writer: String(user.user!.name), detail: comment_write, date: new Date().getTime(), userdata: { likes: [] }, declare: 'none' }); setUpdate(update + 1); setShow_comments_number(show_comments_number + 1); setMaxCommentId(maxCommentId + 1); setMax_show_comments_number(max_show_comments_number + 1); setTimeout(() => setComment_write(''), 1000); console.log(maxCommentId);
                      }
                      else setError('어딘가 문제가 생겼습니다.');
                  }}>확인</button>
              </div>}
              {show_comments_number !== max_show_comments_number && <div className = 'more_border' onClick = {() => {setShow_comments_number(Math.min(show_comments_number + 4, max_show_comments_number))}}>
                  <div className = 'GB px18 bold op5'>더보기</div>
                  <img className = 'more_button' src = {imageUrl('ContentPage/more_button.png')} />
              </div>}
          </div>}
      </div>
    </>
  );
}

export default ContentBorder;
