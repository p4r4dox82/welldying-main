import React from 'react';
import { useSelector } from 'react-redux';
import { imageUrl } from '../etc/config';
import { RootReducer } from '../store';
import { Link } from 'react-router-dom';

import { Colon, MementoLogo } from '../img/Vectors';

interface Props {
    name: string;
    bookname: string;
    mine: boolean;
    accept: boolean;
}

function MementoBook (props: Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let LinkBook = React.useRef<any>(null);
    let LinkBookClick = () => LinkBook.current.click();

    return (
        <>
        <Link to = {`/notebook/1`} ref = {LinkBook} style = {{display: 'none'}} />
        <div className="BookElement" onClick = {props.mine ? () => LinkBookClick() : () => {}}>
            <img src={imageUrl('NotePage/BookCoverImage.png')} alt="" className="BookCover" />
            <div className="BookCoverBlend"></div>
            <div className="MementoLogo">{MementoLogo}</div>
            <div className="bookname GB px13">{Colon}{props.bookname}</div> 
            {props.mine ? <div className="more NS px12 whiteop5">{`메멘토 북 수정하기 >`}</div> : <></>}
            {(!props.mine && !props.accept) && <div className = 'acceptContainer' style = {{width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>
                <div className="text GB px15 line25 whiteop10" style = {{position: 'absolute', top: '71px', left: 'calc(50% - 80px)', width: '160px', textAlign: 'center'}}>
                    <div>{props.name}님의 메멘토 북을</div>
                    <div>수령하시겠습니까?</div>
                </div>
                <div className="buttonContainer" style = {{display: 'flex', flexWrap: 'wrap', gap: '10px', position: 'absolute', top: '152px', left: '31px'}}>
                    <button className = 'NS px13 bold whiteop10' style = {{width: '175px', height: '40px', background: 'rgba(105, 117, 110, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}}>예, 수령하겠습니다.</button>
                    <button className = 'NS px13 bold' style = {{width: '175px', height: '40px', background: 'rgba(248, 247, 246, 1)', color: 'rgba(43, 48, 46, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}}>아니오, 삭제하겠습니다.</button>
                </div>   
            </div>}
        </div>
        </>
    );
}

export default MementoBook;