import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import QuillToolbar from '../components/QuillToolbar';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { parseDate } from '../etc';
import { getrevQnas, getQna } from '../etc/api/qna';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ReadQnA({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [qnaLoading, qna] = usePromise(() => getQna(id));
    let [, revqnas] = usePromise(getrevQnas);
    let [search_word, setSearch_word] = React.useState<string>('');

    let answerdate_form : number  = qna?.answerdate as number;

    if (qnaLoading) return <></>;
    else return (
        <>
            <Header additionalClass = 'fullborder' />
            <div className = 'readqna_page'>
                <div className = 'submenu_container'>
                    <SubmenuContainer additionalClass = 'qna'/>
                    {false && <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} />
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
                    </div>}
                </div>
                <div className = 'main_title'>
                Q & A
                  <div className = 'sub_title'>
                  자주하는 질문
                  </div>
                </div>
                <div className = 'list'>
                    <div className = 'list_content name'>
                        <div className = 'id'>번호</div>
                        <div className = 'writer'>작성자</div>
                        <div className = 'title'>[분류] 제목</div>
                        <div className = 'answerdate'>답변 날짜</div>
                        <div className = 'open'>공개여부</div>
                    </div>
                        <div className = 'list_content'>
                        <div className = 'id'>{qna?.id}</div>
                        <div className = 'writer'>{qna?.writer}</div>
                        <div className = 'title'>
                        {'['}
                        {qna?.classification === '메멘토에 제안' && '제안'}
                        {qna?.classification === '기타 의견' && '기타'}
                        {(qna?.classification === '메멘토 서비스 질문' || qna?.classification === '유언전달에 관한 질문' || qna?.classification === '기타 질문') && '질문'}
                        {'] '}
                        {qna?.title}
                        </div>
                        <div className = 'answerdate'>{qna?.state === '완료' ? parseDate(new Date(qna?.answerdate)) : '답변중'}</div>
                        <div className = 'open'>{qna?.open}</div>
                    </div>
                    <div className = 'list_content answer'>
                        <div className = 'block'>
                            <div className = 'A margin_14px'>Q.</div>
                            <textarea className = 'detail' value = {qna?.detail} disabled />
                        </div>
                        <div className = 'block start_end'>
                            <div className = 'A margin_14px'>A.</div>
                            <textarea className = 'detail answer' value = {qna?.answer} disabled/>
                        </div>
                    </div>
                </div>
                <div className = 'bottommenu_container'>
                    <div className = 'write_button_margin'>
                        <Link to = {`/qnalist/1`}>
                            <div className = 'button'>
                                <div>목록으로</div>
                            </div>
                        </Link>
                        {(user.loggedIn && user.user!.username === "admin") && <Link to = {`/writeqna/answer/${id}`}>
                            <div className = 'button margin_20px'>
                                <div>답변하기</div>
                            </div>
                        </Link>}
                    </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default ReadQnA;
