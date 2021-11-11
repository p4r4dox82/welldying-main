import { calculateBorderBoxPath } from 'html2canvas/dist/types/render/bound-curves';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MementoBook from '../components/MementoBook';
import { DeathInfo, getUsers, setUserDeathInfo } from '../etc/api/user';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { EditVector, leftVector, MementoDotVector, rightVector, UserImage } from '../img/Vectors';
import MobileFooter from '../MobileComponents/MobileFooter';
import MobileHeader from '../MobileComponents/MobileHeader';
import { checkBatchim, EntryType } from '../pages/Mypage';
import { RootReducer } from '../store';

function MobileMyPage() {
    let user = useSelector((state: RootReducer) => state.user);

    let [, AllUsers] = usePromise(getUsers);
    let [editPledge, setEditPledge] = React.useState<boolean>(false);
    let [editPersonalData, setEditPersonalData] = React.useState<boolean>(false);
    let [currentGetBooksNumber, setCurrentGetBooksNumber] = React.useState<number>(0);
    let totalGetBooksNumber = React.useMemo(() => user.user?.UsersInfo.get.filter((userInfo) => userInfo.accept !== 2).length, [user]);
    let [DeathInfo, setDeathInfo] = React.useState<DeathInfo>();
    React.useEffect(() => {
        if(user.user?.DeathInfo !== undefined)
            setDeathInfo(user.user?.DeathInfo);
        else 
            setDeathInfo({agree: false, answerArray: ['', '', '', '', '']});
    }, [user]);

    let GivenUserInfoContainer = React.useCallback((userinfo: any) => {
        if(!AllUsers) return <></>;
        else {
            let givenUser = AllUsers.find((user) => user.username === userinfo.username);
            return (
                <>
                    {(userinfo.accept !== 2) && <div className="GivenUserInfoContainer">
                        <div className="userImage">{UserImage}</div>
                        {(userinfo.accept === 1) ? <div className = "message">
                                <div className="namephone">{givenUser?.name + ' / 0' + givenUser?.cellphone.slice(3, 5) + ' - ' + givenUser?.cellphone.slice(5, 9) + ' - ' + givenUser?.cellphone.slice(9, 13)}</div>
                                <div className="email">{givenUser?.email}</div>
                            </div> : <>
                            <div className="message">{(givenUser?.name === undefined ? userinfo.name : givenUser?.name) + '님의 승인을 대기중입니다.'}</div>
                        </>}
                    </div>}
                </>
            )

        }
    }, [AllUsers]);
    
    let GivenUsers = React.useMemo(() => {
        return (
            user.user?.UsersInfo.give.map((userinfo) => GivenUserInfoContainer(userinfo))
        )
    }, [user, GivenUserInfoContainer]);

    let GetBooks = React.useCallback((userinfo: any) => {
        if(!AllUsers) return <></>;
        else {
            let getBookUser = AllUsers.find((user) => user.username === userinfo.username);
            if(getBookUser)
                return (
                    <>
                        <MementoBook bookOwner = {getBookUser} watchingBookUser = {user.user!}></MementoBook>
                    </>
                )
        }
    }, [AllUsers]);

    let GetBooksContainer = React.useMemo(() => {
        return (
            user.user?.UsersInfo.get.map((userinfo) => {
                if(userinfo.accept !== 2) {
                    return GetBooks(userinfo);
                }
            })
        )
    }, [user, GetBooks]);
    
    let answer1Array = ['불교 형식', '기독교 형식', '카톨릭 형식', '전통 장례', '기타'];
    let answer2Array = ['화장 형식', '매장 형식', '기타'];
    let answer3Array = ['지인 모두 참석', '가족만 참석', '기타'];
    let answer4Array = ['예, 희망합니다.', '아니오, 희망하지 않습니다'];
    let answer5Array = ['예, 희망합니다.', '아니오, 희망하지 않습니다'];
    
    let answerArrays = React.useMemo(() => {
        let result = [];
        result.push({title: '원하시는 장례 진행 방법이 있나요?', answer: answer1Array});
        result.push({title: '어떤 장법을 원하시나요?', answer: answer2Array});
        result.push({title: '장례식의 규모는 어떻게 하시겠습니까?', answer: answer3Array});
        result.push({title: '장기기증을 희망하십니까?', answer: answer4Array});
        result.push({title: '연명 치료를 희망하십니까?', answer: answer5Array});

        return result;
    }, []);
    
    let isAnswerInArray = (answer: string, array: Array<string>) => {
        if(answer === undefined) return false;
        return array.includes(answer);
    }

    let editDataOnArrayWithIndex = (array: Array<string>, data: string, index: number) => {
        let newarray = array;
        newarray[index] = data;
        return newarray;
    }

    let checkDeathInfoAnswerFilled = (DeathInfo: DeathInfo) => {
        if(DeathInfo.answerArray.length !== 5)
            return false;
        if(DeathInfo.answerArray.includes(''))
            return false;
        for(let i = 0; i < 5; i ++)
            if(!DeathInfo.answerArray[i])
                return false;
        return true;
    }

    let Questions = React.useMemo(() => {
        if(!DeathInfo || !answerArrays) return <></>;
        return (
            <>
                {answerArrays.map((answerArray: any, key) => (
                    <div className = 'questionContainer'>
                        <div className = 'title'>
                            {key + 1}.{answerArray.title}
                        </div>
                        <div className = 'answerContainer'>
                            {answerArray.answer.map((answer: any) => (
                                <div className = 'answerElement'>
                                    <div className = 'checkBox' onClick = {answer === '기타' ? () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, '', key)})} : () => {setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, answer, key)})}}>
                                        <div className = {isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? (DeathInfo?.answerArray[key] === answer ? 'checked' : '') : (answer === '기타' ? 'checked' : '')} />
                                    </div>
                                    <div className = {'name' + (answer === '기타' ? ' minWidthZero' : '')}>
                                    {answer}
                                    </div>
                                    {answer === '기타' && <input type='text' autoComplete='password' onChange={(e) => setDeathInfo({...DeathInfo!, answerArray: editDataOnArrayWithIndex(DeathInfo!.answerArray, e.target.value, key)})} value={(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? '' : DeathInfo?.answerArray[key])} placeholder = '25자 이하로 작성해주세요.' disabled = {(isAnswerInArray(DeathInfo!.answerArray[key], answerArrays[key].answer) ? true : false)}/>}
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                )}
            </>
        )
    }, [DeathInfo, answerArrays, isAnswerInArray, editDataOnArrayWithIndex]);


    if(editPledge) return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'}></MobileHeader>
                <div className="MobileMyPageEditPledge">
                    <div className="background"></div>
                    <div className="userImage">
                        {UserImage}
                    </div>
                    <div className="PledgeContainer">
                        <div className="title" >당신은 죽음을 받아들일 준비가 되어 있는 사람인가요?</div>
                        <div className="message">
                            <div>나는 유언을 작성, 전달, 사용하는 과정에서 절대로 자해나 자살을 시도하지 않을 것을 서약합니다. </div>
                            <div>자살하고 싶은 생각이 들면 반드시 주위 사람에게 도움을 청하거나, 중앙자살예방센터(1393), </div>
                            <div>한국생명의 전화(1588-9191) 등으로 전화를 걸어 도움을 요청하겠습니다.</div>
                        </div>
                        <div className="AgreeContainer" onClick = {async () => {
                            if(await setUserDeathInfo(user.user!.username, {...DeathInfo!, agree: true})) {
                                setDeathInfo({...DeathInfo!, agree: true})
                                console.log({...DeathInfo!, agree: true});
                            }
                            }}>
                            {!DeathInfo?.agree && <>
                                <button className="agreeButton"></button>
                                <div className="agreeText"  style = {{cursor: 'pointer'}}>네 이해하고 동의합니다.</div>
                            </>}
                            {DeathInfo?.agree && <div className="agreeText agreed">{`네, 저 ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '은' : '는')} 위와 같이 서약합니다.`}</div>}
                        </div>
                    </div>
                    <div className="DeathInfoContainer">
                        <img src={imageUrl('MyPageBackground.png')} alt="" className = 'background'/>
                        <div className="title">나의 사전 장례 & 연명의료, 장기기증 의향서</div>
                        <div className="detail">
                            <div>급박한 상황이 생겼을 때, 스스로의 자기결정권을 실현할 수 있는 질문들입니다. </div>
                            <div>작성하신 답변은 사망 전에도 열람할 수 있는 오픈프로필에 반영됩니다.</div>
                        </div>
                        <div className="vector upward"></div>
                        {Questions}
                        <div className="vector downward"></div>
                        <button className="submit NS px18 bold" onClick = {async () => {
                            if(!checkDeathInfoAnswerFilled(DeathInfo!)) alert('모든 항목을 채워주세요');
                            else if(await setUserDeathInfo(user.user!.username, DeathInfo!)) {
                                alert('저장되었습니다.');
                                setEditPledge(false);
                                window.scrollTo(0, 0);
                            }
                            else alert('실패하였습니다');
                        }}>저장하기</button>
                    </div>
                </div>
                <MobileFooter></MobileFooter>
            </div>
        </>
    )
    else if(editPersonalData) return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'}></MobileHeader>
                <div className="MobileMyPageEditPersonalData">
                    <div className="userImage">
                        {UserImage}
                    </div>
                    {false && <div className="addUserImage">{'나의 기본 사진 추가하기 >'}</div>}
                </div>
                <MobileFooter></MobileFooter>
            </div>
        </>
    )
    else return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {'/mypage'} />
                <div className="MobileMyPage">
                    <div className="userInfoBlock">
                        <div className="userImage">
                            {UserImage}
                        </div>
                        <div className="userInfoContainer">
                            <div className="namephone NS px15 line25 bold op6">{user.user?.name + ' / 0' + user.user?.cellphone.slice(3, 5) + '-' + user.user?.cellphone.slice(5, 9) + '-' + user.user?.cellphone.slice(9, 13)}</div>
                            <div className="email NS px15 line25 bold op6">{user.user?.email}</div>
                            <button className="Edit" onClick = {() => {
                            }}>{EditVector}</button>
                        </div>
                        <div className="goEditPledge" onClick = {() => setEditPledge(!editPledge)}>
                            {'나의 서약 바로가기 >'}
                        </div>
                    </div>
                    <div className="myBookBlock">
                        <div className="background"></div>
                        <div className="vector"></div>
                        <div className="textContainer">
                            <div className="title">나에게 남긴, 그리고 내가 남긴 기록들</div>
                            <div className="detail">
                                <div>내가 기록을 남겨둔 이들과, 나에게 기록을 남겨둔 이들의 목록입니다.</div>
                                <div>각각의 기록은 사망 사실 확인 후 열람 가능한 상태로 변경됩니다.</div>
                            </div>
                            <Link to = {'/note'} ><div className="goNotePage">{'작성 페이지 바로가기 >'}</div></Link>
                        </div>
                        <div className="divider"></div>
                        <div className="myBookContainer">
                            <div className="title">나의 유언 자서전 전달</div>
                            <div className="myBooks">
                                <MementoBook bookOwner = {user.user!} watchingBookUser = {user.user!} />
                            </div>
                            <div className="GivenUsersContainer">
                                {GivenUsers}
                            </div>
                        </div>
                    </div>
                    <div className="getBooksBlock">
                        <div className="background"></div>
                        <div className="title">나에게 기록을 남겨놓은 사람들</div>
                        <div className="getBooks" style = {{left: (-276 * currentGetBooksNumber + 'px')}}>
                            {GetBooksContainer}
                        </div>
                        <div className="buttonContainer">
                            <div className="cover left"></div>
                            <div className="cover right"></div>
                            <button className="left" onClick = {() => setCurrentGetBooksNumber(Math.max(0, currentGetBooksNumber - 1))}>{leftVector}</button>
                            <button className="right" onClick = {() => setCurrentGetBooksNumber(Math.min(totalGetBooksNumber! - 1, currentGetBooksNumber + 1))}>{rightVector}</button>
                        </div>
                        <div className="dotContainer">
                            {[...Array(totalGetBooksNumber).keys()].map((key) => {
                                return (
                                    <div className = {key === currentGetBooksNumber ? 'selected' : ''}>{MementoDotVector}</div>        
                                )
                            })}
                        </div>
                    </div>
                </div>
                <MobileFooter />
            </div>
        </>
    )
    
}

export default MobileMyPage;

