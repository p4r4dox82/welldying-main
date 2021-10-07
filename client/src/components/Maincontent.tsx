import React from 'react';
import { imageUrl } from '../etc/config';
import { getContents, Content, content_userdata } from '../etc/api/content';
import { getComments } from '../etc/api/comment';
import usePromise from '../etc/usePromise';
import { Link } from 'react-router-dom';

import { MementoMainVector, MementoNoteVector, MementoBookVector, MementoContentVector, MementoMakeBookVector, MementoTogetherNoteVector, LeftVector2, RightVector2, RightVector, LeftArrowVector, RightArrowVector, Colon, like_vector, MementoDotVector, leftVector, rightVector } from '../img/Vectors';
import { parseDate } from '../etc';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';

function Maincontent() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, AllContents] = usePromise(getContents);
    let [, AllComments] = usePromise(getComments);
    let [review_number, setreview_number] = React.useState<number>(1);
    let [total_review_number, settotal_review_number] = React.useState<number>(6);
    let [userdata, setUserdata] = React.useState<{ likes: string[], bookmark: string[], read: string[] }>({ likes: [], bookmark: [], read: [] });
    let [liked, setLiked] = React.useState<boolean>(false);

    let [ContentCategory, setContentCategory] = React.useState<number>(0);

    interface MementoSection {
        name: string;
        vector: JSX.Element;
        detail: string;
    }

    let  MementoSectionArray = React.useMemo(() => {
        let result: MementoSection[] = [];
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

    interface MementoContentCategory {
        name: string;
        image: string;
        detail: string;
        tag: string;
        newcontents: Content[];
        allcontents: Content[];
    }

    let MementoContentCategoryArray = React.useMemo(() => {
        let result: MementoContentCategory[] = [];
        result.push({
            name: '후회 없을 우리의 시간.',
            image: 'Content1Image.png',
            detail: '지난 삶을 돌아보며 추억의 순간들을 정리하고, 앞으로의 남은 삶에 대한 계획을 세우는 시간입니다. 삶의 의미와 가치관, 희로애락의 시간, 소중한 사람들에게 보내는 메세지, 삶의 계획, 버킷리스트 등에 대한 컨텐츠로 구성되어 있습니다.',
            tag: '#기록 #추억 #자서전 #계획 #버킷리스트 #편지',
            newcontents: AllContents?.filter((content) => [2, 45, 23, 46].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(1)),
        });
        result.push({
            name: '삶의 마지막, 그 때.',
            image: 'Content2Image.png',
            detail: '삶의 마지막 순간이 임박했을 때 꼭 해야 하는 선택들에 대해 고민하는 시간입니다. 죽음에 대한 철학적 이해, 호스피스&완화의료, 장례식&유언장, 장기기증 등에 대한 실질적인 의사결정과 마주하며 죽음을 포괄적으로 준비할 수 있는 컨텐츠로 구성되어 있습니다.',
            tag: '#자기결정권 #치료 #장례 #법 #유산 #신탁 #죽음의 이해',
            newcontents: AllContents?.filter((content) => [20, 35, 48, 18].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(2)),
        });
        result.push({
            name: '죽음, 그 이후의 이야기.',
            image: 'Content3Image.png',
            detail: '물리적인 죽음을 넘어섰을 때 일어나는 일들에 대한 사색의 시간입니다. 사별에 대한 대처, 애도의 방식, 유품 정리, 심적 준비, 종교관, 펫로스 등에 대한 컨텐츠로 구성되어 있습니다.',
            tag: '#사별 #애도 #심적준비 #편지 #반려동물',
            newcontents: AllContents?.filter((content) => [37, 42, 22, 50].includes(content.id)),
            allcontents: AllContents?.filter((content) => content.category.includes(3)),
        });
        return result;
    }, [AllContents]);

    let [newContentNumber, setNewContentNumber] = React.useState<number>(0);
    let [popularContentNumber, setPopularContentNumber] = React.useState<number>(0);
    React.useEffect(() => {
        setNewContentNumber(0);
        setPopularContentNumber(0);
    }, [ContentCategory]);
    let ContentCategorySelected = React.useMemo(() => MementoContentCategoryArray[ContentCategory], [ContentCategory, MementoContentCategoryArray]);
    let newContents = React.useMemo(() => ContentCategorySelected.newcontents?.filter((content, key) => key < 4), [ContentCategorySelected]);
    let newContent = React.useMemo(() => {
        if(!newContents) return;
        return newContents[newContentNumber];
    }, [newContents, newContentNumber]);

    React.useEffect(() => {
        if(!newContent) return;
        setUserdata(newContent.userdata);
        if(user.loggedIn) {
            setLiked(newContent?.userdata.likes.find((username) => (username === user.user!.username)) ? true : false );
          } else {
            setLiked(false);
          }
    }, [newContent]);

    let PopularContents = React.useMemo(() => ContentCategorySelected.allcontents?.filter((content, key) => key < 9), [ContentCategorySelected]);
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
                                    <div className="image" style = {{cursor: 'pointer'}}><img src={imageUrl(`ContentPage/${MementoContentCategory.image}`)} alt="" className="" style = {{opacity: (ContentCategory === key ? '1' : '0.5')}}/></div>
                                    <div className="title GB px16 line20" style = {{cursor: 'pointer'}}>{MementoContentCategory.name}</div>
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
                                <button className="left Button" onClick = {() => {setNewContentNumber((newContentNumber - 1) === -1 ? 3 : (newContentNumber - 1));}}>{LeftArrowVector}</button>
                                <button className="right Button" onClick = {() => {setNewContentNumber((newContentNumber + 1)%4)}}>{RightArrowVector}</button>
                            </div>
                        </div>
                        <div className="contentContainer">
                            <img src = {((newContent?.imageData && newContent?.imageData.imageUrl) ? newContent?.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} alt="profile" className = 'thumbnail' style = {{width: '708px', height: '296px', objectFit: 'cover', cursor: 'pointer'}} onClick = {() => NewContentLinkClick()}/>
                            <div className = 'image_selector_container'>
                                {[...Array(4).keys()].map((i) => (
                                    <img className = {(newContentNumber === (i) ? 'selected' : 'notselected')}src = {imageUrl('content_selector.png')}  alt="profile"/>
                                ))}
                            </div>
                            <div className="CoverContainer">
                                {Colon}
                                <button className={"likeContainer" + (liked ? ' liked' : '')} onClick = {user.loggedIn ? async () => {    let new_userdata = userdata;
                                        if(userdata.likes.find((username) => (username === user.user!.username))) {
                                        new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                                        }
                                        else {
                                        new_userdata.likes.push(user.user!.username);
                                        }
                                        setUserdata(new_userdata);
                                        setLiked(!liked);
                                        await content_userdata(Number(newContent?.id), new_userdata);
                                    } : () => {}}>
                                    {like_vector}
                                    <div className="text NS px12 bold">{newContent?.userdata.likes.length}</div>
                                </button>
                                <div className="type NS px18 line25 bold">{newContent?.type === '동영상' ? 'video' : 'book'}</div>
                                <div className="tag NS px14 op6 line15">{newContent?.tag}</div>
                                <div className="title NS px16 line25 bold" onClick = {() => NewContentLinkClick()} style = {{cursor: 'pointer'}}>{'[' + newContent?.type + ']' + newContent?.title}</div>
                            </div>
                        </div>
                    </div>
                    <div className="PopularContentContainer" style = {{marginTop: '106px', paddingBottom: '115px'}}>
                        <div className="titleContainer">
                            <div className="title GB px16 bold">{`'${ContentCategorySelected.name}' 인기 컨텐츠`}</div>
                        </div>
                        <div className="contentContainer" style = {{marginTop: '30px', transform: `translateX(${(-412 * popularContentNumber) + 'px'})`, width: `${(412 * PopularContents?.length + 1000) + 'px'}`}}>
                            <div className="vector" style = {{width: '100%', height: '1px', background: 'rgba(39, 57, 47, 0.2)', position: 'absolute', top: '281px', left: 'calc((678px - 412px) - 1000px)', zIndex: -3}}></div>
                            {PopularContents && PopularContents.map((content, key) => {
                                return (
                                    <div className="contentElement" >
                                        <div className="imageContainer" style = {{marginRight: (popularContentNumber === key ? '0px' : '58px'), transition: 'all 1s ease-in-out', width: (popularContentNumber === key ? '678px' : '354px')}}>
                                            <img src = {((content?.imageData && content?.imageData.imageUrl) ? content?.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} alt="profile" className = 'thumbnail' style = {{width: '354px', height: '261px', objectFit: 'cover', opacity: (popularContentNumber === key ? '1' : '0.6'), paddingRight: (popularContentNumber === key ? '324px' : '0px'), boxSizing: 'content-box', transition: 'all 1s ease-in-out', cursor: 'pointer'}} onClick = {() => PopularContentLinkClick()}/>
                                            <div className="vector" style = {{opacity: (popularContentNumber === key ? '1' : '0.1'), transform: (popularContentNumber === key ? 'translateX(-162px)' : 'translateX(0px)'), transition: 'all 1s ease-in-out'}}></div>
                                            <div className="title NS px12 line15 bold op6" onClick = {() => PopularContentLinkClick()} style ={{transform: (popularContentNumber === key ? 'translateX(-162px)' : 'translateX(0px)'), transition: 'all 1s ease-in-out'}}>{content.title}</div>
                                        </div>
                                        {<div className="CoverContainer" style = {{position: 'absolute', zIndex: -1, transition: 'all 1s ease-in-out', left: (popularContentNumber === key ? '354px' : '0px'), opacity: (popularContentNumber === key ? '1' : '0')}}>           
                                            <div className="oneline GB px14 op6">컨텐츠 한줄</div>
                                            <div className="title GB px20 line35" onClick = {() => PopularContentLinkClick()} style = {{cursor: 'pointer'}}>{content?.title}</div>
                                            <div className="date GB px14 line15">{'컨텐츠 생성일 : ' + String(parseDate(new Date(Number(content?.date))))}</div>
                                            <div className="tag GB px14 op6 line15">{content?.tag}</div>
                                            <div className="vector" style = {{width: '100%', height: '1px', background: 'rgba(110, 118, 114, 0.4)', marginTop: '18px'}}></div>
                                            <div className="title NS px13 bold" onClick = {() => PopularContentLinkClick()} style = {{cursor: 'pointer'}}>{`컨텐츠 확인하러 가기>`}</div>
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
    }, [ContentCategory, MementoContentCategoryArray, newContentNumber, newContent, PopularContents, PopularContent, userdata, liked]);

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

    interface MainTextInterface {
        name: string;
        mainText: JSX.Element;
        subText: JSX.Element;
        more: JSX.Element;
        imageUrl: string;
    }

    let LinkAboutus = React.useRef<any>(null);
    let LinkContent = React.useRef<any>(null);
    let LinkNote = React.useRef<any>(null);
    let LinkBook = React.useRef<any>(null);
    let LinkAboutusClick = () => LinkAboutus.current.click();
    let LinkContentClick = () => LinkContent.current.click();
    let LinkNoteClick = () => LinkNote.current.click();
    let LinkBookClick = () => LinkBook.current.click();

    let MainText: MainTextInterface[] = React.useMemo(() => {
        let result = [];
        
        result.push({
            name: '메멘토는',
            mainText: <>
                <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>당신의 아름다운 이야기</div>를</div>
                <div>소중하게 전달합니다</div>
            </>,
            subText: <>
                <div>웰다잉 플랫폼 메멘토는 남녀노소 누구나 자신의 죽음을 준비해보는 시간을 가질 수 있는 공간입니다. 메멘토에서 인생을 기록하고, 유언을 작성하고, 책과 영상을 통해 죽음에 대해 철학적으로 고민해보며 죽음 이면에 있는 삶의 축복을 발견하세요. </div>
            </>,
            more: <div className="more px12 line40 bold" onClick = {() => window.open('https://www.notion.so/Team-Memento-480ba51aeb3a43f6ad18d19a05bba5ad', '_blank')}>{`메멘토 소개 바로가기>`}</div>,
            imageUrl: 'MainMementoImage.png'
        });

        result.push({
            name: '메멘토 컨텐츠',
            mainText: <>
                <div>여러분은 <div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>죽음에 대해</div></div>
                <div>얼만큼 알고 계신가요?</div>
            </>,
            subText: <>
                <div>메멘토 컨텐츠란, 다양한 책, 영화, 강연을 통해 죽음에 대한 궁금증을 해소하고, 삶에 대한 나만의 철학을 완성해나가는 공간입니다. 컨텐츠 감상 후 제시되는 질문에 답하며 당신만의 삶과 죽음에 관한 생각을 정리해보세요. </div>
            </>,
            more: <div className="more px12 line40 bold" onClick = {() => LinkContentClick()}>{`메멘토 컨텐츠 바로가기>`}</div>,
            imageUrl: 'MainContentImage.png'
        });

        result.push({
            name: '메멘토 노트 ',
            mainText: <>
                <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>당신의 이야기를 작성하는</div></div>
                <div>당신만의 공간</div>
            </>,
            subText: <>
                <div>메멘토가 제시하는 질문에 대한 나의 생각을 정리할 수 있는 프라이빗한 공간입니다. 질문은 삶과 죽음에 관한 총 6가지 카테고리로 구성되어 있으며, 질문에 대해 하나씩 답을 작성하면서 나만의 인생 기록이 담긴 특별한 유언을 완성할 수 있습니다.  </div>
            </>,
            more: <div className="more px12 line40 bold" onClick = {() => LinkNoteClick()}>{`메멘토 노트 바로가기>`}</div>,
            imageUrl: 'MainNoteImage.png'
        });

        result.push({
            name: '메멘토 북',
            mainText: <>
                <div>당신의 이야기를 엮어</div>
                <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>소중한 사람에게 전달하세요.</div></div>
            </>,
            subText: <>
                <div>메멘토 노트에 적은 답변을 온라인 책 형태로 엮어 소중한 이들에게 전달하는 공간입니다. 메멘토 노트의 답변 중 전달하고 싶은 답변을 선택하면 자동적으로 메멘토가 당신의 인생 기록이자 유언이 담긴 전자책을 만들어드립니다. </div>
            </>,
            more: <div className="more px12 line40 bold" onClick = {() => LinkBookClick()}>{`메멘토 북 바로가기>`}</div>,
            imageUrl: 'MainBookImage.png'
        });

        result.push({
            name: '자서전 제작',
            mainText: <>
                <div>여러분의 소중한 이야기를</div>
                <div><div style = {{boxShadow: 'inset 0 -15px 0 rgba(97, 105, 101, 0.2)', lineHeight: '35px', display: 'inline-block'}}>책으로 남겨보세요</div></div>
            </>,
            subText: <>
                <div>메멘토 북을 모두 완성하셨다면, 소중한 이들에게 남길 수 있는 책을 제작해보세요. 메멘토가 당신의 이야기를 섬세하게 엮어 보내드립니다. 당신을 그리워 할 소중한 사람들을 위해 당신의 빈자리에 위로와 온기를 남겨주세요.</div>
            </>,
            more: <div className="more px12 line40 bold">{`2021년 12월 출시 예정`}</div>,
            imageUrl: 'MainMakeBookImage.png'
        });
        
        return result;
    }, []);

    let [MainCoverNumber, setMainCoverNumber] = React.useState<number>(0);

    let MainCover = React.useMemo(() => {
        return (
            <div className="main_block margin_base">
                <div className="main_text GB px30 line55">
                    {MainText[MainCoverNumber].mainText}
                </div>
                <div className="subtext GB px14 line30">
                    {MainText[MainCoverNumber].subText}
                </div>
                <div style = {{cursor: 'pointer'}}>{MainText[MainCoverNumber].more}</div>
                <div className="circle"></div>
                <img src={imageUrl(`${MainText[0].imageUrl}`)} alt="" className="mainBlockImage" style = {{opacity: (MainCoverNumber === 0 ? '1' : '0')}}/>
                <img src={imageUrl(`${MainText[1].imageUrl}`)} alt="" className="mainBlockImage" style = {{opacity: (MainCoverNumber === 1 ? '1' : '0')}}/>
                <img src={imageUrl(`${MainText[2].imageUrl}`)} alt="" className="mainBlockImage" style = {{opacity: (MainCoverNumber === 2 ? '1' : '0')}}/>
                <img src={imageUrl(`${MainText[3].imageUrl}`)} alt="" className="mainBlockImage" style = {{opacity: (MainCoverNumber === 3 ? '1' : '0')}}/>
                <img src={imageUrl(`${MainText[4].imageUrl}`)} alt="" className="mainBlockImage" style = {{opacity: (MainCoverNumber === 4 ? '1' : '0')}}/>
            </div>
        );
    }, [MainCoverNumber]);

    return (
        <div className='main_display'>
            <Link to={'/aboutus'} ref = {LinkAboutus} style = {{display: 'none'}} />
            <Link to={'/content/0'} ref = {LinkContent} style = {{display: 'none'}} />
            <Link to={'/note/1'} ref = {LinkNote} style = {{display: 'none'}} />
            <Link to={'/notebook/0'} ref = {LinkBook} style = {{display: 'none'}} />
            <div className="block" style = {{height: '601px'}}>
                <img src={imageUrl('main_background.png')} alt="" className="background_main" style = {{width: '100vw', height: '601px', objectFit: 'none', position: 'absolute'}}/>
                <div className="background_main_blend" style = {{width: '100vw', height: '601px', mixBlendMode: 'soft-light', background: '#E6E5E2', position: 'absolute', top: '0px'}}></div>
                {MainCover}
            </div>
            <div className="block">
                <div className="introContainer">
                    <div onClick = {() => setMainCoverNumber(MainCoverNumber - 1 === -1 ? 4 : MainCoverNumber - 1)} style = {{cursor: 'pointer'}}>{LeftVector2}</div>
                    <div className="introButtonContainer">
                        <div className="Element" onClick = {() => setMainCoverNumber(0)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (MainCoverNumber === 0 ? ' selected' : ' notselected')}>{MementoMainVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토는</div>
                        </div>
                        {RightVector}
                        <div className="Element" onClick = {() => setMainCoverNumber(1)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (MainCoverNumber === 1 ? ' selected' : ' notselected')}>{MementoContentVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토 컨텐츠</div>
                        </div>
                        {RightVector}
                        <div className="Element" onClick = {() => setMainCoverNumber(2)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (MainCoverNumber === 2 ? ' selected' : ' notselected')}>{MementoNoteVector}</div>
                            <div className = 'GB px15 line30 op3'>메멘토 노트</div>
                        </div>
                        {RightVector}
                        <div className="Element" onClick = {() => setMainCoverNumber(3)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (MainCoverNumber === 3 ? ' selected' : ' notselected')}>{MementoBookVector}</div>
                            <div className = 'GB px15 line30 op3'>유언 자서전</div>
                        </div>
                        {RightVector}
                        <div className="Element" onClick = {() => setMainCoverNumber(4)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (MainCoverNumber === 4 ? ' selected' : ' notselected')}>{MementoMakeBookVector}</div>
                            <div className = 'GB px15 line30 op3'>자서전 제작</div>
                        </div>
                    </div>
                    <div onClick = {() => setMainCoverNumber((MainCoverNumber + 1)%5)} style = {{cursor: 'pointer'}}>{RightVector2}</div>
                </div>
                <div className="margin_base">
                    <div className="explain">
                        <div className="title GB px30">나의 서재</div>
                        <div className="subtitle GB px14">인생을 담은 당신만의 공간</div>
                        <div className="detail GB px15 line40">'나의 서재'란, ‘메멘토 노트’를 통해 인생이 담긴 유언을 기록하고, 이를 바탕으로 ‘메멘토 북’을 제작해 소중한 이들에게 전달하는 공간입니다. 나의 서재에서 인생을 담은 당신만의 공간을 완성하세요. </div>
                        <div className="more"></div>
                        <div className="more px12 line40 bold" onClick = {() => LinkNoteClick()} style = {{cursor: 'pointer'}}>{`작성 페이지 바로가기>`}</div>
                    </div>
                    <div className="SectionContainer">
                        {MementoSectionArray.map((MementoSection, key) => {
                            return (
                                <div className="ElementContainer" onClick = {key === 0 ? () => LinkNoteClick() : key === 1 ? () => LinkBookClick() : () => alert('준비중입니다.')} style = {{cursor: 'pointer'}}>
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
                    <div className="title GB px30" style = {{paddingTop: '130px'}}>메멘토 컨텐츠</div>
                    <div className="subtitle GB px14" style = {{borderBottom: '1px solid rgba(110, 118, 114, 0.3)'}}>삶과 죽음에 대해 생각하는 시간</div>
                    <div className="more NS px12 bold line15" style = {{marginTop: '14px', textAlign: 'right', cursor: 'pointer'}} onClick = {() => LinkContentClick()}>{`컨텐츠 페이지 바로가기>`}</div>
                    <div className="detail GB px16 line40 op7" style = {{width: '796px', marginTop: '33px'}}>
                        <div>메멘토 컨텐츠란, 다양한 책, 영화, 강연을 통해 죽음에 대한 궁금증을 해소하고, 삶에 대한 나만의 철학을 완성해나가는 공간입니다. 컨텐츠 감상 후 제시되는 질문에 답하며 당신만의 삶과 죽음에 대한 생각을 정리해보세요. </div>
                        <div>메멘토 컨텐츠는 당신만의 프라이빗한 작성 공간인 메멘토 노트와 연동됩니다.</div>
                    </div>
                    {MementoContentCategoryElement}
                </div>
            </div>
            {false && <div className="block" style = {{minHeight: '521px'}}> 
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
            </div>}
        </div>
    );
}

export default Maincontent;
