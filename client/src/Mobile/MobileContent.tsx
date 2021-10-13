import React from 'react';
import { match } from "react-router";
import { Link } from 'react-router-dom';
import { getCategorys } from '../etc/api/category';
import { getContents } from '../etc/api/content';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { LeftArrowVector, LeftVector2, RightArrowVector, RightVector2 } from '../img/Vectors';
import MobileContentbox from './MobileContentbox';
import MobileHeader from './MobileHeader';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function MobileContent({ match }: Props) {
    let id = React.useMemo(() => Number.parseInt(match.params.id), [match]); 
    let [, allContents] = usePromise(getContents);
    let [, allcategorys] = usePromise(getCategorys);
    let [categoryNum, setCategoryNum] = React.useState<number>(id);
    React.useEffect(() => {
        setCategoryNum(id);
    }, [id]);
    let category = React.useMemo(() => {
        return allcategorys?.find((category) => category.id === id);
    }, [id, allcategorys])
    let categoryContents = React.useMemo(() => {
        return allContents?.filter((content) => [2, 43, 23, 46].includes(content.id))
    }, [allContents]);
    return (
        <>
            <div className="Mobile">
                <MobileHeader />
                <div className="MobileContentMain">
                    <div className="Main">
                        <img src={imageUrl('Mobile/Background.png')} alt="" />
                        <div className="blend"></div>
                        <div className="title">
                            <div>죽음을 대면하고</div>
                            <div>나의 죽음에 답하는 공간</div>
                        </div>
                        <div className="subtitle">
                            메멘토 컨텐츠
                        </div>
                        <div className="buttonContainer">
                            <Link to = {`/content/${Math.max(id - 1, 1)}`}><div className="leftButton">{LeftVector2}</div></Link>
                            <Link to = {`/content/${Math.min(id + 1, 3)}`}><div className="rightButton">{RightVector2}</div></Link>
                        </div>
                        <div className="categories">
                            <div className="categoryContainer">
                                {allcategorys?.map((category, key) => {
                                    return (
                                        <div className={"category" + (categoryNum === key + 1 ? ' select' : '')}>{category.title}</div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="popularContents">
                        <div className="title">
                        {'‘'}{category?.title}{'’ 인기컨텐츠'}
                        </div>
                        <div className="contentsContainer">
                            {categoryContents?.map((content) => {
                                return (
                                    <MobileContentbox type = 'small' content = {content}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileContent;