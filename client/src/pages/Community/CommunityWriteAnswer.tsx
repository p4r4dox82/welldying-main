import React from 'react';
import CommunityHeader from '../../components/community/CommunityHeader';
import { getCategory } from '../../etc/api/category';
import { getCommunityAnswer, getCommunityAnswers, writeCommunityAnswer } from '../../etc/api/community/communityAnswer';
import usePromise from '../../etc/usePromise';
import { match, Redirect } from 'react-router-dom';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import queryString from 'query-string';
import { getCommunityQuestion } from '../../etc/api/community/communityQuestion';
import { RootReducer } from '../../store';
import { useSelector } from 'react-redux';
import { PlusVector } from '../../img/Vectors';
import { uploadImage_formdata } from '../../etc/api/image';

interface Props {
    location: Location;
};

function CommunityWriteAnswer({ location }: Props) {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let query = queryString.parse(location.search);
    let questionId = Number.parseInt(String(query.qid));
    let [, question] = usePromise(() => getCommunityQuestion(questionId));
    let [, communityAnswer] = usePromise(() => getCommunityAnswer(questionId));
    let [title, setTitle] = React.useState<string>("");
    let [answer, setAnswer] = React.useState<string>("");
    let [imageUri, setImageUri] = React.useState<string>("");
    let [redirectTo, setRedirectTo] = React.useState<string>("");

    let imageInputRef = React.useRef<any>(null);
    let imageButtonClick = () => imageInputRef.current.click();
    let uploadImageToS3 = async (e: any) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0]);

        const s3Uri = await uploadImage_formdata(formData);

        setImageUri(s3Uri);

        if(s3Uri === undefined) {
            setImageUri('');
        }
        return s3Uri;
    }
    

    React.useEffect(() => {
        if(!communityAnswer) return;
        setTitle(communityAnswer?.answerData.title);
        setAnswer(communityAnswer?.answerData.answer);
        setImageUri(communityAnswer?.answerData.imageUri)
        if(!communityUser || !communityUser.communityUser) return;
        else {
            writeCommunityAnswer(communityUser.communityUser!.username, questionId, { title: title, imageUri: imageUri, answer: answer }, false);
        }
    }, [communityAnswer]);


    if(redirectTo) return <Redirect to = {redirectTo}></Redirect>
    return (
        <>
            <CommunityHeader></CommunityHeader>
            <div className="CommunityWriteAnswer">
                <div className="question">
                    <div className="text">
                        {question?.question}
                    </div>
                </div>
                <div className="writeContainer">
                    <div className="menuContainer">
                        <button className="menu"></button>
                        <button className="menu"></button>
                        <button className="menu" onClick = {() => imageButtonClick()}>{PlusVector}</button>
                        <button className="menu"></button>
                        <input type="file" className="image" style = {{ display: 'none' }} ref = {imageInputRef} onChange = {(e: any) => {
                            uploadImageToS3(e);
                        }} />
                    </div>
                    <div className="headerContainer">
                        <div className="tag">{question?.tag}</div>
                        <div className="date">{"2022.01.10"}</div>
                    </div>
                    <div className="imageContainer">
                        <img src={imageUri} alt="" />
                    </div>
                    <div className="textContainer">
                        <textarea name="" id="" className="title" placeholder='제목을 입력해주세요.' value={title} onChange={(e) => setTitle(e.target.value)}></textarea>
                        <textarea name="" id="" className="answer" placeholder='내용을 입력해주세요.' value={answer} onChange={(e) => setAnswer(e.target.value)}></textarea>
                    </div>
                    <button className="save" onClick={async() => {
                        if(!title || !answer) {
                            alert("모두 입력해주세요.");
                        } else {
                            if(await writeCommunityAnswer(communityUser.communityUser!.username, questionId, { title: title, imageUri: imageUri, answer: answer }, true)) {
                                alert("저장되었습니다.");
                                setRedirectTo("/community/write/main");
                            }
                        }
                    }}>{"게시"}</button>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={2}></CommunityNavigationBar>
        </>
    )
}

export default CommunityWriteAnswer