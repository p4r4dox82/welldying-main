import React from 'react';
import { useSelector } from 'react-redux';
import { match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import { getContent } from '../etc/api/content';
import { getSections } from '../etc/api/section';
import { writeNews } from '../etc/api/news';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function WriteNews({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [error, setError] = React.useState<string>();

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [search_word, setSearch_word] = React.useState<string>('');

    let [company, setCompany] = React.useState<string>('');
    let [title, setTitle] = React.useState<string>('');
    let [detail, setDetail] = React.useState<string>('');
    let [date, setDate] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');


    if (!user.loggedIn) return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/newslist/1'/>;
    else return (
        <>
            <Header additionalClass = 'fullborder' />
            <div className = 'writenews_page'>
                <div className = 'submenu_container'>
                    <SubmenuContainer additionalClass = 'news'/>
                    {false && <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} />
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
                    </div>}
                </div>
                <div className = 'main_title'>
                보도자료
                </div>
                <div className = 'write_container'>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>신문사</div>
                        <input value={company} onChange={(e) => setCompany(e.target.value)}/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>제목</div>
                        <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>내용</div>
                        <textarea value={detail} onChange={(e) => setDetail(e.target.value)}/>
                        <div className = 'bottom_text'>
                        내용은 최대 3,000자 까지 입력 가능합니다.
                        </div>
                        <div className = 'characternumbers'>
                        {0 + ' / 3000 자'}
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
                        <div className = 'title'>날짜</div>
                        <input value={date} onChange={(e) => setDate(e.target.value)}/>
                    </div>
                    <div className = 'write_box'>
                        <div className = 'dot' />
                        <div className = 'title'>태그</div>
                        <input value={tag} onChange={(e) => setTag(e.target.value)}/>
                    </div>
                </div>
                <div className = 'submit' onClick={async (e) => {
                    e.preventDefault();
                    if (!title || !detail) setError('모든 항목을 채워주세요.');
                    else if (await writeNews(id, '', company, title, detail, date, tag)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    <div> 뉴스 제출 </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default WriteNews;
