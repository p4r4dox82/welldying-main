import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mainLogo } from '../etc/svg';
import { RootReducer } from '../store';
import { imageUrl } from '../etc/config';

interface Props {
    additionalClass: string;
}

function Header({ additionalClass } : Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <header className={additionalClass} onClick={(e) => { e.preventDefault(); setExpanded(!expanded) }}>
            <div className='mainLogo'>
                <Link to='/'>
                    <img src = {imageUrl('mementoLogo_text.png')} />
                </Link>
            </div>

            <div className={'topbar' + (expanded ? ' expanded' : '')} >
                <div className='menuContainer'>
                    <div><Link to='/aboutus'> 메멘토 소개 </Link></div>
                    <div><Link to='/aboutus'> 서비스 소개 </Link></div>
                    <div><Link to='/content'> 메멘토 컨텐츠 </Link></div>
                    <div><Link to='/checklist'> 유언작성 </Link></div>
                </div>
                <div className = 'userContainer'>
                    <div><Link to = '/login'> 로그인 </Link></div>
                    <div><Link to ='/Signup'> 회원가입 </Link></div>
                </div>
                <div className = 'searchContainer'>
                    <input type = 'text' name = 'search'/>
                </div>
            </div>
        </header>
    )
}

export default Header;
