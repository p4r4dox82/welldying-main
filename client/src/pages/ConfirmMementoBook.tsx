import react from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MementoBook from '../components/MementoBook';
import { getUsers } from '../etc/api/user';
import usePromise from '../etc/usePromise';
import { RootReducer } from '../store';
import MementoNote from './MementoNote';

function ConfirmMementoBook() {
    let user = useSelector((state: RootReducer) => state.user);
    let [, allUsers] = usePromise(getUsers);

    if(!user.loggedIn) return <Redirect to ='/login'></Redirect>;
    else return (
        <>
            <Header additionalClass = ''></Header>
            <div className="ConfirmBook">
                <div className="block titleBlock">
                    <div className="title GB px25 line25 ">메멘토는 성장합니다</div>
                    <div className="subtitle NS px15 line20 op5">memento history</div>
                    <div className="detail NS px15 line20 op8">
                        <div>메멘토는 2020년 4월을 시작으로 현재까지 다양한 어쩌구를 이루었으며</div>
                        <div>신뢰할 수 있는 브랜드로 성장해 나갈 것입니다.</div>
                    </div>
                </div>
                <div className="block BookBlock">
                    <div className="BookContainer">
                        {user.user?.UsersInfo.get.map((userInfo) => {
                            let giveuser = allUsers?.find((user) => user.username === userInfo.username);
                            if(!giveuser) return;
                            else return (
                                <MementoBook name = {userInfo.name} bookname = {giveuser?.bookname[0]} mine = {false} accept = {userInfo.accept} giveusername = {giveuser?.username} getusername = {String(user.user?.username)}></MementoBook>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer additionalClass = ''></Footer>
        </>
    )
}

export default ConfirmMementoBook;