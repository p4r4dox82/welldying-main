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
          {(user && users) && user.user?.UsersInfo.give.map((username) => {
            let user = users.find((user_) => user_.username === username);
            return (
              <div className="username NS px12 line30">{user?.name}</div>
            );
          })}
        </div>
      </div>
    );
  }, [user, users]);

  return (
    <>
        <div className = {'NoteLeftBar' + props.additionalClass}>
            <div className = {'NoteBar' + (!props.category ? ' no_background' : '')}>
                <div className = 'title NS px12 bold op7 line25'>나의 메멘토 노트</div>
                <Link to='/note/1'><div className = {'note' + (props.book ? '' : ' selected')} /></Link>
                <div className = 'vector' />
                <div className = 'title NS px12 bold op5'>나의 유언 자서전</div>
                <Link to='/notebook/1'><div className = {'note' + (props.book ? ' selected' : '')} /></Link>
                <div className = 'add note'>
                    <img className = 'add_image' src = {imageUrl('ContentPage/add_button.png')} />
                </div>
                {UsersGive}
            </div>
            {props.category && <div className = 'CategoryBar'>
                <div className = 'category_container'>
                    <div className = 'title NS px12 bold op7 line25'>작성 카테고리</div>
                    {sections?.map((section, key) =>{
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
