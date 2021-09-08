import React from 'react';
import { imageUrl } from '../etc/config';
import { getSections } from '../etc/api/section';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';


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
    let [, contents] = usePromise(getContents);
    let [currentItem, setCurrentItem] = React.useState<number>(1);
    let [expand, setexpand] = React.useState<boolean>(false);
    let [main_slide, setmain_slide] = React.useState<number>(1);
    let [content_number, setcontent_number] = React.useState<number>(1);
    let [total_content_number, settotal_content_number] = React.useState<number>(6);
    let [review_number, setreview_number] = React.useState<number>(1);
    let [total_review_number, settotal_review_number] = React.useState<number>(8);

    let section = React.useMemo(() => sections?.find((section) => section.id === currentItem), [sections, currentItem]);
    let slide_content = React.useMemo(() => contents?.find((content) => content.id === content_number), [contents, content_number]);
    let slide_content_section = React.useMemo(() => sections?.find((section) => section.id === slide_content?.category), [sections, slide_content]);
    let contents_8 = React.useMemo(() => contents?.filter((content) => content.id <= 8), [contents]);

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
    return (
        <div className='main_display'>
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
