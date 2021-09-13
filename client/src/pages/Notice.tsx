import React from 'react';
import { imageUrl } from '../etc/config';
import { Link, match } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubmenuContainer from '../components/SubmenuContainer';
import usePromise from '../etc/usePromise';
import { getrevNotices, writeNotice } from '../etc/api/notice';
import { RootReducer } from '../store';
import { useSelector } from 'react-redux';
import { parseDate } from '../etc';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function Notice ({ match }: Props) {
  let id = Number.parseInt(match.params.id);
  let user = useSelector((state: RootReducer) => state.user);
  let [search_word, setSearch_word] = React.useState<string>('');
  let [, revnotices] = usePromise(getrevNotices);
  let maxNoticeId = React.useMemo(() => revnotices ? Math.max(...revnotices.map(notice => notice.id)) : 0, [revnotices]);
  let [error, setError] = React.useState<string>();

  let startingid = maxNoticeId - 8 * (id - 1);
  let endingid = Math.max(0, maxNoticeId - 8 * id) + 1;
  let listnotices = revnotices?.filter((notice) => (notice?.id <= startingid && notice?.id >= endingid ));

  let list_num_array = [1, 2, 3, 4, 5, 6, 7, 8 ,9];
  const list_num = ((maxNoticeId - 1) / 8) + 1;
  let list_num_array_actual = list_num_array.filter((i) => (i <= list_num));

  return (
    <>
      <Header additionalClass = 'fullborder' />
      <div className = 'notice_page'>
          <div className = 'submenu_container'>
              <SubmenuContainer additionalClass = 'notice'/>
              <div className = 'searchContainer'>
                  <img src = {imageUrl('search_image.png')} alt="profile"/>
                  <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
              </div>
          </div>
          <div className = 'main_title'>
          공지사항
          </div>
          <div className = 'list'>
              <div className = 'list_content name'>
                  <div className = 'id'>번호</div>
                  <div className = 'classification'>분류</div>
                  <div className = 'title'>제목</div>
                  <div className = 'date'>등록 날짜</div>
                  <div className = 'views'>조회수</div>
              </div>
              {listnotices?.map((notice) => (
                <>
                    <div className = 'list_content'>
                        <div className = 'id'>{notice?.id}</div>
                        <div className = 'classification'>
                        {notice?.classification}
                        </div>
                        <div onClick={async (e) => {
                            e.preventDefault();
                            if (await writeNotice(notice?.id, notice?.classification, notice?.title, notice?.detail, notice?.date, notice?.views + 1)) console.log(notice?.views);
                            else setError('어딘가 문제가 생겼습니다.');
                        }}>
                            <Link to = {`/notice/${notice?.id}`} ><div className = 'title'>{notice?.title}</div></Link>
                        </div>
                        <div className = 'date'>{parseDate(new Date(notice?.date))}</div>
                        <div className = 'views'>{notice?.views}</div>
                    </div>
                </>
              ))}
          </div>
          <div className = 'bottommenu_container'>
              <div className = 'page_container'>
                  <Link to ={`/noticelist/${Math.max(id - 1, 1)}`}><span>{`<`}</span></Link>
                  {list_num_array_actual.map((i) => (
                    <Link to ={`/noticelist/${i}`}><span className = {(id === i ? 'bold' : '')}>{i}</span></Link>
                  ))}
                  <Link to ={`/noticelist/${Math.min(id + 1, list_num)}`}><span>{`>`}</span></Link>
              </div>
              {(user.loggedIn && user.user!.username === 'admin') && <div className = 'write_button_margin'>
                  <Link to = {`/writenotice/${maxNoticeId+1}`}>
                      <div className = 'button'>
                          <div>공지 작성하기</div>
                      </div>
                  </Link>
              </div>}
          </div>
      </div>
      <Footer additionalClass = '' />
    </>
  );
}

export default Notice;
