import React from 'react';
import { imageUrl } from '../etc/config';
import { Link } from 'react-router-dom';
import { Content } from '../etc/api/content';
import { writeAnswer, getAnswers } from '../etc/api/answer';
import { getQuestions } from '../etc/api/question';
import usePromise from '../etc/usePromise';
import { uploadImage_formdata } from '../etc/api/image';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import { getSection, getSections } from '../etc/api/section';
import ReactCrop from 'react-image-crop';

interface Props {
    additionalClass: string;
    content: Content | null;
}

const checkline = (data: string) => {
  let str = data;
  let str_len = str.length;
  let data_fixed;
  if(str_len >= 550) {
    data_fixed = str.slice(0, -1);
  }
  else {
    data_fixed = str;
  }
  return data_fixed;
}

function ContentQuestion (props : Props) {
  let content = props.content;
  let [id, setId] = React.useState<number>(1);
  let user = useSelector((state: RootReducer) => state.user);
  let [message, setMessage] = React.useState<string>('');
  let [imageUri, setImageUri] = React.useState<string>('');
  let [characternumbers, setCharacternumbers] = React.useState<number>(0);

  let [save, setSave] = React.useState<boolean>(false);
  let [upload, setUpload] = React.useState<boolean>(false);

  let [, answers] = usePromise(getAnswers);
  let [, questions] = usePromise(getQuestions);
  let [, sections] = usePromise(getSections);
  let answer = answers?.find((answer) => answer.questionId === content!.question);
  let questionId = React.useMemo(() => content?.question, [content]);
  let question = React.useMemo(() => questions?.find((question) => question.id === questionId), [id, questions]);
  let section = React.useMemo(() => sections?.find((section) => section.questions.includes(id)), [id, sections]);

  React.useEffect(() => {
    if(!content) return;
    setId(content.id);
  }, [content]);

  React.useEffect(() => {
    if(!answer) return;
    setMessage(answer.message);
    if (answer.imageData.imageUrl !== '')
        setImageUri(answer.imageData.imageUrl);
  }, [answer]);

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
    width: 500,
    height: 300,
  });

  React.useEffect(() => {
    if(!answer) return;
    setMessage(answer.message);
    if (answer.imageData.imageUrl !== '')
        setImageUri(answer.imageData.imageUrl);
    setCrop({ unit: 'px', x: answer?.imageData.cropX, y: answer?.imageData.cropY, width: 500, height: 300 });
  }, [answer]);

  React.useEffect(() => {

  }, [question]);

  let input_file = React.useRef<any>(null);
  let [state, setState] = React.useState<any>({ image: '', imageLoaded: false });
  let [cropImage, setCropImage] = React.useState<boolean>(false);
  let [save_success, setSave_success] = React.useState<boolean>(false);
  let handleFileinput  = async (e: any) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);

    const s3Uri = await uploadImage_formdata(formData);
    console.log(s3Uri);
    setImageUri(s3Uri);
    if(s3Uri === undefined) {
      setImageUri('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
    }
    return s3Uri;
  }
  let handleClick = () => {
    input_file.current.click();
  };

  let Link_login = React.useRef<any>(null);


  if (!content) return <></>;
  else return (
    <>
      <Link to='/login' style = {{display: 'none'}} ref = {Link_login} />
      <div className = 'content_question'>
          <img className = 'background' src = {imageUrl('ContentPage/question_background.png')} />
          <img className = 'memento_colon' src = {imageUrl('memento_colon.png')} />
          <div className = 'question_container'>
              <div className ='question GB px20 line40'>
                <div>{question?.title.split('\n')[0]}</div>
                <div>{question?.title.split('\n')[1]}</div>
              </div>
              <div className = 'tag GB px14'>{section?.tag}</div>
              <div onClick = {(user.loggedIn ? () => {} : () => {Link_login.current.click()})}>
                <textarea className = 'answer_area GB px14 line47 op7' value={message} onChange={(e) => {setMessage(checkline(e.target.value)); setCharacternumbers(e.target.value.length);}} />
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
                    {imageUri !== '' && <button className="delete green NS px12 whiteop10" onClick = {() => {
                        setImageUri('');
                    }}>사진 삭제하기</button>}
                </div>
                <div className = 'bottom_container'>
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
          </div>
      </div>
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
    </>
  );
};

export default ContentQuestion;
