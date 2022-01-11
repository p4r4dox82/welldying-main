import React from 'react';
import { useSelector } from 'react-redux';
import CommunityHeader from '../../components/community/CommunityHeader';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import { parseDate } from '../../etc';
import { getCommunityAnswers } from '../../etc/api/community/communityAnswer';
import { getCommunityQuestions } from '../../etc/api/community/communityQuestion';
import { getCommunityUsers } from '../../etc/api/community/communityUser';
import { communityLogin, communitySignUp } from '../../etc/api/community/communityUser';
import { imageUrl } from '../../etc/config';
import usePromise from '../../etc/usePromise';
import { bookmarkVector, commentVector, emotionVector, PlusVector, questionVector } from '../../img/Vectors';
import MobileHeader from '../../MobileComponents/MobileHeader';
import { RootReducer } from '../../store';
import { titleBlockMainTitle, titleBlockSubTitle } from '../../textFiles/communityText';

function CommunityFeed() {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let [, allAnswers] = usePromise(() => getCommunityAnswers());
    let [, allUsers] = usePromise(() => getCommunityUsers());
    let [, allQuestions] = usePromise(() => getCommunityQuestions());

    return (
        <>
            <div className="Mobile">
                <CommunityHeader></CommunityHeader>
                <div className="CommunityFeed">
                    <div className="noticeBlock">

                    </div>
                    <div className="feedBlock">
                        <div className="newQuestionsContainer">
                            <div className="titleContainer">
                                <div className="title">새로운 질문</div>
                                <div className="dots">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                            <div className="questionsContainer">
                                <button className="addQuestion">
                                    <div className="border"></div>
                                    <div className="plusVector">{PlusVector}</div>
                                </button>
                                <button className="newQuestion">
                                    <div className="newDot"></div>
                                    <div className="profileImage"></div>
                                    <div className="name">용훈</div>
                                </button>
                            </div>
                        </div>
                        <div className="userAnswersContainer">
                            {allAnswers?.map((answer) => {
                                let user = allUsers?.find((user) => user.username === answer.username);
                                let question = allQuestions?.find((question) => question.id === answer.questionId);
                                return (
                                    <div className="userAnswer">
                                        <div className="headerContainer">
                                            <div className="profileContainer">
                                                <img src="" alt="" className="profileImage" />
                                                <div className="textContainer">
                                                    <div className="nickName">{user?.userInformation.nickName}</div>
                                                    <div className="tags">{question?.tag}</div>
                                                </div>
                                                <div className="readQuestionContainer">
                                                    <div className="vector">{questionVector}</div>
                                                    <div className="title">질문 읽기</div>
                                                </div>
                                            </div>
                                        </div>  
                                        <img src="" alt="" className="answerImage" />
                                        <div className="contentContainer">
                                            <div className="title">{answer.answerData.title}</div>
                                            <div className="answer">{answer.answerData.answer}</div>
                                        </div>
                                        <div className="footerContainer">
                                            <div className="leftContainer">
                                                <div className="date">{parseDate(new Date(answer.updatedDate))}</div>
                                                <button className="showComments">댓글 모두 보기</button>
                                            </div>
                                            <div className="rightContainer">
                                                <button className="emotion">{emotionVector}</button>
                                                <button className="comment" style = {{marginLeft: '18px'}}>{commentVector}</button>
                                                <button className="bookmark" style = {{marginLeft: '14px', marginTop: '4px'}}>{bookmarkVector}</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <CommunityNavigationBar pageSelected={1}></CommunityNavigationBar>
            </div>
        </>
    )
}

export default CommunityFeed;