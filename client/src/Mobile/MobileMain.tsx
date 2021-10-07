import React from 'react';
import { imageUrl } from '../etc/config';
import { halfColon, MainImageVector, MementoBookVector, MementoDotVector, MementoLogo, MementoMakeBookVector, MementoNoteVector, MementoTogetherNoteVector, toggleVector, UserImage } from '../img/Vectors';

function MobileMain() {
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

    let MementoSections = React.useMemo(() => {
        return (
            <div className="boxContainer" onTouchStart = {(e: any) => {setNoteTouchData({...NoteTouchData, initialX: e.touches ? e.touches[0].clientX: e.clientX , initialY: e.touches ? e.touches[0].clientY: e.clientY })}} onTouchMove = {(e: any) => {
                dragDirection(e);
            }} style = {{transform: `translateX(${251 * NoteTouchData.LRdir + 'px'})`, transition: 'all 0.5s ease-in-out'}}>
                {MementoSectionArray.map((MementoSection) => {
                    return (
                        <div className="boxElement">
                            <div className="vectorContainer">{MementoSection.vector}</div>
                            <div className="title">{MementoSection.name}</div>
                            <div className="detail">{MementoSection.detail}</div>
                        </div>
                    )
                })}
            </div>
        )
    }, [NoteTouchData, NoteTouchDir, update]);

    return (
        <>
            <div className="MobileMain">
                <div className="ToolBar">
                    <div className="userimage">{UserImage}</div>
                    <div className="MementoLogo">{MementoLogo}</div>
                    <div className="toggle">{toggleVector}</div>
                </div>
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
                        <h3 className="more">{'작성 페이지 바로가기>'}</h3>
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
                        <h3 className="more">{'컨텐츠 페이지 바로가기>'}</h3>
                    </div>
                    <div className="dotContainer">
                        <div>{MementoDotVector}</div>
                        <div>{MementoDotVector}</div>
                        <div>{MementoDotVector}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileMain;