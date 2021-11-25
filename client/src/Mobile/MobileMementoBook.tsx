import React from 'react';
import { expandVector, FlowerVector, PlusVector } from '../img/Vectors';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileNavigation from '../MobileComponents/MobileNavigation';

function MobileMementoBook() {
    return (
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