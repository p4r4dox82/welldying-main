import React from 'react';
import { useSelector } from 'react-redux';
import { match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import { getContent } from '../etc/api/content';
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
    let [, qna] = usePromise(() => getQna(id));
    let user = useSelector((state: RootReducer) => state.user);
    let [contentLoading, ] = usePromise(() => getContent(id));
    let [, setError] = React.useState<string>();

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [search_word, setSearch_word] = React.useState<string>('');
    let [answerdate, setAnswerdate] = React.useState<number>(0);
    let [, setState] = React.useState<string>('');
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
                    {false && <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} alt = ""/>
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '???)????????? ?????????'/>
                    </div>}
                </div>
                <div className = 'main_title'>
                Q & A
                  <div className = 'sub_title'>
                  ?????? ????????????
                  </div>
                </div>
                <div className = 'write_container'>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>??????</div>
                        <input value={qna?.title} disabled/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>??????</div>
                        <textarea placeholder = ' ????????? ??????????????? ????????? ????????? ????????? ?????? ?????? ????????? ???????????? ????????????.' value={qna?.detail} disabled/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>??????</div>
                        <textarea placeholder = '????????? ?????? ????????? ????????????.' value={answer} onChange={(e) => {setAnswer(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}}/>
                        <div className = 'bottom_text'>
                        ????????? ?????? 3,000??? ?????? ?????? ???????????????.
                        </div>
                        <div className = 'characternumbers'>
                        {characternumbers + ' / 3000 ???'}
                        </div>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>????????????</div>
                        <input className = 'white short' disabled/>
                        <div className = 'button'>
                            <div className = 'button_text'>?????? ??????</div>
                        </div>
                        <div className = 'bottom_text'>
                            <div>??????????????? ????????? ?????? 5MB?????? ?????? ???????????????.</div>
                            <div>* ???????????? ????????? ?????????????????????.</div>
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
                    setState('??????');
                    let date : number  = qna?.date as number;
                    if (!answer) setError('?????? ????????? ???????????????.');
                    else if (await writeQna(id, qna?.writer as string, qna?.title as string, qna?.detail as string, date, answerdate, qna?.open as string, '??????', qna?.password as string, qna?.classification as string, qna?.sns_notice as string, answer, faq)) setEditDone(true);
                    else setError('????????? ????????? ???????????????.');
                }}>
                    <div> ?????? ?????? </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default WriteQnAanswer;
