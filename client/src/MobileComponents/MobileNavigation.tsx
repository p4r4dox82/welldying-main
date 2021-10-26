import React from 'react';
import { Link } from 'react-router-dom';
import { MementoBookVector, MementoContentVector, MementoMainVector, MementoNoteVector, RightVector } from '../img/Vectors';

function MobileNavigation() {
    return (
        <>
            <div className="padding" style = {{paddingTop: '83px'}}></div>
            <div className="Navigation">
                <div className="introButtonContainer">
                    <div className="Element">
                        <div className={"vector"} style = {{top: '3px'}}>{MementoMainVector}</div>
                        <div className = "text">메멘토는</div>
                    </div>
                    <div className="bar"></div>
                    <Link to = '/test/content/1'><div className="Element">
                        <div className={"vector"}>{MementoContentVector}</div>
                        <div className = "text">메멘토 컨텐츠</div>
                    </div></Link>
                    <div className="bar"></div>
                    <Link to = '/test/note'><div className="Element">
                        <div className={"vector"}>{MementoNoteVector}</div>
                        <div className = "text">메멘토 노트</div>
                    </div></Link>
                    <div className="bar"></div>
                    <div className="Element">
                        <div className={"vector"}>{MementoBookVector}</div>
                        <div className = "text">메멘토 북</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileNavigation;