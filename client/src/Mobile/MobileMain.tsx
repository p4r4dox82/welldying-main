import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getContents } from '../etc/api/content';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { Colon, halfColon, LeftArrowVector, leftVector, LeftVector2, leftVectorMobile, MainImageVector, MementoBookVector, MementoDotVector, MementoLogo, MementoMakeBookVector, MementoNoteVector, MementoTogetherNoteVector, RightArrowVector, rightVector, RightVector2, rightVectorMobile, toggleVector, UserImage } from '../img/Vectors';
import MobileNavigation from '../MobileComponents/MobileNavigation';
import { RootReducer } from '../store';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileFooter from '../MobileComponents/MobileFooter';

function MobileMain() {
    let user = useSelector((state: RootReducer) => state.user);
    let  MementoSectionArray = React.useMemo(() => {
        let result= [];
        result.push({
            name: '메멘토 노트',
            vector: (MementoNoteVector),
            detail: '메멘토가 제시하는 질문에 대한 나의 생각을 정리할 수 있는 프라이빗한 공간입니다.',
        });
        result.push({
            name: '메멘토 북',
            vector: (MementoBookVector),
            detail: '메멘토 노트에 적은 답변을 온라인 책 형태로 엮어 소중한 이들에게 전달하는 공간입니다. ',
        });
        result.push({
            name: '함께쓰는 노트',
            vector: (MementoTogetherNoteVector),
            detail: '생의 마지막까지 함께하고픈 이들과 함꼐 질문에 대해 답하고, 추억을 기록하는 공간입니다.  ',
        });
        result.push({
            name: '유언 자서전 제작',
            vector: (MementoMakeBookVector),
            detail: '온라인으로 제작한 유언 자서전을 오프라인 형태로 받아보실 수 있는 프리미엄 서비스입니다. ',  
        });
        return result;
    }, []);

    interface touchData {
        initialX: number;
        initialY: number;
        LRdir: number;
        UDdir: number;
    }

    let [NoteTouchData, setNoteTouchData] = React.useState<touchData>({ initialX: 0, initialY: 0, LRdir: 0, UDdir: 0 });
    let [NoteTouchDir, setNoteTouchDir] = React.useState<number>(0);
    let [update, setUpdate] = React.useState<number>(0);

    let dragDirection = (e:any) => {
        if(NoteTouchData.initialX !== 0 && NoteTouchData.initialY !== 0) {
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const currentY = e.touches ? e.touches[0].clientY : e.clientY;

            let diffX = NoteTouchData.initialX - currentX;
            let diffY = NoteTouchData.initialY - currentY;
            setNoteTouchData({initialX: 0, initialY: 0 , LRdir: (diffX > diffY && diffX > 0) ? Math.max(NoteTouchData.LRdir - 1, -3) : Math.min(NoteTouchData.LRdir + 1, 0), UDdir: (diffY > diffX && diffY > 0) ? Math.max(NoteTouchData.UDdir - 1, -3) : Math.min(NoteTouchData.UDdir + 1, 0)});
        }
    }
    let noteLink = React.useRef<any>(null);
    let noteLinkClick = () => noteLink.current.click();
    let MementoSections = React.useMemo(() => {
        return (
            <>
            <Link to = '/test/note' ref = {noteLink} style = {{display: 'none'}}></Link>
            <div className="boxContainer" onTouchStart = {(e: any) => {setNoteTouchData({...NoteTouchData, initialX: e.touches ? e.touches[0].clientX: e.clientX , initialY: e.touches ? e.touches[0].clientY: e.clientY })}} onTouchMove = {(e: any) => {
                dragDirection(e);
            }} style = {{transform: `translateX(${251 * NoteTouchData.LRdir + 'px'})`, transition: 'all 0.5s ease-in-out'}}>
                {MementoSectionArray.map((MementoSection, key) => {
                    return (
                        <div className="boxElement" onClick = {key === 0 ? () => noteLinkClick() : () => {}}>
                            <div className="vectorContainer">{MementoSection.vector}</div>
                            <div className="title">{MementoSection.name}</div>
                            <div className="detail">{MementoSection.detail}</div>
                        </div>
                    )
                })}
            </div>
            </>
        )
    }, [NoteTouchData, NoteTouchDir, update]);

    //Content Variable
    let [ContentSection, setContentSection] = React.useState<number>(0);
    let [contentNumber, setContentNumber] = React.useState<number>(0);
    let [, AllContents] = usePromise(getContents);
    let MementoContentSection = React.useMemo(() => {
        let result = [];
        result.push({
            name: '후회 없을 우리의 시간.',
            image: 'contentImage1.png',
            detail: `지난 삶을 돌아보며
            추억의 순간들을 정리하고,
            앞으로의 남은 삶에 대한 
            계획을 세우는 시간입니다.`,
            tag: `#기록 #추억 #자서전 #계획 
            #버킷리스트 #편지`,
            newcontents: AllContents?.filter((content) => [2, 43, 23, 46].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(1)),
        });
        result.push({
            name: '삶의 마지막, 그 때.',
            image: 'contentImage2.png',
            detail: `삶의 마지막 순간이 임박했을 때
            꼭 해야 하는 선택들에 
            대해 고민하는 시간입니다.`,
            tag: `#자기결정권 #치료 #장례 #법 
            #유산 #신탁 #죽음의 이해`,
            newcontents: AllContents?.filter((content) => [20, 35, 48, 18].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(2)),
        });
        result.push({
            name: '죽음, 그 이후의 이야기.',
            image: 'contentImage3.png',
            detail: `물리적인 죽음을 넘어섰을 때
            일어나는 일들에 대한 
            사색의 시간입니다.`,
            tag: `#사별 #애도 #심적준비
             #편지 #반려동물`,
            newcontents: AllContents?.filter((content) => [37, 42, 22, 50].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(3)),
        });

        return result;
    }, [AllContents]);

    

    return (
        <>
            <div className="Mobile">
            <div className="MobileMain">
                <MobileHeader />
                <div className="MainInfo">
                    <img src={imageUrl('main_background.png')} alt="" className="background" />
                    <div className="dotContainer">
                        {[...Array(5).keys()].map((key) => {
                            return (
                                <div className="dot">{MementoDotVector}</div>
                            )
                        })}
                    </div>
                    <div className="imageContainer">
                        <div className="circle"></div>
                        <img src={imageUrl('MainImage1.png')} alt="" className="mainImage" />
                        <div className="imagevector">{MainImageVector}</div>
                    </div>
                    <div className="textContainer">
                        <div className="title">
                            <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', display: 'inline-block'}}>당신의 아름다운 이야기</div>를</div>
                            <div>소중하게 전달합니다</div>
                        </div>
                        <div className="more">{'브랜드 소개 바로가기>'}</div>
                    </div>
                </div>
                <div className="MementoNoteInfo">
                    <div className="textContainer">
                        <h1 className="title">나의 서재</h1>
                        <h2 className="subtitle">인생을 담은 당신만의 공간</h2>
                        <Link to = '/test/note/0'><h3 className="more">{'작성 페이지 바로가기>'}</h3></Link>
                    </div>
                    <div className="vector"></div>
                    <div className="textContainer">
                        <p className="detail">
                            <div>‘메멘토 노트’를 통해 </div>
                            <div>인생이 담긴 유언을 기록하고, </div>
                            <div>이를 바탕으로 ‘메멘토 북’을 제작해 </div>
                            <div>전달하는 공간입니다. </div>
                        </p>
                    </div>
                    {MementoSections}
                </div>
                <div className="MementoContentInfo">
                    <div className="textContainer">
                        <h1 className="title">메멘토 컨텐츠</h1>
                        <h2 className="subtitle">삶과 죽음에 대해 생각하는 시간</h2>
                        <Link to = '/test/content/1'><h3 className="more">{'컨텐츠 페이지 바로가기>'}</h3></Link>
                    </div>
                    <div className="dotContainer">
                        <div className = {ContentSection === 0 ? 'select' : ''}>{MementoDotVector}</div>
                        <div className = {ContentSection === 1 ? 'select' : ''}>{MementoDotVector}</div>
                        <div className = {ContentSection === 2 ? 'select' : ''}>{MementoDotVector}</div>
                    </div>
                    <div className="imageContainer">
                        <div className="leftButton" onClick = {() => {
                            setContentSection(ContentSection === 0 ? 2 : (ContentSection - 1)%3);
                            setContentNumber(0);
                        }}>{leftVectorMobile}</div>
                        <div className="image">
                            <img src={imageUrl(`ContentPage/`+MementoContentSection[ContentSection].image)} alt="" />
                        </div>
                        <div className="rightButton" onClick = {() => {
                            setContentSection((ContentSection + 1)%3);
                            setContentNumber(0);
                        }}>{rightVectorMobile}</div>
                    </div>
                    <div className="titleContainer">
                        <div className="tag">
                            <div>{MementoContentSection[ContentSection].tag.split('\n')[0]}</div>
                            <div>{MementoContentSection[ContentSection].tag.split('\n')[1]}</div>
                        </div>
                        <div className="title">{MementoContentSection[ContentSection].name}</div>
                        <div className="vector"></div>
                    </div>
                </div>
                <div className="MementoContentDetail">
                    <div className="textContainer">
                        <div className="Colon">{Colon}</div>
                        <div className="detail">{MementoContentSection[ContentSection].detail.split('\n').map((detail) => {
                            return (
                                <div>{detail}</div>
                            )
                        })}</div>
                    </div>
                    <div className="ContentContainer">
                        <div className="titleContainer">
                            <div className="leftButton" onClick = {() => setContentNumber(contentNumber === 0 ? 3 : contentNumber - 1)}>{LeftVector2}</div>
                            <div className="title">{'‘'}{MementoContentSection[ContentSection].name}{'’  인기 컨텐츠'}</div>
                            <div className="rightButton" onClick = {() => setContentNumber((contentNumber + 1)%4)}>{RightVector2}</div>
                        </div>
                        <div className="ContentsCover">
                            <div className="Contents" style = {{transition: 'all 0.5s ease-in-out', left: `${(-350 * contentNumber) + 'px'}`}}>
                                {MementoContentSection[ContentSection].newcontents?.map((content_) => {
                                    let content = AllContents.find((content) => content.id === content_.id);
                                    if(!content) return <></>;
                                    else return (
                                        <Link to = {`/test/contentpage/${content.id}`}><div className="ContentElement">
                                            <div className="image">
                                                <img src={content.imageData.imageUrl} alt="" className="thumbnail" />
                                                {content.userdata.read.includes(String(user.user?.username)) && <div className="read"></div>}
                                            </div>
                                            <div className="title">{content.title}</div>
                                        </div></Link>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="vectorContainer">
                            <div className="line"></div>
                            <div className="vector"></div>
                        </div>
                    </div>
                </div>
                {false && <div className="MementoMore">메멘토에 문의하기</div>}
                <MobileFooter />
            </div>
            <MobileNavigation />
            </div>
        </>
    )
}

export default MobileMain;