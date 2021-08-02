import React from 'react';
import { imageUrl } from '../etc/config';

let main_testament_text = `당신의 어쩌구 당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구
당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의 어쩌구 신의 어쩌구신의 어쩌구
당신의 어쩌구당신의 어쩌구당신의 어쩌구당신의`;
let category_name = ['당신이 나아갈 삶의 이야기', '당신이 남길 당신의 이야기', '함께한 사람에게 전할 이야기', '스스로 정리하는 삶의 마지막', '당신이 그리는 당신의 장례식', '죽음을 대하는 당신의 자세', '반려동물에게 전할 이야기'];
let category_tag = ['#계획 #버킷리스트', '#기록 #추억 #자서전', '#편지', '#자기결정권 #유언 #법', '#장례', '#심적 준비' ,'#반려동물'];
let category_text = [`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`,`어쩌구 저쩌구`];

function Maincontent() {
    let [currentItem, setCurrentItem] = React.useState<number>(1);
    let [descriptionActive, setDescriptionActive] = React.useState<boolean>(false);
    return (
        <div className='main_content'>
            <div className = 'block'>
                <div className='main_testament'>
                    <div className = 'mementoLogo_center'>
                        <img src={imageUrl('mementoLogo_center.png')} />
                    </div>
                    <div className = 'text'>
                    {main_testament_text}
                    </div>
                    <div className = 'testament_button'>
                        <div className = 'button_text'>
                        유언 작성하기
                        </div>
                    </div>
                </div>
            </div>
            <div className = 'block'>
                <div className = 'main_explain'>
                    <div className = 'background' />
                    <div className = 'category_vector' />
                    <div className = 'category'>
                        { [...Array(7).keys()].map((i)=> (
                          <div className = {'item' + (currentItem === i ? ' active' : '')}>
                              <div className = 'tag' onClick={() => {setCurrentItem(i);} } >
                              {category_tag[i]}
                              </div>
                              <div className = {'image' + (currentItem === i ? ' active' : '')} >
                                  <img src = {(currentItem === i ? imageUrl('category_select.png') : imageUrl('category_notselect.png'))}/>
                              </div>
                          </div>
                        ))}
                    </div>
                    <div className='category_detail'>
                        <div className={ 'detail' }>
                            { currentItem !== -1 &&
                              <>
                                  <div className = 'title'>
                                  {`유언 카테고리`}
                                  </div>
                                  <div className = 'name'>
                                  { category_name[currentItem] }
                                  </div>
                                  <div className = 'text'>
                                  { category_text[currentItem] }
                                  </div>
                                  <div className = 'more'>
                                  {`더 보기 >`}
                                  </div>
                              </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maincontent;
