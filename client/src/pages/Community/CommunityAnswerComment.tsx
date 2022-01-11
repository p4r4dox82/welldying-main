import React from 'react';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import queryString from 'query-string';
import usePromise from '../../etc/usePromise';
import { getUserByRearPhoneNumber } from '../../etc/api/community/communityUser';
import { getCommunityAnswerByUsernameAndQuestionId } from '../../etc/api/community/communityAnswer';
import { RootReducer } from '../../store';
import { useSelector } from 'react-redux';
import { getCommunityCommentsByAnswerData, writeCommunityComment } from '../../etc/api/community/communityComment';

interface Props {
    location: Location;
}

function CommunityAnswerComment({ location }: Props) {
    const query = queryString.parse(location.search);
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let questionId = Number.parseInt(String(query.qid));
    let username = String(query.un);
    let [, answer] = usePromise(() => getCommunityAnswerByUsernameAndQuestionId(username, questionId));
    let [, comments] = usePromise(() => getCommunityCommentsByAnswerData(username, questionId));
    let [comment, setComment] = React.useState<string>("");
    let [commentNumbering, setCommentNumbering] = React.useState<number>(1);
    React.useEffect(() => {
        if(!comments || !communityUser) return;
        let newNumbering = 1;
        comments.forEach((comment) => {
            console.log(comment.username);
            if(comment.username === communityUser.communityUser?.username) {
                newNumbering++;
            }
        })
        console.log(newNumbering);
        setCommentNumbering(newNumbering);
    }, [comments, communityUser]);


    return (
        <>
            <div className="CommunityAnswerComment">
                <div className="commentsContainer">
                    {comments?.map((comment) => {
                        return (
                            <div className="commentContainer">
                                <img src="" alt="" className="profileImage" />
                                <textarea name="" id="" className="comment" value = {comment.comment}></textarea>
                                <button className="upload"></button>
                            </div>
                        )
                    })}
                </div>
                <div className="writeCommentContainer">
                    <img src="" alt="" className="profileImage" />
                    <textarea name="" id="" className="comment" value = {comment} onChange={(e) => setComment(e.target.value)} placeholder='댓글을 입력해주세요.'></textarea>
                    <button className="upload" onClick = {async () => {
                        if(await writeCommunityComment(communityUser.communityUser!.username, answer!.username, answer!.questionId, comment, commentNumbering)) {
                            alert("저장되었습니다.");
                            setCommentNumbering(commentNumbering + 1);
                            setComment("");
                        }
                    }}>게시</button>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={1}></CommunityNavigationBar>
        </> 
    )
}

export default CommunityAnswerComment;