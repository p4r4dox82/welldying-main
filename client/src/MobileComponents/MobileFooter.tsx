import { imageUrl } from "../etc/config";

function MobileFooter() {
    //Footer Variable
    let snsuri = ["https://www.instagram.com/memento.welldying/", "https://business.facebook.com/memento.welldying/", "https://blog.naver.com/memento_welldying", ""];

    return (
        <>
        <div className="Footer">
            <div className="whiteBackground">
                <div>회사명 : 메멘토</div>
                <div>대표이메일 : welldying.mememnto@gmail.com</div>
                <div>대표 : 신동경 | 사업자등록번호 : 176-64-00459</div>
                <div>주소 : 서울특별시 관악구 봉천동 856-6 BS타워 5층 (우) 08788</div>
            </div>
            <div className="greenBackground">
                <div className="SNSContainer">
                    {[...Array(4).keys()].map((i, key) => (
                    <img src={imageUrl(`share_image_${i+1}.png`)} alt = "profile" key = {key} onClick = {key === 3 ? () => {} : () => window.open(snsuri[key], "_blank")} style = {{cursor: 'pointer'}}/>
                    ))}
                </div>
                <div className="Copyright">Copyright © 2021 Memento Corporation All rights reserved</div>
            </div>
        </div>
        </>
    )
}

export default MobileFooter;