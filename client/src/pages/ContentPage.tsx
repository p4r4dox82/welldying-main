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
import { parseDate } from '../etc';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ContentPage ({ match } : Props) {
    let id = Number.parseInt(match.params.id);
    let [, contents] = usePromise(() => getContents());
    let content = React.useMemo(() => contents?.find((content) => content.id === id), [id, contents]);
    let [title, setTitle] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');
    let [type, setType] = React.useState<string>('');
    let [summary, setSummary] = React.useState<string>('');
    React.useEffect(() => {
        if(!content) return;
        setTitle(content.title);
        setTag(content.tag);
        setType(content.type);
        setSummary(content.detail.summary);
    }, [content]);
    let [more_contents_count, setMore_contents_count] = React.useState<number>(6);
    let more_contents = contents?.slice(0, more_contents_count);

    React.useEffect(() => {
        more_contents = contents?.slice(0, more_contents_count);
    }, [more_contents_count]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    let ContentPageHtml = React.useMemo(() => {
        if(!content) return <></>;
        return (
            <>
            <Header additionalClass = '' />
            <ContentCover additionalClass = '0' title = {title} tag = {tag} date = {String(parseDate(new Date(Number(content?.date))))} source = {content?.source}/>
            <Content_type additionalClass = {type} content = {content}/>
            <div className = 'block contentpage' style = {{marginTop: '176px'}}>
                <div className = 'contentsummary margin_large'>
                    <div className = 'title GB px20'>
                    컨텐츠 내용 요약
                    </div>
                    <div className = 'summary GB px16 line35'>
                    {content?.detail.summary.split('\n').map((summary_line) => 
                        <div>{summary_line}</div>
                    )}
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
            <ContentBorder content = {content}/>
            <div className = 'block contentpage overflow_hidden'style = {{paddingTop: '115px', paddingBottom: '150px'}}>
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
            <Footer additionalClass = ''/>
        </>
        )
    }, [id, content, title, tag, type, summary, contents, more_contents_count]);
    
    return (
        <>
        {ContentPageHtml}
        </>
    );
}

export default ContentPage;
