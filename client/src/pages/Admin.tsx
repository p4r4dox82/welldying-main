import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getSections } from '../etc/api/section';
import { getQuestions } from '../etc/api/question';
import { getContents } from '../etc/api/content';
import { downloadSubscribers } from '../etc/api/subscriber';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { getCategorys } from '../etc/api/category';

function Admin() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, sections] = usePromise(getSections);
    let [, questions] = usePromise(getQuestions);
    let [, contents] = usePromise(getContents);
    let [, categorys] = usePromise(getCategorys);

    let maxSectionId = React.useMemo(() => sections ? Math.max(...sections.map(section => section.id)) : 0, [sections]);
    let maxQuestionId = React.useMemo(() => questions ? Math.max(...questions.map(question => question.id)) : 0, [questions]);
    let maxContentId = React.useMemo(() => contents ? Math.max(...contents.map(content => content.id)) : 0, [contents]);
    let maxCategoryId = React.useMemo(() => categorys ? Math.max(...categorys.map(category => category.id)) : 0, [categorys]);

    let [id, setId] = React.useState<number>(1);

    let question = React.useMemo(() => {
        let section = sections?.find((section) => section.id === id);
        let category = categorys?.find((category) => category.id === (id - 7));
        if(!section && !category) return <> </>;
        else if(section) return (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { `[질문지 ID: ${section.id}] ` }
                        { section.title }
                    </h1>
                </div>
                <Link to={`/admin/section/${id}`}><button> 질문지 수정하기 </button></Link>
                { section.questions.map((questionId) => {
                    let question = questions?.find((question) => question.id === questionId);
                    if (!question) return;
                    return (
                        <div className='row'>
                            <h2> { `[질문 ID: ${question.id}] ` } { question.title } </h2>
                            <ul> { question.message.split('\n').map((str) => <li> {str} </li>) } </ul>
                            <div style={{marginBottom: '50px'}}/>
                            <Link to={`/admin/question/${questionId}`}><button> 질문 내용 수정하기 </button></Link>
                        </div>
                    );
                })}
            </>
        );
        else if(category) return (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { `[질문지 ID: ${category.id}] ` }
                        { category.title }
                    </h1>
                </div>
                <Link to={`/admin/category/${id}`}><button> 질문지 수정하기 </button></Link>
                { category.contents.map((contentId) => {
                    let content = contents?.find((content) => content.id === contentId);
                    if (!content) return;
                    return (
                        <div className='row'>
                            <h2> { `[질문 ID: ${content.id}] ` } { content.title } </h2>
                            <div style={{marginBottom: '50px'}}/>
                            <Link to={`/admin/content/${contentId}`}><button> 질문 내용 수정하기 </button></Link>
                        </div>
                    );
                })}
            </>
        );
    }, [id, sections, questions]);


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
                        <Link to={`/admin/question/${maxQuestionId+1}`}><button> 새 질문 추가하기 </button></Link>
                        <Link to={`/admin/content/${maxContentId+1}`}><button> 새 컨텐츠 추가하기 </button></Link>
                        <Link to={`/admin/category/${maxCategoryId+1}`}><button> 새 카테고리 추가하기 </button></Link>


                        <div className='navigationMenu'>
                            { sections?.map((section) => (
                                <div className={ id ? (section.id === id ? 'link active' : 'link inactive') : 'link' } onClick={(e) => { e.preventDefault(); setId(section.id);}}>
                                    { section.title }
                                </div>
                            ))}

                            { categorys?.map((category) => (
                                <div className={ id ? (category.id === id ? 'link active' : 'link inactive') : 'link' } onClick={(e) => { e.preventDefault(); setId(category.id + 7);}}>
                                    { category.title }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='row' style={{margin: 0}}>
                    <div className='rightArea'>
                        <div className='navigationMenu'>
                            { contents?.map((content) => (
                              <div className={ id ? (content.id === id ? 'link active' : 'link inactive') : 'link' }>
                                  <Link to = {`/admin/content/${content.id}`}>
                                      { content.id + '. ' + content.title}
                                  </Link>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
                { question }
            </div>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default Admin;
