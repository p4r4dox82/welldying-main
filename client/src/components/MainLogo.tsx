import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mainLogo } from '../etc/svg';
import { RootReducer } from '../store';

interface Props {
    additionalClass: string;
}

function MainLogo({ additionalClass } : Props) {
    return (
        <div className='mainLogo'>
            <Link to='/'>
                { mainLogo }
            </Link>
        </div>
    )
}

export default MainLogo;