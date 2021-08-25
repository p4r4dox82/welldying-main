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

function ContentMain({ match } : Props) {
  let id = Number.parseInt(match.params.id);
  let [, contents] = usePromise(getContents);
  let popular_contents = contents?.slice(0, 3);
  let subject_contents = contents?.slice(0, 4);
  let subject_contents_8 = contents?.slice(0, 8);
  let question_contents = contents?.slice(0, 8);
  const maxquestion_contents = 8;
  let [position, setPosition] = React.useState<number>(0);

  let question_content_dom = React.useRef<any>(null);

  let moveLeft = (position: number) => {
    question_content_dom.current.style.transform = `translateX(${-353 * position + 'px'})`;
  }
  let moveRight = (position: number) => {
    question_content_dom.current.style.transform = `translateX(${-353 * position + 'px'})`;
  }

  return (
    <>
      <Header additionalClass = ' '/>
      <ContentCategory additionalClass = {String(id)}/>
      {id === 0 && <>
        <ContentDetail additionalClass = '0' margin = ' margin_bottom' border = ''/>
        <ContentSlide />
        <div className = 'block contentpage' >
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
        <div className = 'block contentpage flex' >
            <div className = 'subject_content'>
                <div className = 'title'>
                생각이 깊어지는 이야기
                </div>
                <div className = 'content_container border'>
                    {subject_contents?.map((content) =>
                    <Contentbox additionalClass = 'small' title = {content.title} type = {content.type} category = {content.category} likes = {content.likes} tag = {content.tag}/>)}
                </div>
            </div>
            <div className = 'subject_content'>
                <div className = 'title'>
                가족이 떠오르는 이야기
                </div>
                <div className = 'content_container border'>
                    {subject_contents?.map((content) =>
                    <Contentbox additionalClass = 'small' title = {content.title} type = {content.type} category = {content.category} likes = {content.likes} tag = {content.tag}/>)}
                </div>
            </div>
        </div>
        <div className = 'block contentpage overflow_hidden' >
            <div className = 'video_content_main'>
                <div className = 'title'>
                신규 영상 컨텐츠
                </div>
                <ContentSlide2 />
            </div>
        </div>
      </>}
      {id !== 0 && <>
        <div className = 'block contentpage margin_top_50px' >
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
        <ContentDetail additionalClass = {String(id)} margin = ' margin_sub' border = ' border'/>
        <div className = 'block contentpage overflow_hidden'>
            <div className = 'category_content'>
                <div className = 'title'>
                질문으로 정하는 컨텐츠
                </div>
                <div className = 'content_container nowrap transition' ref = {question_content_dom}>
                    {question_contents?.map((content) =>
                    <Contentbox additionalClass = 'question' title = {content.title} type = {content.type} category = {content.category} likes = {content.likes} tag = {content.tag}/>)}
                </div>
                {position !== (maxquestion_contents - 3) && <img className = 'slide_right_button' src = {imageUrl('ContentPage/slide_right_button.png')} onClick = {() => {let newposition = Math.min(position + 3, maxquestion_contents - 3); setPosition(newposition); moveLeft(newposition);}}/>}
                {position !== 0 && <img className = 'slide_left_button' src = {imageUrl('ContentPage/slide_left_button.png')} onClick = {() => {let newposition = Math.max(position - 3, 0); setPosition(newposition); moveRight(newposition);}} />}
            </div>
        </div>
        <div className = 'block contentpage flex' >
            <div className = 'subject_content'>
                <div className = 'title'>
                생각이 깊어지는 이야기
                </div>
                <div className = 'content_container'>
                    {subject_contents_8?.map((content) =>
                    <Contentbox additionalClass = 'small' title = {content.title} type = {content.type} category = {content.category} likes = {content.likes} tag = {content.tag}/>)}
                </div>
            </div>
        </div>
      </>}
      <Footer additionalClass = ' '/>
    </>
  );
}

export default ContentMain;
