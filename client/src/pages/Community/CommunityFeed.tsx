import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/community/CommunityHeader';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import { parseDate } from '../../etc';
import { CommunityAnswer, Emotion, getCommunityAnswerByUsernameAndQuestionId, getCommunityAnswers, modifyCommunityAnswerBookmarks, modifyCommunityAnswerEmotions } from '../../etc/api/community/communityAnswer';
import { getCommunityCommentsByAnswerDataAndUsername, writeCommunityComment } from '../../etc/api/community/communityComment';
import { CommunityQuestion, getCommunityQuestions, getCommunityQuestionsRecentOrder } from '../../etc/api/community/communityQuestion';
import { CommunityUser, getCommunityUsers } from '../../etc/api/community/communityUser';
import usePromise from '../../etc/usePromise';
import { bookmarkVector, commentVector, emotionVector, PlusVector, questionVector } from '../../img/Vectors';
import { RootReducer } from '../../store';

interface FeedAnswerProps {
    user: CommunityUser,
    answer: CommunityAnswer, 
    question: CommunityQuestion
}

function CommunityFeedAnswer({ user, answer, question }: FeedAnswerProps) {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let [openComment, setOpenComment] = React.useState<boolean>(false);
    let [bookmarked, setBookmarked] = React.useState<boolean>(false);
    let [checkEmotion, setCheckEmotion] = React.useState<boolean>(false);
    let [comment, setComment] = React.useState<string>("");
    let [commentNumbering, setCommentNumbering] = React.useState<number>(0);
    let [newAnswerBookmarks, setNewAnswerBookmarks] = React.useState<string[]>(JSON.parse(JSON.stringify(answer.bookmarks)));
    let [newAnswerEmotions, setNewAnswerEmotions] = React.useState<Emotion[]>(JSON.parse(JSON.stringify(answer.emotions)));
    
    let modifyAnswerBookmarkList = async (bookmarked: boolean) => {
        if(bookmarked) {
            let userIndex = answer.bookmarks.findIndex((username) => username === communityUser.communityUser!.username);
            newAnswerBookmarks.splice(userIndex, 1);
            setNewAnswerBookmarks(newAnswerBookmarks);
            await modifyCommunityAnswerBookmarks(answer.username, answer.questionId, newAnswerBookmarks);
        } else {
            newAnswerBookmarks.push(communityUser.communityUser!.username);
            setNewAnswerBookmarks(newAnswerBookmarks);
            await modifyCommunityAnswerBookmarks(answer.username, answer.questionId, newAnswerBookmarks);
        }
    }

    let modifyAnswerEmotionList = async (checkEmotion: boolean) => {
        if(checkEmotion) {
            let userIndex = answer.emotions[0].usernames.findIndex((username) => username === communityUser.communityUser!.username);
            newAnswerEmotions[0].usernames.splice(userIndex, 1);
            setNewAnswerEmotions(newAnswerEmotions);
            await modifyCommunityAnswerEmotions(answer.username, answer.questionId, newAnswerEmotions);
        } else {
            newAnswerEmotions[0].usernames.push(communityUser.communityUser!.username);
            setNewAnswerEmotions(newAnswerEmotions);
            await modifyCommunityAnswerEmotions(answer.username, answer.questionId, newAnswerEmotions);
        }
    }
    
    React.useEffect(() => {
        if(!communityUser) return;
        setBookmarked(!!answer.bookmarks.find((username) => username === communityUser.communityUser!.username));
    }, [answer, user])

    return (
        <div className = "userAnswer">
            <div className="answerContainer">
                <div className="headerContainer">
                    <div className="profileContainer">
                        <img src="" alt="" className="profileImage" />
                        <div className="textContainer">
                            <div className="nickName">{user?.userInformation.nickName}</div>
                            <div className="tags">{question?.tag}</div>
                        </div>
                        <div className="readQuestionContainer">
                            <div className="vector">{questionVector}</div>
                            <div className="title">질문 읽기</div>
                        </div>
                    </div>
                </div>  
                {answer.answerData.imageUri && <div className="imageContainer">
                    <img src={answer.answerData.imageUri} alt="" className="answerImage" />
                </div>}
                <div className="contentContainer">
                    <div className="title">{answer.answerData.title}</div>
                    <div className="answer">{answer.answerData.answer}</div>
                </div>
                <div className="footerContainer">
                    <div className="leftContainer">
                        <div className="date">{parseDate(new Date(answer.updatedDate))}</div>
                        <Link to = {`/community/comment?un=${answer.username}&qid=${answer.questionId}`}><button className="showComments">댓글 모두 보기</button></Link>
                    </div>
                    <div className="rightContainer">
                        <button className={"emotion" + (checkEmotion ? " checkEmotion" : "")} onClick = {async () => {
                            setCheckEmotion(!checkEmotion);
                            modifyAnswerEmotionList(checkEmotion);
                        }}>{emotionVector}</button>
                        <button className={"comment" + (openComment ? " openComment" : "")} onClick={async () => {
                            setOpenComment(!openComment);
                            try {
                                const myComment = await getCommunityCommentsByAnswerDataAndUsername(communityUser.communityUser!.username, answer.questionId, answer.username);
                                setCommentNumbering(myComment![0].numbering + 1);
                            } catch {
                                setCommentNumbering(1);
                            }
                        }} style = {{marginLeft: '18px'}}>{commentVector}</button>
                        <button className={"bookmark" + (bookmarked ? " bookmarked" : "")} onClick = {() => {
                            setBookmarked(!bookmarked);
                            modifyAnswerBookmarkList(bookmarked);
                        }} style = {{marginLeft: '14px', marginTop: '4px'}}>{bookmarkVector}</button>
                    </div>
                </div>
            </div>
            {openComment && <div className="writeCommentContainer">
                <img src="" alt="" className="profileImage" />
                <textarea name="" id="" className="comment" value = {comment} onChange={(e) => setComment(e.target.value)} placeholder='댓글을 입력해주세요.'></textarea>
                <button className="upload" onClick = {async () => {
                    if(await writeCommunityComment(communityUser.communityUser!.username, answer!.username, answer!.questionId, comment, commentNumbering)) {
                        alert("저장되었습니다.");
                        setCommentNumbering(commentNumbering + 1);
                        setComment("");
                    }
                }}>게시</button>
            </div>}
        </div>
    )
}

function CommunityFeed() {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let [, allAnswers] = usePromise(() => getCommunityAnswers());
    let [, allUsers] = usePromise(() => getCommunityUsers());
    let [, allQuestionsRecentOrder] = usePromise(() =>getCommunityQuestionsRecentOrder());

    return (
        <>
            <CommunityHeader></CommunityHeader>
            <div className="CommunityFeed">
                <div className="noticeBlock">

                </div>
                <div className="feedBlock">
                    <div className="newQuestionsContainer">
                        <div className="titleContainer">
                            <div className="title">새로운 질문</div>
                            <div className="dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                        <div className="questionsContainer">
                            <div className="slide">
                                <button className="addQuestion">
                                    <div className="border"></div>
                                    <div className="plusVector">{PlusVector}</div>
                                </button>
                                {allQuestionsRecentOrder?.map((question) => {
                                    let user = allUsers?.find((user) => user.username === question.username);
                                    return (
                                        <button className="newQuestion">
                                            <div className="newDot"></div>
                                            <div className="profileImage">{user?.userInformation.profileImageUri}</div>
                                            <div className="name">{user?.userInformation.name}</div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="userAnswersContainer">
                        {allAnswers?.map((answer) => {
                            let user = allUsers?.find((user) => user.username === answer.username);
                            let question = allQuestionsRecentOrder?.find((question) => question.id === answer.questionId);
                            if(!user || !question) return <></>;
                            else return (
                                <CommunityFeedAnswer user = {user} answer = {answer} question = {question}></CommunityFeedAnswer>
                            )
                        })}
                    </div>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={1}></CommunityNavigationBar>
        </>
    )
}

export default CommunityFeed;