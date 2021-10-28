import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import React from 'react';
import { match } from "react-router";
import { Link } from 'react-router-dom';
import { getCategorys } from '../etc/api/category';
import { getContents } from '../etc/api/content';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { Colon, LeftArrowVector, leftVector, LeftVector2, RightArrowVector, RightVector2 } from '../img/Vectors';
import MobileContentbox from '../MobileComponents/MobileContentbox';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileNavigation from '../MobileComponents/MobileNavigation';

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
    let [contentsNum, setContentsNum] = React.useState<number>(4);
    React.useEffect(() => {
        setCategoryNum(id);
    }, [id]);
    let category = React.useMemo(() => {
        return allcategorys?.find((category) => category.id === id);
    }, [id, allcategorys])
    let categoryPopularContentIds = React.useMemo(() => {
        let result = [];
        result.push([2, 42, 23, 46]);
        result.push([20, 35, 48, 18]);
        result.push([37, 42, 22, 50]);
        return result;
    }, []);
    let categoryContents = React.useMemo(() => {
        return allContents?.filter((content) => categoryPopularContentIds[categoryNum - 1].includes(content.id));
    }, [allContents, categoryNum]);
    let categoryAllContents = React.useMemo(() => {
        return allContents?.filter((content) => content.category.includes(categoryNum));
    }, [allContents, categoryNum]);
    let categoryRef = React.useRef<any>(null);
    let popularContentsRef = React.useRef<any>(null);
    React.useEffect(() => {
        switch(categoryNum) {
            case 1:
                categoryRef.current?.scrollTo(0, 0);
                break;
            case 2:
                categoryRef.current.scrollTo(100, 0);
                break;
            case 3:
                categoryRef.current.scrollTo(250, 0);
                break;
        }
    }, [categoryNum]);
    let clearVariable = () => {
        setContentsNum(4);
        popularContentsRef.current.scrollTo(0, 0);
    }
    return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/content/1'}/>
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
                            <Link to = {`/content/${Math.max(id - 1, 1)}`} onClick = {() => clearVariable()}><div className="leftButton">{LeftVector2}</div></Link>
                            <Link to = {`/content/${Math.min(id + 1, 3)}`} onClick = {() => clearVariable()}><div className="rightButton">{RightVector2}</div></Link>
                        </div>
                        <div className="categories" ref = {categoryRef} style = {{transition : 'all 0.5s ease-in-out'}}>
                            <div className="categoryContainer" >
                                {allcategorys?.map((category, key) => {
                                    return (
                                        <Link to = {`/content/${key + 1}`} onClick = {() => {
                                            clearVariable();
                                        }}><div className={"category" + (categoryNum === key + 1 ? ' select' : '')}>{category.title}</div></Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="popularContents">
                        <div className="title">
                        {'‘'}{category?.title}{'’ 인기컨텐츠'}
                        </div>
                        <div className="contentsContainer"  ref = {popularContentsRef}>
                            {categoryContents?.map((content) => {
                                return (
                                    <MobileContentbox type = 'small' content = {content}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className="ContentMainInfo">
                        <div className="textContainer">
                            <span className="Colon">{Colon}</span>
                            <span className = 'text'>
                                <div>당신이 나아갈 삶의 이야기.</div>
                                <div>당신은 남은 시간동안 </div>
                                <div>어떤 일을 계획하고 있나요?</div>
                            </span>
                        </div>
                        <div className="tags">
                            {category?.tag}
                        </div>
                    </div>
                    <div className="moreContents">
                        <div className="title">
                            메멘토 인기 컨텐츠
                        </div>
                        <div className="contentsContainer">
                            {categoryAllContents?.slice(0, contentsNum).map((content) => {
                                return (
                                    <MobileContentbox type = 'big' content = {content}/>
                                )
                            })}
                        </div>
                        {contentsNum < categoryAllContents?.length && <div className="more" onClick = {() => setContentsNum(contentsNum + 4)}>
                            <div>더보기</div>
                            <div className = "vector">{LeftArrowVector}</div>
                        </div>}
                    </div>
                </div>
                <MobileNavigation />
            </div>
        </>
    )
}

export default MobileContent;