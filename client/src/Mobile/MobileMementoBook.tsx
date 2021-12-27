import React from 'react';
import { bookCoverVector, Colon, expandVector, FlowerVector, LeftArrowVector, leftVector, moonVector } from '../img/Vectors';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileNavigation from '../MobileComponents/MobileNavigation';
import queryString from 'query-string';
import { ProgramAnswerData, getProgramAnswer, programAnswer } from '../etc/api/programAnswer';
import usePromise from '../etc/usePromise';
import { imageUrl } from '../etc/config';
import { oneByte } from '../etc';
import { getTitle } from '../pages/MyBook';

interface Props {
    location: Location;
}

export let QuestionInterface = [
    {
        title: "내가 걸어온 길",
        questions: ["당신의 기억은 어떤 순간들을 담고 있나요?", "당신에게 행복한 기억을 만들어준 사람은 누구인가요?", "당신의 인생은 스스로에게 어떤 의미였나요?"],
        tag: "#기록 #추억"
    },
    {
        title: "언젠가는 마주할 그 순간",
        questions: ["마지막 순간에 당신은 어떤 말을 남기고 싶나요?", "장례식, 그리고 그 이후에 가까운 사람들이 당신을 어떻게 추모해주길 바라나요?", "죽음을 떠올리면 어떤 생각과 기분이 드나요?"],
        tag: "#장례 #심적준비"
    },
    {
        title: "내가 걸어갈 길",
        questions: ["어떤 가치관, 신념, 좌우명을 가지고 살아가고 있나요?", "삶이 끝나기 전, 꼭 하고 싶은 것은 무엇인가요?", "미래의 나에게 편지를 적어봅시다."],
        tag: "#현재 #미래"
    }
]

export let isImage = (answer: string) => {
    if(!answer) return false;
    let answerLength = answer.length;
    let answerRear = answer.slice(answerLength - 3, answerLength);
    return (answerRear === 'jpg' || answerRear === 'png');
}

function MobileMementoBook({ location }: Props) {
    const query = queryString.parse(location.search);
    const pid = Number.parseInt(String(query.pid));
    const [, programAnswer] = usePromise(() => getProgramAnswer(pid));
    let [enterBook, setEnterBook] = React.useState<boolean>(false);
    let [week1Open, setWeek1Open] = React.useState<boolean>(false);
    let [week2Open, setWeek2Open] = React.useState<boolean>(false);
    let [week3Open, setWeek3Open] = React.useState<boolean>(false);
    let weekOpen = (week: number) => {
        switch(week) {
            case 1:
                return week1Open;
            case 2:
                return week2Open;
            case 3:
                return week3Open;
        }
    }
    let OpenOneWeek = (week: number) => {
        switch(week) {
            case 1:
                setWeek1Open(true);
                setWeek2Open(false);
                setWeek3Open(false);
                break;
            case 2:
                setWeek1Open(false);
                setWeek2Open(true);
                setWeek3Open(false);
                break;
            case 3:
                setWeek1Open(false);
                setWeek2Open(false);
                setWeek3Open(true);
                break;
        }
    }
    let setWeekOpen = (week: number, open: boolean) => {
        if(open) {
            OpenOneWeek(week);
        } else {
            switch(week) {
                case 1: 
                    setWeek1Open(open);
                    break;
                case 2:
                    setWeek2Open(open);
                    break;
                case 3:
                    setWeek3Open(open);
                    break;
            }
        }
    }

    let [lineLength, setLineLength] = React.useState<number>(0);
    React.useEffect(() => {
        function handleResize() {
            let textWidth = window.innerWidth - (40 + 24 + 5) * 2 - 5;
            setLineLength(textWidth);
        }
        handleResize();
    }, [])
    let getByteOfString = (str: string) => {
        let byte = 0;
        for(let i = 0; i < str.length; i++) {
            if (oneByte.test(str[i])) {
                byte++;
            } else {
                byte = byte+2;
            }
        }
        return byte;
    }
    let answerLineRef = React.useRef<any>(null);
    let convertAnswertoArray = (answer: string) => {
        let answerArray = [];
        answerArray = answer.split('\n');
        
        let answerLineArray: string[] = [];
        answerArray.forEach((answerParagraph) => {
            let sidx = 0;
            for(let i = 0; i < answerParagraph.length; i++) {
                if(answerLineRef.current.offsetWidth <= lineLength) {
                    answerLineRef.current.innerText = answerParagraph.slice(sidx, i);
                }
                if(answerLineRef.current.offsetWidth > lineLength) {
                    answerLineArray.push(answerLineRef.current.innerText.slice(0,-1) + "&");
                    answerLineRef.current.innerText = "";
                    i -= 1;
                    sidx = i;
                }
            }
            answerLineArray.push(answerParagraph.substring(sidx, answerParagraph.length));
        })

        return answerLineArray;
    }

    let firstPage = (answerArray: string[], questionTitle: string, imageUri: string) => {
        if(isImage(answerArray[0])) {
            return (
                <div className="page">
                    <div className="mementoColon">{Colon}</div>
                    <div className="questionTitle">{questionTitle}</div>
                    <div className="answerLines image">
                        <img src={imageUrl(`ProgramBook/${answerArray[0]}`)} alt="" />
                    </div>
                </div>
            )
        }
        let emptyPage = true;
        answerArray.forEach((answerLine) => {
            if(answerLine !== "") {
                emptyPage = false;
            }
        })

        if(!emptyPage) return (
            <div className="page">
                <div className="mementoColon">{Colon}</div>
                <div className="questionTitle">{questionTitle}</div>
                {imageUri && <div className="imageContainer">
                    <img src={imageUrl(`ProgramBook/${imageUri}`)} alt="" />
                </div>}
                <div className={"answerLines" + (imageUri === undefined ? ' notFirst' : ' first')}>
                    <div>{answerArray.map((answerLine) => {
                        if(answerLine[answerLine.length - 1] === "&") {
                            return (
                                <div className="answerLine notLastLine">{answerLine.slice(0, -1)}</div>
                            )
                        }
                        else if(answerLine === "") {
                            return (
                                <div className = "answerLine emptyLine">{" "}</div>
                            )
                        }
                        else return (
                            <div className='answerLine'>{answerLine}</div>
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }
    let notFirstPage = (answerArray: string[], tag: string) => {
        if(isImage(answerArray[0])) {
            return (
                <div className="page">
                    <div className="header">
                        <div className="tag">{tag}</div>
                        <div className="date">{"2021년 11월의 청춘유언"}</div>
                    </div>
                    <div className="answerLines image">
                        <img src={imageUrl(`ProgramBook/${answerArray[0].slice(1)}`)} alt="" />
                    </div>
                </div>
            )
        }

        let emptyPage = true;
        answerArray.forEach((answerLine) => {
            if(answerLine !== "") {
                emptyPage = false;
            }
        })

        if(!emptyPage) return (
            <div className="page">
                <div className="header">
                    <div className="tag">{tag}</div>
                    <div className="date">{"2021년 11월의 청춘유언"}</div>
                </div>
                <div className="answerLines notFirst">
                    <div>{answerArray.map((answerLine) => {
                        if(answerLine[answerLine.length - 1] === "&") {
                            return (
                                <div className="answerLine notLastLine">{answerLine.slice(0, -1)}</div>
                            )
                        }
                        else if(answerLine === "") {
                            return (
                                <div className = "answerLine emptyLine">{" "}</div>
                            )
                        }
                        else return (
                            <div className='answerLine'>{answerLine}</div>
                        )
                    })}</div>
                </div>
            </div>
        )
    }

    let pageComponents = (answerData: ProgramAnswerData, questionTitle: string, tag: string) => {
        let answerLineArray = convertAnswertoArray(answerData.answer);
        let answerPageLineNumberexceptFirstPage = answerLineArray.length - 4;
        let pageNumber = (answerPageLineNumberexceptFirstPage > 0) ? (answerPageLineNumberexceptFirstPage - answerPageLineNumberexceptFirstPage%10)/10 + (answerPageLineNumberexceptFirstPage%10 == 0 ? 0 : 1): 0;

        if(isImage(answerData.answer)) {
            answerLineArray = answerData.answer.split(',');
            return (
                <>
                    {firstPage([answerLineArray[0]], questionTitle, answerData.imageUri)}
                    {[...Array(answerLineArray.length -1).keys()].map((key) => {
                        return (
                            notFirstPage([answerLineArray[key+1]], tag)
                        )
                    })}
                </>
            )
        }
        if(answerData.imageUri === 'giwa_1-2.jpg') {
            return (
                <>
                    {firstPage([answerData.imageUri], questionTitle, "")}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 14, (key+1) * 14), tag)
                        )
                    })}
                </>
            )
        }
        if(answerData.imageUri === undefined) {
            return (
                <>
                    {firstPage(answerLineArray.slice(0, 14), questionTitle, answerData.imageUri)}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 14 + 14, (key+1) * 14 + 14), tag)
                        )
                    })}
                </>
            )
        }
        
        else {
            return (
                <>
                    {firstPage(answerLineArray.slice(0, 4), questionTitle, answerData.imageUri)}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 14 + 4, (key+1) * 14 + 4), tag)
                        )
                    })}
                </>
            );
        }
    }

    let [updateCheckLine, setUpdateCheckLine] = React.useState<string>("");
    React.useEffect(() => {

        console.log(answerLineRef.current.offsetWidth);
    }, [updateCheckLine]);

    if(pid) return (
        <>
            <div ref = {answerLineRef} className = "answerLineRef"></div>
            <div className="Mobile">
                <MobileHeader uri = '/book'></MobileHeader>
                {!enterBook && <>
                    {programAnswer && <div className="MobileMementoBookCover">
                        <div className="cover">
                            <div className="line"></div>
                            <div className="moon">{moonVector}</div>
                            <div className="bookCover">{bookCoverVector}</div>
                            <div className="title">{getTitle(programAnswer.title).map((title) => {
                                return (
                                    <div>{title}</div>
                                )
                            })}</div>
                            <div className="writer">
                                :당신의 아름다운 순간을 책에 담다<br/>
                                {`${programAnswer.name} 지음`}
                            </div>
                        </div>
                        <button className="enterBook" onClick = {() => setEnterBook(true)}>
                            <div className="border"></div>
                            입 장 하 기
                        </button>
                    </div>}
                </>}
                {enterBook && <>
                    <div className="MobileMementoBook">
                    <div className="titleBlock">
                        <div className="borderBox"></div>
                        <div className="title">{'[ 청춘유언 ]'}</div>
                        <div className="subtitle">{': 당신의 아름다운 순간을 책에 담다. '}</div>
                        <div className="flowerImage">{FlowerVector}</div>
                    </div>
                    <div className="booksBlock">
                        {QuestionInterface.map((questionInterface, key) => {
                            const week = key + 1;
                            return (
                                <div className="bookBlock">
                                    <div className="titleContainer" onClick = {() => {
                                        setWeekOpen(week, !weekOpen(week));
                                        window.scrollTo(0, 0);
                                    }}>
                                        <div className="title">{`${week}주차 : ${questionInterface.title}`}</div>
                                        <button className={"expandButton" + (weekOpen(week) ? " open" : " close")} >{leftVector}</button>
                                    </div>
                                    <div className="vector"></div>
                                    {weekOpen(week) && 
                                        <>
                                            <div className="bookContainer">
                                                {programAnswer && <div className="pageContainer">
                                                    {programAnswer.answerData.slice(key*3, key*3+3).map((answerData, key) => {
                                                        if(answerData.answer) {
                                                            return (
                                                                pageComponents(answerData, questionInterface.questions[key], questionInterface.tag)
                                                            )
                                                        }
                                                    })}
                                                </div>}
                                            </div>
                                        </>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    </div>
                    <button className="goUpButton" onClick = {() => window.scrollTo(0, 0)}>
                        <div className="border">
                            {LeftArrowVector}
                        </div>
                    </button>
                </>}
                <MobileNavigation></MobileNavigation>
            </div>
        </>
    )
    else return (
        <>
            <div className="Mobile">
                <MobileHeader uri = '/book'></MobileHeader>
                <div className="MobileMementoBook">
                    <div className="titleBlock">
                        <div className="borderBox"></div>
                        <div className="title">{'[ 청춘유언 ]'}</div>
                        <div className="subtitle">{': 당신의 아름다운 순간을 책에 담다. '}</div>
                        <div className="flowerImage">{FlowerVector}</div>
                    </div>
                    <div className="bookBlock">
                        <div className="titleContainer">
                            <div className="title">{'1주차 : 당신이 나아갈 삶의 이야기'}</div>
                            <button className="expandButton">{expandVector}</button>
                        </div>
                        <div className="vector"></div>
                        <div className="explanationText">확대 버튼 또는 유언을 클릭해서 확대해주세요.</div>
                        <div className="bookContainer">
                            <div className="pageContainer">
                                <div className="page"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <MobileNavigation></MobileNavigation>
            </div>
        </>
    )
}

export default MobileMementoBook;