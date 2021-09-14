import React from 'react';
import { imageUrl } from '../etc/config';
import { getSections } from '../etc/api/section';
import { getContents, Content } from '../etc/api/content';
import usePromise from '../etc/usePromise';

import { MementoNoteVector, MementoBookVector, MementoContentVector, MementoMakeBookVector, MementoTogetherNoteVector, LeftVector2, RightVector2, RightVector, LeftArrowVector, RightArrowVector, Colon, like_vector } from '../img/Vectors';


let main_testament_text = `당신의 어쩌구 당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구
당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구 신의 어쩌구신의 어쩌구
당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의`;
let content_type_eng = ['book', 'book', 'book'];
let content_name = ['어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구어쩌구 저쩌저쩌구어쩌구저쩌구어쩌구', 'ㅂㅈㄷ', 'ㅋㅌㅍ'];
let content_tag = ['1', '2', '3'];
let content_like = ['12', '3', '123'];
let content_detail = [`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`];
let memento_brand_text = `메멘토는 단순하고 쉬운 솔루션과 가이드를 통한, 유언 작성 및 전달 서비스를 제공하는 브랜드로
‘모든 사람이 죽음을 준비할 수 있는 사회와 문화’를 만들어 나갑니다.`;

function Maincontent() {
    let [, sections] = usePromise(getSections);
    let [, AllContents] = usePromise(getContents);
    let [currentItem, setCurrentItem] = React.useState<number>(1);
    let [expand, setexpand] = React.useState<boolean>(false);
    let [main_slide, setmain_slide] = React.useState<number>(1);
    let [content_number, setcontent_number] = React.useState<number>(1);
    let [total_content_number, settotal_content_number] = React.useState<number>(6);
    let [review_number, setreview_number] = React.useState<number>(1);
    let [total_review_number, settotal_review_number] = React.useState<number>(8);

    let section = React.useMemo(() => sections?.find((section) => section.id === currentItem), [sections, currentItem]);
    let slide_content = React.useMemo(() => AllContents?.find((content) => content.id === content_number), [AllContents, content_number]);
    let slide_content_section = React.useMemo(() => sections?.find((section) => section.id === slide_content?.category), [sections, slide_content]);
    let contents_8 = React.useMemo(() => AllContents?.filter((content) => content.id <= 8), [AllContents]);

    let category_detail = React.useMemo(() => {
      return (
        <div className='category_detail'>
            <div className={ 'detail' }>
                { currentItem !== -1 &&
                  <>
                  <div className = 'title'>
                  {`카테고리 설명`}
                  </div>
                  <div className = 'name'>
                  { section?.title }
                  </div>
                  <div className = 'detail'>
                  { section?.detail }
                  </div>
                  <div className = 'more'>
                  {`더 보기 >`}
                  </div>
                  </>
                }
            </div>
        </div>
      );
    }, [section, currentItem]);

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
            name: '죽음, 그 이후의 이약기.',
            detail: '메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ',
            tag: '# 기록  # 추억 # 자서전 # 죽음의 이해 # 심적준비 # 편지',
            contents: AllContents?.filter((content) => content.id < 10),
        });
        return result;
    }, []);

    let [newContentNumber, setNewContentNumber] = React.useState<number>(0);
    let ContentCategorySelected = React.useMemo(() => MementoContentCategoryArray[ContentCategory], [ContentCategory, MementoContentCategoryArray]);
    let newContents = React.useMemo(() => ContentCategorySelected.contents?.filter((content, key) => key < 6), [ContentCategorySelected]);
    let newContent = React.useMemo(() => {
        if(!newContents) return;
        return newContents[newContentNumber];
    }, [newContents, newContentNumber]);
    
    let MementoContentCategoryElement = React.useMemo(() => {
        return (
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
                        <div className="title GB px16 bold">{`'${ContentCategorySelected.name}'신규 컨텐츠`}</div>
                        <div className="buttonContainer">
                            <button className="left Button">{LeftArrowVector}</button>
                            <button className="right Button">{RightArrowVector}</button>
                        </div>
                    </div>
                    <div className="contentContainer">
                        <img src = {imageUrl('content_slide.png')} alt="profile"/>
                        <div className="CoverContainer">
                            {Colon}
                            <button className="likeContainer">
                                {like_vector}
                                <div className="text NS px12 bold">{newContent?.userdata.likes.length}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [ContentCategory, MementoContentCategoryArray, newContentNumber, newContent]);

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
            <div className="block" style = {{minHeight: '678px'}}>
                <div className="background" style = {{width: '100%', height: '678px', position: 'absolute', top: '0px', background: 'rgba(210, 217, 215, 0.3)', boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.15)'}}></div>
                <div className="MainContent margin_base">
                    <div className="title GB px30" style = {{paddingTop: '130px'}}>memento AllContents</div>
                    <div className="subtitle GB px14" style = {{borderBottom: '1px solid rgba(110, 118, 114, 0.3)'}}>ㄷㅏㅇ신ㄴㅇㅡㅣ ㅇㅓㅉㅓㄱㅜ ㅈㅓㅉㅓㄱㅜ ㅁㅏㄴㅅ</div>
                    <div className="more NS px12 bold line15" style = {{marginTop: '14px', textAlign: 'right'}}>{`컨텐츠 페이지 바로가기>`}</div>
                    <div className="detail GB px16 line40 op7" style = {{width: '796px', marginTop: '33px'}}>메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는엄냐ㅓㅇ머ㅐㅁ너ㅑ처먀ㅐㄴ처ㅑㅁㄴ처ㅑㅁ냐ㅓㅁㄴ처ㅐ먄챰ㄴㅊ</div>
                    {MementoContentCategoryElement}
                </div>
            </div>
            <div className = 'block'>
                <div className = 'main_image'>
                    <img className = 'main_background' src={imageUrl('main_background.png')} alt="profile"/>
                    <div className = 'main_background_blend' />
                    <div className = 'vector_1' />
                    <div className = 'vector_2' />
                    <div className = 'vector_3' />
                    <div className = 'main_text_container'>
                        <div className = 'text_1'>Cherish your memories</div>
                        <div className = 'text_2'>Cherish your memories</div>
                        <div className = 'slide_container'>
                            <img className = 'left_button' src = {imageUrl('left_button.png')} onClick = {() => {setmain_slide((main_slide - 1) === 0 ? 4 : (main_slide - 1));}} alt="profile"/>
                            <img className = 'right_button' src = {imageUrl('right_button.png')} onClick = {() => {setmain_slide((main_slide + 1)%4 === 0 ? 4 : (main_slide + 1)%4); }} alt="profile"/>
                            <div className = 'slide_rectangle_container'>
                                {[...Array(4).keys()].map((i) => (
                                    <div className = {'slide_bar' + (main_slide === (i + 1) ? ' selected' : '')} />
                                ))}
                            </div>
                        </div>
                        <img className = 'text_3' src={imageUrl('text_3.png')} alt="profile"/>
                    </div>
                    <div className = 'circle' />
                    <img className = 'main_image_1' src = {imageUrl('main_iamge_1.png')} alt="profile"/>
                    <div className = 'text_container_1'>
                        <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} alt="profile"/>
                        <div className = 'title'>당신의 아름다운 이야기를 소중하게 전달합니다.</div>
                        <div className = 'numbering'>{'0' + main_slide}</div>
                        <div className = 'total_number'> / 04</div>
                        <div className = 'vector' />
                        <div className = 'detail'>
                        {`어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌`}
                        </div>
                        <div className = 'more'>{`작성 페이지 바로가기>`}</div>
                    </div>
                    <div className = 'share_container'>
                        {[...Array(4).keys()].map((i) => (
                          <img src={imageUrl(`share_image_${i+1}.png`)} alt="profile"/>
                        ))}
                    </div>
                    <div className = 'family_container'>
                        <div className = 'family_button'>
                            <div className = 'button_text'>
                            유가족 열람 요청
                            </div>
                        </div>
                        <div className = 'dot' />
                        <div className = 'text'>
                        memento 사용자가 남겨놓은 이야기를 확인하러 오셨나요?
                        </div>
                    </div>
                    <img className = 'scroll_image' src = {imageUrl('scroll_image.png')} alt="profile"/>
                </div>
            </div>
            <div className = 'block'>
                <div className={'main_testament' + (expand ? ' expanded' : '')}>
                    <img className = 'testament_background' src={imageUrl('testament_background.png')} alt="profile"/>
                    <div className = 'mementoLogo_center'>
                        <img src={imageUrl('mementoLogo_center.png')} alt="profile"/>
                    </div>
                    <div className = 'text'>
                    {main_testament_text}
                    </div>
                    <div className = 'testament_button'>
                        <div className = 'button_text'>
                        나의 유언 작성하기
                        </div>
                    </div>
                    <div className = {'expand_button' + (expand ? ' expanded' : '')} onClick = {() => {setexpand(!expand);}}>
                        유언 카테고리 확인하기
                    </div>
                    <img className = {'mouse_click' + (expand ? ' expanded' : '')} src={imageUrl('mouse_click.png')} alt="profile"/>
                    <div className = {'main_explain' + (expand ? ' expanded' : '')}>
                        <div className = 'category_vector' />
                        <div className = 'category'>
                            { sections?.map((section)=> (
                              <div className = {'item' + (currentItem === section.id ? ' active' : '')}>
                              <div className = 'tag' onMouseEnter={() => {setCurrentItem(section.id);} } >
                              {section.tag}
                              </div>
                              <div className = {'image' + (currentItem === section.id ? ' active' : '')} >
                              <img src = {(currentItem === section.id ? imageUrl('category_select.png') : imageUrl('category_notselect.png'))} alt="profile"/>
                              </div>
                              </div>
                            ))}
                        </div>
                        {category_detail}
                        <div className = 'category_image'>
                            <img className = 'image' src = {imageUrl('category_image.png')} alt="profile"/>
                            <img className = 'colon' src = {imageUrl('category_colon.png')} alt="profile"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className = 'block'>
                <div className = 'main_content'>
                    <div className = 'main_name'>
                    메멘토 컨텐츠
                    </div>
                    <div className = 'main_subname'>
                    당신의 글을 쓰기 전 당신의 감정을 어쩌구 해보세요.
                    </div>
                    <div className = 'vector'>
                        <div className = 'line' />
                        <div className = 'more_content'>
                            <div className = 'text'>컨텐츠 더보기</div>
                        </div>
                    </div>
                    <div className = 'content'>
                        <div className = 'name'>
                            당신이 나아갈 삶의 이야기
                        </div>
                        <div className = 'subname'>
                            한 주간 인기있는 컨텐츠를 소개합니다
                        </div>
                        <div className = 'numbering'>
                            <span className = 'left_button' onClick = {() => {setcontent_number((content_number - 1) === 0 ? 6 : (content_number - 1));}}>{`<`}</span>
                            <span>
                            {` ${content_number}/${total_content_number} `}
                            </span>
                            <span className = 'right_button' onClick = {() => {setcontent_number((content_number + 1)%6 === 0 ? 6 : (content_number + 1)%6); }}>{`>`}</span>
                        </div>
                        <div className = 'content_container'>
                            <div className = 'slide_content'>
                                <div className = 'content_image'>
                                    <img src = {imageUrl('content_slide.png')} alt="profile"/>
                                    <div className = 'image_selector_container'>
                                        {[...Array(total_content_number).keys()].map((i) => (
                                          <img className = {(content_number === (i+1) ? 'selected' : 'notselected')}src = {imageUrl('content_selector.png')}  alt="profile"/>
                                        ))}
                                    </div>
                                </div>
                                <div className = 'content_detail'>
                                    <img src = {imageUrl('memento_colon.png')} alt="profile"/>
                                    <div className = 'like'>
                                        <img src = {imageUrl('content_like.png')} alt="profile"/>
                                        {slide_content?.userdata.likes?.length}
                                    </div>
                                    <div className = 'type'>{slide_content?.type}</div>
                                    <div className = 'tag'>{slide_content_section?.tag}</div>
                                    <div className = 'title'>{`[` + slide_content?.type + ']' + slide_content?.title}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = 'content'>
                        <div className = 'name'>
                            {`주간 인기 컨텐츠 >`}
                        </div>
                        <div className = 'subname'>
                            한 주간 인기있는 컨텐츠를 소개합니다
                        </div>
                        <div className = 'content_container'>
                            {contents_8 && contents_8.map((content) => (
                              <div className = 'small_content'>
                                  <div className = 'Thumbnail'>
                                      <img src = {imageUrl(`content_small.png`)} alt="profile"/>
                                  </div>
                                  <div className = 'content_name'>
                                      {'['+content?.type+']'}
                                      {content?.title}
                                  </div>
                                  <div className = 'content_tag'>
                                      {content?.tag}
                                  </div>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className = 'block'>
                <div className = 'main_review'>
                    <img className = 'background' src = {imageUrl('review_background.png')} alt="profile"/>
                    <img className = 'image_1' src = {imageUrl('review_back_image_1.png')} alt="profile"/>
                    <img className = 'image_2' src = {imageUrl('review_back_image_2.png')} alt="profile"/>
                    <div className = 'review_1'>
                        <div className = 'main_name'>댓글 이야기</div>
                        <div className = 'main_subname'>죽음을 어쩌구 아름다운 ~합니다.</div>
                        <div className = 'tag'>{'#' + content_tag[review_number]}</div>
                        <div className = 'detail'>{content_detail[review_number]}</div>
                        <div className = 'review_selector'>
                            {[...Array(8).keys()].map((i) => (
                              <img className = {(review_number === (i+1) ? '' : 'notselected')}src = {imageUrl('review_selector.png')} alt="profile"/>
                            ))}
                            <div className = 'review_number'>
                                {review_number + '/' + total_review_number}
                            </div>
                        </div>
                    </div>
                    <div className = 'review_2'>
                        <img className = 'background' src = {imageUrl('review_image_2.png')} alt="profile"/>
                        <img className = 'left_button' src = {imageUrl('review_left_button.png')} onClick = {() => {setreview_number((review_number - 1) === 0 ? total_review_number : (review_number - 1));}} alt="profile"/>
                        <img className = 'right_button' src = {imageUrl('review_right_button.png')} onClick = {() => {setreview_number((review_number + 1)%total_review_number === 0 ? total_review_number : (review_number + 1)%total_review_number); }} alt="profile"/>
                        <img className = 'colon' src = {imageUrl('review_colon.png')} alt="profile"/>
                        <div className = 'type'>{content_type_eng[review_number - 1]}</div>
                        <div className = 'name'>{content_name[review_number - 1]}</div>
                        <div className = 'like'>
                            <img className = 'review_like' src = {imageUrl('review_like.png')} alt="profile"/>
                            {content_like[review_number - 1]}
                        </div>
                        <div className = 'review'>
                            <img src = {imageUrl('review_user_image.png')} alt="profile"/>
                            <div className = 'user_name'>asdasd</div>
                            <div className = 'write_date'>2021.09.03</div>
                            <div className = 'coment'>{`어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구`}</div>
                            <div className = 'review_like'>
                                <img className = 'review_like' src = {imageUrl('review_like.png')} alt="profile"/>
                                {`좋아요`}
                            </div>
                        </div>
                        <div className = 'more'>
                        {`컨텐츠 보러가기 >`}
                        </div>
                    </div>
                </div>
            </div>
            <div className = 'block'>
                <div className = 'main_more'>
                    <div className = 'memento_brand'>
                        <img src = {imageUrl('main_more_image.png')} alt="profile"/>
                        <div className = 'text_box'>
                            <div className = 'text'>
                            {memento_brand_text}
                            </div>
                        </div>
                        <div className = 'button'>
                            <div className = 'button_text'>
                            메멘토 브랜드 소개
                            </div>
                        </div>
                    </div>
                    <div className = 'memento_instagram'>
                        <div className = 'title'>
                        메멘토 인스타그램
                        </div>
                        <div className = 'subtitle'>
                        {`'메멘토' 인스타그램 바로가기 >`}
                        </div>
                        {[...Array(3).keys()].map((i) => (
                          <img src = {imageUrl('instragram_image.png')} />
                        ))}
                    </div>
                    <div className = 'vector' />
                    <div className = 'memento_notice'>
                        <div className = 'title'>
                        공지사항
                        </div>
                        <div className = 'name'>
                        {`[긴급] 메멘토 서버 폭발 사과문, 죄송합니다. 어쩌구 어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구`}
                        </div>
                        <div className = 'detail'>
                        {`라일락 꽃향기 마맡으며 잊을 수 업ㅇ느니ㅏㅁ으추충마ㅜ차머ㅜㅇ차ㅜㅁㅇ처ㅏㅜㅁㅇ춰ㅜㅇㅊ무ㅏㅊ...`}
                        </div>
                        <div className = 'write_date'>
                        2021.11.13
                        </div>
                        <div className = 'more'>
                        {`공지사항 더보기 >`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maincontent;
