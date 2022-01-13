import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import CommunityHeader from '../../components/community/CommunityHeader';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import { CommunityQuestion, getCommunityQuestions, writeCommunityQuestion } from '../../etc/api/community/communityQuestion';
import usePromise from '../../etc/usePromise';
import { PlusVector } from '../../img/Vectors';
import { RootReducer } from '../../store';

function CommunityWriteAnswerMain() {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let [question, setQuestion] = React.useState<CommunityQuestion>();
    let [isCustomQuestion, setIsCustomQuestion] = React.useState<boolean>(false);
    let [customQuestion, setCustomQuestion] = React.useState<string>("");
    let [, allQuestions] = usePromise(() => getCommunityQuestions());
    let [redirectTo, setRedirectTo] = React.useState<string>("");

    React.useEffect(() => {
        if(customQuestion) {
            setQuestion({ id: 0, username: communityUser.communityUser!.username, question: customQuestion, tag: "", updatedDate: 0});
        } else {
            setQuestion(undefined);
        }
    }, [customQuestion]);

    if(redirectTo) return <Redirect to = {redirectTo}></Redirect>;
    else return (
        <>
            <CommunityHeader></CommunityHeader>
            <div className="CommunityWriteAnswerMain">
                <div className="questionContainer">
                    {isCustomQuestion ? <>
                        <textarea className="question" value = {customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} />
                    </> : <>
                        <div className="question">{question ? question.question : "질문을 선택해주세요."}</div>
                    </>}
                    {question ? <>
                        <button className="writeAnswer" onClick={async() => {
                            if(isCustomQuestion) {
                                let [success, id] = await writeCommunityQuestion(question!.username, question!.question, question!.tag);
                                if(success) {
                                    setRedirectTo(`/community/write?qid=${id}`); 
                                }
                            } else {
                                setRedirectTo(`/community/write?qid=${question!.id}`);
                            }
                        }}>{"답변 작성하기"}</button>
                    </> : <>
                        <button className="writeAnswer">{"질문을 선택해주세요"}</button>
                    </>}
                </div>
                <div className="background"></div>
                <div className="allQuestionsContainer">
                    <div className="allQuestionsList">
                        {allQuestions?.map((question) => {
                            return (
                                <button className="question" onClick={() => {
                                    setQuestion(question);
                                    setIsCustomQuestion(false);
                                }}>
                                    <div className="text">
                                        {question.question}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <div className="addQuestion" onClick={() => {
                        setIsCustomQuestion(true);
                        if(customQuestion) {
                            setQuestion({ id: 0, username:communityUser.communityUser!.username, question: customQuestion, tag: "", updatedDate: 0})
                        } else {
                            setQuestion(undefined);
                        }
                    }}>
                        <button className="question">
                            <div className="plusVector">
                                <div className="border"></div>
                                {PlusVector}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={2}></CommunityNavigationBar>
        </>
    )
}

export default CommunityWriteAnswerMain;