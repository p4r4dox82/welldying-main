import React from 'react';
import { MementoLogo, menuVector, noticeVector, searchVector } from '../../img/Vectors';

function CommunityHeader() {
    return (
        <>
            <div className="CommunityHeader">
                <div className="border"></div>
                <div className="mementoLogo">{MementoLogo}</div>
                <div className="menuContainer">
                    <div className="notice">{noticeVector}</div>
                    <div className="search">{searchVector}</div>
                    <div className="menu">{menuVector}</div>
                </div>
            </div>
        </>
    )
}

export default CommunityHeader;