import React from 'react';
import { Link } from 'react-router-dom';
import { feedVector, homeVector, myPageVector, writeVector } from '../../img/Vectors';

interface Props {
    pageSelected: number;
}

function CommunityNavigationBar(props: Props) {
    let [pageSelected, setPageSelected] = React.useState<number>(0);

    React.useEffect(() => {
        setPageSelected(props.pageSelected);
    }, []);

    return (
        <>
            <div className="CommunityNavigationBar">
                <Link to ="/community/main"><button className="home" onClick = {() => setPageSelected(0)}>{homeVector}</button></Link>
                <Link to = "/community/feed"><button className="feed" onClick = {() => setPageSelected(1)}>{feedVector}</button></Link>
                <Link to = "/community/write/main"><button className="write" onClick = {() => setPageSelected(2)}>{writeVector}</button></Link>
                <button className="myPage" onClick = {() => setPageSelected(3)}>{myPageVector}</button>
                <div className="pageSelected" style = {{transform: `translateX(${pageSelected * (42 + 25)}px)`}}></div>
            </div>
        </>
    )
}

export default CommunityNavigationBar;