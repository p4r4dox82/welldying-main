import React from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import QuillToolbar from '../components/QuillToolbar';
import { getContent, writeContent } from '../etc/api/content';
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
    let [error, setError] = React.useState<string>();

    let [title, setTitle] = React.useState<string>('');
    let [type, setType] = React.useState<'question' | 'post'>('question');
    let [message, setMessage] = React.useState<string>('');
    let [placeholder, setPlaceholder] = React.useState<string>('');

    let [editDone, setEditDone] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!content) return;
        setTitle(content.title);
        setType(content.type);
        setMessage(content.message);
        setPlaceholder(content.placeholder);
    }, [content]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else if (contentLoading) return <></>;
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <form className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>
                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !content ? '새 질문 추가하기' : '질문 내용 수정하기' } 
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
                    <button className={'selectButton ' + (type === 'question' ? 'active' : 'inactive')} onClick={(e) => {e.preventDefault(); setType('question') }}> 질문 </button>
                    <span> / </span>
                    <button className={'selectButton ' + (type === 'post' ? 'active' : 'inactive')} onClick={(e) => {e.preventDefault(); setType('post') }}> 읽기 자료 </button>
                    <div className='label'> 내용 </div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                
                { type === 'question' && <div className='row'>
                    <div className='label' style={{marginBottom: '50px'}}> 답안 기본값 (템플릿) </div>
                    <QuillToolbar id={1} image={false}/>
                    <ReactQuill 
                        theme="snow" 
                        modules={{
                            toolbar: `.quill-toolbar1`,
                            clipboard: {
                                matchVisual: false,
                            }
                        }}
                        onChange={async (content, delta, source, editor) => {
                            let newLength = editor.getLength() - 1;
                            let newPlaceholder = newLength > 0 ? editor.getHTML() : '';

                            if (newLength <= 1000) {
                                setPlaceholder(newPlaceholder);
                            } else {
                                setPlaceholder(placeholder + ' ');
                            }
                        }}
                        value={placeholder}
                    />
                </div> }

                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!type || !title || !message) setError('모든 항목을 채워주세요.');
                    else if (await writeContent(id, type, title, message, placeholder)) setEditDone(true);
                    else setError('어딘가 문제가 생겼습니다.');
                }}>
                    { !content ? '추가하기' : '수정하기' } 
                </button>
                { error }
            </form>
            <Footer/>
        </>
    )
}

export default AdminWriteContent;