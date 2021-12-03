import React from 'react';
import { Link } from 'react-router-dom';
import { MementoBookVector, MementoContentVector, MementoMainVector, MementoNoteVector } from '../img/Vectors';

function MobileNavigation() {
    return (
        <>
            <div className="padding" style = {{paddingTop: '83px'}}></div>
            <div className="Navigation">
                <div className="introButtonContainer">
                    <div className="Element" onClick = {() => window.open('https://www.notion.so/Team-Memento-480ba51aeb3a43f6ad18d19a05bba5ad', '_blank')}>
                        <div className={"vector"} style = {{top: '3px'}}>{MementoMainVector}</div>
                        <div className = "text">메멘토는</div>
                    </div>
                    <div className="bar"></div>
                    <Link to = '/content/1'><div className="Element">
                        <div className={"vector"}>{MementoContentVector}</div>
                        <div className = "text">메멘토 컨텐츠</div>
                    </div></Link>
                    <div className="bar"></div>
                    <Link to = '/note'><div className="Element">
                        <div className={"vector"}>{MementoNoteVector}</div>
                        <div className = "text">메멘토 노트</div>
                    </div></Link>
                    <div className="bar"></div>
                    <div className="Element" onClick = {() => alert('모바일 메멘토 북 서비스가 준비중입니다. PC크롬을 이용하여 접속해주십시오.')}>
                        <div className={"vector"}>{MementoBookVector}</div>
                        <div className = "text">메멘토 북</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileNavigation;