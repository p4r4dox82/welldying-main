import React from 'react';
import { imageUrl } from '../etc/config';
import { getSections } from '../etc/api/section';
import usePromise from '../etc/usePromise';
import { Link } from 'react-router-dom';
import { getCategorys } from '../etc/api/category';

interface Props {
    additionalClass: string;
}

function ContentCategory (props : Props) {
  let [, sections] = usePromise(getSections);
  let [, categorys] = usePromise(getCategorys);
  let [search_word, setSearch_word] = React.useState<string>('');
  let [mouseover, setMouseover] = React.useState<number>(-1);
  let next_page_id = (parseInt(props.additionalClass) + 1)%8;
  let prev_page_id = (parseInt(props.additionalClass) === 0 ? 7 : parseInt(props.additionalClass) - 1);
  return (
    <>
      <div className = 'block'>
          <img className = 'background' src = {imageUrl('ContentPage/content_background.png')} style = {{height: '436px', objectFit: 'cover'}}/>
          <div className = 'background' style = {{height: '436px'}}/>
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
                  <Link to={`${prev_page_id}`}><img className = 'left_button' src = {imageUrl('ContentPage/left_button.png')} /></Link>
                  <Link to={`${next_page_id}`}><img className = 'right_button' src = {imageUrl('ContentPage/right_button.png')} /></Link>
                  <div className = 'vector' />
                  <div className = 'category_container_main'>
                      { categorys?.map((category, key)=> (
                        <Link to={`/content/${category.id}`}>
                            <button className = {'category' + (((key + 1) === parseInt(props.additionalClass) && mouseover === -1)||mouseover === (key + 1) ? ' selected' : '')} onMouseOver = {() => {setMouseover(key + 1);}} onMouseLeave = {() => {setMouseover(-1);}}>
                                <div className="name GB px16 line25">{category.title}</div>
                                <div className="tag NS px12 line25 op4">{key === 1 ? category.tag.slice(0, 21) + category.tag.slice(25, 35) : category.tag}</div>
                            </button>
                        </Link>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default ContentCategory;
