import React from 'react';
import { useSelector } from 'react-redux';
import { match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import { getContent } from '../etc/api/content';
import { getSections } from '../etc/api/section';
import { writeQna } from '../etc/api/qna';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

const checkline = (data: string) => {
  let str = data;
  let str_len = str.length;
  let str_arr = str.split('\n');
  let row = str_arr.length;
  let actual_row = row;
  let data_fixed = '';
  let data_len = 0;
  let current_row = 0;
  if(str_len >= 3000) {
    data_fixed = str.slice(0, -1);
  }
  else {
    data_fixed = str;
  }
  console.log(data_fixed);
  console.log(data_len);
  console.log(current_row);
  console.log(actual_row);
  return data_fixed;
}

function WriteQnA({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [error, setError] = React.useState<string>();

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [search_word, setSearch_word] = React.useState<string>('');

    let classification_answer = ['메멘토 서비스 질문', '유언전달에 관한 질문', '기타 질문', '메멘토에 제안', '기타 의견'];
    let open_answer = ['공개', '비공개'];
    let sns_notice_answer = ['수신 원함', '수신 원치 않음'];
    let writer = user.user!.name;
    let [title, setTitle] = React.useState<string>('');
    let [detail, setDetail] = React.useState<string>('');
    let [date, setDate] = React.useState<number>(0);
    let [answerdate, setAnswerdate] = React.useState<number>(0);
    let [open, setOpen] = React.useState<string>('공개');
    let [password, setPassword] = React.useState<string>('');
    let [classification, setClassification] = React.useState<string>('메멘토 서비스 질문');
    let [sns_notice, setSns_notice] = React.useState<string>('수신 원함');
    let [answer, setAnswer] = React.useState<string>('');
    let [characternumbers, setCharacternumbers] = React.useState<number>(0);


    if (!user.loggedIn) return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/qnalist/1'/>;
    else return (
        <>
            <Header additionalClass = 'fullborder' />
            <div className = 'writeqna_page'>
                <div className = 'submenu_container'>
                    <SubmenuContainer additionalClass = 'qna'/>
                    <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} />
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
                    </div>
                </div>
                <div className = 'main_title'>
                Q & A
                  <div className = 'sub_title'>
                  메멘토에 질문하기
                  </div>
                </div>
                <div className = 'list'>
                    <div className = 'text_container'>
                        <div>메멘토에 관심을 가져주셔서 감사합니다.</div>
                        <div>보다 세심한 답변과 서비를 위해 사용자님의 상세한 작성 부탁드립니다.</div>
                    </div>
                </div>
                <div className = 'type_container'>
                    <div className = 'question'>
                        <div className = 'title_container'>
                            <div className = 'number'>
                            1.
                            </div>
                            <div className = 'title'>
                            어떤 유형의 질문이신가요?
                            </div>
                        </div>
                        <div className = 'answer_container'>
                            {classification_answer.map((answer) => (
                              <div className = 'answer_block'>
                                  <div className = 'checkbox' onClick = {() => {setClassification(answer);}}>
                                      <div className = {(classification === answer ? 'checked': '')} />
                                  </div>
                                  <div className = 'name'>
                                  {answer}
                                  </div>
                              </div>
                            ))}
                        </div>
                    </div>
                    <div className = 'question'>
                        <div className = 'title_container'>
                            <div className = 'number'>
                            2.
                            </div>
                            <div className = 'title'>
                            Q&A 게시판 질문 공개 여부를 선택해주세요.
                            </div>
                        </div>
                        <div className = 'answer_container'>
                            {open_answer.map((answer) => (
                              <div className = 'answer_block'>
                                  <div className = 'checkbox' onClick = {() => {setOpen(answer);}}>
                                      <div className = {(open === answer ? 'checked': '')} />
                                  </div>
                                  <div className = 'name'>
                                  {answer}
                                  </div>
                              </div>
                            ))}
                            {open === '비공개' ? <input type='text' autoComplete='password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder = '10자 이하의 비밀번호를 설정해주세요.'/> : <input type='text' autoComplete='password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder = '10자 이하의 비밀번호를 설정해주세요.' disabled/>}
                        </div>
                    </div>
                    <div className = 'question'>
                        <div className = 'title_container'>
                            <div className = 'number'>
                            3.
                            </div>
                            <div className = 'title'>
                            SMS로 메일 답변 여부를 받으시겠어요?
                            </div>
                        </div>
                        <div className = 'answer_container'>
                            {sns_notice_answer.map((answer) => (
                              <div className = 'answer_block'>
                                  <div className = 'checkbox' onClick = {() => {setSns_notice(answer);}}>
                                      <div className = {(sns_notice === answer ? 'checked': '')} />
                                  </div>
                                  <div className = 'name'>
                                  {answer}
                                  </div>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className = 'write_container'>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>제목</div>
                        <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>내용</div>
                        <textarea placeholder = ' 메멘토 사용자님의 소중한 질문과 의견이 모여 더욱 따스한 메멘토를 만듭니다.' value={detail} onChange={(e) => {setDetail(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
                        <div className = 'bottom_text'>
                        내용은 최대 3,000자 까지 입력 가능합니다.
                        </div>
                        <div className = 'characternumbers'>
                        {characternumbers + ' / 3000 자'}
                        </div>
                    </div>
                    {false && <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>첨부파일</div>
                        <input className = 'white short' disabled/>
                        <div className = 'button'>
                            <div className = 'button_text'>파일 선택</div>
                        </div>
                        <div className = 'bottom_text'>
                            <div>첨부파일은 파일당 최대 5MB까지 첨부 가능합니다.</div>
                            <div>* 첨부파일 추가는 선택사항입니다.</div>
                        </div>
                    </div>}
                    <div className = 'write_box margin_150px'>
                        <div className = 'dot' />
                        <div className = 'title'>유의사항</div>
                        <div className = 'text'>
                            <div>{`작성하신 고객 의견 및 답변은 고객 지원 > Q&A 메뉴에서 확인하실 수 있습니다.`} </div>
                            <div>홍보 및 광고성 내용은 관리자에 의해 삭제될 수 있습니다.</div>
                            <div>
                                <span>파트너쉽 등의 세부 문의는 메멘토 대표이메일(</span>
                                <span className = 'small'> memento.welldying@gmail.com </span>
                                <span>)로 연락주시면 보다 상세한 답변드리겠습니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = 'submit_container'>
                    <div className = 'submit cancel' onClick={async (e) => {setEditDone(true);}}>
                        <div> 취소하기 </div>
                    </div>
                    <div className = 'submit' onClick={async (e) => {
                        e.preventDefault();
                        setDate(new Date().getTime());
                        if (!title || !detail) setError('모든 항목을 채워주세요.');
                        else if (await writeQna(id, writer, title, detail, date, answerdate, open, '답변중', password, classification, sns_notice, answer, false)) setEditDone(true);
                        else setError('어딘가 문제가 생겼습니다.');
                    }}>
                        <div> 질문 제출 </div>
                    </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default WriteQnA;
