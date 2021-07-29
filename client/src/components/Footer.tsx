import React from 'react';
import { mainLogo } from '../etc/svg';

function Footer() {
    return (
        <footer>
            <span className='footerLogo'>
                { mainLogo }
            </span>
            <span className='copyright'>
                © 2020 by Memento Inc.
            </span>
        </footer>
    )
}

export default Footer;