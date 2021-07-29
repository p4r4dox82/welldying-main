import React from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../etc/config';

function MainA() {
    return (
        <div style={{height: 'calc(100% - 150px)', backgroundImage: `url(${imageUrl('background.png')}`}} className='mainA'>
            <div />
            <div className='copyText'>
                아직 전하지 못한 말이 많아서,
                <br/>
                미안하고, 사랑하고, 감사하다.
            </div>
            <div className='aboutButton'>
                <Link to='/checklist'> &gt; 마이 웰다잉 서비스 바로가기 </Link>
            </div>
        </div>
    );
}

export default MainA;