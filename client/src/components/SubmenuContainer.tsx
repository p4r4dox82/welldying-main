import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    additionalClass: string;
}

function SubmenuContainer({ additionalClass } : Props) {
    return (
        <>
            <Link to = '/noticelist/1'><div className = {additionalClass === 'notice' ? 'selected' : ''}>공지사항</div></Link>
            <Link to = '/newslist/1'><div className = {additionalClass === 'news' ? 'selected' : ''}>보도자료</div></Link>
            <Link to = '/qnalist/1'><div className = {additionalClass === 'qna' ? 'selected' : ''}>Q&A</div></Link>
            <Link to = '/aboutus'><div className = {additionalClass === 'aboutus' ? 'selected' : ''}>커뮤니티</div></Link>
        </>
    )
}

export default SubmenuContainer;
