import React from 'react';
import { imageUrl } from '../etc/config';
import { Link, match, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubmenuContainer from '../components/SubmenuContainer';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { useSelector } from 'react-redux';
import { parseDate } from '../etc';
import { getrevNewses, writeNews } from '../etc/api/news';
import { useWindowScroll } from 'react-use';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function News ({ match }: Props) {
  let id = Number.parseInt(match.params.id);
  let user = useSelector((state: RootReducer) => state.user);
  let [search_word, setSearch_word] = React.useState<string>('');
  let [, revnewses] = usePromise(getrevNewses);
  let maxNewsId = React.useMemo(() => revnewses ? Math.max(...revnewses.map(news => news.id)) : 0, [revnewses]);
  let [error, setError] = React.useState<string>();
  console.log(revnewses?.map((news) => (news?.tag.split('#'))));

  let startingid = maxNewsId - 3 * (id - 1);
  let endingid = Math.max(0, maxNewsId - 3 * id) + 1;
  let listnewses = revnewses?.filter((news) => (news?.id <= startingid && news?.id >= endingid ));

  let list_num_array = [1, 2, 3, 4, 5, 6, 7, 8 ,9];
  const list_num = ((maxNewsId - 1) / 3) + 1;
  let list_num_array_actual = list_num_array.filter((i) => (i <= list_num));

  return (
    <>
      <Header additionalClass = 'fullborder' />
      <div className = 'news_page'>
          <div className = 'submenu_container'>
              <SubmenuContainer additionalClass = 'news'/>
              <div className = 'searchContainer'>
                  <img src = {imageUrl('search_image.png')} />
                  <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
              </div>
          </div>
          <div className = 'main_title'>
          보도자료
          </div>
          <div className = 'list'>
              <div className = 'list_content name'>
                  <div className = 'archive'>뉴스 아카이브</div>
                  <div className = 'news_info'>뉴스 주요 정보</div>
                  <div className = 'tag'>태그 카테고리</div>
              </div>
              {listnewses?.map((news, key) => (
                <>
                    <div className = 'list_content' onClick = {() => window.open((key === 0 ? 'https://www.newswire.co.kr/newsRead.php?no=919731' : 'https://www.sedaily.com/NewsVIew/22L3E5TQVJ'), '_blank')}>
                        <img className = 'archive' src = {imageUrl(key === 0 ? 'news2.png' : 'news1.png')} />
                        <div className = 'news_info'>
                            <div className = 'company'>{news?.company}</div>
                            <div className = 'title'>{news?.title}</div>
                            <div className = 'detail'>{news?.detail}</div>
                            <div className = 'date' style ={{marginTop: '20px'}}>{news?.date}</div>
                        </div>
                        <div className = 'tag each'>
                            {news?.tag.split("#").slice(1).map((tag_) => (
                              <div className = 'tag_'>{'#' + tag_}</div>
                            ))}
                        </div>
                    </div>
                </>
              ))}
          </div>
          <div className = 'bottommenu_container'>
              <div className = 'page_container'>
                  <Link to ={`/newslist/${Math.max(id - 1, 1)}`}><span>{`<`}</span></Link>
                  {list_num_array_actual.map((i) => (
                    <Link to ={`/newslist/${i}`}><span className = {(id === i ? 'bold' : '')}>{i}</span></Link>
                  ))}
                  <Link to ={`/newslist/${Math.min(id + 1, list_num)}`}><span>{`>`}</span></Link>
              </div>
              {(user.loggedIn && user.user!.username === 'admin') && <div className = 'write_button_margin'>
                  <Link to = {`/writenews/${maxNewsId+1}`}>
                      <div className = 'button'>
                          <div>뉴스 작성하기</div>
                      </div>
                  </Link>
              </div>}
          </div>
      </div>
      <Footer additionalClass = '' />
    </>
  );
}

export default News;
