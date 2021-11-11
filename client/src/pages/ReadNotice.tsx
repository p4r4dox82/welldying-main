import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubmenuContainer from '../components/SubmenuContainer';
import { getrevNotices, getNotice } from '../etc/api/notice';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { parseDate } from '../etc';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ReadNotice({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [noticeLoading, notice] = usePromise(() => getNotice(id));
    let [, revnotices] = usePromise(getrevNotices);
    let [search_word, setSearch_word] = React.useState<string>('');

    if (noticeLoading) return <></>;
    else return (
        <>
            <Header additionalClass = 'fullborder' />
            <div className = 'readnotice_page'>
                <div className = 'submenu_container'>
                    <SubmenuContainer additionalClass = 'notice'/>
                    {false && <div className = 'searchContainer'>
                        <img src = {imageUrl('search_image.png')} alt = "profile"/>
                        <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
                    </div>}
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
                    <div className = 'list_content'>
                        <div className = 'id'>{notice?.id}</div>
                        <div className = 'classification'>
                        {notice?.classification}
                        </div>
                        <Link to = {`/notice/${notice?.id}`} ><div className = 'title'>{notice?.title}</div></Link>
                        <div className = 'date'>{parseDate(new Date(notice?.date as number))}</div>
                        <div className = 'views'>{notice?.views}</div>
                    </div>
                    <div className = 'list_content answer'>
                        <div className = 'block' style = {{display: 'block', margin: '101px 0px 99px 31px', padding: '0px 15px', width: '945px', boxSizing: 'content-box'}}>
                            {notice?.detail.split('\n').map((row) => {
                                let uri = '';
                                let rowhtml = <div className = "NS px13 line40" style = {{minHeight: '40px'}}>{row}</div>;
                                if(row === '')
                                    row = ' ';
                                if(row.includes('http')) {
                                    let startindex = row.indexOf('http');
                                    let endindex = row.indexOf(' ', startindex);
                                    if(endindex === -1) 
                                        endindex = row.length;
                                    uri = row.slice(startindex, endindex); 
                                    rowhtml = <div className = "NS px13 line40" style = {{minHeight: '40px'}}>
                                        <span>{row.slice(0, startindex)}</span>
                                        <span onClick = {() => window.open(uri, '_blank')} className = 'uri'>{uri}</span>
                                        <span>{row.slice(endindex, row.length)}</span>
                                    </div>;
                                }
                                return (
                                   rowhtml
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className = 'bottommenu_container'>
                    <div className = 'write_button_margin'>
                        <Link to = {`/noticelist/1`}>
                            <div className = 'button'>
                                <div>목록으로</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer additionalClass = '' />
        </>
    )
}

export default ReadNotice;
