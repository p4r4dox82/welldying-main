import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from '../store';
import { imageUrl } from '../etc/config';

interface Props {
    additionalClass: string;
}

function Header({ additionalClass } : Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [expanded_1, setExpanded_1] = React.useState<boolean>(false);
    let [expanded_4, setExpanded_4] = React.useState<boolean>(false);

    return (
      <>
        <header className={additionalClass}>

            <div className={'topbar'} >
                <div className='mainLogo_home'>
                    <Link to='/'>
                        <img src = {imageUrl('mementoLogo_text.png')}  alt = "profile"/>
                    </Link>
                </div>
                <div className='menuContainer'>
                    <div><Link to='/aboutus' className = {(expanded_1 ? ' active' : '')} onMouseEnter = {() => (setExpanded_1(true))}>메멘토 소개</Link></div>
                    <div><Link to='/checklist'>유언작성</Link></div>
                    <div><Link to='/content'>메멘토 컨텐츠</Link></div>
                    <div><Link to='/notice' className = {(expanded_4 ? ' active' : '')} onMouseEnter = {() => (setExpanded_4(true))}>고객 지원</Link></div>
                </div>
                { user.loggedIn ? (
                  <>
                  <div className = 'user_login'>
                      <img className = 'user_login' src = {imageUrl('user_login.png')}  alt = "profile"/>
                  </div>
                  <div className = 'userContainer'>
                    <div><Link to = '/mypage'>{user.user!.name + `님의 메멘토 공간`}</Link></div>
                    <div><Link to ='/logout'>로그아웃</Link></div>
                  </div>
                  </>
                ) : (
                  <>
                    <div className = 'button'>
                      <div className = 'button_text'>
                          서비스가 처음이신가요?
                      </div>
                    </div>
                    <div className = 'userContainer'>
                      <div><Link to = '/login'>로그인</Link></div>
                      <div><Link to ='/signup'>회원가입</Link></div>
                    </div>
                  </>
                )}

            </div>
            <div className = 'vector' />
            <div className = {'submenuContainter_1' + (expanded_1 ? ' active' : '')} onMouseLeave = {() => (setExpanded_1(false))}>
                <div className = 'menuItem_1'><Link to='/aboutus'>메멘토 소개</Link></div>
                <div className = 'dot' />
                <div><Link to='/aboutus'>대표의 말</Link></div>
                <div><Link to='/aboutus'>팀 소개</Link></div>
                <div><Link to='/aboutus'>팀 연혁</Link></div>
                <div><Link to='/aboutus'>브랜드 소개</Link></div>
                <div><Link to='/aboutus'>서비스 소개</Link></div>
            </div>
            <div className = {'submenuContainter_4' + (expanded_4 ? ' active' : '')} onMouseLeave = {() => (setExpanded_4(false))}>
                <div className = 'menuItem_1'><Link to='/notice'>고객 지원</Link></div>
                <div className = 'dot' />
                <div><Link to='/noticelist/1'>공지사항</Link></div>
                <div><Link to='/newslist/1'>보도자료</Link></div>
                <div><Link to='/qnalist/1'>Q&A</Link></div>
                <div><Link to='/aboutus'>커뮤니티</Link></div>
            </div>
        </header>
      </>
    )
}

export default Header;
