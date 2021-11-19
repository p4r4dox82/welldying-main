import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Notification from '../components/Notification';
import { imageUrl } from '../etc/config';
import { leftVector, like_vector, MementoBookVector, MementoContentVector, MementoMainVector, MementoMakeBookVector, MementoNoteVector, rightVector } from '../img/Vectors';

function SellingMain() {
    let [mainBlockNumber, setMainBlockNumber] = React.useState<number>(0);
    return (
        <>
            <div className="SellingMain">
                <Header additionalClass = ""></Header>
                <Notification text = "혹시 memento 사용자가 남겨놓은 이야기를 확인하러 오셨다면 이곳을 클릭해주세요."></Notification>
                <div className="mainBlock">
                    <img src={imageUrl('main_background.png')} alt="" className = {"backgroundImage"}/>
                    <div className="textContainer">
                        <div className="titleContainer">
                            <div>당신의 기억을 담아</div>
                            <div>메멘토 포토카드</div>
                        </div>
                        <div className="vectorLine"></div>
                        <div className="detail">메멘토 포토카드는 상세설명상세설명. 메멘토 포토카드는 상세설명상세설명. 메멘토 포토카드는 상세설명상세설명. 메멘토 포토카드는 상세설명상세설명.</div>
                        <button className="moreButton">{"메멘토 포토카드 보러가기 >"}</button>
                    </div>
                    <div className="imageContainer">
                        <div className="circle"></div>
                        <img src={imageUrl('SellingPage/productMainImage.png')} alt="" className="productMainImage" />
                    </div>
                    <div className="menuContainer">
                        <div className="menuElement" onClick = {() => setMainBlockNumber(0)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (mainBlockNumber === 0 ? ' selected' : ' notselected')}>{MementoMainVector}</div>
                            <div className = 'name'>메멘토는</div>
                        </div>
                        <div className="menuElement" onClick = {() => setMainBlockNumber(1)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (mainBlockNumber === 1 ? ' selected' : ' notselected')}>{MementoContentVector}</div>
                            <div className = 'name'>메멘토 컨텐츠</div>
                        </div>
                        <div className="menuElement" onClick = {() => setMainBlockNumber(2)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (mainBlockNumber === 2 ? ' selected' : ' notselected')}>{MementoNoteVector}</div>
                            <div className = 'name'>메멘토 노트</div>
                        </div>
                        <div className="menuElement" onClick = {() => setMainBlockNumber(3)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (mainBlockNumber === 3 ? ' selected' : ' notselected')}>{MementoBookVector}</div>
                            <div className = 'name'>유언 자서전</div>
                        </div>
                        <div className="menuElement" onClick = {() => setMainBlockNumber(4)} style = {{cursor: 'pointer'}}>
                            <div className={"vector" + (mainBlockNumber === 4 ? ' selected' : ' notselected')}>{MementoMakeBookVector}</div>
                            <div className = 'name'>자서전 제작</div>
                        </div>
                    </div>
                </div>
                <div className="productListBlock">
                    <div className="headContainer">
                        <div className="title">{"메멘토 굿즈 >"}</div>
                        <div className="numberContainer">
                            <button className="leftSlide">{leftVector}</button>
                            <div>{"1 / 1"}</div>
                            <button className="rightSlide">{rightVector}</button>
                        </div>
                    </div>
                    <div className="productList">
                        <div className="productElement">
                            <Link to = {"/product/1"}><img src={imageUrl('ContentPage/defaultThumbnail.png')} alt="" className="thumbnail"/></Link>
                            <div className="cover">
                                <div className="title">메멘토 포토카드</div>
                                <div className="detail">소중한 이에게 포토카드를 보내보세요. 상세설명 상세설명.</div>
                                <div className="price">10,000<span>원</span></div>
                                <div className="tag">#기록</div>
                                <div className="likeContainer">{like_vector}   999+</div>
                            </div>
                            <div className="likeButton">{like_vector}</div>
                        </div>
                    </div>
                </div>
                {false && <div className="commentBlock">
                    <img src={imageUrl('main_background.png')} alt="" className="backgroundImage" />
                </div>}
                <Footer additionalClass = ""></Footer>
            </div>
        </>
    )
}

export default SellingMain;