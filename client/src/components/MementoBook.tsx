import React from 'react';
import { useSelector } from 'react-redux';
import { imageUrl } from '../etc/config';
import { RootReducer } from '../store';
import { Link } from 'react-router-dom';

import { Colon, MementoLogo } from '../img/Vectors';
import { getUsers, setUsers, UserGiveInfo } from '../etc/api/user';
import usePromise from '../etc/usePromise';

interface Props {
    name: string;
    bookname: string;
    mine: boolean;
    accept: number;
    giveusername: string;
    getusername: string;
}

function MementoBook (props: Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let LinkBook = React.useRef<any>(null);
    let LinkBookClick = () => LinkBook.current.click();
    let [, allusers] = usePromise(getUsers);
    let giveuser = allusers?.find((user) => user.username === props.giveusername);
    let [accept, setAccept] = React.useState<number>(props.accept);
    let getUserIndex = user.user?.UsersInfo.get.findIndex((UserInfo) => UserInfo.username === props.giveusername);
    let giveUserIndex = React.useMemo(() => giveuser?.UsersInfo.give.findIndex((UserInfo) => UserInfo.username === props.giveusername), [giveuser]);
    let [getUserInfo, setgetUserInfo] = React.useState<{ get: UserGiveInfo[], give: UserGiveInfo[]}>({ get: [], give: []});
    let [giveUserInfo, setgiveUserInfo] = React.useState<{ get: UserGiveInfo[], give: UserGiveInfo[]}>({ get: [], give: []});
    
    React.useEffect(() => {
        if(!user || !user.user) return;
        setgetUserInfo(user.user?.UsersInfo);
        if(!giveuser) return;
        setgiveUserInfo(giveuser.UsersInfo);
        if(!user.user?.UsersInfo.get[Number(getUserIndex)]) return;
        setAccept(user.user?.UsersInfo.get[Number(getUserIndex)].accept);
    }, [getUserIndex, giveuser, giveUserIndex]);
    

    let BookAccept = React.useMemo(() =>  {
        console.log(giveUserInfo);
            if(!getUserInfo) return <></>;
            else return (
                (!props.mine && accept === 0) && <div className = 'acceptContainer' style = {{width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>
                    <div className="text GB px15 line25 whiteop10" style = {{position: 'absolute', top: '71px', left: 'calc(50% - 80px)', width: '160px', textAlign: 'center'}}>
                        <div>{props.name}님의 메멘토 북을</div>
                        <div>수령하시겠습니까?</div>
                    </div>
                    <div className="buttonContainer" style = {{display: 'flex', flexWrap: 'wrap', gap: '10px', position: 'absolute', top: '152px', left: '31px'}}>
                        <button className = 'NS px13 bold whiteop10' style = {{width: '175px', height: '40px', background: 'rgba(105, 117, 110, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}} onClick = {async () => {
                            let newgetUserInfo = getUserInfo;
                            newgetUserInfo.get[Number(getUserIndex)] = { ...newgetUserInfo.get[(getUserIndex!)], accept: 1};
                            let newgiveUserInfo = giveUserInfo;
                            newgiveUserInfo.give[Number(giveUserIndex)] = { ...newgiveUserInfo.give[Number(giveUserIndex)], accept: 1};
                            if (await setUsers(String(user.user?.username), newgetUserInfo, 0, false, '')) {
                                setAccept(1);
                                alert(`${props.name}의 메멘토 북을 수령하였습니다.`);
                                console.log(newgetUserInfo);
                            }
                            if (await setUsers(String(giveuser?.username), newgiveUserInfo, 0, false, '')) {
                                console.log(newgiveUserInfo);
                            }
                        }}>예, 수령하겠습니다.</button>
                        <button className = 'NS px13 bold' style = {{width: '175px', height: '40px', background: 'rgba(248, 247, 246, 1)', color: 'rgba(43, 48, 46, 1)', borderRadius: '5px', padding: '0px', boxShadow: '0px 4px 5px 1px rgba(0, 0, 0, 0.5);'}} onClick = {async () => {
                            let newgetUserInfo = getUserInfo;
                            newgetUserInfo.get[Number(getUserIndex)] = { ...newgetUserInfo.get[(getUserIndex!)], accept: 2};
                            let newgiveUserInfo = giveUserInfo;
                            newgiveUserInfo.give[Number(giveUserIndex)] = { ...newgiveUserInfo.give[Number(giveUserIndex)], accept: 2};
                            if (await setUsers(String(user.user?.username), newgetUserInfo, 0, false, '')) {
                                setAccept(2);
                                alert(`${props.name}의 메멘토 북을 수령하지 않으셨습니다.`);
                                console.log(newgetUserInfo);
                            }
                            if (await setUsers(String(giveuser?.username), newgiveUserInfo, 0, false, '')) {
                                console.log(newgiveUserInfo);
                            }
                        }}>아니오, 삭제하겠습니다.</button>
                    </div>
                </div>
            )  
    }, [accept, getUserIndex, getUserInfo, giveuser, giveUserInfo, giveUserIndex]);

    let MyBook = React.useMemo(() => {
        console.log(giveuser);
        return (
            props.mine ? <div className="more NS px12 whiteop5">{`메멘토 북 수정하기 >`}</div> : <div className="GiveUsersElement" style ={{width: '236px', padding: '0px', justifyContent: 'center', boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)', background: 'rgba(0, 0, 0, 0)', height: '60px', marginTop: '20px'}}>
                <div style ={{textAlign: 'center'}}>
                    <div className="namephone NS px15 line25 bold op6">{giveuser?.name + ' / ' + giveuser?.birthYear + '.' + giveuser?.birthMonth + '.' + giveuser?.birthDate}</div>
                    <div className="email NS px15 line25 bold op6">{giveuser?.email}</div>
                </div>
            </div>
        )
    }, [props.mine, giveuser]);

    return (
        <>
        <Link to = {`/notebook/1`} ref = {LinkBook} style = {{display: 'none'}} />
        {accept !== 2 && <div className="BookElement" onClick = {props.mine ? () => LinkBookClick() : () => {}}>
            <img src={imageUrl('NotePage/BookCoverImage.png')} alt="" className="BookCover" />
            <div className="BookCoverBlend"></div>
            <div className="MementoLogo">{MementoLogo}</div>
            <div className="bookname GB px13">{Colon}{props.bookname}</div> 
            {MyBook}
            {BookAccept}
        </div>}
        </>
    );
}

export default MementoBook;