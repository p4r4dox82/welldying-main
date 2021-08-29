import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCategory from '../components/ContentCategory';
import ContentDetail from '../components/ContentDetail';
import ContentSlide from '../components/ContentSlide';
import ContentSlide2 from '../components/ContentSlide2';
import Contentbox from '../components/Contentbox';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { Link, match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ContentSub({ match } : Props) {
  let id_ = match.params.id;
  let id = Number.parseInt(match.params.id);
  let [, contents] = usePromise(getContents);
  let popular_contents = contents?.slice(0, 3);
  let subject_contents = contents?.slice(0, 8);
  let question_contents = contents?.slice(0, 4);
  return (
    <>
      <Header additionalClass = ' '/>
      <ContentCategory additionalClass = {String(id)}/>
      <div className = 'block contentpage margin_top_50px' >
          <div className = 'popular_content'>
              <div className = 'title'>
              메멘토 인기 컨텐츠
              </div>
              <div className = 'content_container'>
                  {popular_contents?.map((content) =>
                  <Contentbox additionalClass = 'big' content = {content}/>)}
              </div>
          </div>
      </div>
      <ContentDetail additionalClass = {String(id)} margin = ' margin_sub' border = ' border'/>
      <div className = 'block contentpage overflow_hidden'>
          <div className = 'category_content'>
              <div className = 'title'>
              질문으로 정하는 컨텐츠
              </div>
              <div className = 'content_container nowrap'>
                  {question_contents?.map((content) =>
                  <Contentbox additionalClass = 'question' content = {content}/>)}
              </div>
              <img className = 'slide_right_button' src = {imageUrl('ContentPage/slide_right_button.png')} />
              <img className = 'slide_left_button' src = {imageUrl('ContentPage/slide_left_button.png')} />
          </div>
      </div>
      <div className = 'block contentpage flex' >
          <div className = 'subject_content'>
              <div className = 'title'>
              생각이 깊어지는 이야기
              </div>
              <div className = 'content_container'>
                  {subject_contents?.map((content) =>
                  <Contentbox additionalClass = 'small' content = {content}/>)}
              </div>
          </div>
      </div>
      <Footer additionalClass = ' '/>
    </>
  );
}

export default ContentSub;
