import React from 'react';
import ReactPlayer from 'react-player';
import { imageUrl } from '../etc/config';
import { FlowerVector, leftVector, MementoLogo, rightVector } from '../img/Vectors'; 
import queryString from 'query-string';
import usePromise from '../etc/usePromise';
import { getYouthTestament } from '../etc/api/youthTestament';
import { kakaoJskey } from '../etc/config';

interface Props {
    location: Location
}

interface ITitle {
    page: number,
    week: number,
    weekTitle: string,
    subTitle: string
}

declare global {
    interface Window {
      Kakao: any;
    }
}

const { Kakao } = window;

function YouthTestament({ location }: Props) {
    const query = queryString.parse(location.search);
    const pid = Number.parseInt(String(query.pid));
    let [, YouthTestamentData] = usePromise(() => getYouthTestament(pid));
    console.log(YouthTestamentData);
    let [bookPage, setBookPage] = React.useState<number>(0);
    let [maxBookPage, setMaxBookPage] = React.useState<number>(0);
    let [weekList, setWeekList] = React.useState<number[]>([]);
    let weekTitleList = ["1주차 : 내가 걸어온 길", "2주차 : 언젠가 마주할 그 순간", "3주차 : 내가 걸어갈 길"];
    let titleList: ITitle[] = [
        {
            page: 1,
            week: 1,
            weekTitle: weekTitleList[0],
            subTitle: "나의 인생그래프"
        },
        {
            page: 1,
            week: 1,
            weekTitle: weekTitleList[0],
            subTitle: "인생그래프 설명"
        },
        {
            page: 2,
            week: 2,
            weekTitle: weekTitleList[1],
            subTitle: "나의 묘비명"
        },
        {
            page: 2,
            week: 2,
            weekTitle: weekTitleList[1],
            subTitle: "소중한 사람에게 남기는 편지"
        },
        {
            page: 3,
            week: 3,
            weekTitle: weekTitleList[2],
            subTitle: "나의 버킷리스트"
        },
        {
            page: 3,
            week: 3,
            weekTitle: weekTitleList[2],
            subTitle: "미래의 나에게 남기는 편지"
        }
    ]

    React.useEffect(() => {
        if(YouthTestamentData) {
            let _weekList = [];
            let _maxBookPage = 0;
            if(YouthTestamentData.week1.length > 1) {
                _maxBookPage++;
                _weekList.push(1);
            }
            if(YouthTestamentData.week2.length > 1) {
                _maxBookPage++;
                _weekList.push(2);
            }
            if(YouthTestamentData.week3.length > 1) {
                _maxBookPage++;
                _weekList.push(3);
            }
            setMaxBookPage(_maxBookPage);
            setWeekList(_weekList);
        }
    }, [YouthTestamentData])

    React.useEffect(() => {
        if(!Kakao.isInitialized())
          Kakao.init(kakaoJskey);
    }, []);

    let kakaoShare = () => {
        Kakao.Link.createDefaultButton({
          container: '#kakao-link_btn',
          objectType: 'feed',
          content: {
            title: `${YouthTestamentData.name}님이 작성하신 청춘유언이 도착했습니다. 아래 버튼을 눌러 열람해주세요:)`,
            description: ``,
            imageUrl:
              imageUrl("NotePage/BookCoverImage.png"),
            link: {
              mobileWebUrl: `https://mymemento.kr/youthTestament?pid=${pid}`,
              webUrl: `https://mymemento.kr/youthTestament?pid=${pid}`,
            },
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: `https://mymemento.kr/youthTestament?pid=${pid}`,
                webUrl: `https://mymemento.kr/youthTestament?pid=${pid}`,
              },
            },
          ],
        });
      }

    let Header = () => {
        return (
            <>
                <div className="Header">
                    <button className='Logo' onClick={() => setBookPage(0)}>{MementoLogo}</button>
                </div>
            </>
        )
    }
    
    let BookCover = () => {
        let clickEnterButton = () => {
            setBookPage(1);
        }
        if(!YouthTestamentData) {
            return (
                <>
                </>
            )
        } else {
            return (
                <>
                    <div className="BookCover">
                        <div className="Background">
                            <img src={imageUrl("NotePage/BookCoverImage.png")} alt="" />
                        </div>
                        <div className="BookCoverContainer">
                            <div className="title">{YouthTestamentData.name}님의 <br/><br/>청춘유언</div>
                            <button className="enter" onClick = {() => setBookPage(1)}>보러가기</button>
                        </div>
                    </div>
                </>
            )
        }
    }

    let WeekContent = React.useCallback((week: number) => {
        let weekContent;
        if(week == 1) {
            weekContent = YouthTestamentData.week1;
        }
        if(week == 2) {
            weekContent = YouthTestamentData.week2;
        }
        if(week == 3) {
            weekContent = YouthTestamentData.week3;
        }
        return (
            <>  
                {weekContent?.map((content, key) => {
                    if(key !== 0) {
                        let contentCode;
                        if(content.includes(".jpg")) {
                            contentCode = <img src = {imageUrl(`YouthTestament/${content}`)} alt = ""/>
                        }
                        if(content.includes("youtube")) {
                            contentCode = <ReactPlayer width = {"100%"} height = {'200px'} url = {content} controls></ReactPlayer>
                        }
                        return (
                            <div className="weekContentElement">
                                {contentCode}
                            </div>
                        )
                    }
                })}
            </>
        )
    }, [YouthTestamentData]);
    
    let BookContent = () => {
        if(!YouthTestamentData) {
            return (
                <>
                </>
            )
        }
        let bookPageDown = () => {
            setBookPage(Math.max(bookPage - 1, 1));
        }
        let bookPageUp = ()  => {
            setBookPage(Math.min(bookPage + 1, maxBookPage));
        }
        
        return (
            <>
                <div className="BookContent">
                    <div className="titleBlock">
                        <div className="borderBox"></div>
                        <div className="title">{'[ 청춘유언 ]'}</div>
                        <div className="subtitle">{': 당신의 아름다운 순간을 책에 담다. '}</div>
                        <div className="flowerImage">{FlowerVector}</div>
                    </div>
                    <div className="pageBlock">
                        <div className="weekTitle">
                            <div style = {{ "display": "inline" }}>{weekTitleList[weekList[bookPage - 1] - 1]}</div>
                            <img style = {{ "width": "30px", "height": "30px" }} alt = "" id = 'kakao-link_btn' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick = {() => kakaoShare()} />
                        </div>
                        <div className="border"></div>
                        <div className="imageContainer">
                            {WeekContent(weekList[bookPage - 1])}
                        </div>
                    </div>
                    <div className="buttonBlock">
                        {bookPage !== 1 ? <button className="prevPage" onClick = {bookPageDown}>{leftVector}</button> : 
                        <button className="prevPage transparent"></button>}
                        <div className="pageDisplay">{bookPage + " / " + maxBookPage}</div>
                        {bookPage !== maxBookPage ? <button className="nextPage" onClick = {bookPageUp}>{rightVector}</button> :
                        <button className="nextPage transparent"></button>}
                        
                    </div>
                </div>
            </>
        )
    }
    
    return (
        <>
            <div className="YouthTestament">
                <Header></Header>
                {bookPage === 0 ? 
                <BookCover></BookCover> :
                <BookContent></BookContent>}
            </div>
        </>
    )
}

export default YouthTestament;