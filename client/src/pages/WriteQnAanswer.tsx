import React from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import QuillToolbar from '../components/QuillToolbar';
import { getContent, writeContent } from '../etc/api/content';
import { getSections } from '../etc/api/section';
import { writeQna, getQna } from '../etc/api/qna';
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
  let real_row;
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

function WriteQnAanswer({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let [qnaLoading, qna] = usePromise(() => getQna(id));
    let user = useSelector((state: RootReducer) => state.user);
    let [contentLoading, content] = usePromise(() => getContent(id));
    let [allSectionsLoading, allSections] = usePromise(() => getSections());
    let [error, setError] = React.useState<string>();

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [search_word, setSearch_word] = React.useState<string>('');

    let classification_answer = ['메멘토 서비스 질문', '유언전달에 관한 질문', '기타 질문', '메멘토에 제안', '기타 의견'];
    let open_answer = ['공개', '비공개'];
    let sns_notice_answer = ['수신 원함', '수신 원치 않음'];
    let writer = user.user!.name;
    let [title, setTitle] = React.useState<string>('');
    let [detail, setDetail] = React.useState<string>('');
    let [answerdate, setAnswerdate] = React.useState<number>(0);
    let [open, setOpen] = React.useState<string>('공개');
    let [state, setState] = React.useState<string>('');
    let [password, setPassword] = React.useState<string>('');
    let [classification, setClassification] = React.useState<string>('메멘토 서비스 질문');
    let [sns_notice, setSns_notice] = React.useState<string>('수신 원함');
    let [answer, setAnswer] = React.useState<string>('');
    let [faq, setFaq] = React.useState<boolean>(qna?.faq as boolean);
    let [characternumbers, setCharacternumbers] = React.useState<number>(0);


    if (!user.loggedIn) return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/qnalist/1'/>;
    else if (contentLoading) return <></>;
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
                  질문 답변하기
                  </div>
                </div>
                <div className = 'write_container'>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>제목</div>
                        <input value={qna?.title} disabled/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>내용</div>
                        <textarea placeholder = ' 메멘토 사용자님의 소중한 질문과 의견이 모여 더욱 따스한 메멘토를 만듭니다.' value={qna?.detail} disabled/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>답변</div>
                        <textarea placeholder = '질문에 대한 답변을 해주세요.' value={answer} onChange={(e) => {setAnswer(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
                        <div className = 'bottom_text'>
                        내용은 최대 3,000자 까지 입력 가능합니다.
                        </div>
                        <div className = 'characternumbers'>
                        {characternumbers + ' / 3000 자'}
                        </div>
                    </div>
                    <div className = 'write_box'>
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
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>FAQ</div>
                        <div className = 'answer_block alone'>
                            <div className = 'checkbox' onClick = {() => {setFaq(!faq);}}>
                                <div className = {(faq === true ? 'checked': '')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className = 'submit' onClick={async (e) => {
                    e.preventDefault();
                    setAnswerdate(new Date().getTime());
                    setState('완료');
                    let date : number  = qna?.date as number;
                    if (!answer) setError('모든 항목을 채워주세요.');
                    else if (await writeQna(id, qna?.writer as string, qna?.title as string, qna?.detail as string, date, answerdate, qna?.open as string, '완료', qna?.password as string, qna?.classification as string, qna?.sns_notice as string, answer, faq)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    <div> 답변 제출 </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default WriteQnAanswer;
