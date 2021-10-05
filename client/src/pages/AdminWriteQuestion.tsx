import React from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import QuillToolbar from '../components/QuillToolbar';
import { getQuestion, writeQuestion } from '../etc/api/question';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { getSections } from '../etc/api/section';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function AdminWriteQuestion({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [questionLoading, question] = usePromise(() => getQuestion(id));
    let [, AllContents] = usePromise(getContents);
    let [error, setError] = React.useState<string>();

    let [title, setTitle] = React.useState<string>('');
    let [type, setType] = React.useState<'question' | 'post'>('question');
    let [message, setMessage] = React.useState<string>('');
    let [placeholder, setPlaceholder] = React.useState<string>('');
    let [contents, setContents] = React.useState<number[]>([]);
    let [update, setUpdate] = React.useState<number>(0);

    let [editDone, setEditDone] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!question) return;
        setTitle(question.title);
        setMessage(question.message);
        setPlaceholder(question.placeholder);
        setContents(question.contents);
    }, [question]);

    let contentForm = React.useMemo(() => {
        if (!AllContents) return <></>;
        else return contents.map((contentId, k) => {
            return (
                <div>
                    { k+1 }
                    <select style={{width: '888px'}} value={contentId} onChange={(e) => {
                        let newId = Number.parseInt(e.target.value);
                        let newContents = contents;
                        newContents[k] = newId;
                        setContents(newContents);
                        setUpdate(update+1);
                    }}>
                        <option value={-1}> 컨텐츠를 골라주세요. </option>
                        { AllContents.map((content) => <option value={content.id}> {content.title} </option>)}
                    </select>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setContents(contents.filter((id, i) => i !== k));
                        setUpdate(update+1);
                    }}> 제외하기 </button>
                </div>
            );
        })
    }, [update, AllContents, questionLoading]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <form className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>
                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !question ? '새 질문 추가하기' : '질문 내용 수정하기' }
                </h1>
                <div className='row'>
                    <div className='label'> ID </div>
                    <input value={id} readOnly />
                </div>
                <div className='row'>
                    <div className='label'> 제목 </div>
                    <textarea value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 세부 질문 </div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 컨텐츠 목록 </div>
                    { contentForm }
                    <button onClick={(e) => {
                        e.preventDefault();
                        setContents(contents.concat(-1));
                        setUpdate(update+1);
                    }}> 컨텐츠 추가하기 </button>
                </div>

                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!type || !title || !message || !contents) setError('모든 항목을 채워주세요.');
                    else if (await writeQuestion(id, title, message, placeholder, contents)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    { !question ? '추가하기' : '수정하기' }
                </button>
                { error }
            </form>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default AdminWriteQuestion;
