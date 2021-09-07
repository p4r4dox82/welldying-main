import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getContent, writeContent } from '../etc/api/content';
import { getSections } from '../etc/api/section';
import { getQuestions } from '../etc/api/question';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function AdminWriteContent({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [contentLoading, content] = usePromise(() => getContent(id));
    let [allSectionsLoading, allSections] = usePromise(() => getSections());
    let [QuestionsLoading, Questions] = usePromise(getQuestions);
    let [error, setError] = React.useState<string>();

    let [title, setTitle] = React.useState<string>('');
    let [type, setType] = React.useState<string>('');
    let [category, setCategory] = React.useState<number>(1);
    let [question, setQuestion] = React.useState<number>(1);
    let [source, setSource] = React.useState<string>('');
    let [summary, setSummary] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');
    let [thumbnailUri, setThumbnailUri] = React.useState<string>('');
    let [update, setUpdate] = React.useState<number>(1);

    let [editDone, setEditDone] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!content) return;
        setTitle(content.title);
        setType(content.type);
        setCategory(content.category);
        setTag(content.tag);
        setSource(content.source);
        setSummary(content.detail.summary);
        setQuestion(content.question);
        setThumbnailUri(content.thumbnailUrl);
    }, [content]);

    let categoryForm = React.useMemo(() => {
        if (!allSections) return <></>;
        else return (
          <div>
              <select style={{width: '888px'}} value={category} onChange={(e) => {
                  let newId = Number.parseInt(e.target.value);
                  let newCategory = category;
                  newCategory = newId;
                  setCategory(newCategory);
                  let content_section = allSections?.find((section) => section.id === newCategory);
                  setTag(content_section ? content_section?.tag : 'nosection');
                  setUpdate(update+1);
              }}>
                  <option value={-1}> 카테고리를 골라주세요. </option>
                  { allSections.map((section) => <option value={section.id}> {section.title} </option>)}
              </select>
          </div>
        );
    }, [update, allSectionsLoading, contentLoading]);

    let questionForm = React.useMemo(() => {
        if (!Questions) return <></>;
        else return (
          <div>
              <select style={{width: '888px'}} value={question} onChange={(e) => {
                  let newId = Number.parseInt(e.target.value);
                  let newQuestion = question;
                  newQuestion = newId;
                  setQuestion(newQuestion);
                  setUpdate(update+1);
              }}>
                  <option value={-1}> 질문을 골라주세요. </option>
                  { Questions.map((question) => <option value={question.id}> {question.title} </option>)}
              </select>
          </div>
        );
    }, [update, allSectionsLoading, contentLoading]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <form className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>

                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !content ? '새 컨텐츠 추가하기' : '컨텐츠 내용 수정하기' }
                </h1>
                <div className='row'>
                    <div className='label'> ID </div>
                    <input value={id} readOnly />
                </div>
                <div className='row'>
                    <div className='label'> 제목 </div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 타입 </div>
                    <input value={type} onChange={(e) => setType(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 카테고리 목록 </div>
                    { categoryForm }
                </div>
                <div className='row'>
                    <div className='label'> 태그 </div>
                    <input value={tag} disabled/>
                </div>
                <div className='row'>
                    <div className='source'> 출처 </div>
                    <input value={source} onChange={(e) => setSource(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='summary'> 요약 </div>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 질문 목록 </div>
                    { questionForm }
                </div>
                <div className='row'>
                    <div className='source'> 썸네일 </div>
                    <input value={thumbnailUri} onChange={(e) => setThumbnailUri(e.target.value)}/>
                </div>
                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!title || !category || !type || !source || !summary || !question || !thumbnailUri ) setError('모든 항목을 채워주세요.');
                    else if (await writeContent(id, title, type, category, { likes: [], bookmark: [], read: [], }, tag, 0, source, { summary: summary, }, [], question, thumbnailUri)) {setEditDone(true); console.log(tag);}
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    { !content ? '추가하기' : '수정하기' }
                </button>
                { error }
            </form>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default AdminWriteContent;
