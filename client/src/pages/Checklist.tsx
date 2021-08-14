import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProgressCircle from '../components/ProgressCircle';
import { parseDate } from '../etc';
import { getAnswerTime } from '../etc/api/answer';
import { getQuestions, Question } from '../etc/api/question';
import { getSections } from '../etc/api/section';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import useScroll from '../etc/useScroll';
import { RootReducer } from '../store';




function ChecklistPost(question: Question) {
    let [expanded, setExpanded] = React.useState(false);

    return (
        <div className='row'>
            <h3 className='link postTitle' onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}>
                { `${question.title}` }
            </h3>
            { expanded &&
                <ul className='postBody'>
                    { question.message.split('\n').map((question) => <p> { question } </p>) }
                </ul>
            }
        </div>
    )
}

interface MatchParams {
    id?: string;
};

interface Props {
    match: match<MatchParams>;
};

function Checklist({ match } : Props) {
    let id = match.params.id ? Number.parseInt(match.params.id) : undefined;
    let scroll = useScroll();

    let user = useSelector((state: RootReducer) => state.user);
    let [, sections] = usePromise(getSections);
    let [, questions] = usePromise(getQuestions);
    let [, times] = usePromise(getAnswerTime);

    let lastTime = React.useMemo(() => times && Math.max(...times.map((time) => time.updatedAt)), [times]);

    let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);

    let question = React.useMemo(() => {
        return (id === undefined) ? undefined : (
            <>
                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        { section?.title }
                    </h1>
                </div>
                {section?.questions?.map((questionId) => {
                    let question = questions?.find((question) => question.id === questionId);
                    if (!question) return;

                    let time = times?.find((x) => x.questionId === questionId);

                    if (question.type === 'question') return (
                        <div className='row'>
                            <h2>
                                { question.title }
                                <span className='dialogCheckBox' onClick={() => { if (!(time?.isChecked)) alert('답변 작성 완료 후 체크해주세요!'); }}>
                                    <img className={'dialogCheckSign' + (time?.isChecked ? ' active' : '')} src={imageUrl('check.png')} alt = "profile"/>
                                </span>
                            </h2>

                            <ul> { question.message.split('\n').map((str) => <li> {str} </li>) } </ul>
                            <div className='rightArea'>
                                <div className='message'> { time && `마지막 수정: ${parseDate(new Date(time.updatedAt))}` } </div>
                                <Link to={`/write/${id}/${questionId}`}><button> 작성하기 </button></Link>
                            </div>
                        </div>
                    );
                    else return <ChecklistPost {...question} />;
                })}
            </>
        );
    }, [section, times]);

    let emptyQuestion = React.useMemo(() => (
        <>
            <div className='row' style={{marginBottom: 0}}>
                <h1>
                    웰다잉 이야기, 선택과 기록.
                    <span className='message'>
                        { lastTime && `마지막 수정: ${parseDate(new Date(lastTime))}` }
                    </span>
                </h1>
            </div>
            <div className='checklistContainer'>
                { times && sections?.map((section, i) => {
                    if (!times || !sections || !questions) return;

                    const id = i + 1;
                    const sectionQuestions = sections.find((section) => section.id === id)?.questions.filter((id) => questions.find((c) => c.id === id)?.type === 'question') || [];
                    const x = sectionQuestions.filter((id) => times?.find((at) => at.questionId === id && at.isChecked)).length;
                    const y = sectionQuestions.length;
                    const progress = y ? Math.floor(x * 1000 / y) / 10 : 0;

                    const message = y ? ( x === y ? "완료" : `${progress}%` ) : '';

                    return (
                        <div className='checklistItem'>
                            <Link to={`/checklist/${id}`}>
                                <ProgressCircle
                                    image={`checklists/${id-1}.png`}
                                    progress={progress}
                                    message={message}
                                    title={section.title}
                                    color={
                                        ['#E0949159', '#FFC2AD59', '#F9D5D559', '#FFF3F0B2',
                                         '#929AA059', '#DDCCC459', '#B1B3AC59', '#DCA69559'][id-1]
                                    }
                                />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    ), [sections, times]);

    if (!user.loggedIn) return <Redirect to='/login' />;
    return (
        <>
            <Header additionalClass='grey borderBottom' />
            <div className='content'>
                <div className='row' style={{margin: 0}}>
                    <div className={'leftArea' + (scroll >= 138 ? ' fixed' : '')}>
                        <Link to='/checklist'>
                            <h1> { `${user.user!.name}님의`} </h1>
                            <h1> 웰다잉 체크리스트 </h1>
                        </Link>
                        <div className='submenuContainer'>
                            <h6> <Link to='/logout'> 로그아웃 </Link> </h6>
                            <h6> <Link to='/mypage'> 개인 설정 </Link> </h6>
                        </div>

                        <div className='navigationMenu'>
                            { sections?.map((section) => (
                                <Link to={`/checklist/${section.id}`}>
                                    <div className={ id ? (section.id === id ? 'active' : 'inactive') : undefined }>
                                        { section.title }
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{position: 'absolute', right: '66px', top: '-32px', fontSize: '11px', fontWeight: 'bold'}}><Link to='/checklist/print'> 체크리스트 인쇄하기 </Link></div>
                { question ?? emptyQuestion }
            </div>
            <Footer additionalClass= ' '/>
        </>
    )
}

export default Checklist;
