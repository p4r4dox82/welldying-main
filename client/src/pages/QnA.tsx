import React from 'react';
import { imageUrl } from '../etc/config';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubmenuContainer from '../components/SubmenuContainer';
import usePromise from '../etc/usePromise';
import { parseDate } from '../etc';
import { getrevQnas } from '../etc/api/qna';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function QnA ({ match }: Props) {
  let id = Number.parseInt(match.params.id);
  let user = useSelector((state: RootReducer) => state.user);
  let [, revqnas] = usePromise(getrevQnas);
  let [search_word, setSearch_word] = React.useState<string>('');
  let maxQnAId = React.useMemo(() => revqnas ? Math.max(...revqnas.map(qna => qna.id)) : 0, [revqnas]);
  let [selectid, setSelectid] = React.useState<number>(0);
  let [selectfaqid, setSelectfaqid] = React.useState<number>(0);
  let faqs = revqnas?.filter((qna) => (qna.id < 8));
  let [password, setPassword] = React.useState<string>('');
  let [redirectTo, setRedirectTo] = React.useState<string>();

  const password_check = async() =>{
    let qna_select = revqnas?.find((qna_) => qna_.id === selectid);
    if(qna_select && password === qna_select.password) {
      console.log('true');
      setRedirectTo(`/qna/${selectid}`);
    }
  }

  let startingid = maxQnAId - 8 * (id - 1);
  let endingid = Math.max(0, maxQnAId - 8 * id) + 1;
  let listqnas = revqnas?.filter((qna) => (qna?.id <= startingid && qna?.id >= endingid ));

  let list_num_array = [1, 2, 3, 4, 5, 6, 7, 8 ,9];
  const list_num = ((maxQnAId - 1) / 8) + 1;
  let list_num_array_actual = list_num_array.filter((i) => (i <= list_num));
  console.log(list_num_array_actual);

  if (redirectTo) return <Redirect to={ redirectTo }/>;
  return (
    <>
      <Header additionalClass = 'fullborder' />
      <div className = 'qna_page'>
          <div className = 'submenu_container'>
              <SubmenuContainer additionalClass = 'qna'/>
              <div className = 'searchContainer'>
                  <img src = {imageUrl('search_image.png')} alt = "profile"/>
                  <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
              </div>
          </div>
          <div className = 'main_title'>
          Q & A
            <div className = 'sub_title'>
            자주하는 질문
            </div>
          </div>
          <div className = 'list faq'>
              {faqs?.map((faq) => (
                <>
                <div className = 'list_content'>
                    <div className = 'Q'>Q.</div>
                    <div className = 'faq_title'>
                    {'['}
                    {faq?.classification === '메멘토 서비스 질문' && '메멘토 서비스'}
                    {faq?.classification === '유언전달에 관한 질문' && '유언 전달'}
                    {(faq?.classification === '기타 질문') && '기타'}
                    {']'}
                    {faq?.title}
                    </div>
                    <div className = 'faq_answerdate'>{parseDate(new Date(faq?.answerdate))}</div>
                    {selectfaqid === faq.id ? <img className = 'open_close' src = {imageUrl('close_button.png')} onClick = {() => {setSelectfaqid(0);}}/> : <img className = 'open_close' src = {imageUrl( 'open_button.png')} onClick = {() => {let id = faq?.id; setSelectfaqid(id);}} alt = "profile"/>}
                </div>
                {(faq?.id === selectfaqid) && <div className = 'list_content clicked auto_height'>
                <div className = 'A'>A.</div>
                    <textarea className = 'faq_answer' value = {faq?.answer} disabled/>
                </div>}
                </>
              ))}
          </div>
          <div className = 'classification_container'>
              <div>메멘토 서비스</div>
              <div>유언 전달</div>
              <div>기타</div>
          </div>
          <div className = 'title small'>질문 게시판</div>
          <div className = 'list margin_31px'>
              <div className = 'list_content name'>
                  <div className = 'id'>번호</div>
                  <div className = 'writer'>작성자</div>
                  <div className = 'title'>[분류] 제목</div>
                  <div className = 'answerdate'>답변 날짜</div>
                  <div className = 'open'>공개여부</div>
              </div>
              {listqnas?.map((qna) => (
                <>
                    <div className = 'list_content'>
                        <div className = 'id'>{qna?.id}</div>
                        <div className = 'writer'>{qna?.writer}</div>
                        {((qna?.state === '답변중' || qna?.open === '비공개')) && <div className = 'title' onClick = {() => {let id = qna?.id; setSelectid(id);}}>
                        {'['}
                        {qna?.classification === '메멘토에 제안' && '제안'}
                        {qna?.classification === '기타 의견' && '기타'}
                        {(qna?.classification === '메멘토 서비스 질문' || qna?.classification === '유언전달에 관한 질문' || qna?.classification === '기타 질문') && '질문'}
                        {'] '}
                        {qna?.title}
                        </div>}
                        {((qna?.state === '완료' && qna?.open === '공개')) && <Link to = {`/qna/${qna?.id}`} ><div className = 'title'>
                        {'['}
                        {qna?.classification === '메멘토에 제안' && '제안'}
                        {qna?.classification === '기타 의견' && '기타'}
                        {(qna?.classification === '메멘토 서비스 질문' || qna?.classification === '유언전달에 관한 질문' || qna?.classification === '기타 질문') && '질문'}
                        {'] '}
                        {qna?.title}
                        </div></Link>}
                        <div className = 'answerdate'>{qna?.state === '완료' ? parseDate(new Date(qna?.answerdate)) : '답변중'}</div>
                        <div className = 'open'>{qna?.open}</div>
                    </div>
                    {(qna?.id === selectid && qna?.state === '답변중') && <div className = 'list_content clicked'>
                        <Link to = {`/qna/${qna?.id}`} >
                            <div className = 'answeredlet'>현재 답변중입니다. 빠른시일 내에 만족스러운 답변을 남겨드릴 수 있도록 노력하겠습니다.</div>
                        </Link>
                    </div>}
                    {(qna?.id === selectid && qna?.state === '완료' && qna?.open === '비공개') && <div className = 'list_content clicked'>
                        <div className = 'password_name'>비공개 답변 인증</div>
                        <input className = 'password_input' placeholder = '설정하신 비밀번호를 입력해주세요.' value = {password} onChange={(e) => {setPassword(e.target.value);}}/>
                        <div className = 'password_button' onClick = {() => {password_check();}}><div>입력하기</div></div>
                    </div>}
                </>
              ))}
          </div>
          <div className = 'bottommenu_container'>
              <div className = 'page_container'>
                  <Link to ={`/qnalist/${Math.max(id - 1, 1)}`}><span>{`<`}</span></Link>
                  {list_num_array_actual.map((i) => (
                    <Link to ={`/qnalist/${i}`}><span className = {(id === i ? 'bold' : '')}>{i}</span></Link>
                  ))}
                  <Link to ={`/qnalist/${Math.min(id + 1, list_num)}`}><span>{`>`}</span></Link>
              </div>
              <div className = 'write_button_margin'>
                  <Link to = {(user.loggedIn ? `/writeqna/${maxQnAId+1}` : '/login')}>
                      <div className = 'button'>
                          <div>질문 및 제안하기</div>
                      </div>
                  </Link>
              </div>
          </div>
      </div>
      <Footer additionalClass = '' />
    </>
  );
}

export default QnA;
