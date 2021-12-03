import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { HomeVector, MementoBookVector, MementoContentVector, MementoLogo, MementoMainVector, MementoNoteVector, NoticeVector, PlusVector, rightVector, toggleVector, UserImage } from "../img/Vectors";
import { RootReducer } from '../store';

interface Props {
    uri: string;
}

function MobileHeader({ uri }: Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [menuActive, setMenuActive] = React.useState<boolean>(false);
    let linkMyPage = React.useRef<any>(null);

    return (
        <>
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <Link to ='/mypage' ref = {linkMyPage} style = {{display: 'none'}} />
            <div className={"Header" + (menuActive ? ' active' : '')}>
                <div className="Topbar">
                    <div className="userimage">{}</div>
                    <Link to = '/'><div className="MementoLogo">{MementoLogo}</div></Link>
                    <div className="toggle" onClick = {() => setMenuActive(!menuActive)}>{toggleVector}</div>
                </div>
                <div className="Menu">
                    <div className="background"></div>
                    <div className="MenuContainer">
                            <button className="quitMenu" onClick = {() => setMenuActive(false)}>{PlusVector}</button>
                            <div className="userInfoContainer">
                                <div className="userImage">{UserImage}</div>
                                <div className="textContainer">
                                    {user.loggedIn && <>
                                        <div className="name">{user.user?.name}</div>
                                        <div className="email">{user.user?.email}</div>
                                        <Link to = {'/mypage'}><div className="linkMyPage">{'마이페이지 >'}</div></Link>
                                    </>}
                                    {!user.loggedIn && <>
                                        <div className="loginMessage">로그인 후 사용해주세요.</div>
                                        <Link to = {'/login'}><div className="linkLogin">{'로그인하기 >'}</div></Link>
                                    </>}
                                </div>
                            </div>
                            <div className="dashLine"></div>
                            <div className="linksBlock">
                                <Link to = {'/'}>
                                <div className="linkContainer">
                                    <div className="vector">{HomeVector}</div>
                                    <div className="title">메인</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                </Link>
                                <div className="linkContainer">
                                    <div className="vector">{NoticeVector}</div>
                                    <div className="title">알림</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                            </div>
                            <div className="dashLine"></div>
                            <div className="linksBlock">
                                <div className="linkContainer" onClick = {() => window.open('https://www.notion.so/Team-Memento-480ba51aeb3a43f6ad18d19a05bba5ad', '_blank')}>
                                    <div className="vector">{MementoMainVector}</div>
                                    <div className="title">메멘토는</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                <Link to = {'/content/1'}>
                                <div className="linkContainer">
                                    <div className="vector">{MementoContentVector}</div>
                                    <div className="title">메멘토 컨텐츠</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                </Link>
                                <Link to ={'/note'}>
                                <div className="linkContainer">
                                    <div className="vector">{MementoNoteVector}</div>
                                    <div className="title">메멘토 노트</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                </Link>
                                <div className="linkContainer" onClick = {() => alert('모바일 메멘토 북 서비스가 준비중입니다. PC크롬을 이용하여 접속해주십시오.')}>
                                    <div className="vector">{MementoBookVector}</div>
                                    <div className="title">메멘토 북</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                            </div>
                            <div className="dashLine"></div>
                            <div className="linksBlock">
                                <div className="linkContainer">
                                    <div className="vector" style = {{opacity: '0'}}>{MementoMainVector}</div>
                                    <div className="title">설정</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                <div className="linkContainer">
                                    <div className="vector" style = {{opacity: '0'}}>{MementoContentVector}</div>
                                    <div className="title">고객센터</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                <Link to = {user.loggedIn ? '/logout' : {pathname: '/login', state: {from: '/'}}}>
                                <div className="linkContainer">
                                    <div className="vector" style = {{opacity: '0'}}>{MementoNoteVector}</div>
                                    <div className="title">{user.loggedIn ? '로그아웃' : '로그인'}</div>
                                    <div className="leftVector">{rightVector}</div>
                                </div>
                                </Link>
                            </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileHeader;