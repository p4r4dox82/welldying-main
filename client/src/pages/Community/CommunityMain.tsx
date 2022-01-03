import React from 'react';
import { imageUrl } from '../../etc/config';
import MobileHeader from '../../MobileComponents/MobileHeader';
import { titleBlockMainTitle, titleBlockSubTitle } from '../../textFiles/communityText';

function CommunityMain() {
    return (
        <>
            <div className="Mobile">
                <MobileHeader uri = "/community"></MobileHeader>
                <div className="CommunityMain">
                    <div className="titleBlock">
                        <img src={imageUrl('main_background.png')} alt="" className="background" />
                        <div className="subTitle">
                            {titleBlockSubTitle}
                        </div>
                        <div className="mainTitle">
                            {titleBlockMainTitle}
                        </div>
                        <div className="communityUserNum">{"커뮤니티 참여 인원 " + 50}</div>
                    </div>
                    <div className="feedBlock">
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommunityMain;