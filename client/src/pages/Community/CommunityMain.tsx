import React from 'react';
import { useSelector } from 'react-redux';
import CommunityHeader from '../../components/community/CommunityHeader';
import { communityLogin, communitySignUp } from '../../etc/api/community/communityUser';
import { imageUrl } from '../../etc/config';
import { PlusVector, questionVector } from '../../img/Vectors';
import MobileHeader from '../../MobileComponents/MobileHeader';
import { RootReducer } from '../../store';
import { titleBlockMainTitle, titleBlockSubTitle } from '../../textFiles/communityText';

function CommunityMain() {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let [username, setUsername] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");
    return (
        <>
            <div className="Mobile">
                <CommunityHeader></CommunityHeader>
                <div className="CommunityMain">
                    <div className="writeBlock">

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
                            <div className="userAnswer">
                                <div className="headerContainer">
                                    <div className="profileContainer">
                                        <img src="" alt="" className="profileImage" />
                                        <div className="textContainer">
                                            <div className="nickName">아리랑</div>
                                            <div className="tags">{"#죽음 #유언"}</div>
                                        </div>
                                        <div className="readQuestionContainer">
                                            <div className="vector">{questionVector}</div>
                                            <div className="title">질문 읽기</div>
                                        </div>
                                    </div>
                                </div>  
                                <img src="" alt="" className="answerImage" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommunityMain;