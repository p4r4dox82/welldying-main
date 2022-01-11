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
import { image } from 'html2canvas/dist/types/css/types/image';

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
                        <button className="menu"></button>
                        <button className="menu"></button>
                    </div>
                    <div className="headerContainer">
                        <div className="tag">{question?.tag}</div>
                        <div className="date">{"2022.01.10"}</div>
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