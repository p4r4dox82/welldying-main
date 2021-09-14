import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents, Content } from '../etc/api/content';
import { getComments } from '../etc/api/comment';
import usePromise from '../etc/usePromise';
import { Link } from 'react-router-dom';

import { MementoNoteVector, MementoBookVector, MementoContentVector, MementoMakeBookVector, MementoTogetherNoteVector, LeftVector2, RightVector2, RightVector, LeftArrowVector, RightArrowVector, Colon, like_vector, MementoDotVector, leftVector, rightVector } from '../img/Vectors';
import { parseDate } from '../etc';

let content_type_eng = ['book', 'book', 'book'];
let content_name = ['어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구어쩌구 저쩌저쩌구어쩌구저쩌구어쩌구', 'ㅂㅈㄷ', 'ㅋㅌㅍ'];
let content_tag = ['1', '2', '3'];
let content_like = ['12', '3', '123'];
let content_detail = [`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`];
let memento_brand_text = `메멘토는 단순하고 쉬운 솔루션과 가이드를 통한, 유언 작성 및 전달 서비스를 제공하는 브랜드로
‘모든 사람이 죽음을 준비할 수 있는 사회와 문화’를 만들어 나갑니다.`;

function Maincontent() {
    let [, AllContents] = usePromise(getContents);
    let [, AllComments] = usePromise(getComments);
    let [total_content_number, settotal_content_number] = React.useState<number>(6);
    let [review_number, setreview_number] = React.useState<number>(1);
    let [total_review_number, settotal_review_number] = React.useState<number>(6);

    let [ContentCategory, setContentCategory] = React.useState<number>(0);

    interface MementoSection {
        name: string;
        vector: JSX.Element;
        detail: string;
    }

    let MementoSectionArray = React.useMemo(() => {
        let result: MementoSection[] = [];
        result.push({
            name: '메멘토 노트',
            vector: (MementoNoteVector),
            detail: '어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 ',
        });
        result.push({
            name: '유언 자서전',
            vector: (MementoBookVector),
            detail: '어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 ',
        });
        result.push({
            name: '함께쓰는 노트',
            vector: (MementoTogetherNoteVector),
            detail: '어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 ',
        });
        result.push({
            name: '유언 자서전 제작',
            vector: (MementoMakeBookVector),
            detail: '어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 어쩌구어쩌구 ',
        });
        return result;
    }, []);

    interface MementoContentCategory {
        name: string;
        detail: string;
        tag: string;
        contents: Content[];
    }

    let MementoContentCategoryArray = React.useMemo(() => {
        let result: MementoContentCategory[] = [];
        result.push({
            name: '후회 없을 우리의 시간.',
            detail: '메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ',
            tag: '# 기록  # 추억 # 자서전 # 죽음의 이해 # 심적준비 # 편지',
            contents: AllContents?.filter((content) => content.id < 10),
        });
        result.push({
            name: '삶의 마지막, 그 때.',
            detail: '메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ',
            tag: '# 기록  # 추억 # 자서전 # 죽음의 이해 # 심적준비 # 편지',
            contents: AllContents?.filter((content) => content.id < 10),
        });
        result.push({
            name: '죽음, 그 이후의 이야기.',
            detail: '메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ',
            tag: '# 기록  # 추억 # 자서전 # 죽음의 이해 # 심적준비 # 편지',
            contents: AllContents?.filter((content) => content.id < 10),
        });
        return result;
    }, [AllContents]);

    let [newContentNumber, setNewContentNumber] = React.useState<number>(0);
    let [popularContentNumber, setPopularContentNumber] = React.useState<number>(0);
    let ContentCategorySelected = React.useMemo(() => MementoContentCategoryArray[ContentCategory], [ContentCategory, MementoContentCategoryArray]);
    let newContents = React.useMemo(() => ContentCategorySelected.contents?.filter((content, key) => key < 6), [ContentCategorySelected]);
    let newContent = React.useMemo(() => {
        if(!newContents) return;
        return newContents[newContentNumber];
    }, [newContents, newContentNumber]);
    let PopularContents = React.useMemo(() => ContentCategorySelected.contents?.filter((content, key) => key < 10), [ContentCategorySelected]);
    let PopularContent = React.useMemo(() => {
        if(!PopularContents) return;
        return PopularContents[popularContentNumber];
    }, [newContents, popularContentNumber]);

    let MainComents = React.useMemo(() => AllComments?.filter((comment) => comment.id >= 62),[AllComments]);
    let [CommentNumber, setCommentNumber] = React.useState<number>(0);
    let Comment = React.useMemo(() => {
        if(!MainComents) return;
        return MainComents[CommentNumber];
    }, [MainComents, CommentNumber]);

    let NewContentLink = React.useRef<any>(null);
    let PopularContentLink = React.useRef<any>(null);
    let NewContentLinkClick = () => NewContentLink.current.click();
    let PopularContentLinkClick = () => PopularContentLink.current.click();
    
    let MementoContentCategoryElement = React.useMemo(() => {
        return (
            <>
                <Link to = {`/contentpage/${newContent?.id}`} ref = {NewContentLink} style = {{display: 'none'}}/>
                <Link to = {`/contentpage/${PopularContent?.id}`} ref = {PopularContentLink} style = {{display: 'none'}}/>
                <div className="MementoContentCategory" style = {{marginTop: '143px'}}>
                    <div className="title GB px16">메멘토 컨텐츠 카테고리</div>
                    <div className="CategoryContainer">
                        {MementoContentCategoryArray.map((MementoContentCategory, key) => {
                            return (
                                <div className="ContentCategoryContainer" onClick = {() => setContentCategory(key)}>
                                    <div className="image"></div>
                                    <div className="title GB px16 line20">{MementoContentCategory.name}</div>
                                    <div className="vector" style = {{opacity: (ContentCategory === key ? '1' : '0')}}></div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="detailContainer" style = {{width: '676px', marginLeft: 'calc(50% - 676px/2)', textAlign: 'center', marginTop: '88px'}}>
                        <div className="detail GB px16 line40 op8">{ContentCategorySelected.detail}</div>
                        <div className="tag NS px14 line30 op4" style = {{marginTop: '29px'}}>{ContentCategorySelected.tag}</div>
                    </div>
                    <div className="NewContentContainer">
                        <div className="titleContainer">
                            <div className="title GB px16 bold">{`'${ContentCategorySelected.name}' 신규 컨텐츠`}</div>
                            <div className="buttonContainer">
                                <button className="left Button" onClick = {() => {setNewContentNumber((newContentNumber - 1) === -1 ? 5 : (newContentNumber - 1));}}>{LeftArrowVector}</button>
                                <button className="right Button" onClick = {() => {setNewContentNumber((newContentNumber + 1)%6)}}>{RightArrowVector}</button>
                            </div>
                        </div>
                        <div className="contentContainer">
                            <img src = {imageUrl('content_slide.png')} alt="profile" className = 'thumbnail' onClick = {() => NewContentLinkClick()}/>
                            <div className = 'image_selector_container'>
                                {[...Array(total_content_number).keys()].map((i) => (
                                    <img className = {(newContentNumber === (i) ? 'selected' : 'notselected')}src = {imageUrl('content_selector.png')}  alt="profile"/>
                                ))}
                            </div>
                            <div className="CoverContainer">
                                {Colon}
                                <button className="likeContainer">
                                    {like_vector}
                                    <div className="text NS px12 bold">{newContent?.userdata.likes.length}</div>
                                </button>
                                <div className="type NS px18 line25 bold">{newContent?.type === '동영상' ? 'video' : 'book'}</div>
                                <div className="tag NS px14 op6 line15">{newContent?.tag}</div>
                                <div className="title NS px16 line25 bold" onClick = {() => NewContentLinkClick()}>{'[' + newContent?.type + ']' + newContent?.title}</div>
                            </div>
                        </div>
                    </div>
                    <div className="PopularContentContainer" style = {{marginTop: '106px', paddingBottom: '115px'}}>
                        <div className="titleContainer">
                            <div className="title GB px16 bold">{`'${ContentCategorySelected.name}' 인기 컨텐츠`}</div>
                        </div>
                        <div className="contentContainer" style = {{marginTop: '30px', transform: `translateX(${(-412 * popularContentNumber) + 'px'})`}}>
                            {PopularContents && PopularContents.map((content, key) => {
                                return (
                                    <div className="contentElement">
                                        <div className="vector" style = {{width: '100vw', height: '1px', background: 'rgba(39, 57, 47, 0.2)', position: 'absolute', top: '281px', left: 'calc(50% - 50vw)', zIndex: -1}}></div>
                                        <div className="imageContainer" style = {{marginRight: (popularContentNumber === key ? '0px' : '58px')}}>
                                            <img src = {imageUrl('content_slide.png')} alt="profile" className = 'thumbnail' style = {{opacity: (popularContentNumber === key ? '1' : '0.6')}} onClick = {() => PopularContentLinkClick()}/>
                                            <div className="vector" style = {{opacity: (popularContentNumber === key ? '1' : '0.1')}}></div>
                                            <div className="title NS px12 line15 bold op6" onClick = {() => PopularContentLinkClick()}>{content.title}</div>
                                        </div>
                                        {popularContentNumber === key && <div className="CoverContainer">           
                                            <div className="oneline GB px14 op6">컨텐츠 한줄</div>
                                            <div className="title GB px20 line35" onClick = {() => PopularContentLinkClick()}>{content?.title}</div>
                                            <div className="date GB px14 line15">{'컨텐츠 생성일 : ' + String(parseDate(new Date(Number(content?.date))))}</div>
                                            <div className="tag GB px14 op6 line15">{content?.tag}</div>
                                            <div className="vector" style = {{width: '100%', height: '1px', background: 'rgba(110, 118, 114, 0.4)', marginTop: '18px'}}></div>
                                            <div className="title NS px13 bold" onClick = {() => PopularContentLinkClick()}>{`컨텐츠 확인하러 가기>`}</div>
                                        </div>}
                                    </div>
                                );
                            })}
                            
                        </div>
                        <button className="left Button" onClick = {() => {setPopularContentNumber((popularContentNumber - 1) === -1 ? 0 : (popularContentNumber - 1));}}>{LeftArrowVector}</button>
                        <button className="right Button" onClick = {() => {setPopularContentNumber((popularContentNumber + 1)%9 === 0 ? 8 : (popularContentNumber + 1)%9)}}>{RightArrowVector}</button>
                    </div>
                </div>
            </>
        );
    }, [ContentCategory, MementoContentCategoryArray, newContentNumber, newContent, PopularContents, PopularContent]);

    let comment_content = React.useRef<any>(null);
    let LinkCommentContent = () => {comment_content.current.click()};

    let MainComment = React.useMemo(() => {
        if(!AllContents) return;
        let Content = AllContents?.find((content) => content.comments?.includes(Number(Comment?.id)));
        return (
            <>
                <Link to={`/contentpage/${Content?.id}`} style = {{display: 'none'}} ref = {comment_content}/>
                <div className="Comment">
                    <img src={imageUrl('MainCommentImage.png')} alt="" className="ComentImage" style = {{marginLeft: '-24px'}} />
                    <div className = 'comment_box'>
                        <div className = 'writer NS px13 bold line25'>
                        {Comment?.writer + ' 님'}
                        </div>
                        <textarea className = 'comment_area written NS px13 line25' placeholder = '메멘토에 댓글을 남겨보세요.' value = {Comment?.detail} disabled/>
                        <div className="bottomContainer">
                            <div className = 'date_container'>
                                <div className = 'date NS px12 bold op9'>{parseDate(new Date(Number(Comment?.date)))}</div>
                                <button className = 'declare_button  NS px12 bold op9' style = {{padding: '0px', background: 'rgba(0, 0, 0, 0)'}} onClick = {() => LinkCommentContent()}>{`컨텐츠 확인하기>`}</button>
                            </div>
                            <div className="like_container">
                                <button className="like_button">{like_vector}</button>
                                <div className = 'likes NS px13 bold line25'>
                                {Comment?.userdata.likes.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="topContainer">
                    <div className="selectorContainer">
                        {[...Array(6).keys()].map((i) => (
                            <div className={"dotvector" + (review_number === (i+1) ? '' : ' notselected')} >{MementoDotVector}</div>
                        ))}
                    </div>
                    <div className="contentTitle NS px12 op6 bold line15">{Content?.title.slice(0, 20) + ((Content?.title && Content?.title.length > 20) ? '...' : '')}</div>
                </div>
            </>
        );
    }, [Comment, AllContents,review_number])

    return (
        <div className='main_display'>
            <div className="block" style = {{height: '601px'}}>
                <img src={imageUrl('main_background.png')} alt="" className="background_main" style = {{width: '100vw', height: '601px', objectFit: 'none', position: 'absolute'}}/>
                <div className="background_main_blend" style = {{width: '100vw', height: '601px', mixBlendMode: 'soft-light', background: '#E6E5E2', position: 'absolute', top: '0px'}}></div>
                <div className="main_block margin_base">
                    <div className="main_text GB px30 line55">
                        <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>당신의 아름다운 이야기</div>를</div>
                        <div>소중하게 전달합니다</div>
                    </div>
                    <div className="subtext GB px14 line30">
                        메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하
                    </div>
                    <div className="more px12 line40 bold">{`메멘토 소개 바로가기>`}</div>
                    <div className="circle"></div>
                    <img src={imageUrl('main_block_image.svg')} alt="" className="mainBlockImage" />
                </div>
            </div>
            <div className="block">
                <div className="introContainer">
                    {LeftVector2}
                    <div className="introButtonContainer">
                        <div className="Element">
                            <div className="vector">{MementoNoteVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토는</div>
                        </div>
                        {RightVector}
                        <div className="Element">
                            <div className="vector">{MementoContentVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토 컨텐츠</div>
                        </div>
                        {RightVector}
                        <div className="Element">
                            <div className="vector">{MementoNoteVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토 노트</div>
                        </div>
                        {RightVector}
                        <div className="Element">
                            <div className="vector">{MementoBookVector}</div>
                            <div className = 'GB px15 line30 op3'>유언 자서전</div>
                        </div>
                        {RightVector}
                        <div className="Element">
                            <div className="vector">{MementoMakeBookVector}</div>
                            <div className = 'GB px15 line30 op3'>자서전 제작</div>
                        </div>
                    </div>
                    {RightVector2}
                </div>
                <div className="margin_base">
                    <div className="explain">
                        <div className="title GB px30">memento note</div>
                        <div className="subtitle GB px14">당신을 담아 보관하는 죽음에 대한 당신의 이야기</div>
                        <div className="detail GB px15 line40">메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는</div>
                        <div className="more"></div>
                        <div className="more px12 line40 bold">{`작성 페이지 바로가기>`}</div>
                    </div>
                    <div className="SectionContainer">
                        {MementoSectionArray.map((MementoSection) => {
                            return (
                                <div className="ElementContainer">
                                    <div className="vectorContainer">{MementoSection.vector}</div>
                                    <div className="title NS px14 line25 bold">{MementoSection.name}</div>
                                    <div className="detail NS px12 line25">{MementoSection.detail}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="background" style = {{width: '100%', height: '678px', position: 'absolute', top: '0px', background: 'rgba(210, 217, 215, 0.3)', boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.15)'}}></div>
                <div className="MainContent margin_base">
                    <div className="title GB px30" style = {{paddingTop: '130px'}}>memento contents</div>
                    <div className="subtitle GB px14" style = {{borderBottom: '1px solid rgba(110, 118, 114, 0.3)'}}>ㄷㅏㅇ신ㄴㅇㅡㅣ ㅇㅓㅉㅓㄱㅜ ㅈㅓㅉㅓㄱㅜ ㅁㅏㄴㅅ</div>
                    <div className="more NS px12 bold line15" style = {{marginTop: '14px', textAlign: 'right'}}>{`컨텐츠 페이지 바로가기>`}</div>
                    <div className="detail GB px16 line40 op7" style = {{width: '796px', marginTop: '33px'}}>메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ</div>
                    {MementoContentCategoryElement}
                </div>
            </div>
            <div className="block" style = {{minHeight: '521px'}}> 
                <div className="BackgroundContainer" style = {{opacity: '0.2', filter: 'drop-shadow(0px 3px 10px rgba(0, 0, 0, 0.1))'}}>
                    <img src={imageUrl('CommentMainBackground.png')} alt="" className="MainCommentBackground" style = {{position: 'absolute', top: '0px'}}/>
                    <div className="MainCommentBackgroundBlend" style = {{width: '100vw', height: '521px', position: 'absolute',top: '0px', background: 'rgba(253, 252, 252, 1)', mixBlendMode: 'multiply'}}></div>
                </div>
                <div className="CommentsContainer margin_base">
                    <div className="title GB px30" style = {{paddingTop: '85px'}}>memento comments</div>
                    <div className="subtitle GB px14 line15" style = {{borderBottom: '1px solid rgba(110, 118, 114, 0.3)'}}>메멘토 서비스 사용자분들이 남겨주신 이야기.</div>
                    {MainComment}
                    <button className = 'left_button' onClick = {() => {setreview_number((review_number - 1) === 0 ? total_review_number : (review_number - 1));}}>{LeftArrowVector}</button>
                    <button className = 'right_button' onClick = {() => {setreview_number((review_number + 1)%total_review_number === 0 ? total_review_number : (review_number + 1)%total_review_number); }} >{RightArrowVector}</button>
                </div>
            </div>
        </div>
    );
}

export default Maincontent;
