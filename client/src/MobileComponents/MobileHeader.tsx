import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { MementoLogo, toggleVector, UserImage } from "../img/Vectors";
import { RootReducer } from '../store';

interface Props {
    uri: string;
}

function MobileHeader({ uri }: Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [menu, setMenu] = React.useState<boolean>(false);
    let linkMyPage = React.useRef<any>(null);
    let clickLinkMyPage = () => linkMyPage.current.click();

    return (
        <>
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <div className={"Header" + (menu ? ' active' : '')}>
                <div className="Topbar">
                    <div className="userimage">{}</div>
                    <Link to = '/'><div className="MementoLogo">{MementoLogo}</div></Link>
                    <div className="toggle" onClick = {() => setMenu(!menu)}>{toggleVector}</div>
                </div>
                <div className="Menu">
                    <span className="Name" onClick = {user.loggedIn ? () => clickLinkMyPage() : () => {}}>
                        {user.loggedIn && <div className="userimage" >{UserImage}</div>}{user.loggedIn ? user.user?.name + '님' : ''}
                    </span>
                    <Link to = {user.loggedIn ? '/logout' : {pathname: '/login', state: {from: '/'}}}><span className="login">{user.loggedIn ? '로그아웃' : '로그인'}</span></Link>
                </div>
            </div>
        </>
    )
}

export default MobileHeader;