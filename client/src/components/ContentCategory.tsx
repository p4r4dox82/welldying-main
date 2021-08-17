import React from 'react';
import { imageUrl } from '../etc/config';
import { getSections } from '../etc/api/section';
import usePromise from '../etc/usePromise';

interface Props {
    additionalClass: string;
}

function ContentCategory ({ additionalClass } : Props) {
  let [, sections] = usePromise(getSections);
  let [search_word, setSearch_word] = React.useState<string>('');
  return (
    <>
      <div className = 'block'>
          <img className = 'background' src = {imageUrl('ContentPage/content_background.png')} />
          <div className = 'background' />
          <div className = 'contentcategory'>
              <div className = 'main_title'>
                  <div>죽음을 대면하고</div>
                  <div>나의 죽음에 답하는 공간</div>
              </div>
              <div className = 'sub_title'>
              메멘토 컨텐츠
              </div>
              <div className = 'searchContainer'>
                  <img src = {imageUrl('search_image.png')} />
                  <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)메멘토 이벤트'/>
              </div>
              <div className = 'category_container'>
                  <div className = 'title'>
                  컨텐츠 카테고리 분류
                  </div>
                  <img className = 'left_button' src = {imageUrl('ContentPage/left_button.png')} />
                  <img className = 'right_button' src = {imageUrl('ContentPage/right_button.png')} />
                  <div className = 'vector' />
                  <div className = 'category_container_main'>
                      <button className = 'category'>
                      {'#전체'}
                      </button>
                      { sections?.map((section)=> (
                        <button className = 'category'>
                        {section.tag.split('#').slice(1).map((tag) => <div>{'#' + tag}</div>)}
                        </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentCategory;
