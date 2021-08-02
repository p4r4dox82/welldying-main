import React from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../etc/config';

function MainA() {
    return (
        <div style={{height: 'calc(100% - 150px)', backgroundImage: `url(${imageUrl('background.png')}`}} className='mainA'>
        </div>
    );
}

export default MainA;
