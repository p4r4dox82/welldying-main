import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCover from '../components/ContentCover';
import Content_type from '../components/Content_type';
import ContentQuestion from '../components/ContentQuestion';
import OtherContent from '../components/OtherContent';
import ContentBorder from '../components/ContentBorder';
import Contentbox from '../components/Contentbox';
import { getContents, getContent } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { Link, match, Redirect } from 'react-router-dom';
import { imageUrl } from '../etc/config';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ContentPage ({ match } : Props) {
  let id = Number.parseInt(match.params.id);
  let [contentLoading, content] = usePromise(() => getContent(id));
  let title = String(content?.title);
  let tag = String(content?.tag);
  let type = String(content?.type);
  let summary = String(content?.title);
  let [, contents] = usePromise(() => getContents());
  let [more_contents_count, setMore_contents_count] = React.useState<number>(6);
  let more_contents = contents?.slice(0, more_contents_count);

  React.useEffect(() => {
    more_contents = contents?.slice(0, more_contents_count);
  }, [more_contents_count]);

  return (
      <>
        <Header additionalClass = '' />
        <ContentCover additionalClass = '0' title = {title} tag = {tag} date = {'2021. 07 .03'} source = {'brunch.co.kr/@ssls1223/456'}/>
        <Content_type additionalClass = {type} content = {content}/>
        <div className = 'block contentpage'>
            <div className = 'contentsummary margin_large'>
                <div className = 'title GB px20'>
                영상 내용 요약
                </div>
                <div className = 'summary GB px16 line35'>
                {'어떤 어떤 삶을 살아왔다는 그녀의 이야기 그녀는 왜 이런 생가ㅣㄱ을 가지게 도ㅓㅣ었을까. 행복한 그녀가 말하는 50분의 다른ㅇ 생각 지금 시작합니다. 어쩌구 저쩌구 어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구'}
                </div>
            </div>
        </div>
        <div className = 'block contentpage'>
            <div className = 'contentquestion margin_large'>
                <div className = 'title GB px20'>
                메멘토 질문
                </div>
                <ContentQuestion additionalClass = {type} content = {content} />
            </div>
        </div>
        <div className = 'block contentpage'>
            <OtherContent additionalClass = {type} title = {title} tag = {tag} />
        </div>
        <ContentBorder content = {content}/>
        <div className = 'block contentpage overflow_hidden'>
            <div className = 'more_content margin_base'>
                <div className = 'background' />
                <div className = 'title GB px20'>
                연관 컨텐츠
                </div>
                <div className = 'content_container'>
                    {more_contents?.map((content) =>
                    <Contentbox additionalClass = 'small wide' content = {content}/>)}
                </div>
                {more_contents_count !== 8 && <div className = 'more_border' onClick = {() => {setMore_contents_count(Math.min(more_contents_count + 6, 8))}}>
                    <div className = 'GB px18 bold op5'>더보기</div>
                    <img className = 'more_button' src = {imageUrl('ContentPage/more_button.png')} />
                </div>}
            </div>
        </div>
        <Footer additionalClass = '' />
      </>
  );
}

export default ContentPage;
