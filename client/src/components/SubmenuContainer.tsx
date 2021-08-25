import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    additionalClass: string;
}

function SubmenuContainer({ additionalClass } : Props) {
    return (
        <>
            <Link to = '/noticelist/1'><div className = {'text ' + (additionalClass === 'notice' ? 'selected' : '')}>공지사항</div></Link>
            <Link to = '/newslist/1'><div className = {'text ' + (additionalClass === 'news' ? 'selected' : '')}>보도자료</div></Link>
            <Link to = '/qnalist/1'><div className = {'text ' + (additionalClass === 'qna' ? 'selected' : '')}>Q&A</div></Link>
        </>
    )
}

export default SubmenuContainer;
