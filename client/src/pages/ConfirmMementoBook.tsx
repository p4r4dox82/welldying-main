import React from 'react';
import { useSelector } from 'react-redux';
import { match, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MementoBook from '../components/MementoBook';
import { uploadImage_formdata } from '../etc/api/image';
import { getUsers } from '../etc/api/user';
import { imageUrl } from '../etc/config';
import usePromise from '../etc/usePromise';
import { answer1_1, answer1_2, answer1_3, answer2_1, answer2_2, answer3_1, answer_else, LeftArrowVector, RightArrowVector } from '../img/Vectors';
import { RootReducer } from '../store';

interface MatchParams {
    id?: string;
};

interface Props {
    match: match<MatchParams>;
};

function ConfirmMementoBook({match} : Props) {
    let id = Number.parseInt(match.params.id || '0');
    let user = useSelector((state: RootReducer) => state.user);
    let [, allUsers] = usePromise(getUsers);
    let [giveusername, setGiveusername] = React.useState<string>('');
    let [, setSelectBook] = React.useState<number>(id);
    React.useEffect(() => {
        console.log(id);
        setGiveusername(String(user.user?.UsersInfo.get[id].username));
    }, [id, user]);
    let giveUser = React.useMemo(() => allUsers?.find((user) => user.username === giveusername), [giveusername, allUsers]);

    let input_file = React.useRef<any>(null);
    let [, setImageUri] = React.useState<string>('');
    let handleFileinput = async (e: any) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0]);
    
        const s3Uri = await uploadImage_formdata(formData);
        console.log(s3Uri);
        setImageUri(s3Uri);
        if(s3Uri === undefined) {
          setImageUri('');
        }
        return s3Uri;
    }
    let handleClick = () => {
        input_file.current.click();
    };

    let deathInfoVector = (answer: string) => {
        if(answer === '불교 형식')
            return answer1_1;
        if(answer === '기독교 형식')
            return answer1_2;
        if(answer === '전통 장례')
            return answer1_3;
        if(answer === '화장 형식')
            return answer2_1;
        if(answer === '매장 형식')
            return answer2_2;
        if(answer === '지인 모두 참석')
            return answer3_1;
        if(answer === '가족만 참식')
            return answer3_1;
        if(answer === '기타' || answer === '')
            return answer_else;
    }

    let DeathInfoContainer = React.useMemo(() => {
        console.log(giveusername);
        console.log(giveUser);
        return (
            <div className="DeathInfo">
                <img className = 'Background' src={imageUrl('MyPageBackground.png')} alt="" style = {{opacity: '0.4', objectFit: 'none', overflow: 'hidden', height: '100%', width: '100%'}}/>
                <div className="titleContainer">
                    <div className="title GB px25 line40">{giveUser?.name + "님의 사전 장례 & 연명의료, 장기기증 의향서"}</div>
                    <div className="subtitle NS px15 line30 op5" style = {{letterSpacing: '0em'}}>
                        <div>{giveUser?.name + "님이 작성하신 장례, 연명치료, 장기기증 의향서입니다."}</div>
                        <div>본 의향서는 작성자 본인의 선택에 따라 언제든지 변경될 수 있습니다.</div>
                    </div>
                </div>
                <div className="deathInfoContainer" style = {{width: '269px', gap: '13px', marginTop: '61px', height: '132px'}}>
                    <div className="answer" style = {{opacity: (giveUser?.DeathInfo.answerArray[4] === '예, 희망합니다.' ? '1' : '0' )}}>
                        <div className="image">
                            <div className="agree"></div>
                        </div>
                        <div className="name NS px12 op5 bold">연명 치료 희망</div>
                    </div>
                    <div className="answer" style = {{opacity: (giveUser?.DeathInfo.answerArray[3] === '예, 희망합니다.' ? '1' : '0' )}}>
                        <div className="image">
                            <div className="agree"></div>
                        </div>
                        <div className="name NS px12 op5 bold">장기 기증 희망</div>
                    </div>
                </div>
                <div className="deathInfoContainer" style = {{width: '915px', borderTop: '1px dashed rgba(147, 156, 151, 1)', borderBottom: '1px dashed rgba(147, 156, 151, 1)', margin: '41px 0px 0px calc(50% - 915px/2)', gap: '27px', padding: '17px 27px'}}>
                    <div className="answer big">
                        <div className="name GB px16">{giveUser?.name + '님의 희망 장례 진행 방법'}</div>
                        <div className="answerName NS px14 bold" style ={{color: 'rgba(124, 132, 127, 1)'}}>{giveUser?.DeathInfo.answerArray[0] ? giveUser?.DeathInfo.answerArray[0] : ''}</div>
                        <div className="image">
                            <div className="imageinset">
                                {deathInfoVector(giveUser?.DeathInfo.answerArray[0] ? giveUser?.DeathInfo.answerArray[0] : '')}
                            </div>
                        </div>
                    </div>
                    <div className="answer big">
                        <div className="name GB px16">{giveUser?.name + '님의 희망 장법'}</div>
                        <div className="answerName NS px14 bold" style ={{color: 'rgba(124, 132, 127, 1)'}}>{giveUser?.DeathInfo.answerArray[1] ? giveUser?.DeathInfo.answerArray[1] : ''}</div>
                        <div className="image">
                            <div className="imageinset">
                                {deathInfoVector(giveUser?.DeathInfo.answerArray[1] ? giveUser?.DeathInfo.answerArray[1] : '')}
                            </div>
                        </div>
                    </div>
                    <div className="answer big">
                        <div className="name GB px16">{giveUser?.name + '님의 희망 장례 규모'}</div>
                        <div className="answerName NS px14 bold" style ={{color: 'rgba(124, 132, 127, 1)'}}>{giveUser?.DeathInfo.answerArray[2] ? giveUser?.DeathInfo.answerArray[2] : ''}</div>
                        <div className="image">
                            <div className="imageinset">
                                {deathInfoVector(giveUser?.DeathInfo.answerArray[2] ? giveUser?.DeathInfo.answerArray[2] : '')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
        )
    }, [giveusername, giveUser]);

    let [pagenumber, setPagenumber] = React.useState<number>(0);

    let BookContainer = React.useMemo(() => {
        return (
            <>
            <div className="BookContainerOverflow">
                <div className="BookContainer" style = {{left: `${pagenumber * -266 + 'px'}`}}>
                    {user.user?.UsersInfo.get.map((userInfo, key) => {
                        let giveuser = allUsers?.find((user) => user.username === userInfo.username);
                        if(!giveuser) return <></>;
                        else return (
                            <div onClick = {() => {
                                setGiveusername(userInfo.username);
                                setSelectBook(key);
                            }}>
                                <MementoBook bookOwner = {giveuser} watchingBookUser = {user.user!} ></MementoBook>
                            </div>
                        )
                    })}
                    <div className="vectorContainer" style = {{left: `${pagenumber * 266 + 'px'}`}}>
                        <div className="vector">

                        </div>
                    </div>
                </div>
            </div>
            {Number(user.user?.UsersInfo.get.length) > 4 && <div className="buttonContainer margin_base">
                <button className="leftButton" onClick = {() => setPagenumber(Math.max(0, pagenumber - 1))}>{LeftArrowVector}</button>
                <button className="rightButton" onClick = {() => setPagenumber(Math.min(Number(user.user?.UsersInfo.get.length) - 4, pagenumber + 1))}>{RightArrowVector}</button>
            </div>}
            </>       
        )
    }, [pagenumber, allUsers, user]);

    if(!user.loggedIn) return <Redirect to ='/login'></Redirect>;
    else return (
        <>
            <Header additionalClass = ''></Header>
            <div className="ConfirmBook">
                <div className="block titleBlock">
                    <div className="title GB px25 line25 ">메멘토북 보관함</div>
                    <div className="subtitle NS px15 line20 op5">memento book storage</div>
                    <div className="detail NS px15 line20 op8">
                        <div>{`${giveUser?.name}님께 전달된 메멘토북을 보관하는 공간입니다.`}</div>
                        <div>찾으시는 메멘토북을 클릭해주세요.</div> 
                    </div>
                </div>
                <div className="block BookBlock">
                    {BookContainer}    
                </div>
                <div className="block BookContent margin_base">
                    <div className="GB px20 line40" style = {{marginTop: '111px'}}>아직 확인할 수 없는 기록입니다.</div>
                    <div className="GB px14 line25 op5" style = {{marginTop: '17px'}}>
                        <div>작성자가 자신의 사후(死後)에 전달되기를 희망한 기록입니다.</div>
                        <div>기록의 열람 방법은 하단의 글을 참고해주세요.</div>
                    </div>
                    <div className="vector"></div>
                    <div className="detail GB px15 line45">
                        <div>메멘토는 작성자의 사망 사실을 확인한 후, 본 기록의 열람 권한을 오픈하는 방식으로 유언을 전달하고 있습니다. 그렇기 때문에 메멘토 북의 수령인 중 최소 1명 이상이 작성자분의 사망 사실을 메멘토에 알려주셔야 유언의 열람이 가능하게 됩니다. 따라서 사망사실을 확인하신 작성자분께서는 다음과 같은 방식으로 메멘토에 사망 사실 신고 절차를 진행해주시면 됩니다.</div>
                        <div>1. 하단의 ‘사망 사실 신고’ 버튼을 통해 신고자 본인의 인적 사항과 작성자분의 사망확인 서류(사망진단서, 사체검안서 원본 또는 사본)를 제출합니다.</div>
                        <div>2. 제출하신 서류는 3일 이내에 확인 후 작성해주신 연락처를 통해 열람 가능 여부를 회신 드릴 예정입니다.</div>
                        <div>3. 추가적인 문의 사항이 있다면 memento.welldying@gmail.com으로 연락주세요!</div>
                    </div>
                    <div className="vector"></div>
                    <button className="submit NS bold whiteop10 px16" onClick = {() => handleClick()}>{'사망 사실 신고하기>'}</button>
                    {DeathInfoContainer}
                    <input type="file" onChange={e => {handleFileinput(e)}} ref = {input_file} style = {{display: 'none'}} />
                </div>
            </div>
            <Footer additionalClass = ''></Footer>
        </>
    )
}

export default ConfirmMementoBook;