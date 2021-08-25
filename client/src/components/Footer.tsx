import React from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../etc/config';

interface Props {
    additionalClass: string;
}

function Footer({ additionalClass } : Props) {
    return (
        <footer className={additionalClass}>
            <div className = 'menu_container'>
                <div className = 'item'><Link to='/aboutus'>회사소개</Link></div>
                <div className = 'item'><Link to='/aboutus'>메멘토 파트너쉽</Link></div>
                <div className = 'item'><Link to='/aboutus'>이용약관</Link></div>
                <div className = 'item'><Link to='/aboutus'>개인정보처리방침</Link></div>
                <div className = 'item'><Link to='/aboutus'>사업자정보 확인</Link></div>
            </div>
            <div className = 'about_company_container_1'>
                <div className = 'item'>회사명 : memento</div>
                <div className = 'item'>대표 : 신동경</div>
                <div className = 'item'>대표이메일 : welldying.memento@gmail.com</div>
            </div>
            <div className = 'about_company_container_2'>
                <div className = 'item'>주소 : 서울특병시 관악구 봉천동 560 - 1 스프링캠프 5층 (우) 53111</div>
                <div className = 'item'>사업자등록번 : 042-444-1234</div>
            </div>
            <div className = 'copyright'>
            Copyright © 2016 Hanwha Corporation All rights reserved
            </div>
            <div className = 'footer_logo'>
                <img className = 'logo' src = {imageUrl(('footer_logo_color.png'))} alt = "profile"/>
                <div className = 'share_container'>
                    {[...Array(4).keys()].map((i) => (
                      <img src={imageUrl(`share_image_${i+1}.png`)} alt = "profile"/>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer;
