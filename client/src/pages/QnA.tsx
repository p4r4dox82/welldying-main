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
              {false && <div className = 'searchContainer'>
                  <img src = {imageUrl('search_image.png')} alt = "profile"/>
                  <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '???)????????? ?????????'/>
              </div>}
          </div>
          <div className = 'main_title'>
          Q & A
            <div className = 'sub_title'>
            ???????????? ??????
            </div>
          </div>
          <div className = 'list faq'>
              {faqs?.map((faq) => (
                <>
                <div className = 'list_content'>
                    <div className = 'Q'>Q.</div>
                    <div className = 'faq_title'>
                    {'['}
                    {faq?.classification === '????????? ????????? ??????' && '????????? ?????????'}
                    {faq?.classification === '??????????????? ?????? ??????' && '?????? ??????'}
                    {(faq?.classification === '?????? ??????') && '??????'}
                    {']'}
                    {faq?.title}
                    </div>
                    <div className = 'faq_answerdate'>{parseDate(new Date(faq?.answerdate))}</div>
                    {selectfaqid === faq.id ? <img alt = "" className = 'open_close' src = {imageUrl('close_button.png')} onClick = {() => {setSelectfaqid(0);}}/> : <img className = 'open_close' src = {imageUrl( 'open_button.png')} onClick = {() => {let id = faq?.id; setSelectfaqid(id);}} alt = "profile"/>}
                </div>
                {(faq?.id === selectfaqid) && <div className = 'list_content clicked auto_height'>
                <div className = 'A'>A.</div>
                    <textarea className = 'faq_answer' value = {faq?.answer} disabled/>
                </div>}
                </>
              ))}
          </div>
          <div className = 'classification_container'>
              <div>????????? ?????????</div>
              <div>?????? ??????</div>
              <div>??????</div>
          </div>
          <div className = 'title small'>?????? ?????????</div>
          <div className = 'list margin_31px'>
              <div className = 'list_content name'>
                  <div className = 'id'>??????</div>
                  <div className = 'writer'>?????????</div>
                  <div className = 'title'>[??????] ??????</div>
                  <div className = 'answerdate'>?????? ??????</div>
                  <div className = 'open'>????????????</div>
              </div>
              {listqnas?.map((qna) => (
                <>
                    <div className = 'list_content'>
                        <div className = 'id'>{qna?.id}</div>
                        <div className = 'writer'>{qna?.writer}</div>
                        {((qna?.state === '?????????' || qna?.open === '?????????')) && <div className = 'title' onClick = {() => {let id = qna?.id; setSelectid(id);}}>
                        {'['}
                        {qna?.classification === '???????????? ??????' && '??????'}
                        {qna?.classification === '?????? ??????' && '??????'}
                        {(qna?.classification === '????????? ????????? ??????' || qna?.classification === '??????????????? ?????? ??????' || qna?.classification === '?????? ??????') && '??????'}
                        {'] '}
                        {qna?.title}
                        </div>}
                        {((qna?.state === '??????' && qna?.open === '??????')) && <Link to = {`/qna/${qna?.id}`} ><div className = 'title'>
                        {'['}
                        {qna?.classification === '???????????? ??????' && '??????'}
                        {qna?.classification === '?????? ??????' && '??????'}
                        {(qna?.classification === '????????? ????????? ??????' || qna?.classification === '??????????????? ?????? ??????' || qna?.classification === '?????? ??????') && '??????'}
                        {'] '}
                        {qna?.title}
                        </div></Link>}
                        <div className = 'answerdate'>{qna?.state === '??????' ? parseDate(new Date(qna?.answerdate)) : '?????????'}</div>
                        <div className = 'open'>{qna?.open}</div>
                    </div>
                    {(qna?.id === selectid && qna?.state === '?????????') && <div className = 'list_content clicked'>
                        <Link to = {`/qna/${qna?.id}`} >
                            <div className = 'answeredlet'>?????? ??????????????????. ???????????? ?????? ??????????????? ????????? ???????????? ??? ????????? ?????????????????????.</div>
                        </Link>
                    </div>}
                    {(qna?.id === selectid && qna?.state === '??????' && qna?.open === '?????????') && <div className = 'list_content clicked'>
                        <div className = 'password_name'>????????? ?????? ??????</div>
                        <input className = 'password_input' placeholder = '???????????? ??????????????? ??????????????????.' value = {password} onChange={(e) => {setPassword(e.target.value);}}/>
                        <div className = 'password_button' onClick = {() => {password_check();}}><div>????????????</div></div>
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
                          <div>?????? ??? ????????????</div>
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
