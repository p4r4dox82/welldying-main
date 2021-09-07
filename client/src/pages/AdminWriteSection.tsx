import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getQuestions } from '../etc/api/question';
import { getSection, writeSection } from '../etc/api/section';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function AdminWriteSection({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [sectionLoading, section] = usePromise(() => getSection(id));
    let [allQuestionsLoading, allQuestions] = usePromise(() => getQuestions());
    let [error, setError] = React.useState<string>();

    let [title, setTitle] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');
    let [detail, setDetail] = React.useState<string>('');
    let [imageurl, setImageurl] = React.useState<string>('');
    let [questions, setQuestions] = React.useState<number[]>([]);
    let [update, setUpdate] = React.useState<number>(1);

    let [editDone, setEditDone] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!section) return;
        setTitle(section.title);
        setQuestions(section.questions);
        setTag(section.tag);
        setDetail(section.detail);
        setImageurl(section.imageurl);
    }, [section]);

    let questionForm = React.useMemo(() => {
        if (!allQuestions) return <></>;
        else return questions.map((questionId, k) => {
            return (
                <div>
                    { k+1 }
                    <select style={{width: '888px'}} value={questionId} onChange={(e) => {
                        let newId = Number.parseInt(e.target.value);
                        let newQuestions = questions;
                        newQuestions[k] = newId;
                        setQuestions(newQuestions);
                        setUpdate(update+1);
                    }}>
                        <option value={-1}> 질문을 골라주세요. </option>
                        { allQuestions.map((question) => <option value={question.id}> {question.title} </option>)}
                    </select>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setQuestions(questions.filter((id, i) => i !== k));
                        setUpdate(update+1);
                    }}> 제외하기 </button>
                </div>
            );
        })
    }, [update, allQuestionsLoading, sectionLoading]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <form className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>

                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !section ? '새 질문지 추가하기' : '질문지 내용 수정하기' }
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
                    <div className='label'> 태그 </div>
                    <input value={tag} onChange={(e) => setTag(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> detail </div>
                    <input value={detail} onChange={(e) => setDetail(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> imageurl </div>
                    <input value={imageurl} onChange={(e) => setImageurl(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 질문 목록 </div>
                    { questionForm }
                    <button onClick={(e) => {
                        e.preventDefault();
                        setQuestions(questions.concat(-1));
                        setUpdate(update+1);
                    }}> 질문 추가하기 </button>
                </div>

                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!title || !questions || questions.find((x) => x === -1) !== undefined) setError('모든 항목을 채워주세요.');
                    else if (await writeSection(id, title, tag, detail, imageurl, questions)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    { !section ? '추가하기' : '수정하기' }
                </button>
                { error }
            </form>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default AdminWriteSection;
