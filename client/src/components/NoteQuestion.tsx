import React from 'react';
import { imageUrl } from '../etc/config';
import { Link, match, Redirect } from 'react-router-dom';
import { getContent, contentComment, Content } from '../etc/api/content';
import { Question, deleteQuestion } from '../etc/api/question';
import { uploadImage } from '../etc/api/image';
import { getAnswers, writeAnswer, addBook } from '../etc/api/answer';
import { getContents } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { parseDate } from '../etc/index';
import { uploadImage_formdata } from '../etc/api/image';
import ReactCrop from 'react-image-crop';
import { RootReducer } from '../store';
import { useSelector } from 'react-redux';
import { halfColon, leftVector, PlusVector } from '../img/Vectors';

interface Props {
  question: Question | undefined;
  written: boolean;
  type: string;
  order: number;
}

const checkline = (data: string) => {
  let str = data;
  let str_len = str.length;
  let data_fixed;
  if(str_len >= 550) {
    data_fixed = str.slice(0, 549);
  }
  else {
    data_fixed = str;
  }
  return data_fixed;
}

function NoteQuestion(props: Props) {
  let question = props.question;
  let [show_answer, setShow_answer] = React.useState<boolean>(false);
  let [answer_type, setAnswer_type] = React.useState<string>('');

  let id = React.useMemo(() => Number(question?.id), [question]);
  let user = useSelector((state: RootReducer) => state.user);
  let contentid = React.useMemo(() => question?.contents[0], [question]);
  let [message, setMessage] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);
  let [imageUri, setImageUri] = React.useState<string>('');

  let [save, setSave] = React.useState<boolean>(false);
  let [save_success, setSave_success] = React.useState<boolean>(false);
  let [upload, setUpload] = React.useState<boolean>(false);
  let [del, setDel] = React.useState<boolean>(false);
  let [add, setAdd] = React.useState<boolean>(false);
  let [showcontent, setshowcontent] = React.useState<boolean>(false);
  let [smallHover, setSmallHover] = React.useState<boolean>((props.type === 'small' ? false : true));

  let [, answers] = usePromise(getAnswers);
  let [, contents] = usePromise(getContents);
  let answer = React.useMemo(() => answers?.find((answer) => answer.questionId === id), [answers, id]);
  let content = React.useMemo(() => contents?.find((content) => content.id === contentid), [contents, contentid]);

  let [booked, setBooked] = React.useState<number>(0);
  
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
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    setSmallHover((props.type === 'small' ? false : true));
  }, [props])

  React.useEffect(() => {
    if(!answer) return;
    setMessage(answer.message);
    setCharacternumbers(answer.message.length);
    if (answer.imageData.imageUrl !== '')
        setImageUri(answer.imageData.imageUrl);
    setCrop({ unit: 'px', x: answer?.imageData.cropX, y: answer?.imageData.cropY, width: 500, height: 300 });
    setBooked(answer.book);
  }, [answer]);

  React.useEffect(() => {
    if(imageUri !== answer?.imageData.imageUrl)
        setCrop({ ...crop, x: 0, y: 0 });
  }, [imageUri]);

  let [exceptuser, setExceptUser] = React.useState<string[]>([]);

  React.useEffect(() => {
    if(!question) return;
    setExceptUser(question.userdata.exceptuser);
  }, [question]);

  let input_file = React.useRef<any>(null);
  let [state, setState] = React.useState<any>({ image: '', imageLoaded: false });
  let [cropImage, setCropImage] = React.useState<boolean>(false);
  let handleFileinput  = async (e: any) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);

    const s3Uri = await uploadImage_formdata(formData);
    console.log(s3Uri);
    setImageUri(s3Uri);
    if(s3Uri === undefined) {
      setImageUri('');
    }
    return s3Uri;
  }
  let handleClick = () => {
    input_file.current.click();
  };


  if(!question) return <></>;
  else return (
    <div style = {{width: (props.type === 'small' ? '235px' : ''), height: ((props.type === 'small' && !show_answer) ? '360px' : '')}}>
        {props.written && <div className = {'questionBox ' + props.type + ' ' + String(props.order)}  style = {{cursor: 'pointer'}} onMouseOver = {props.type === 'small' ? () => setSmallHover(true) : () => {}} onMouseLeave = {props.type === 'small' ? () => {setSmallHover(false); setDel(false); setAdd(false)} : () => {}}>
            <div className = 'click_area' style = {{width: '100%', height: '100%', borderRadius: '5px'}} onClick = {() => {setShow_answer(!show_answer); setAnswer_type('written');}}>
                {props.type === 'small' && <div className = 'cover' style = {{background: 'rgba(255, 255, 255, 1)', width: '100%', height: '100px', top: '230px'}} />}
                <div className = {'title GB ' + (props.type === 'small' ? 'px15 line30' : 'px20 line40')} style = {{margin: '0px'}} >
                    {props.type === 'small' ? <div style = {{marginTop: '18px'}}>
                        {question.title}
                    </div>
                    : <>
                        <div>{question.title.split('\n')[0]}</div>
                        <div>{question.title.split('\n')[1]}</div>
                    </>}
                </div>
                <div className = 'answerdate GB px13'>{'답변일 : ' + (answer?.updatedAt === undefined ? String(parseDate(new Date())) : String(parseDate(new Date(Number(answer?.updatedAt)))))}</div>
                {!(props.type === 'type2') && <div className = 'write_button NS px12' >
                    답변보기
                    <img src = {imageUrl('NotePage/down_image.png')} />
                </div>}
            </div>
            {!(props.type === 'add') && <>
                {smallHover && <>
                    <div className="delButton" onClick = {() => {setDel(!del);}}>
                        {PlusVector}
                    </div>
                    {props.type !== 'type2' && <div className="addButton" onClick = {() => setAdd(!add)}>
                        {halfColon}
                    </div>}
                </>}
                {question.contents.length !== 0 && <div className = 'content_button' onMouseOver = {() => setshowcontent(true)} onMouseLeave = {() => setshowcontent(false)}>
                    <Link to={`/contentpage/${question.contents[0]}`}><button className = 'white NS px12 op10'>대표 컨텐츠 바로가기</button></Link>
                </div>}
                <div className = 'left_vector' >
                    <div className = 'angle' />
                    <div className = 'round' />
                </div>
                {del && smallHover && <div className = 'del_container' style = {{zIndex: 10}}>
                    <div className = 'text GB px14'>해당 질문을 삭제하시겠습니까?</div>
                    <button className = 'rec white NS px12' onClick = {() => setDel(false)}>돌아가기</button>
                    <button className = 'rec green NS px12' onClick = {async () => {
                        let newexceptuser = exceptuser;
                        newexceptuser = newexceptuser?.concat(user.user!.username);
                        if(await deleteQuestion(id, newexceptuser))
                            alert('질문이 삭제되었습니다.');
                    }}>삭제하기</button>
                </div>}
                {add && smallHover && <div className = 'add_container' style = {{zIndex: 10}}>
                    <div className = 'text GB px14 line20'>해당 질문을 메멘토 북에 추가하시겠습니까?</div>
                    <button className = 'rec white NS px12' onClick = {() => setAdd(false)}>돌아가기</button>
                    <button className = 'rec green NS px12' onClick = {async () => {
                        if(user.user?.bookname.length === 0)
                            alert('아직 메멘토 북이 존재하지 않습니다. 메멘토 북 추가 후 다시 시도해주세요.')
                        else if (booked === 1 || answer?.book === 1)
                            alert('이미 메멘토 북에 추가된 질문입니다.')
                        else if (await addBook(Number(id), 1)) {
                            setBooked(1);
                            alert('해당 질문이 메멘토 북에 추가되었습니다.');
                            setAdd(false);
                        }
                    }}>추가하기</button>
                </div>}
            </>}
            {props.type === 'add' && <>
                <button className = 'add_button' onClick = {async () => {
                    if (await addBook(Number(id), 1))
                        setBooked(1);
                }}>
                    <img className = 'add_image' src = {imageUrl('NotePage/add_vector.svg')} />
                    <div className = 'text NS px12 op4 bold'>추가하기</div>
                </button>
            </>}
            {showcontent && <div className = 'show_content_container'>
            <img src = {((content?.imageData && content?.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} style = {{width: (props.type === 'small' ? '207px' : '108px'), height: (props.type === 'small' ? '122px' : '64px'), objectFit: 'cover', borderRadius: '5px'}}/>
            <div className = 'content_title NS px12 line15'>{content?.title.split('_')[0].slice(0, 25) + ((Number(content?.title.split('_')[0].length) > 25) ? '...' : '')}</div>
            <div className = 'content_writer NS px12 line15'>{content?.title.split('_')[1]}</div>
            </div>}
        </div>}
        {!props.written && <div className = 'questionBox unwritten'  style = {{cursor: 'pointer'}}>
            <div className = 'click_area' style = {{width: '100%', height: '100%', borderRadius: '5px'}} onClick = {() => {setShow_answer(!show_answer); setAnswer_type('written');}}>
                <div className = 'title GB px20 line40' style = {{margin: '0px'}}>
                    <div>{question.title.split('\n')[0]}</div>
                    <div>{question.title.split('\n')[1]}</div>
                </div>
            </div>
            {question.contents.length !== 0 && <div className = 'content_button' onMouseOver = {() => setshowcontent(true)} onMouseLeave = {() => setshowcontent(false)}>
                <Link to={`/contentpage/${question.contents[0]}`}><button className = 'white NS px12 op10'>대표 컨텐츠 바로가기</button></Link>
            </div>}
            {props.type !== 'add' && <img className = 'delete_button' src = {imageUrl('NotePage/delete_button.png')} onClick = {() => {setDel(!del);}}/>}
            {del && <div className = 'del_container' style = {{top: '12px', zIndex: 10}}>
                <div className = 'text GB px14'>해당 질문을 삭제하시겠습니까?</div>
                <button className = 'rec white NS px12' onClick = {() => setDel(false)}>돌아가기</button>
                <button className = 'rec green NS px12' onClick = {async () => {
                    let newexceptuser = exceptuser;
                    newexceptuser = newexceptuser?.concat(user.user!.username);
                    if(await deleteQuestion(id, newexceptuser))
                        alert('질문이 삭제되었습니다.');
                }}>삭제하기</button>
            </div>}
            {showcontent && <div className = 'show_content_container'>
                <img src = {((content?.imageData && content?.imageData.imageUrl) ? content?.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} style = {{width: '108px', height: '64px', objectFit: 'cover'}}/>
                <div className = 'content_title NS px12 line15'>{content?.title.split('_')[0].slice(0, 20)}</div>
                <div className = 'content_writer NS px12 line15'>{content?.title.split('_')[1]}</div>
            </div>}
        </div>}
        {show_answer && <div className = {'note_question ' + answer_type + ' ' + props.type} style = {{marginLeft: (props.order !== -1 ? `${-30 -265 * (props.order % 3)}px` : ''), height: 'fit-content', marginTop: (props.type === 'add' ? '-121px' : '')}}>
            <img className = 'background' src = {imageUrl('ContentPage/question_background.png')} style = {{height: '100%'}}/>
            {props.type === 'small' && <div className="question GB px18 line30">
                <div>{question.title.split('\n')[0]}</div>
                <div>{question.title.split('\n')[1]}</div>    
            </div>}
            <div className="closeQuestion" style = {{top: (props.type === 'small' ? '54px' : '174px')}} onClick = {() => setShow_answer(false)}>
                {leftVector}
            </div>
            <div className = 'question_container'>
                <textarea className = 'answer_area GB px15 line40 op7' value={message} onChange={(e) => {setMessage(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}} />
                <div className = 'characternumbers NS px12 bold op6'>
                {Math.min(550, characternumbers) + ' / 550 자'}
                </div>
                <div className = 'image_uploader'>
                    <div className = 'fileSelector' style = {{height: (imageUri === '' ? 150 : (400 + 60))}}>
                        <button className = 'image_input' onClick = {() => {handleClick(); setCropImage(true);}} >
                            <div className = 'new_image' style = {{margin: 'auto', width: 400, height: (imageUri === '' ? 150 : 400), overflow: 'hidden'}}>
                                <img className = 'new_image' src = {(imageUri === '' ? 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' : imageUri)} style = {{width: (imageUri === '' ? '67px' : '400px'), height: (imageUri === '' ? '67px' : '400px'), objectFit: (imageUri === '' ? 'none' : 'cover')}}/>
                            </div>
                            {false && <div className = 'new_image' style = {{margin: 'auto', width: crop.width, height: (imageUri === '' ? 150 : crop.height), overflow: 'hidden'}}>
                                <img className = 'new_image' src = {(imageUri === '' ? 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' : imageUri)} style = {{left: -crop.x, top: -crop.y, objectFit: 'none', marginTop: (imageUri === '' ? '11px' : '0px')}}/>
                            </div>}
                        </button>
                        <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
                    </div>
                </div>
                <div className = 'bottom_container' style = {{paddingBottom: '50px'}}>
                    <div className = 'more'>
                        <div className = 'NS px12 op9'>같은 질문에 사람들은 어떻게 답변했을까요?</div>
                        <div className = 'NS px12 op9 bold'>{'소통공간 오픈 준비중입니다. 많은 기대 부탁드립니다.'}</div>
                    </div>
                    <button className = 'white NS px13 op9' onClick = {() => setUpload(!upload)}>소통공간에 게시하기</button>
                    <button className = 'green NS px13 op9' onClick = {() => setSave(!save)}>저장하기</button>
                    {save && <div className = 'save_container'>
                        <div className = 'text GB px14'>이대로 저장하시겠습니까?</div>
                        <button className = 'rec white NS px12' onClick = {() => setSave(false)}>돌아가기</button>
                        <button className = 'rec green NS px12' onClick = {async () => {
                            if(await writeAnswer(id!, message, characternumbers, { imageUrl: imageUri, cropX: crop.x, cropY: crop.y }))
                                setSave_success(true);
                            setSave(false);
                        }}>저장하기</button>
                    </div>}
                    {save_success && <div className = 'save_success'>
                        <div className = 'text GB px14 line25'>안전하게 저장되었습니다.</div>
                        <button className = 'rec green NS px12' onClick = {() => {
                          setSave_success(false);
                        }}>확인</button>
                    </div>}
                    {upload && <div className = 'upload_container'>
                        <div className = 'text GB px14'>이대로 게시하시겠습니까?</div>
                        <button className = 'rec white NS px12' onClick = {() => setUpload(false)}>돌아가기</button>
                        <button className = 'rec green NS px12' >게시하기</button>
                        <div className="notopen GB px15 whiteop10" style = {{width: '100%', height: '100%', background: 'rgba(96, 103, 99, 0.8)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>오픈 준비중입니다.</div>
                    </div>}
                </div>
            </div>
        </div>}
        {(false && cropImage) && <div className = 'crop_image_container'>
            <div className = 'imageCrop'>
                <img className = 'quit_button' src = {imageUrl('NotePage/quit_vector.svg')} onClick = {() => setCropImage(false)}/>
                <div className = 'image_container'>
                    <ReactCrop className = 'Crop' src = {(imageUri)} crop = {crop} onChange = {(newCrop) => {
                        let changeCrop = newCrop;
                        setCrop({...changeCrop, height: changeCrop.width});

                    }} style = {{width: 'fit-content', height: 'fit-content', objectFit: 'none', minHeight: '410px'}} />
                </div>
                <div className = 'bottom_container'>
                    <div className = 'text GB px14'>드래그하여 삽입될 사진을 조절해주세요.</div>
                    <button className = 'change NS px14 whiteop10' onClick = {() => handleClick()}>사진 변경하기</button>
                    <button className = 'insert NS px14 whiteop10' onClick = {() => setCropImage(false)}>사진 삽입하기</button>
                </div>
            </div>
        </div>}
    </div>
  );
};

export default NoteQuestion;
