import React from 'react';
import { imageUrl } from '../etc/config';
import { Link } from 'react-router-dom';
import { getSections } from '../etc/api/section';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { useSelector } from 'react-redux';
import { getUsers } from '../etc/api/user';

interface Props {
  additionalClass: string;
  id: number;
  book: boolean;
  category: boolean;
  setAddUserGive: any;
}

function NoteLeftBar (props: Props) {
  let [, sections] = usePromise(getSections);
  let user = useSelector((state: RootReducer) => state.user);
  let [,users] = usePromise(getUsers);

  let UsersGive = React.useMemo(() => {
    return (
      <div className="usersgive">
        <div className="title NS px12 bold line25">사후 노트 수령인</div>
        <div className="userscontainer">
          {(user && users) && user.user?.UsersInfo.give.map((userinfo) => {
            let giveuser = users.find((user_) => user_.username === userinfo.username);
            if(giveuser) return (
              <div className="username NS px12 line30">{giveuser?.name}</div>
            );
          })}
        </div>
        <div className="adduser NS px12 bold line25" onClick = {() => props.setAddUserGive(true)}>{'+ 수정하기'}</div>
      </div>
    );
  }, [user, users]);

  let NoteBook = React.useRef<any>(null);
  let NoteBookClick = () => NoteBook.current.click();

  return (
    <>
        <Link to = {'/notebook/1'} ref = {NoteBook} style = {{display: 'none'}} />
        <div className = {'NoteLeftBar' + props.additionalClass}>
            <div className = {'NoteBar' + (!props.category ? ' no_background' : '')}>
                <div className = 'title NS px12 bold op7 line25'>나의 메멘토 노트</div>
                <Link to='/note/1'><div className = {'note' + (props.book ? '' : ' selected')} /></Link>
                <div className = 'vector' />
                <div className = 'title NS px12 bold op5'>나의 메멘토 북</div>
                {(user.user?.bookname && user.user.bookname.length === 1) && <Link to='/notebook/1'><div className = {'note' + (props.book ? ' selected' : '')} /></Link>}
                <div className = 'add note'>
                    <img className = 'add_image' src = {imageUrl('ContentPage/add_button.png')} onClick = {() => NoteBookClick()}/>
                    {(user.user?.bookname && user.user.bookname.length === 1) && <div className="notopen GB px12 whiteop10" style = {{width: '100%', height: '100%', background: 'rgba(96, 103, 99, 0.8)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>오픈 준비중</div>}
                </div>
                {props.book && UsersGive}
            </div>
            {props.category && <div className = 'CategoryBar'>
                <div className = 'category_container'>
                    <div className = 'title NS px12 bold op7 line25'>작성 카테고리</div>
                    {sections?.map((section, key) =>{
                      if(key === 5) return <></>;
                      return (
                        <Link to={`/note/${key + 1}`}><div className = {'category NS px14 whiteop9 line25' + (props.id === (key + 1) ? ' bold' : '')}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div></Link>
                      );
                    })}
                </div>
            </div>}
        </div>
    </>
  );
}

export default NoteLeftBar;
