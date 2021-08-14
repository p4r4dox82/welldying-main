import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { getAnswers } from '../etc/api/answer';
import { getQuestions } from '../etc/api/question';
import { getSections } from '../etc/api/section';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import 'react-quill/dist/quill.snow.css';
import QuillToolbar from '../components/QuillToolbar';
import { parseDate } from '../etc';
import WriteItem from '../components/WriteItem';
import useScroll from '../etc/useScroll';

interface NumberMap {
    [key: string]: number;
}
interface MatchParams {
    sectionId?: string;
    questionId?: string;
};

interface Props {
    match: match<MatchParams>;
};


function Write({ match } : Props) {
    const sectionId = match.params.sectionId ? Number.parseInt(match.params.sectionId) : undefined;
    const questionId = match.params.questionId ? Number.parseInt(match.params.questionId) : 0;

    let scroll = useScroll();

    let user = useSelector((state: RootReducer) => state.user);
    let [sectionsLoading, sections] = usePromise(getSections);
    let [questionsLoading, questions] = usePromise(getQuestions);
    let [answersLoading, answers] = usePromise(getAnswers);
    let [currentEditor, setCurrentEditor] = React.useState<number>();
    let [scrollActive, setScrollActive] = React.useState(false);
    let [editTime, setEditTime] = React.useState<number>();
    let [offsets, setOffsets] = React.useState<NumberMap>();

    let allIds = React.useMemo(() => {
        let res: number[] = [];
        sections?.forEach((section) => res.push(...section.questions))
        if (res.length > 0) setCurrentEditor(res[0]);
        return res;
    }, [sections]);

    let toolbars = React.useMemo(() => {
        return allIds?.map((id) => <QuillToolbar id={id} visible={currentEditor === id } scroll={scrollActive}/> );
    }, [allIds, currentEditor, scrollActive]);

    React.useEffect(() => {
        setScrollActive(scroll >= 137);
    }, [scroll]);

    React.useEffect(() => {
        let editTime = 0;
        answers?.forEach((answer) => editTime = Math.max(answer.updatedAt, editTime) );
        setEditTime(editTime);
    }, [answers]);

    React.useEffect(() => {
        setTimeout(() => {
            let newOffsets: NumberMap = {};
            sections?.forEach((section) => {
                section.questions.forEach((id) => {
                    let key = `question_${section.id}_${id}`;
                    let value = document.getElementById(key)?.offsetTop;

                    if (value) newOffsets[key] = value;
                })
            })

            setOffsets(newOffsets);

            if (newOffsets && newOffsets[`question_${sectionId}_${questionId}`]) {
                window.scrollTo(0, newOffsets[`question_${sectionId}_${questionId}`]);
            }
        }, 0);
    }, [answers, sections, questions]);

    if (!user.loggedIn) return <Redirect to='/login' />;
    if (answersLoading) return <></>;
    return (
        <>
            <Header additionalClass='grey' />
            { toolbars }
            <div className='write'>
                <div className={'left' + (scroll >= 158 ? ' fixed' : '')}>
                    { sections?.map((section) => {
                        let names = sections.map((section) => `question_${section.id}_${section.questions[0]}`);
                        let activeNames = names.filter((name) => offsets && offsets[name] <= scroll);
                        let name = `question_${section.id}_${section.questions[0]}`;
                        let isActive = activeNames.length > 0 && activeNames[activeNames.length - 1] == name;

                        return (
                            <h1 className={'link ' + (isActive ? ' active' : ' inactive')} onClick={() => offsets && offsets[name] && window.scrollTo(0, offsets[name])}>
                                { section.title }
                            </h1>
                        );
                    })}
                </div>

                <div className={'right' + (scroll >= 158 ? ' fixed' : '')}>
                    <div className='message'> { editTime ? `마지막 수정: ${parseDate(new Date(editTime))}` : ''  } </div>
                    <Link to='/checklist/print'><button> 다운로드 </button></Link>
                    <Link to='/checklist/print'><button> 인쇄 </button></Link>
                    <Link to={sectionId ? `/checklist/${sectionId}` : `/checklist`}><button> 나가기 </button></Link>
                </div>


                { sections?.map((section) => (
                    <>
                        <div className='row' style={{marginBottom: 0}}>
                            <h1>
                                { section.title }
                            </h1>
                        </div>
                        { section.questions.map((id) => {
                            if (!questions || !answers) return;
                            let question = questions?.find((value) => value.id === id);
                            if (!question) return;
                            if (question.type === 'post') return;

                            let answer = answers?.find((answer) => answer.questionId === id);

                            return <WriteItem
                                section={section}
                                question={question}
                                answer={answer}
                                setCurrentEditor={setCurrentEditor}
                                setEditTime={setEditTime}
                            />
                        })}
                    </>
                )) }
                <div className='message'>
                    Powered by opensource editor project Quill
                </div>
            </div>
        </>
    )
}

export default Write;
