import React from 'react';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/community/CommunityHeader';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import { CommunityQuestion, getCommunityQuestions } from '../../etc/api/community/communityQuestion';
import usePromise from '../../etc/usePromise';

function CommunityWriteAnswerMain() {
    let [question, setQuestion] = React.useState<CommunityQuestion>();
    let [, allQuestions] = usePromise(() => getCommunityQuestions());
    return (
        <>
            <CommunityHeader></CommunityHeader>
            <div className="CommunityWriteAnswerMain">
                <div className="questionContainer">
                    <div className="question">{question ? question.question : "질문을 선택해주세요."}</div>
                    {question ? <>
                        <Link to = {`/community/write?qid=${question.id}`}><button className="writeAnswer">{"답변 작성하기"}</button></Link>
                    </> : <>
                        <button className="writeAnswer">{"질문을 선택해주세요"}</button>
                    </>}
                </div>
                <div className="allQuestionsContainer">
                    <div className="allQuestionsList">
                        {allQuestions?.map((question) => {
                            return (
                                <button className="question" onClick={() => setQuestion(question)}>
                                    <div className="text">
                                        {question.question}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={2}></CommunityNavigationBar>
        </>
    )
}

export default CommunityWriteAnswerMain;