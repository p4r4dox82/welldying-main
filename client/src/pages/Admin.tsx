import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getSections } from '../etc/api/section';
import { getContents } from '../etc/api/content';
import { downloadSubscribers } from '../etc/api/subscriber';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';

function Admin() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, sections] = usePromise(getSections);
    let [, contents] = usePromise(getContents);

    let maxSectionId = React.useMemo(() => sections ? Math.max(...sections.map(section => section.id)) : 0, [sections]);
    let maxContentId = React.useMemo(() => contents ? Math.max(...contents.map(content => content.id)) : 0, [contents]);
    console.log(maxSectionId);

    let [id, setId] = React.useState<number>(1);

    let content = React.useMemo(() => {
        let section = sections?.find((section) => section.id === id);
        if (!section) return <></>;
        return (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { `[질문지 ID: ${section.id}] ` }
                        { section.title }
                    </h1>
                </div>
                <Link to={`/admin/section/${id}`}><button> 질문지 수정하기 </button></Link>
                { section.contents.map((contentId) => {
                    let content = contents?.find((content) => content.id === contentId);
                    if (!content) return;

                    if (content.type === 'question') return (
                        <div className='row'>
                            <h2> { `[질문 ID: ${content.id}] ` } { content.title } </h2>
                            <ul> { content.message.split('\n').map((str) => <li> {str} </li>) } </ul>
                            <div style={{marginBottom: '50px'}}/>
                            <Link to={`/admin/content/${contentId}`}><button> 질문 내용 수정하기 </button></Link>
                        </div>
                    );
                    else return (
                        <div className='row'>

                            <h2> { `[질문 ID: ${content.id}] ` } { `[읽기자료] ${content.title}` } </h2>
                            <div className='row'>
                            <h2> { `[읽기 자료] ${content.title}` } </h2>
                                <ul> { content.message.split('\n').map((content) => <p> { content } </p>) } </ul>
                            </div>
                            <div style={{marginBottom: '50px'}}/>
                            <Link to={`/admin/content/${contentId}`}><button> 질문 내용 수정하기 </button></Link>
                        </div>
                    );
                })}
            </>
        );
    }, [id, sections, contents]);


    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    return (
        <>
            <Header additionalClass='grey borderBottom' />
            <div className='content'>
                <div className='row' style={{margin: 0}}>
                    <div className='leftArea'>
                        <h1>
                            체크리스트 관리
                        </h1>
                        <button onClick={() => downloadSubscribers() }> 이메일 리스트 받기 </button>
                        <Link to={`/admin/section/${maxSectionId+1}`}><button> 새 질문지 추가하기 </button></Link>
                        <Link to={`/admin/content/${maxContentId+1}`}><button> 새 질문 추가하기 </button></Link>


                        <div className='navigationMenu'>
                            { sections?.map((section) => (
                                    <div className={ id ? (section.id === id ? 'link active' : 'link inactive') : 'link' } onClick={(e) => { e.preventDefault(); setId(section.id); }}>
                                        { section.title }
                                    </div>
                            ))}
                        </div>
                    </div>
                </div>
                { content }
            </div>
            <Footer />
        </>
    )
}

export default Admin;
