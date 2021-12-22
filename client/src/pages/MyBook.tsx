import React from 'react';
import queryString from 'query-string';
import usePromise from '../etc/usePromise';
import { getProgramAnswer, ProgramAnswerData } from '../etc/api/programAnswer';
import Header from '../components/Header';
import { mainLogo } from '../etc/svg';
import { Colon, leftVector, MementoLogo, rightVector } from '../img/Vectors';
import { imageUrl } from '../etc/config';
import { isImage, QuestionInterface } from '../Mobile/MobileMementoBook';

interface Props {
    location: Location
}

function MyBook({ location }: Props) {
    const query = queryString.parse(location.search);
    const pid = Number(query.pid);
    const [, programAnswer] = usePromise(() => getProgramAnswer(pid));
    let [showHeader, setShowHeader] = React.useState<boolean>(false);
    let [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    let [totalPageNumber, setTotalPageNumber] = React.useState<number>(0);
    let sumToTalPageNumber = 0;
    let [lineLength, setLineLength] = React.useState<number>(0);
    let answerLineRef = React.useRef<any>(null);

    React.useEffect(() => {
        setLineLength(356);
    })

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

        if(!emptyPage) {
            return (
                <div className="page">
                    <div className="mementoColon">{Colon}</div>
                    <div className="questionTitle">{questionTitle}</div>
                    {imageUri && <div className="imageContainer">
                        <img src={imageUrl(`ProgramBook/${imageUri}`)} alt="" />
                    </div>}
                    <div className={"answerLines" + (imageUri === undefined ? ' notFirst' : ' getImage')}>
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
    }

    let notFirstPage = (answerArray: string[]) => {
        if(isImage(answerArray[0])) {
            return (
                <div className="page">
                    <div className="header">
                        <div className="tag">{"#계획 #버킷리스트"}</div>
                        <div className="date">{"2021.12.20"}</div>
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
        if(!emptyPage) {
            return (
                <div className="page">
                    <div className="header">
                        <div className="tag">{"#계획 #버킷리스트"}</div>
                        <div className="date">{"2021.12.20"}</div>
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
    }

    let pageComponents = (answerData: ProgramAnswerData, questionTitle: string) => {
        let answerLineArray = convertAnswertoArray(answerData.answer);
        let answerPageLineNumberexceptFirstPage = (answerData.imageUri === undefined) ? (answerLineArray.length - 12) : (answerLineArray.length - 4);
        let pageNumber = (answerPageLineNumberexceptFirstPage > 0) ? (answerPageLineNumberexceptFirstPage - answerPageLineNumberexceptFirstPage%12)/12 + (answerPageLineNumberexceptFirstPage%12 == 0 ? 0 : 1): 0;

        if(isImage(answerData.answer)) {
            answerLineArray = answerData.answer.split(',');
            sumToTalPageNumber = (sumToTalPageNumber + answerLineArray.length);
            setTotalPageNumber(sumToTalPageNumber);
            return (
                <>
                    {firstPage([answerLineArray[0]], questionTitle, answerData.imageUri)}
                    {[...Array(answerLineArray.length -1).keys()].map((key) => {
                        return (
                            notFirstPage([answerLineArray[key+1]])
                        )
                    })}
                </>
            )
        }
        if(answerData.imageUri === 'giwa_1-2.jpg') {
            sumToTalPageNumber = (sumToTalPageNumber + pageNumber + 1);
            setTotalPageNumber(sumToTalPageNumber);
            return (
                <>
                    {firstPage([answerData.imageUri], questionTitle, "")}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 12, (key+1) * 12))
                        )
                    })}
                </>
            )
        }
        if(answerData.imageUri === undefined) {
            sumToTalPageNumber = (sumToTalPageNumber + pageNumber + 1);
            setTotalPageNumber(sumToTalPageNumber);
            return (
                <>
                    {firstPage(answerLineArray.slice(0, 12), questionTitle, answerData.imageUri)}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 12 + 12, (key+1) * 12 + 12))
                        )
                    })}
                </>
            )
        }
        
        else {
            sumToTalPageNumber = (sumToTalPageNumber + pageNumber + 1);
            setTotalPageNumber(sumToTalPageNumber);
            return (
                <>
                    {firstPage(answerLineArray.slice(0, 4), questionTitle, answerData.imageUri)}
                    {[...Array(pageNumber).keys()].map((key) => {
                        return (
                            notFirstPage(answerLineArray.slice(key * 12 + 4, (key+1) * 12 + 4))
                        )
                    })}
                </>
            );
        }
        
    }

    let BookContainerRef = React.useRef<any>(<></>);

    let bookContainer = React.useMemo(() => {
        return (
            <div className="BookContainer" ref = {BookContainerRef}>
                {programAnswer && QuestionInterface.map((questionInterface, key1) => {
                    return (
                        questionInterface.questions.map((question, key2) => {
                            if(programAnswer.answerData[key1 * 3 + key2].answer) {
                                return(
                                    pageComponents(programAnswer.answerData[key1 * 3 + key2], question)
                                )
                            }
                        })
                    )
                })}
            </div>
        )
    }, [programAnswer, QuestionInterface]);

    React.useEffect(() => {
        if(BookContainerRef) {
            setInterval(() => {
                setCurrentPageNumber(Math.ceil(BookContainerRef.current.scrollLeft/539) + 1);
            }, 100)
        }
    }, [])

    if(pid) return (
        <>
            <div ref = {answerLineRef} className = "answerLineRef PC"></div>
            <div className = "Background">
                <div className="MyBook">
                    <div className="Header">
                        {showHeader ? 
                        <>
                            <div className="mainHeader">
                                <Header additionalClass=''></Header> 
                                <div className="showHeaderButton" >
                                    상단바 올리기
                                    <button onClick = {() => setShowHeader(!showHeader)}>{rightVector}</button>
                                </div>
                            </div>
                        </> :
                        <>
                            <div className="reducedHeader">
                                <div className="mainLogo">{MementoLogo}</div>
                                <div className="showHeaderButton" >
                                    상단바 내리기
                                    <button onClick = {() => setShowHeader(!showHeader)}>{leftVector}</button>
                                </div>
                            </div>
                        </>}
                    </div>
                    {bookContainer}
                    <div className="pageControllerContainer">
                        <div className="pageBar">
                            <div className="totalPageBar">
                                <div className="number firstNumber">{1}</div>
                                <div className="linesContainer">
                                    <div className="dotsContainer">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <div className="line"></div>
                                </div>
                                <div className="currentPageDotContainer">
                                    <div className="currentPageInfo" style={{transform: `translateX(${(currentPageNumber - 1)/(totalPageNumber - 1) * 414}px)`}}>
                                        <div className="currentPageDot"></div>
                                        <div className="currentPageNumber">{currentPageNumber}</div>
                                    </div>
                                </div>       
                                <div className="number totalPageNumber">{totalPageNumber}</div>
                            </div>
                            <div className="buttonContainer">
                                <button className="moveLeft" onClick = {() => BookContainerRef.current.scrollTo((currentPageNumber - 2) * 539, 0)}>{leftVector}</button>
                                <button className="moveRight" onClick = {() => BookContainerRef.current.scrollTo(currentPageNumber * 539, 0)}>{rightVector}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    else {
        return (
            <>
            </>
        )
    }
}

export default MyBook;