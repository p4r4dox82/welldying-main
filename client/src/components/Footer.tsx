import React from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../etc/config';

import { MementoLogo } from '../img/Vectors';

interface Props {
    additionalClass: string;
}

let snsuri = ["https://www.instagram.com/welldying_memento/ ", "https://m.facebook.com/memento.welldying/", "https://blog.naver.com/memento_welldying", ""];

function Footer({ additionalClass } : Props) {
    return (
        <footer className={additionalClass}>
            <div className = 'menu_container'>
                <div className = 'item' onClick = {() => window.open("https://www.notion.so/Team-Memento-480ba51aeb3a43f6ad18d19a05bba5ad", '_blank')} style = {{cursor: 'pointer'}}>회사소개</div>
                <div className = 'item'>메멘토 파트너쉽</div>
                <div className = 'item' onClick = {() => window.open("https://western-hawthorn-e48.notion.site/59cdb1872f064eb98f07cad53f5e69be", "_blank")} style = {{cursor: 'pointer'}}>이용약관</div>
                <div className = 'item' onClick = {() => window.open("https://western-hawthorn-e48.notion.site/6f11479c6ce24373baec20ee447a6d9a", "_blank")} style = {{cursor: 'pointer'}}>개인정보처리방침</div>
                <div className = 'item'>사업자정보 확인</div>
            </div>
            <div className = 'about_company_container_1'>
                <div className = 'item'>회사명 : 메멘토</div>
                <div className = 'item'>대표 : 신동경</div>
                <div className = 'item'>대표이메일 : welldying.memento@gmail.com</div>
            </div>
            <div className = 'about_company_container_2'>
                <div className = 'item'>주소 : 서울특별시 관악구 봉천동 856-6 BS타워 5층 (우) 08788</div>
                <div className = 'item'>사업자등록 번호: 176-64-00459</div>
            </div>
            <div className = 'copyright'>
            Copyright © 2021 Memento Corporation All rights reserved
            </div>
            <div className = 'footer_logo'>
                {MementoLogo}
                <div className = 'share_container'>
                    {[...Array(4).keys()].map((i, key) => (
                      <img src={imageUrl(`share_image_${i+1}.png`)} alt = "profile" key = {key} onClick = {key === 3 ? () => {} : () => window.open(snsuri[key], "_blank")} style = {{cursor: 'pointer'}}/>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer;
