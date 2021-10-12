import React from 'react';
import { getSections } from '../etc/api/section';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import MobileHeader from './MobileHeader';

function MobileNote() {
    let [, sections] = usePromise(getSections);
    return (
        <>
            <div className="Mobile">
                <MobileHeader />
                <div className="MobileNote">
                    <div className="Main">
                        <img src={imageUrl('Mobile/Background.png')} alt="" />
                        <div className="blend"></div>
                        <div className="title">
                            <div>나의 생각과 이야기를</div>
                            <div>남겨두는 공간</div>
                        </div>
                        <div className="subtitle">
                            메멘토 노트
                        </div>
                    </div>
                    <div className="sections">
                        <div className="sectionContainer">
                            <div className="section">전체</div>
                            {sections?.map((section) => {
                                return (
                                    <div className="section">{section.tag.split('#').slice(1).map((tag) => {
                                        return (
                                            <span>{tag}</span>
                                        )
                                    })}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileNote;