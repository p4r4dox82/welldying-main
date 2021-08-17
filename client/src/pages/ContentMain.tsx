import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCategory from '../components/ContentCategory';
import ContentDetail from '../components/ContentDetail';
import ContentSlide from '../components/ContentSlide';
import Contentbox from '../components/Contentbox';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';

function ContentMain() {
  let [, contents] = usePromise(getContents);
  let popular_contents = contents?.slice(0, 3);
  return (
    <>
      <Header additionalClass = ' '/>
      <ContentCategory additionalClass = '0'/>
      <ContentDetail additionalClass = '0'/>
      <ContentSlide />
      <div className = 'block' >
          <div className = 'popular_content'>
              <div className = 'title'>
              메멘토 인기 컨텐츠
              </div>
              <div className = 'content_container'>
                  {popular_contents?.map((content) =>
                  <Contentbox additionalClass = 'big' title = {content.title} type = {content.type} category = {content.category} likes = {content.likes} tag = {content.tag}/>)}
              </div>
          </div>
      </div>
      <Footer additionalClass = ' '/>
    </>
  );
}

export default ContentMain;
