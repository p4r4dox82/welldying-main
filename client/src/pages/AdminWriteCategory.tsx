import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getQuestions } from '../etc/api/question';
import { getContents } from '../etc/api/content';
import { getSection, writeSection } from '../etc/api/section';
import { getCategory, writeCategory } from '../etc/api/category';
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
    let [categoryLoading, category] = usePromise(() => getCategory(id));
    let [allContentsLoading, allContents] = usePromise(() => getContents());
    let [error, setError] = React.useState<string>();

    let [title, setTitle] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');
    let [contents, setContents] = React.useState<number[]>([]);
    let [update, setUpdate] = React.useState<number>(1);

    let [editDone, setEditDone] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!category) return;
        setTitle(category.title);
        setContents(category.contents);
        setTag(category.tag);
    }, [category]);

    let contentForm = React.useMemo(() => {
        if (!allContents) return <></>;
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
                        <option value={-1}> 질문을 골라주세요. </option>
                        { allContents.map((content) => <option value={content.id}> {content.title} </option>)}
                    </select>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setContents(contents.filter((id, i) => i !== k));
                        setUpdate(update+1);
                    }}> 제외하기 </button>
                </div>
            );
        })
    }, [update, allContentsLoading, categoryLoading]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <form className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>

                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !category ? '새 카테고리 추가하기' : '카테고리 내용 수정하기' }
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
                    <div className='label'> 컨텐츠 목록 </div>
                    { contentForm }
                    <button onClick={(e) => {
                        e.preventDefault();
                        setContents(contents.concat(-1));
                        setUpdate(update+1);
                    }}> 질문 추가하기 </button>
                </div>

                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!title || !contents || contents.find((x) => x === -1) !== undefined) setError('모든 항목을 채워주세요.');
                    else if (await writeCategory(id, title, tag, contents)) {
                        setEditDone(true);
                        console.log('asd');
                    }
                    else console.log('123');
                }}>
                    { !category ? '추가하기' : '수정하기' }
                </button>
                { error }
            </form>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default AdminWriteSection;
