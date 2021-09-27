import React from 'react';
import { useSelector } from 'react-redux';
import { match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import { getContent } from '../etc/api/content';
import { getSections } from '../etc/api/section';
import { writeNotice } from '../etc/api/notice';
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

function WriteNotice({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [error, setError] = React.useState<string>();

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [search_word, setSearch_word] = React.useState<string>('');

    let classification_answer = ['메멘토 이벤트', '메멘토 서비스', '기타'];
    let [title, setTitle] = React.useState<string>('');
    let [detail, setDetail] = React.useState<string>('');
    let [date, setDate] = React.useState<number>(0);
    let [classification, setClassification] = React.useState<string>('메멘토 이벤트');
    let [characternumbers, setCharacternumbers] = React.useState<number>(0);


    if (!user.loggedIn) return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/noticelist/1'/>;
    else return (
        <>
            <Header additionalClass = 'fullborder' />
            <div className = 'writenotice_page'>
                <div className = 'submenu_container'>
                    <SubmenuContainer additionalClass = 'notice'/>
                    {false && <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} />
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
                    </div>}
                </div>
                <div className = 'main_title'>
                공지사항
                </div>
                <div className = 'type_container'>
                    <div className = 'question'>
                        <div className = 'title_container'>
                            <div className = 'number'>
                            1.
                            </div>
                            <div className = 'title'>
                            어떤 유형의 공지사항인가요?
                            </div>
                            <div className = 'subtitle'>
                            제안과 의견은 Q&A 게시판에 게시되지 않는 점 유의바랍니다.
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
                        <textarea value={detail} onChange={(e) => {setDetail(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
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
                </div>
                <div className = 'submit' onClick={async (e) => {
                    e.preventDefault();
                    setDate(new Date().getTime());
                    if (!title || !detail) setError('모든 항목을 채워주세요.');
                    else if (await writeNotice(id, classification, title, detail, date, 0)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    <div> 공지 제출 </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default WriteNotice;
