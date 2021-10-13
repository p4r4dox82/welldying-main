import React from 'react';
import { getSections } from '../etc/api/section';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import MobileHeader from './MobileHeader';

function MobileNote() {
    let [allSectionsLoading, allSections] = usePromise(getSections);
    let [sectionNum, setSectionNum] = React.useState<number>(0);

    let sections = React.useMemo(() => {
        if(!allSectionsLoading) return <></>;
        else return (
            <div className="sections">
                <div className="sectionContainer">
                    <div className={"section" + (sectionNum === 0 ? ' select' : '')}>전체</div>
                    {allSections?.map((section, key) => {
                        return (
                            <div className={"section" + (sectionNum === key + 1 ? ' select' : '')}>{section.tag.split('#').slice(1).map((tag) => {
                                return (
                                    <span>{tag}</span>
                                )
                            })}</div>
                        )
                    })}
                </div>
            </div>
        )
    }, [allSections, sectionNum]);
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
                    {sections}
                </div>
            </div>
        </>
    )
}

export default MobileNote;