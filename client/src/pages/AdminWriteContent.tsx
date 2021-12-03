import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { deleteContent, getContent, writeContent } from '../etc/api/content';
import { getQuestions } from '../etc/api/question';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import { uploadImage_formdata } from '../etc/api/image';
import ReactCrop from 'react-image-crop';
import { imageUrl } from '../etc/config';

import { leftVector, rightVector } from '../img/Vectors';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function AdminWriteContent({ match }: Props) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let [, content] = usePromise(() => getContent(id));
    let [, Questions] = usePromise(getQuestions);
    let [error, setError] = React.useState<string>();


    let [title, setTitle] = React.useState<string>('');
    let [type, setType] = React.useState<string>('');
    let [category, setCategory] = React.useState<number[]>([1]);
    let [question, setQuestion] = React.useState<number>(1);
    let [source, setSource] = React.useState<string>('');
    let [summary, setSummary] = React.useState<string>('');
    let [oneline, setOneline] = React.useState<string>('');
    let [subtitle, setSubtitle] = React.useState<string>('');
    let [bookdetail, setBookdetail] = React.useState<string[]>([]);
    let [tag, setTag] = React.useState<string>('');
    let [tagId, setTagId] = React.useState<number>(0);
    let [thumbnailUri, setThumbnailUri] = React.useState<string>('');
    let [update, setUpdate] = React.useState<number>(1);

    let [editDone, setEditDone] = React.useState<boolean>(false);

    let [crop, setCrop] = React.useState<{
        unit: "px" | "%",
        x: number,
        y: number,
        width: number,
        height: number,
    }>({
        unit: "px",
        x: 0,
        y: 0,
        width: 1228,
        height: 720,
    });

    let [pagenumber, setPagenumber] = React.useState<number>(0);
    let [pagetotalnumber, setPagetotalnumber] = React.useState<number>(0);

    React.useEffect(() => {
        if (!content) return;
        setTitle(content.title);
        setType(content.type);
        setCategory(content.category);
        setTag(content.tag);
        setSource(content.source);
        setSummary(content.detail.summary);
        setOneline(content.detail.oneline);
        setSubtitle(content.detail.subtitle);
        setBookdetail(content.detail.bookdetail);
        if(content.detail.bookdetail)
            setPagetotalnumber(content.detail.bookdetail.length);
        setQuestion(content.question);
        if(!content.imageData || !content.imageData.imageUrl) return;
        if (content.imageData.imageUrl !== '')
            setThumbnailUri(content.imageData.imageUrl);
        setCrop({ ...crop, x: content.imageData.cropX, y: content.imageData.cropY });
    }, [content, crop]);

    let tagForm = React.useMemo(() => {
        let allTags = ['#기록 #추억 #자서전', '#계획 #버킷리스트', '#편지', '#자기경정권 #치료', '#장례', '#죽음의 이해 #심적준비', '#법 #유산 #신탁', '#반려동물', '#사별 #애도'];
        if (!allTags) return <></>;
        else return (
            <div>
                <select style={{width: '888px'}} value={tagId} onChange={(e) => {
                    let newId = Number.parseInt(e.target.value);
                    let newTagId = tagId;
                    newTagId = newId;
                    setTagId(newTagId);
                    setTag(allTags[newTagId]);
                    switch(newTagId) {
                        case 0: 
                        case 1:
                            setCategory([1]);
                            break;
                        case 3:
                        case 4:
                        case 6:
                            setCategory([2]);
                            break;
                        case 8:
                            setCategory([3]);
                            break;
                        case 2:
                            setCategory([1, 3]);
                            break;
                        case 5:
                        case 7:
                            setCategory([2, 3]);
                            break;
                    }
                    setUpdate(update+1);
                }}>
                    <option value={-1}> 태그를 골라주세요. </option>
                    { allTags.map((tag, key) => <option value={key}> {allTags[key]} </option>)}
                </select>
            </div>
        );
    }, [update, tagId]);

    let questionForm = React.useMemo(() => {
        if (!Questions) return <></>;
        else return (
          <div>
              <select style={{width: '888px'}} value={question} onChange={(e) => {
                  let newId = Number.parseInt(e.target.value);
                  let newQuestion = question;
                  newQuestion = newId;
                  setQuestion(newQuestion);
                  setUpdate(update+1);
              }}>
                  <option value={-1}> 질문을 골라주세요. </option>
                  { Questions.map((question) => <option value={question.id}> {question.title} </option>)}
              </select>
          </div>
        );
    }, [update, Questions, question]);

    React.useEffect(() => {
        if(!content?.imageData || !content?.imageData.imageUrl) return;
        if(thumbnailUri !== content?.imageData.imageUrl)
            setCrop({ ...crop, x: 0, y: 0 });
    }, [thumbnailUri, content, crop]);

    let input_file = React.useRef<any>(null);
    let [cropImage, setCropImage] = React.useState<boolean>(false);
    let handleFileinput  = async (e: any) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0]);

        const s3Uri = await uploadImage_formdata(formData);
        console.log(s3Uri);
        setThumbnailUri(s3Uri);
        if(s3Uri === undefined) {
        setThumbnailUri('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
        }
        return s3Uri;
    }
    let handleClick = () => {
        input_file.current.click();
    };

    let bookdetailhtml = React.useMemo(() => {
        return(
            <div className='bookcontent' style = {{padding: '0px', paddingBottom: '100px'}}>
                <div className="buttonContainer" style = {{top: '450px'}}>
                    <button className="left" onClick = {() => setPagenumber(Math.max(pagenumber - 1, 0))}>{leftVector}</button>
                    <div className="pagenumber NS px14 bold">{(pagenumber + 1) + '/' + pagetotalnumber}</div>
                    <button className="right" onClick = {() => setPagenumber(Math.min(pagenumber + 1, pagetotalnumber - 1))}>{rightVector}</button>
                </div>
                <div className="pageContainer" style = {{transition: 'all 0.8s ease-in-out', transform: `translateX(${-362 * pagenumber + 'px'})`}}>
                    {[...Array(pagetotalnumber).keys()].map((key) => {
                        if(key === 0) {
                            return (
                                <div className="page">
                                    <div className="number GB px20 px45 bold">#1</div>
                                    <input className="subtitle GB px20 line40" style = {{marginTop: '5px', outline: 'none', border: 'none', background: 'rgba(0, 0, 0, 0)'}} value = {subtitle} onChange = {(e) => setSubtitle(e.target.value)} placeholder = '입력해주세요'/>
                                    <textarea name="" id="" cols = {36} rows={7} className="detail GB px13 line30" value = {bookdetail[0]} onChange = {(e) => {
                                        let newBookdetail = bookdetail;
                                        newBookdetail[0] = e.target.value;
                                        setBookdetail(newBookdetail);
                                        setUpdate(update + 1);
                                        console.log(newBookdetail);
                                    }} style  = {{marginTop: '40px'}} placeholder = '입력해주세요'></textarea>
                                </div>
                            );
                        } else {
                            return (
                                <div className="page" style = {{padding: '62px 56px 0px 58px'}}>
                                    <textarea name="" id="" cols = {36} rows={10} className="detail GB px13 line30" value = {bookdetail[key]} onChange = {(e) => {
                                        let newBookdetail = bookdetail;
                                        newBookdetail[key] = e.target.value;
                                        setBookdetail(newBookdetail);
                                        setUpdate(update + 1);
                                    }} placeholder = '입력해주세요' ></textarea>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        )
    }, [pagenumber, pagetotalnumber, bookdetail, subtitle, update]);

    if (!user.loggedIn || user.user?.username !== 'admin') return <Redirect to='/'/>;
    else if (editDone) return <Redirect to='/admin'/>
    else return (
        <>
            <Header additionalClass='grey borderBottom' />
            <div className='signupForm' style={{width: '1000px'}}>
                <span><Link to='/admin'> 뒤로 가기 </Link></span>

                <h1 style={{fontSize: '28px', fontWeight: 'bold', lineHeight: '32px', marginBottom: '32px'}}>
                    { !content ? '새 컨텐츠 추가하기' : '컨텐츠 내용 수정하기' }
                </h1>
                <div className='row'>
                    <div className='label'> ID </div>
                    <input value={id} readOnly />
                </div>
                <div className='row'>
                    <div className='label'> 제목 </div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 타입 </div>
                    <input value={type} onChange={(e) => setType(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='label'> 카테고리 목록 </div>
                    <input value={category.map((category) => String(category))} disabled/>
                </div>
                <div className='row'>
                    <div className='label'> 태그 </div>
                    {tagForm}
                </div>
                <div className='row'>
                    <div className='source'> 출처 </div>
                    <input value={source} onChange={(e) => setSource(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='summary'> 요약 </div>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)}/>
                </div>
                <div className='row'>
                    <div className='oneline'> 한줄 </div>
                    <input value={oneline} onChange={(e) => setOneline(e.target.value)}/>
                </div>
                <div className="row">
                    <button onClick = {() => {
                        setPagetotalnumber(pagetotalnumber + 1);
                        console.log(pagetotalnumber);
                    }}>페이지 추가</button>
                    
                </div>
                {bookdetailhtml}
                <div className='row'>
                    <div className='label'> 질문 목록 </div>
                    { questionForm }
                </div>
                <div className='row' style = {{width: '100vw'}}>
                    <div className='source'> 썸네일 </div>
                    <div className = 'image_uploader' style = {{marginLeft: '-200px'}}>
                        <div className = 'fileSelector' style = {{height: (thumbnailUri === 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' ? 150 : (crop.height + 60))}}>
                            <button className = 'image_input' onClick = {() => {handleClick(); setCropImage(true);}} style = {{background:'rgba(255, 255, 255, 1)'}}>
                                <div className = 'new_image' style = {{margin: 'auto', width: crop.width, height: (thumbnailUri === 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' ? 150 : crop.height), overflow: 'hidden'}}>
                                    <img alt = "" className = 'new_image' src = {thumbnailUri} style = {{left: -crop.x, top: -crop.y, objectFit: 'none', marginTop: (thumbnailUri === 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' ? '11px' : '0px')}}/>
                                </div>
                            </button>
                            <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
                        </div>
                    </div>
                </div>
                <button type='submit' className='signupButton' onClick={async (e) => {
                    e.preventDefault();
                    if (!title || !category || !type || !source || !summary || !question  ) setError('모든 항목을 채워주세요.');
                    else if (await writeContent(id, title, type, category, { likes: [], bookmark: [], read: [], }, tag, 0, source, { summary: summary, oneline: oneline, subtitle: subtitle, bookdetail: bookdetail }, [], question, { imageUrl: thumbnailUri, cropX: crop.x, cropY: crop.y })) {setEditDone(true);}
                    else setError('어딘가 문제가 생겼습니다.');
                }} style = {{marginBottom: '0px'}}>
                    { !content ? '추가하기' : '수정하기' }
                </button>
                <button className="signupButton" onClick = {async () => {
                    if(await deleteContent(id)) 
                        setEditDone(true);
                }}>삭제하기</button>
                { error }
            </div>
            {cropImage && <div className = 'crop_image_container admin'>
                <div className = 'imageCrop'>
                    <img alt = "" className = 'quit_button' src = {imageUrl('NotePage/quit_vector.svg')} onClick = {() => setCropImage(false)}/>
                    <div className = 'image_container'>
                        <ReactCrop className = 'Crop' src = {(thumbnailUri === 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' ? '' : thumbnailUri)} crop = {crop} onChange = {(newCrop) => {
                            let changeCrop = newCrop;
                            setCrop(changeCrop);

                        }} style = {{width: 'fit-content', height: 'fit-content', objectFit: 'none', minHeight: '410px'}} locked />
                    </div>
                    <div className = 'bottom_container'>
                        <div className = 'text GB px14'>드래그하여 삽입될 사진을 조절해주세요.</div>
                        <button className = 'change NS px14 whiteop10' onClick = {() => handleClick()}>사진 변경하기</button>
                        <button className = 'insert NS px14 whiteop10' onClick = {() => setCropImage(false)}>사진 삽입하기</button>
                    </div>
                </div>
            </div>}
            <Footer additionalClass= ' '/>
        </>
    )
}

export default AdminWriteContent;
