import React from 'react';
import { useSelector } from 'react-redux';
import { getQuestions } from '../etc/api/question';
import { getSections } from '../etc/api/section';
import { getAnswers } from '../etc/api/answer';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { LeftArrowVector, leftVector, rightVector } from '../img/Vectors';
import { RootReducer } from '../store';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileNoteQuestion from '../MobileComponents/MobileNoteQuestion';
import { Redirect } from 'react-router-dom';
import MobileNavigation from '../MobileComponents/MobileNavigation';

function MobileNote() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, allSections] = usePromise(getSections);
    let [, allQuestions] = usePromise(getQuestions);
    let [, allAnswers] = usePromise(getAnswers);
    let [sectionNum, setSectionNum] = React.useState<number>(0);
    let section = React.useMemo(() => {return allSections?.find((section) => section.id === sectionNum)}, [allSections, sectionNum]);
    let [pageNumber, setPageNumber] = React.useState<number>(1);
    let [totalPageNumber, setTotalPageNumber] = React.useState<number>(4);
    let [questionNum, setQuestionNum] = React.useState<number>(4);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    })

    let writtenQuestions = React.useMemo(() => {
        let userAnswers = allAnswers?.filter((answer) => answer.username === user.user?.username);
        console.log(userAnswers);
        let userSectionAnswers = userAnswers;
        if(sectionNum !== 0) {
            let sectionQuestions = allQuestions?.filter((question) => section?.questions.includes(question.id));
            userSectionAnswers = userAnswers?.filter((answer) => {
                if(sectionQuestions?.find((question) => question.id === answer.questionId)) return true;
                else return false;
            });
        }
        setTotalPageNumber(((Number(userSectionAnswers?.length) - Number(userSectionAnswers?.length)%4) / 4) + (Number(userSectionAnswers?.length)%4 !== 0 ? 1 : 0));
        return userSectionAnswers;
    }, [allAnswers, user, section, sectionNum, allQuestions]);

    let unwrittenQuestions = React.useMemo(() => {
        let sectionQeustions = allQuestions;
        if(sectionNum !== 0) {
            sectionQeustions = allQuestions?.filter((question) => section?.questions.includes(question.id));
        }
        let userAnswers = allAnswers?.filter((answer) => answer.username === user.user?.username);
        let unwrittensectionQuestions = sectionQeustions?.filter((question) => {
            if(userAnswers?.find((answer) => answer.questionId === question.id))
                return false;
            else return true;
        })
        return unwrittensectionQuestions;
    }, [allQuestions, section, sectionNum, allAnswers, user]);
    
    //answerVariable
    

    let sections = React.useMemo(() => {
        if(!allSections) return <></>;
        else return (
            <div className="sections">
                <div className="sectionContainer">
                    <div className={"section" + (sectionNum === 0 ? ' select' : '')} onClick = {() => {setSectionNum(0); setPageNumber(1); setQuestionNum(4);}}>전체</div>
                    {allSections?.map((section, key) => {
                        if(key !== 5) return (
                            <div className={"section" + (sectionNum === key + 1 ? ' select' : '')} onClick = {() => {setSectionNum(key+1); setPageNumber(1); setQuestionNum(4);}}>{section.tag.split('#').slice(1).map((tag) => {
                                return (
                                    <span>{tag}</span>
                                )
                            })}</div>
                        )
                        else
                            return <></>;
                    })}
                </div>
            </div>
        )
    }, [allSections, sectionNum]);
    if(!user.loggedIn) return <Redirect to = {{pathname: '/login', state: {from: '/note'}}} />;
    else return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/note'} />
                <div className="MobileNote">
                    <div className="Main">
                        <img src={imageUrl('Mobile/Background.png')} alt="" />
                        <div className="blend"></div>
                        <div className="title">
                            <div>나의 생각과 이야기를</div>
                            <div>남겨두는 공간</div>
                        </div>
                        <div className="subtitle">
                            메멘토 노트
                        </div>
                    </div>
                    {sections}
                    <div className="QuestionContainer">
                        <div className="writtenQuestions">
                            <div className="title">{section?.title}</div>
                            {totalPageNumber === 0 ? <div className="empty">
                                <div className="title">아직 답변하신 질문이 존재하지 않습니다.</div>
                                <div className="subtitle">
                                    <div>아래의 '작성하지 않은 질문'을 선택하여 </div>
                                    <div>질문에 대한 답변을 남겨보세요</div>
                                </div>
                            </div> : <div className="questions">
                                {writtenQuestions?.slice(4*(pageNumber - 1), 4*pageNumber).map((answer) => {
                                    let question = allQuestions?.find((question) => question.id === answer.questionId);
                                    if(question) return (
                                        <MobileNoteQuestion question = {question} answer = {answer} written = {true} />
                                    )
                                    else 
                                        return <></>;
                                })}
                            </div>}
                            {totalPageNumber > 1 && <div className="buttonContainer">
                                <button className="left" onClick = {() => setPageNumber(Math.max(pageNumber - 1, 1))}>{leftVector}</button>
                                <div className="pagenumber NS px14 bold">{pageNumber + '/' + (totalPageNumber)}</div>
                                <button className="right" onClick = {() => setPageNumber(Math.min(pageNumber + 1, totalPageNumber))}>{rightVector}</button>
                            </div>}
                        </div>
                        <div className="unwrittenQuestions">
                            <div className="title">아직 작성하지 않은 질문</div>
                            <div className="questions">
                                {unwrittenQuestions?.slice(0,questionNum).map((question) => {
                                    return (
                                        <MobileNoteQuestion question = {question} answer = {null} written = {false} />
                                    )
                                })}
                            </div>
                            {questionNum < unwrittenQuestions?.length && <div className="more" onClick = {() => setQuestionNum(questionNum + 3)}>
                                <div>더보기</div>
                                <div className = "vector">{LeftArrowVector}</div>
                            </div>}
                        </div>
                    </div>
                </div>
                <MobileNavigation />
            </div>
        </>
    )
}

export default MobileNote;