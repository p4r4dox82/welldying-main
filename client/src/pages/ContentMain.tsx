import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCategory from '../components/ContentCategory';
import ContentDetail from '../components/ContentDetail';
import ContentSlide from '../components/ContentSlide';
import ContentSlide2 from '../components/ContentSlide2';
import Contentbox from '../components/Contentbox';
import { getContents, Content } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { Link, match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import { RootReducer } from '../store';
import { useSelector } from 'react-redux';
import { getCategorys } from '../etc/api/category';


interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ContentMain({ match } : Props) {
    let id = React.useMemo(() => Number.parseInt(match.params.id), [match]);    
    let [, contents] = usePromise(getContents);
    let [, categorys] = usePromise(getCategorys);
    let popular_contents = React.useMemo(() => contents?.filter((content) => [44, 34, 39].includes(content.id)), [contents]);
    let subject_contents1 = React.useMemo(() => contents?.filter((content) => [2, 43, 23, 46].includes(content.id)), [contents]);
    let subject_contents2 = React.useMemo(() => contents?.filter((content) => [20, 35, 48, 18].includes(content.id)), [contents]);
    let subject_contents3 = React.useMemo(() => contents?.filter((content) => [37, 42, 22, 50].includes(content.id)), [contents]);
    let [categoryContentsNumber, setcategoryContentNumber] = React.useState<number>(8);
    let categoryContents = React.useMemo(() => {
        if(!contents) return;
        return (
            contents.filter((content) => content.category.includes(id)).slice(0, categoryContentsNumber)
            )
        }, [contents, categoryContentsNumber, id]);
    let question_contents = React.useMemo(() => categoryContents?.filter((content) => {
        if(content.question === -1) return false;
        else return true;
    }), [categoryContents]);
    let question_contentsNumber = React.useMemo(() => categoryContents?.filter((content) => {
        if(content.question === -1) return false;
        else return true;
    }).length, [categoryContents]);
    let maxcategoryContents = React.useMemo(() => contents?.filter((content) => content.category.includes(id)).length, [contents, id]);
    let [position, setPosition] = React.useState<number>(0);
        
    let question_content_dom = React.useRef<any>(null);

    let moveLeft = (position: number) => {
        question_content_dom.current.style.transform = `translateX(${-353 * position + 'px'})`;
    }
    let moveRight = (position: number) => {
        question_content_dom.current.style.transform = `translateX(${-353 * position + 'px'})`;
    }

    let LinkNote = React.useRef<any>(null);
    let LinkNoteClick = () => LinkNote.current.click();

    let html = React.useMemo(() => {
        if(!subject_contents1 || !subject_contents2 || !subject_contents3) return;
        return (
            <>
            <Link to = {'/note/1'} ref = {LinkNote} style = {{display: 'none'}} />
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
                          <Contentbox additionalClass = 'big' content = {content}/>)}
                      </div>
                  </div>
              </div>
              <div className = 'block contentpage flex'  style = {{paddingBottom: '200px'}}>
                  <div className = 'subject_content'>
                      <div className = 'title'>
                      후회 없을 우리의 시간
                      </div>
                      <div className = 'content_container border'>
                          {subject_contents1?.map((content) =>
                          <Contentbox additionalClass = 'small' content = {content}/>)}
                      </div>
                  </div>
                  <div className = 'subject_content'>
                      <div className = 'title'>
                      삶의 마지막, 그때
                      </div>
                      <div className = 'content_container border'>
                          {subject_contents2?.map((content) =>
                          <Contentbox additionalClass = 'small' content = {content}/>)}
                      </div>
                  </div>
                  <div className = 'subject_content'>
                      <div className = 'title'>
                      죽음, 그 이후의 이야기
                      </div>
                      <div className = 'content_container border'>
                          {subject_contents3?.map((content) =>
                          <Contentbox additionalClass = 'small' content = {content}/>)}
                      </div>
                  </div>
              </div>
              {false && <div className = 'block contentpage overflow_hidden' style = {{paddingBottom: '200px'}}>
                  <div className = 'video_content_main'>
                      <div className = 'title'>
                      신규 영상 컨텐츠
                      </div>
                      <div style = {{width: '100vw', height: '437px', background: 'rgba(245, 245, 245, 1)', position: 'absolute', top: '48px', left: 'calc(50% - 50vw)', filter: 'blur(2px)'}}></div>
                      <ContentSlide2 />
                  </div>
              </div>}
            </>}
            {id !== 0 && <>
              <div className = 'block contentpage margin_top_50px' >
                  <div className = 'popular_content'>
                      <div className = 'title'>
                      메멘토 인기 컨텐츠
                      </div>
                      <div className = 'content_container'>
                          {(id === 1 ? subject_contents1?.slice(0, 3) : (id === 2 ? subject_contents2.slice(0, 3) : subject_contents3.slice(0, 3)))?.map((content) =>
                          <Contentbox additionalClass = 'big type2' content = {content}/>)}
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
                          <Contentbox additionalClass = 'question' content = {content}/>)}
                      </div>
                      {(question_contentsNumber && position !== (question_contentsNumber - 3)) && <div className = 'button_background right'>
                          <img className = 'slide_right_button' src = {imageUrl('ContentPage/slide_right_button.png')} onClick = {() => {let newposition = Math.min(position + 3, Number(question_contentsNumber) - 3); setPosition(newposition); moveLeft(newposition);}}/>
                      </div>}
                      {position !== 0 && <div className = 'button_background left'>
                          <img className = 'slide_left_button' src = {imageUrl('ContentPage/slide_left_button.png')} onClick = {() => {let newposition = Math.max(position - 3, 0); setPosition(newposition); moveRight(newposition);}} />
                      </div>}
                  </div>
              </div>
              <div className = 'block contentpage flex' style = {{paddingBottom: '300px'}}>
                  <div className = 'subject_content'>
                      <div className = 'title'>
                      생각이 깊어지는 이야기
                      </div>
                      <div className = 'content_container'>
                          {categoryContents?.map((content) =>
                          <Contentbox additionalClass = 'small' content = {content}/>)}
                      </div>
                      {categoryContentsNumber !== maxcategoryContents && <div className = 'more_border' onClick = {() => {setcategoryContentNumber(Math.min(categoryContentsNumber + 8, maxcategoryContents))}}>
                          <div className = 'GB px18 bold op5'>더보기</div>
                          <img className = 'more_button' src = {imageUrl('ContentPage/more_button.png')} />
                      </div>}
                  </div>
              </div>
            </>}
            <Footer additionalClass = ' '/>
            </>
        );
    }, [id, popular_contents, categorys, contents, categoryContentsNumber, maxcategoryContents, categoryContents, position, question_contents, subject_contents1, subject_contents2, subject_contents3])

    return (
    <>
       {html}
    </>
  );
}

export default ContentMain;
