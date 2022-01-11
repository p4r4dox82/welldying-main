import React from 'react';
import CommunityHeader from '../../components/community/CommunityHeader';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import { CommunityQuestion, getCommunityQuestions } from '../../etc/api/community/communityQuestion';
import usePromise from '../../etc/usePromise';
import { leftVector, rightVector, writeVector } from '../../img/Vectors';

export interface touchData {
    initialX: number,
    initialY: number,
    lastX: number,
    lastY: number
}

export let ordinalNumberToText = (number: number) => {
    let text;
    switch(number) {
        case 1:
            text = "첫번째";
            break;
        case 2:
            text = "두번째";
            break;
        case 3: 
            text = "세번째";
            break;
        case 4:
            text = "네번째";
            break;
    }
    return text;
}

export let addNumberWithMax = (curr: number, max: number) => {
    return Math.min(max, curr + 1);
}

export let substractNumberWithMin = (curr: number, min: number) => {
    return Math.max(min, curr - 1);
}


function CommunityMain() {
    let [, allQuestions] = usePromise(() => getCommunityQuestions());
    let [selectedQuestionNumber, setSelectedQuestionNumber] = React.useState<number>(0);
    let [selectedQuestion, setSelectedQuestion] = React.useState<CommunityQuestion>();
    let [weekQuestionTouchData, setWeekQuestionTouchData] = React.useState<touchData>({ initialX: 0, initialY: 0, lastX: 0, lastY: 0 });

    let width = window.innerWidth;
    React.useEffect(() => {
        if(!allQuestions) return;
        setSelectedQuestion(allQuestions[selectedQuestionNumber]);
    }, [selectedQuestionNumber])

    return (
        <>
            <CommunityHeader></CommunityHeader>
            <div className="CommunityMain">
                <div className="notice"></div>
                <div className="titleContainer">
                    <div className="textContainer">
                        <div className="title">이번주 프로그램</div>
                        <div className="date">2022.03.14 - 2022.03.21</div>
                    </div>
                    <div className="dotContainer">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="programContainer">
                    <div className="border"></div>
                    <div className="title">첫째주 프로그램</div>
                    <div className="contentContainer">
                        <div className="text">{"아리랑치기어쩌구 나는 아리름암 우리나라 맑은 나라 어쩌구 아리랑치기어쩌구 나는 아리름암 우리나라 맑은 나라 어쩌구아리랑치기어쩌구 나는 아리름암 우리나라..."}</div>
                        <div className="vector"></div>
                        <div className="questionsSlide" onTouchStart = {(e: any) => {
                                setWeekQuestionTouchData({...weekQuestionTouchData, initialX: e.touches ? e.touches[0].clientX: e.clientX, initialY: e.touches ? e.touches[0].clientY: e.clientY })
                            }} onTouchMove={(e: any) => {
                                setWeekQuestionTouchData({...weekQuestionTouchData, lastX: e.touches ? e.touches[0].clientX: e.clientX, lastY: e.touches ? e.touches[0].clientY: e.clientY })
                            }} onTouchEnd={() => {
                                if((weekQuestionTouchData.lastX - weekQuestionTouchData.initialX) > Math.abs(weekQuestionTouchData.lastY - weekQuestionTouchData.initialY)) {
                                    setSelectedQuestionNumber(substractNumberWithMin(selectedQuestionNumber, 0));
                                } else if((weekQuestionTouchData.initialX - weekQuestionTouchData.lastX) > Math.abs(weekQuestionTouchData.lastY - weekQuestionTouchData.initialY)) {
                                    setSelectedQuestionNumber(addNumberWithMax(selectedQuestionNumber, allQuestions!.length - 1));
                                }
                            }} >
                            <div className="border"></div>
                            <div className="slide" style = {{transform: `translateX(${-(width - 38 * 2) * selectedQuestionNumber}px)`, transition: 'all 0.5s ease-in-out'}}>
                                {allQuestions?.map((question, key) => {
                                    return (
                                        <>
                                            <div className="question">
                                                <div className="title">{ordinalNumberToText(key + 1) + "질문"}</div>   
                                                <div className="questionText">
                                                    {question.question}
                                                </div>
                                                <button className="writeAnswer">
                                                    {writeVector}
                                                    <span className="text">작성하러가기</span>
                                                </button>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                            <div className="buttonContainer">
                                <button className="left" onClick={() => setSelectedQuestionNumber(substractNumberWithMin(selectedQuestionNumber, 0))}>{leftVector}</button>
                                <button className="right" onClick={() => setSelectedQuestionNumber(addNumberWithMax(selectedQuestionNumber, allQuestions!.length - 1))}>{rightVector}</button>
                            </div>
                        </div>
                        <div className="questionsSlideBar">
                            {[...Array(allQuestions?.length).keys()].map((key) => {
                                return (
                                    <>
                                        <div className={"dot" + (key === selectedQuestionNumber ? " selected" : "")}></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className="tag">{"#감성적 #이성적 #유언 #메시지"}</div>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={0}></CommunityNavigationBar>
        </>
    )
}

export default CommunityMain;