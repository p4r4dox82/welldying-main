import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mainLogo } from '../etc/svg';
import { RootReducer } from '../store';

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
                    { mainLogo }
                </Link>
            </div>
            
            <div className={'topbar' + (expanded ? ' expanded' : '')} >
                <Link to='/checklist'>
                    <div className='boxContainer'>
                        { user.loggedIn ? `${user.user!.name}님의 웰다잉 서비스`: '웰다잉 서비스가 처음이신가요?' }
                    </div>
                </Link>
                <div className='menuContainer'>
                    <div><Link to='/checklist'> My Checklist </Link></div>
                    <div><Link to='/aboutus'> About Us </Link></div>
                    <div> Q&amp;A 게시판 </div>
                </div>
            </div>
        </header>
    )
}

export default Header;