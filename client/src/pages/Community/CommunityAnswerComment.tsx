import React from 'react';
import CommunityNavigationBar from '../../components/community/CommunityNavigationBar';
import queryString from 'query-string';
import usePromise from '../../etc/usePromise';
import { getUserByRearPhoneNumber } from '../../etc/api/community/communityUser';
import { getCommunityAnswerByUsernameAndQuestionId } from '../../etc/api/community/communityAnswer';
import { RootReducer } from '../../store';
import { useSelector } from 'react-redux';
import { CommunityComment, getCommunityCommentsByAnswerData, writeCommunityComment } from '../../etc/api/community/communityComment';
import { parseDate } from '../../etc';

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
    let [answerComments, setAnswerComments] = React.useState<CommunityComment[]>();
    let [comment, setComment] = React.useState<string>("");
    let [commentNumbering, setCommentNumbering] = React.useState<number>(1);
    React.useEffect(() => {
        if(!answerComments || !communityUser) return;
        let newNumbering = 0;
        answerComments.forEach((comment) => {
            if(comment.username === communityUser.communityUser?.username) {
                newNumbering = Math.max(newNumbering, comment.numbering);
            }
        })
        setCommentNumbering(newNumbering + 1);
    }, [answerComments, communityUser]);

    let reloadingComments = async() => {
        let result: CommunityComment[] | null = await getCommunityCommentsByAnswerData(username, questionId);
        if(!result) return;
        setAnswerComments(result);
        return;
    }

    React.useEffect(() => {
        if(!comments) return;
        setAnswerComments(comments);
    }, [comments]);

    React.useEffect(() => {
        console.log(commentNumbering);
    }, [commentNumbering]);


    return (
        <>
            <div className="CommunityAnswerComment">
                <div className="commentsContainer">
                    {answerComments?.map((comment) => {
                        return (
                            <div className="commentContainer">
                                <img src="" alt="" className="profileImage" />
                                <textarea name="" id="" className="comment" value = {comment.comment}></textarea>
                                <div className="date">{parseDate(new Date(comment.updatedDate))}</div>
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
                            reloadingComments();
                        }
                    }}>게시</button>
                </div>
            </div>
            <CommunityNavigationBar pageSelected={1}></CommunityNavigationBar>
        </> 
    )
}

export default CommunityAnswerComment;