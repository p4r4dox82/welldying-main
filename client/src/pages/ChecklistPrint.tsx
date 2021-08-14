import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getSections } from '../etc/api/section';
import { getQuestions } from '../etc/api/question';
import { getAnswerTime } from '../etc/api/answer';
import usePromise from '../etc/usePromise';
import useScroll from '../etc/useScroll';
import { RootReducer } from '../store';

function ChecklistPrint() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, sections] = usePromise(getSections);
    let [, questions] = usePromise(getQuestions);
    let [, times] = usePromise(getAnswerTime);

    let scroll = useScroll();

    let [items, setItems] = React.useState<[number, number][]>([]);
    let [update, setUpdate] = React.useState<number>(0);



    let checklist = React.useMemo(() => (
        <div className='reviewContainer'>
            { sections?.map((section) => (
                <div className='reviewItem'>
                    <h2>
                        <label>
                            <input //total section select
                                type='checkbox'
                                ref={e => {
                                    if (!e) return;
                                    let x = items.filter(([x, y]) => x === section.id).length;
                                    let y = section.questions.filter((x) => questions?.find((question) => question.id === x && question.type === 'question')).length;
                                    if (0 < x && x < y) e.indeterminate = true;
                                    else e.indeterminate = false;
                                }}
                                checked={(() => {
                                    let x = items.filter(([x, y]) => x === section.id).length;
                                    let y = section.questions.filter((x) => questions?.find((question) => question.id === x && question.type === 'question')).length;
                                    if (x === 0) return false;
                                    if (x === y) return true;
                                    return undefined;
                                })()}
                                disabled={times?.find((time) => section.questions.find((x) => x === time.questionId)) ? false : true}
                                onChange={(e) => {
                                    let newItems = items.filter(([x, y]) => x !== section.id);
                                    if (e.target.checked) section.questions.filter((x) => questions?.find((question) => question.id === x && question.type === 'question')).forEach((id) => newItems.push([section.id, id]));
                                    newItems = newItems.filter(([x, y]) => times?.find((time) => time.questionId === y) ? true : false);
                                    setItems(newItems);
                                    setUpdate(update+1);
                                }}
                            />
                            { section.title }
                        </label>
                    </h2>
                    { section.questions.filter((x) => questions?.find((question) => question.id === x && question.type === 'question')).map((id) => (
                        <div>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={items?.find((([x, y]) => x === section.id && y === id)) ? true : false}
                                    disabled={times?.find((time) => time.questionId === id) ? false : true}
                                    onChange={(e) => {
                                        if (e.target.checked) items.push([section.id, id]);
                                        else setItems(items.filter(([x, y]) => x !== section.id || y !== id));
                                        setUpdate(update+1);
                                    }}
                                />
                                { questions?.find((question) => question.id === id)?.title }
                            </label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ), [sections, questions, times, update]);

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
                                    <div>
                                        { section.title }
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='row' style={{marginBottom: 0}}>
                    <h1>
                        체크리스트 인쇄하기
                    </h1>
                    <div>
                        인쇄하고 싶은 내용을 체크한 후, 인쇄하기 버튼을 눌러주세요.
                    </div>
                </div>

                { checklist }

                <div>
                    <button> 체크한 부분 저장하기 (PDF) </button>
                </div>
                <div>
                    <button> 체크한 부분 인쇄하기 </button>
                </div>

                PDF 저장 및 인쇄 기능은 차후 지원할 예정입니다.
            </div>
            <Footer additionalClass= ' '/>
        </>
    );
}

export default ChecklistPrint;
