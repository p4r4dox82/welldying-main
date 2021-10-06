import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootReducer } from '../store';
import { imageUrl } from '../etc/config';
import { MementoLogo } from '../img/Vectors';

interface Props {
    additionalClass: string;
}

function Header({ additionalClass } : Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [expanded_1, setExpanded_1] = React.useState<boolean>(false);
    let [expanded_2, setExpanded_2] = React.useState<boolean>(false);
    let [expanded_4, setExpanded_4] = React.useState<boolean>(false);

    return (
      <>
        <header className={additionalClass}>
            <div className={'topbar'} >
                <div className='mainLogo_home'>
                    <Link to='/'>
                        {MementoLogo}
                    </Link>
                </div>
                <div className='menuContainer'>
                    <div><Link to='/aboutus' className = {(expanded_1 ? ' active' : '')} onMouseEnter = {() => (setExpanded_1(true))} style = {{cursor: 'pointer'}}>메멘토 소개</Link></div>
                    <div><Link to='/note/1' className = {(expanded_2 ? ' active' : '')} onMouseEnter = {() => (setExpanded_2(true))}><span style = {{padding: '0px 5px'}}>나의 서재</span></Link></div>
                    <div><Link to='/content/0'>메멘토 컨텐츠</Link></div>
                    <div><Link to='/notice' className = {(expanded_4 ? ' active' : '')} onMouseEnter = {() => (setExpanded_4(true))}>고객 지원</Link></div>
                </div>
                { user.loggedIn ? (
                  <>
                  <div className = {'userContainer' + (user.user?.username === 'admin' ? ' admin' : '')}>
                    {user.user?.username === 'admin' && <div className="admin"><Link to = '/admin'>admin</Link></div>}
                    <div><Link to = '/mypage'>{user.user!.name + `님의 메멘토 공간`}</Link></div>
                    <div><Link to ='/logout'>로그아웃</Link></div>
                  </div>
                  </>
                ) : (
                  <>
                    <div className = 'userContainer'>
                      <div><Link to = '/login'>로그인</Link></div>
                      <div><Link to ='/signup'>회원가입</Link></div>
                    </div>
                  </>
                )}

            </div>
            <div className = 'vector' style = {{zIndex: 10}} />
            <div className={"submenuContainerBar" + ((expanded_1 || expanded_2 || expanded_4) ? ' active' : '')} style = {{display: 'flex', width: '500px'}}>
              <div className = {'submenuContainer' + (expanded_1 ? ' active' : '')} onMouseLeave = {() => (setExpanded_1(false))}>
                  <div className = 'menuItem_1' onClick = {() => window.open('https://www.notion.so/Team-Memento-480ba51aeb3a43f6ad18d19a05bba5ad', '_blank')} style = {{cursor: 'pointer'}}>메멘토 소개</div>
                  {false && <><div className = 'dot' />
                  <div><Link to='/aboutus'>대표의 말</Link></div>
                  <div><Link to='/aboutus'>팀 소개</Link></div>
                  <div><Link to='/aboutus'>팀 연혁</Link></div>
                  <div><Link to='/aboutus'>브랜드 소개</Link></div>
                  <div><Link to='/aboutus'>서비스 소개</Link></div>
                  </>}
              </div>
              <div style = {{padding: '0px 1px', opacity: '0', fontSize: '15px'}}>|</div>
              <div className = {'submenuContainer' + (expanded_2 ? ' active' : '')} onMouseLeave = {() => (setExpanded_2(false))}>
                  <div className = 'menuItem_1'><Link to='/note'><span style = {{padding: '0px 5px'}}>나의 서재</span></Link></div>
                  <div className = 'dot' />
                  <div><Link to='/note/1'>메멘토 노트</Link></div>
                  <div><Link to='/notebook/0'>메멘토 북</Link></div>
                  <div><Link to='/note'>함께쓰는 노트</Link></div>
              </div>
              <div style = {{padding: '0px 1px', opacity: '0', fontSize: '15px'}}>|</div>
              <div className = {'submenuContainer'}>
                  <div className = 'menuItem_1'><Link to='/note'>메멘토 컨텐츠</Link></div>
              </div>
              <div style = {{padding: '0px 1px', opacity: '0', fontSize: '15px'}}>|</div>
              <div className = {'submenuContainer' + (expanded_4 ? ' active' : '')} onMouseLeave = {() => (setExpanded_4(false))}>
                  <div className = 'menuItem_1'><Link to='/noticelist/1'>고객 지원</Link></div>
                  <div className = 'dot' />
                  <div><Link to='/noticelist/1'>공지사항</Link></div>
                  <div><Link to='/newslist/1'>보도자료</Link></div>
                  <div><Link to='/qnalist/1'>Q&A</Link></div>
                  {false && <div><Link to='/aboutus'>커뮤니티</Link></div>}
              </div>
            </div>
        </header>
      </>
    )
}

export default Header;
