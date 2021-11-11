import React from 'react';
import { useSelector } from 'react-redux';
import { imageUrl } from '../etc/config';
import { RootReducer } from '../store';
import { Link } from 'react-router-dom';

import { Colon, MementoLogo } from '../img/Vectors';
import { getUsers, setUsers, User, UserData, UserGiveInfo } from '../etc/api/user';
import usePromise from '../etc/usePromise';
import { UserState } from '../store/user';

interface Props {
    bookOwner: UserData;
    watchingBookUser: UserData;
}

function findDataAndEditInArray(array: Array<any>, oldValue: any, newValue: any) {
    let index = array.findIndex((data) => data === oldValue);
    console.log(index);
    if(index >= 0)
        array[index] = newValue;
    return array;
}

function MementoBook (props: Props) {
    let bookOwner = props.bookOwner;
    let watchingBookUser = props.watchingBookUser;
    let bookisMine = (bookOwner == watchingBookUser);
    let bookOwnerUserInfoByWatchingBookUser = React.useMemo(() => watchingBookUser?.UsersInfo.get.find((userInfo) => userInfo.username === bookOwner?.username), [bookOwner, watchingBookUser]);



    let LinkBook = React.useRef<any>(null);
    let LinkBookClick = () => LinkBook.current.click();
    

    let acceptBookButtonsContainer = React.useMemo(() =>  {
        console.log(bookOwnerUserInfoByWatchingBookUser);
        if(!bookOwnerUserInfoByWatchingBookUser) return <></>;
        else return (
            bookOwnerUserInfoByWatchingBookUser.accept === 0 && <div className = 'acceptContainer' style = {{width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>
                <div className="text GB px15 line25 whiteop10" style = {{position: 'absolute', top: '71px', left: 'calc(50% - 80px)', width: '160px', textAlign: 'center'}}>
                    <div>{bookOwner?.name}님의 메멘토 북을</div>
                    <div>수령하시겠습니까?</div>
                </div>
                <div className="buttonContainer" style = {{display: 'flex', flexWrap: 'wrap', gap: '10px', position: 'absolute', top: '152px', left: '31px'}}>
                    <button className = 'NS px13 bold whiteop10' style = {{width: '175px', height: '40px', background: 'rgba(105, 117, 110, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}} onClick = {async () => {
                        if(watchingBookUser) {
                            watchingBookUser.UsersInfo.get = findDataAndEditInArray(watchingBookUser.UsersInfo.get, bookOwnerUserInfoByWatchingBookUser, {...bookOwnerUserInfoByWatchingBookUser, accept: 1});
                            console.log(watchingBookUser.UsersInfo.get);
                        }
                        if (await setUsers(String(watchingBookUser?.username), watchingBookUser!.UsersInfo, 0, false, '')) {
                            alert(`${bookOwner?.name}의 메멘토 북을 수령하였습니다.`);
                        }
                    }}>예, 수령하겠습니다.</button>
                    <button className = 'NS px13 bold' style = {{width: '175px', height: '40px', background: 'rgba(248, 247, 246, 1)', color: 'rgba(43, 48, 46, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}} onClick = {async () => {
                        if(watchingBookUser)
                            watchingBookUser.UsersInfo.get = findDataAndEditInArray(watchingBookUser.UsersInfo.get, bookOwnerUserInfoByWatchingBookUser, {...bookOwnerUserInfoByWatchingBookUser, accept: 2});
                        if (await setUsers(String(watchingBookUser?.username), watchingBookUser!.UsersInfo, 0, false, '')) {
                            alert(`${bookOwner?.name}의 메멘토 북을 수령하지 않으셨습니다.`);
                        }
                    }}>아니오, 삭제하겠습니다.</button>
                </div>
            </div>
        )  
    }, [bookOwner, bookOwnerUserInfoByWatchingBookUser, watchingBookUser]);

    let modifyMyBookButton = React.useMemo(() => {
        return (
            <div className="more NS px12 whiteop5" style = {{cursor: 'pointer'}}>{`메멘토 북 수정하기 >`}</div>
        )
    }, [bookisMine, bookOwner]);

    let bookOwnerInfoOnBottom = React.useMemo(() => {
        return (
            <div className="GiveUsersElement" style ={{width: '236px', padding: '0px', justifyContent: 'center', boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)', background: 'rgba(0, 0, 0, 0)', height: '60px', marginTop: '20px'}}>
                <div style ={{textAlign: 'center'}}>
                    <div className="namephone NS px15 line25 bold op6">{bookOwner?.name + ' / ' + bookOwner?.birthYear + '.' + bookOwner?.birthMonth + '.' + bookOwner?.birthDate}</div>
                    <div className="email NS px15 line25 bold op6">{bookOwner?.email}</div>
                </div>
            </div>
        )
    }, [bookOwner]);

    return (
        <>
        <Link to = {`/notebook/1`} ref = {LinkBook} style = {{display: 'none'}} />
        <div className="BookElement" onClick = {bookisMine ? () => LinkBookClick() : () => {}} style = {{height: bookisMine ? '' : '376px'}}>
            <div className="backgroundCover"></div>
            <img src={imageUrl('NotePage/BookCoverImage.png')} alt="" className="BookCover" />
            <div className="BookCoverBlend" style = {{cursor: 'pointer'}}></div>
            <div className="MementoLogo" style = {{cursor: 'pointer'}}>{MementoLogo}</div>
            <div className="bookname GB px13" style = {{cursor: 'pointer'}}>{Colon}{bookOwner?.bookname}</div> 
            {bookisMine && modifyMyBookButton}
            {!bookisMine && bookOwnerInfoOnBottom}
            {acceptBookButtonsContainer}
        </div>
        </>
    );
}

export default MementoBook;