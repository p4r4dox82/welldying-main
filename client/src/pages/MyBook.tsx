import React from 'react';
import queryString from 'query-string';
import usePromise from '../etc/usePromise';
import { getProgramAnswer, ProgramAnswerData } from '../etc/api/programAnswer';
import Header from '../components/Header';
import { bookCoverVector, Colon, leftVector, MementoLogo, moonVector, PlusVector, rightVector } from '../img/Vectors';
import { imageUrl } from '../etc/config';
import { isImage, QuestionInterface } from '../Mobile/MobileMementoBook';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ClipboardJS from 'clipboard';
import Draggable from 'react-draggable';

interface Props {
    location: Location
}

export let getTitle = (title: string) => {
    if(title === null) {
    return ["청춘유언", ""];
}
    let newTitle: string[] = ["", ""];
    let idx = 0;
    for(let i = 0; i < title.length; i++) {
        if(title[i] === "\n") {
            idx += 1;
        }
        else {
            newTitle[idx] += title[i];
        }
    }
    return newTitle;
}

function MyBook({ location }: Props) {
    const query = queryString.parse(location.search);
    const pid = Number(query.pid);
    const downloadPassword = (pid - 12345678)%10000;
    const [, programAnswer] = usePromise(() => getProgramAnswer(pid));
    let [showHeader, setShowHeader] = React.useState<boolean>(false);
    let [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    let [totalPageNumber, setTotalPageNumber] = React.useState<number>(0);
    let sumToTalPageNumber = 2;
    let [lineLength, setLineLength] = React.useState<number>(0);
    let [downloadStatus, setDownloadStatus] = React.useState<number>(0);
    let [downloadIng, setDownloadIng] = React.useState<boolean>(false);
    let [downloadStart, setDownloadStart] = React.useState<boolean>(false);
    let [downloadPasswordInput, setDownloadPasswordInput] = React.useState<string>("");
    let [barPosition, setBarPosition] = React.useState<number>(0);
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
                <div className="page" id = "realpage">
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
                <div className="page" id = "realpage">
                    <div className="mementoColon">{Colon}</div>
                    <div className="questionTitle">{questionTitle.split("&").map((question) => {
                        return (
                            <div>{question}</div>
                        )
                    })}</div>
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

    let notFirstPage = (answerArray: string[], tag: string) => {
        if(isImage(answerArray[0])) {
            return (
                <div className="page" id = "realpage">
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
        if(!emptyPage) {
            return (
                <div className="page" id = "realpage">
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
    }

    let pageComponents = (answerData: ProgramAnswerData, questionTitle: string, tag: string) => {
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
                            notFirstPage([answerLineArray[key+1]], tag)
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
                            notFirstPage(answerLineArray.slice(key * 12, (key+1) * 12), tag)
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
                            notFirstPage(answerLineArray.slice(key * 12 + 12, (key+1) * 12 + 12), tag)
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
                            notFirstPage(answerLineArray.slice(key * 12 + 4, (key+1) * 12 + 4), tag)
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
                {programAnswer && 
                <>
                <div className="page cover">
                    <div className="cover">
                        <div className="line"></div>
                        <div className="moon">{moonVector}</div>
                        <div className="bookCover">{bookCoverVector}</div>
                        <div className="title">
                        {getTitle(programAnswer.title).map((title: string) => {
                            return (
                                <div>{title}</div>
                            )
                        })}
                        </div>
                        <div className={"writer" + (getTitle(programAnswer.title)[1] === "" ? " shortTitle" : "")}>
                            :당신의 아름다운 순간을 책에 담다<br/>
                            {`${programAnswer.name} 지음`}
                        </div>
                    </div>
                </div>
                {QuestionInterface.map((questionInterface, key1) => {
                    return (
                        questionInterface.questions.map((question, key2) => {
                            if(programAnswer.answerData[key1 * 3 + key2].answer) {
                                console.log(pid);
                                console.log(key1);
                                if(pid === 75631369 && key1 === 1) {
                                    console.log('asd');
                                    return (
                                        pageComponents(programAnswer.answerData[key1 * 3 + key2], questionInterface.questions[0] + "&" + questionInterface.questions[1] + "&" + questionInterface.questions[2], questionInterface.tag)
                                    )
                                }
                                return(
                                    pageComponents(programAnswer.answerData[key1 * 3 + key2], question, questionInterface.tag)
                                )
                            }
                        })
                    )
                })}
                <div className="page cover">
                    <div className="cover last">
                        <div className="moon">{moonVector}</div>
                        <div className="writer">
                            :당신의 아름다운 순간을 책에 담다
                        </div>
                    </div>
                </div>
                </>}
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

    let downloadPDF = async () => {
        let pageComponents: NodeListOf<HTMLElement> = document.querySelectorAll('#realpage') as NodeListOf<HTMLElement>;
        let captureBookContainer: HTMLElement = document.querySelector('#captureBook') as HTMLElement;
        let doc = new jsPDF({
            orientation: "landscape",
            format: "a4"
        });
        
        for(let i = 0; i < Math.round(pageComponents.length/2); i ++) {
            setDownloadStatus(Math.round(i/(Math.round(pageComponents.length/2) - 1) * 1000)/10);
            while(captureBookContainer.childNodes.length !== 0) {
                captureBookContainer.removeChild(document.querySelector('.page') as Node);
            }
            captureBookContainer.appendChild(pageComponents[i*2].cloneNode(true));
            if(i*2 + 1 < pageComponents.length) {
                captureBookContainer.appendChild(pageComponents[i*2 + 1].cloneNode(true));
            }
            await html2canvas(document.getElementById('capture')!).then(function (canvas) {
                let imageData = canvas.toDataURL('image/png');

                const imageWidth = 297;
                const imageHeight = canvas.height * imageWidth / canvas.width;
                if(i !== 0) {
                    doc.addPage();
                }
                doc.addImage(imageData, 'PNG', 0, 0, imageWidth, imageHeight);
                
                if(i === Math.round(pageComponents.length/2) - 1) {
                    doc.save(`${programAnswer.name}님의 청춘유언.pdf`);
                }
            })
        }

    }

    let captureBook = React.useMemo(() => {
        return (
            <div className="MyBookCapture" id = "capture" style = {{position: "absolute", top: "-9999px", left: "-9999px", width: "1260px", height: "891px", background: "rgba(229, 231, 230, 0.2)"}}>
                <div className="MyBook">
                    <div className="Header" >
                        <div className="reducedHeader">
                            <div className="mainLogo">{MementoLogo}</div>
                        </div>
                    </div>
                    <div className="BookContainer" id = "captureBook" style = {{marginTop: '50px'}}>

                    </div>
                </div>
            </div>
        )
    }, []);

    let copyLink = () => {
        let clipboard = new ClipboardJS('.copyLink');

        clipboard.on('success', function(e) {
            alert('링크가 복사되었습니다.');
        })
    }

    let trackPos = (data: any) => {
        setBarPosition(data.x);
    }

    if(pid) return (
        <>
            <div ref = {answerLineRef} className = "answerLineRef PC"></div>
            {captureBook}
            <div className = "Background">
                <div className="MyBook">
                    <div className="Header" >
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
                        <div className="buttonContainer">
                            <button className="downloadPDF" onClick = {() => {
                                setDownloadStart(true);
                            }}>
                                <img src={imageUrl('ionicons.designerpack/download-outline.svg')} alt="" />
                                pdf 다운로드
                            </button>
                            <button className="copyLink" data-clipboard-text = {`mymemento.kr/mybook?pid=${pid}`} onClick = {() => {
                                copyLink();
                            }}>링크 복사</button>
                        </div>
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
                                        <div className="currentPageInfo" style={{transform: `translateX(${(currentPageNumber - 1)/(totalPageNumber - 1) * 414}px)`}} >
                                            <div className="currentPageDot" onDragStart = {() => alert("ASD")}></div>
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
            {downloadStart && <div className="downloadWindow">
                {!downloadIng ? <>
                    <div className="downloadPasswordInputContainer">
                        <div className="buttonContainer">
                            <button className="close" onClick = {() => setDownloadStart(false)}>{PlusVector}</button>
                        </div>
                        <div className="text">다운로드 비밀번호를 입력해주세요</div>
                        <input type="text" className="downloadPassword" value = {downloadPasswordInput} onChange={(e) => {
                            setDownloadPasswordInput(e.target.value);
                        }} />
                        <button className="submit" onClick = {() => {
                            if(Number.parseInt(downloadPasswordInput) === downloadPassword) {
                                setDownloadIng(true);
                                downloadPDF();
                            }
                            else {
                                alert("입력하신 비밀번호가 잘못되었습니다.")
                            }
                        }}>입력</button>
                    </div>
                </> :<div className="downloadInformationContainer">
                    <div className="text">다운로드 중입니다</div>
                    <div className="downloadBarContainer">
                        <div className="statusBar" style = {{width: `${downloadStatus * 392 / 100}px`}}></div>
                    </div>
                    <div className="downloadStatus">{downloadStatus}%</div>
                    {downloadStatus === 100 && <button className="confirm" onClick = {() => {
                        setDownloadStart(false);
                        setDownloadIng(false);
                    }}>돌아가기</button>}
                </div>}
            </div>}
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