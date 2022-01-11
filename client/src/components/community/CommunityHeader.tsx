import React from 'react';
import { MementoLogo, menuVector, noticeVector, searchVector } from '../../img/Vectors';
import { useSelector } from 'react-redux';
import { RootReducer } from '../../store';
import { communityLogin, communityLogout } from '../../etc/api/community/communityUser';
import { Link } from 'react-router-dom';

function CommunityHeader() {
    let communityUser = useSelector((state: RootReducer) => state.communityUser);
    let user = useSelector((state: RootReducer) => state.user);
    let [menu, setMenu] = React.useState<boolean>(false);
    let [username, setUsername] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");

    let trylogin = async() => {
        if(await communityLogin(username, password)) {
            alert("로그인 성공");
        }
    }
    let trylogout = async() => {
        if(await communityLogout()) {
            alert("로그아웃");
        }
    }

    return (
        <>
            <div className="CommunityHeader">
                <div className="border"></div>
                <Link to = "/community/feed"><div className="mementoLogo">{MementoLogo}</div></Link>
                <div className="menuContainer">
                    <div className="notice">{noticeVector}</div>
                    <div className="search">{searchVector}</div>
                    <div className="menu" onClick = {() => setMenu(!menu)}>{menuVector}</div>
                </div>
                {menu && <div className="menuBar">
                    {!communityUser.loggedIn && <>
                        <input type="text" className="username" value = {username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" className="password" value = {password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="login" onClick = {() => {
                            trylogin();
                        }}>로그인</button>
                    </>}
                    {communityUser.loggedIn && <>
                        <button onClick={() => {
                            console.log(communityUser);
                        }}>유저 정보</button>
                        <button className="logout" onClick={() => {
                            trylogout();
                        }}>로그아웃</button>
                    </>}
                </div>}
            </div>
            
        </>
    )
}

export default CommunityHeader;