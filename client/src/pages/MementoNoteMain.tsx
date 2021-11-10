import React from 'react';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { imageUrl } from '../etc/config';
import { MementoLogo, UserImage, Colon, leftVector, rightVector, PlusVector } from '../img/Vectors';
import { Link, Redirect } from 'react-router-dom';
import { getSections } from '../etc/api/section';
import { getQuestions } from '../etc/api/question';
import { getContents } from '../etc/api/content';
import { getUsers } from '../etc/api/user';
import Contentbox from '../components/Contentbox';
import usePromise from '../etc/usePromise';
import MementoBook from '../components/MementoBook';

let checkBatchim = (word: string) => {
    let lastLetter = word[word.length - 1];
    let uni = lastLetter.charCodeAt(0);

    if((uni < 44032) || (uni > 55203)) return;

    return ((uni - 44032) % 28 !== 0);
};

function MementoNoteMain () {
    let user = useSelector((state: RootReducer) => state.user);
    let [check, setCheck] = React.useState<boolean>(false);
    let [select, setSelect] = React.useState<number>(1);
    let [, sections] = usePromise(getSections);
    let [, questions] = usePromise(getQuestions);
    let [, contents] = usePromise(getContents);
    let [, AllUsers] = usePromise(getUsers);
    let [id, setId] = React.useState<number>(0);
    let [position, setPosition] = React.useState<number>(0);
    React.useEffect(() => {
        if(!user || !user.user) return;
        setCheck(user.user?.DeathInfo.agree);
    }, [user]);
    
    let title = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '메멘토 노트는';
            case 2:
                return '메멘토 북은';
            case 3:
                return '함께쓰는 노트는';
            case 4:
                return '오프라인 자서전은';
        }
    }, [select]);
    let message = React.useMemo(() => {
        switch(select) {
            case 1: 
                return `메멘토가 제시하는 질문에 대한 나의 생각을 정리할 수 있는 프라이빗한 공간입니다. 질문은 삶과 죽음에 관한 총 6가지 카테고리로 구성되어 있으며, 질문에 대해 하나씩 답을 작성하면서 나만의 인생 기록이 담긴 특별한 유언을 완성할 수 있습니다. 질문에 관한 생각을 정리하는 데 어려움을 느끼신다면, 답변 작성에 도움을 받을 수 있는 '도움 컨텐츠'를 참고해주세요!`;
            case 2:
                return '메멘토 노트에 적은 답변을 온라인 책 형태로 엮어 소중한 이들에게 전달하는 공간입니다. 메멘토 노트의 답변 중 전달하고 싶은 답변을 선택하면 자동적으로 메멘토가 당신의 인생 기록이자 유언이 담긴 전자책을 만들어드립니다. 메멘토 북을 모두 완성하셨다면, 소중한 이들에게 이를 열람할 수 있는 초대 메세지를 보내주세요! 전달된 메멘토 북은 작성인의 사망사실이 확인된 이후 열람가능한 상태로 바뀝니다.';
            case 3:
                return '생의 마지막까지 함께하고픈 이들과 함께 질문에 대해 답하고, 추억을 기록하는 공간입니다.';
            case 4:
                return '온라인으로 제작한 유언 자서전을 오프라인 형태로 받아보실 수 있는 프리미엄 서비스입니다.';
        }
    }, [select]);
    let explain_main = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '질문 카테고리 구성';
            case 2:
                return '메멘토 북 노트 수령인';
            case 3:
                return '';
        }
    }, [select]);
    let explain_detail  = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '메멘토 노트는 일반적인 유언과는 달리, 삶과 죽음을 다루는 총 6가지의 카테고리로 구성되어있습니다. 이는 삶을 정리하는 복잡한 과정을 최대한 구체적으로 도움을 드리고자 하는 의미이며, 고인의 의지를 가능한한 왜곡 없이 전달하고자 하는 메멘토의 노력입니다. 혹여 유언을 작성하시는 과정에서 불편함을 느끼셨거나, 피드백이 있으신 분들은 언제든 서비스 피드백 설문을 통해 이야기를 들려주세요:)';
            case 2:
                return '메멘토 노트는 일반적인 유언과는 달리, 삶과 죽음을 다루는 총 6가지의 카테고리로 구성되어있습니다. 이는 삶을 정리하는 복잡한 과정을 최대한 구체적으로 도움을 드리고자 하는 의미이며, 고인의 의지를 가능한한 왜곡 없이 전달하고자 하는 메멘토의 노력입니다. 혹여 유언을 작성하시는 과정에서 불편함을 느끼셨거나, 피드백이 있으신 분들은 언제든 서비스 피드백 설문을 통해 이야기를 들려주세요:) ';
            case 3:
                return '';
        }
    }, [select]);
    let section = React.useMemo(() => sections?.find((section) => section.id === id), [id, sections])
    let section_questions = React.useMemo(() => {
        if(id !== 0)
            return (
                questions?.filter((question) => section?.questions?.includes(question.id))
            );
        else 
            return questions;
    }, [id, questions, section]);
    let maxQuestionId = React.useMemo(() => section_questions?.length, [section_questions]);
    let LinkNote = React.useRef<any>(null);
    let LinkNoteClick = () => LinkNote.current.click();
    let LinkBook = React.useRef<any>(null);
    let LinkBookClick = () => LinkBook.current.click();

    let MementoNoteInfo = React.useMemo(() =>  {
        console.log(user.user?.UsersInfo.give);
        switch(select) {
            case 1: 
                return (
                    <>
                    <div className="block Info" style = {{paddingBottom: '323px', borderBottom: '1px solid rgba(99, 106, 102, 0.2)', cursor: 'pointer'}} onClick = {() => LinkNoteClick()}>
                        <img src={imageUrl('NotePage/backgroundImage.png')} alt="" className="background" style = {{width: '100%', height: '296px', objectFit: 'none', position: 'absolute', borderRadius: '5px'}}/>
                        <div className="mixblend" style = {{width: '100%', height: '296px', position: 'absolute', background: 'rgba(110, 118, 114, 1)', mixBlendMode: 'multiply', borderRadius: '5px'}}></div>
                        <div className="text GB px13 line20" style = {{position: 'absolute', top: '-30px', left: '620px'}}>메멘토 노트에 작성된 답변을 메멘토 북으로 옮겨야 전달이 됩니다.</div>
                        <div className="MementoLogo">{MementoLogo}</div>
                        <div className="more NS px14 whiteop10" style = {{cursor: 'pointer'}}>{`나의 메멘토 노트 작성하기 >`}</div>
                    </div>
                    <div className="detail" style = {{margin: '101px 15px 62px 15px '}}>
                        <div className="title GB px20 line40 ">{explain_main}</div>
                        <div className="message GB px14 line30 "style = {{marginTop: '37px'}}>{explain_detail}</div>
                    </div>
                    <div className = 'category_container'>
                        <div className = {'category NS px12 line25 bold' + (id === 0 ? ' op7' : ' op4')} onClick = {() => {setId(0); setPosition(0);}} style = {{cursor: 'pointer'}}>{'전체'}</div>
                        {sections?.map((section, key) =>{
                            if(key === 5) return <></>;
                            return (
                            <div className = {'category NS px12 line25 bold' + (id === (key + 1) ? ' op7' : ' op4')} onClick = {() => {setId(key + 1); setPosition(0);}} style = {{cursor: 'pointer'}}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div>
                            );
                        })}
                    </div>
                    {section_questions && <div className="questionContainer" style = {{ marginTop: '-16px', overflow: 'hidden'}}>
                        <div className="questions" style = {{left: `${(-530 * position) + 'px'}`, display: 'flex', gap: '30px'}}>
                            {section_questions.map((question) => <div className="questionBox" style = {{width: '501px', height: '188px'}}>
                                <div className="question GB px18 line40">{question.title}</div>
                                {question.contents.length !== 0 && <div style = {{position: 'absolute', top: '129px', left: 'calc(50% - 155px/2)'}}><Link to ={`/contentpage/${question.contents[0]}`}><button className="gocontent NS px12 whiteop10" style = {{background: 'rgba(141, 151, 145, 1)', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)', borderRadius: '20px', width: '155px', height: '27px', padding: '0px'}}>대표 컨텐츠 바로가기</button></Link></div>}
                            </div>)}
                        </div>
                        <div className="left Button" onClick = {() => setPosition(Math.max(position - 2, 0))}>{leftVector}</div>
                        <div className="right Button" onClick = {() => setPosition(Math.min(position + 2, maxQuestionId - 2))}>{rightVector}</div>
                    </div>}
                    </>
                );
            case 2: 
                return (
                    <>
                    <div className="block Info" style = {{paddingBottom: '0px'}}>
                        <div className="BookContainer" style = {{borderBottom: '1px solid rgba(99, 106, 102, 0.2)'}}>
                            {user.user?.bookname.map((bookname) => {
                                return (
                                    <MementoBook bookOwner = {user.user!} watchingBookUser = {user.user!}/>
                                )
                            })}
                            <div className="BookElement" onClick = {(user.user?.bookname && user.user.bookname.length === 1) ? () => {} : () => LinkBookClick()} style = {{cursor: 'pointer'}}>
                                <button className="plus">{PlusVector}</button>
                                <div className="text NS px12">유언 자서전 추가하기</div>
                                {(user.user?.bookname && user.user.bookname.length === 1) && <div className="notopen GB px20 whiteop10" style = {{width: '100%', height: '100%', background: 'rgba(96, 103, 99, 0.8)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0px', left: '0px', borderRadius: '5px'}}>오픈 준비중입니다</div>}
                            </div>
                        </div>
                        <div className="colorContainer">

                        </div>
                    </div>
                    <div className="detail" style = {{margin: '101px 15px 62px 15px '}}>
                        <div className="title GB px20 line40 ">{explain_main}</div>
                        <div className="message GB px14 line30 "style = {{marginTop: '37px'}}>{explain_detail}</div>
                    </div>
                    <div className="text NS px12 bold line25" style = {{marginBottom: '14px'}}>기본형</div>
                    <div className = 'GiveUsersContainer'>
                        {user.user?.UsersInfo.give.map((UserInfo) => {
                        let giveuser = AllUsers.find((user_) => user_.username === UserInfo.username);
                        return (
                            (UserInfo.accept !== 2) && <div className="GiveUsersElement">
                                <div className="UserImage">{UserImage}</div>
                                {(UserInfo.accept === 1) ? <div>
                                    <div className="namephone NS px15 line25 bold op6">{giveuser?.name + ' / 0' + giveuser?.cellphone.slice(3, 5) + '-' + giveuser?.cellphone.slice(5, 9) + '-' + giveuser?.cellphone.slice(9, 13)}</div>
                                    <div className="email NS px15 line25 bold op6">{giveuser?.email}</div>
                                </div> : <>
                                    <div className="email NS px13 line25 bold op6" style ={{width: '200px', letterSpacing: '0em'}}>{(giveuser?.name === undefined ? UserInfo.name : giveuser?.name )+ '님의 승인을 대기중입니다.'}</div>
                                </>}
                            </div>
                        );
                        })}
                        <div className="GiveUsersElement" style = {{padding: '0px 0px 0px 104px', cursor: 'pointer'}}>
                            <div className="plus">{PlusVector}</div>
                            <div className="NS px13 line25 bold op6" style = {{width: '200px'}}>노트 수령인 추가하기</div>
                        </div>
                    </div>
                    </>
                );
            case 3: 
            case 4:
                return (
                    <div className="block Info" style = {{height: '323px'}}>
                        <div className="mixblend" style = {{width: '100%', height: '296px', position: 'absolute', background: 'rgba(96, 103, 99, 0.8)', borderRadius: '5px'}}></div>
                        <div className="open GB px25 line25 whiteop10">오픈준비중입니다.</div>
                        <div className="date NS px15 line30 whiteop5">출시 예정일: 2021년 12월 예정</div>
                    </div>
                );
        }
    }, [select, sections, section_questions, user, position]);

    if(!user.loggedIn) return <Redirect to='/login'/>
    return (
        <div className = 'MementoNoteMain'>
            <Link to = {`/note/1`} ref = {LinkNote} style = {{display: 'none'}} />
            <Link to = {`/notebook/1`} ref = {LinkBook} style = {{display: 'none'}} />
            <Header additionalClass = ' ' />
            <div className="block" style = {{overflow: 'hidden', height: '223px'}}>
                <img src={imageUrl('NotePage/NoteMainBackground.png')} alt="" className="NoteMainBackground" style = {{position: 'absolute'}} />
                <div className="mixblend" style = {{background: 'rgba(230, 229, 226, 1)',mixBlendMode: 'soft-light', width: '100%', height: '223px', position: 'absolute', top: '0px'}}></div>
                <div className="MementoLogo">{MementoLogo}</div>
            </div>
            <div className="block">
                <div className="UserImage">{UserImage}</div>
                <div className="explain">
                    <div className="title NS px14 line25">{`${user.user!.name}님의 메멘토 노트`}</div>
                    <div className="colon" style = {{marginTop: '88px'}}>{Colon}</div>
                    <div className="maintext GB px20 line40" style = {{marginTop: '21px'}}>건강한 서비스 이용을 위한 생명 존중 서약</div>
                    <div className="subtext GB px15 line40" style = {{marginTop: '54px', textAlign: 'justify'}}>
                        <div>나는 유언을 작성, 전달, 사용하는 과정에서 절대로 자해나 자살을 시도하지 않을 것을 서약합니다.</div>
                        <div>자살하고 싶은 생각이 들면 반드시 주위 사람에게 도움을 청하거나, 중앙자살예방센터(1393),</div>
                        <div>한국 생명의 전화(1588-9191) 등으로 전화를 걸어 도움을 요청하겠습니다.</div>
                    </div>
                    <div className="agreeCheck px12 line25 op3 bold" style = {{marginTop: '47px'}}>{(check ? <>{`네, 저 ${user.user?.name + ((!(!user || !user.user) && checkBatchim(String(user.user.name))) ? '은' : '는')} 메멘토의 이야기에 공감합니다.`}</> : <>네 이해하고 동의합니다
                    <div className={"checkbox" + (check ? ' checked' : '')} style = {{width: '14px', height: '14px', cursor: 'pointer'}} onClick = {() => setCheck(!check)}></div></>)}</div>
                </div>
            </div>
            <div className="block" style = {{marginTop: '165px'}}>
                <div className="background" style = {{width: '100%', height: ((select === 1 || select === 2) ? '866px' : '327px'), top: '475px', background: 'rgba(229, 231, 230, 0.2)'}}></div>
                <div className="margin_base">
                    <div className="toolbarContainer">
                        <div className="toolbar GB px16 bold">
                            <div className="text" onClick = {() => setSelect(1)} style = {{cursor: 'pointer'}}>메멘토 노트{(select === 1) && <div className="select"></div>}</div>
                            <div className="text" onClick = {() => setSelect(2)} style = {{cursor: 'pointer'}}>메멘토 북{(select === 2) && <div className="select"></div>}</div>
                            <div className="text" onClick = {() => setSelect(3)} style = {{cursor: 'pointer'}}>함께쓰는 노트{(select === 3) && <div className="select"></div>}</div>
                            <div className="text" onClick = {() => setSelect(4)} style = {{cursor: 'pointer'}}>오프라인 자서전{(select === 4) && <div className="select"></div>}</div>
                        </div>
                    </div>
                    <div className="detail" style = {{margin: '60px 15px'}}>
                        <div className="title GB px20 line40 ">{title}</div>
                        <div className="message GB px14 line30 "style = {{marginTop: '37px', paddingBottom: '55px'}}>{message}</div>
                    </div>
                    {MementoNoteInfo}
                </div>
            </div>
            <div style = {{height: '150px'}}></div>
            {false && <div className="block">
                <div className="contents_bookmark margin_base" style = {{marginTop: '192px', textAlign: 'center', paddingBottom: '105px'}}>
                    <div className="title GB px20 line40">당신을 의미있게 만들어준 책갈피</div>
                    <div className="message GB px14 line25 op5 " style = {{marginTop: '10px'}}>
                        <div>죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요</div>
                        <div>않은 감정이 있나요?죽기 전?죽기 전. 감정이 있나요</div>
                    </div>
                    <div className="more NS px12 line15 bold" style = {{marginTop: '27px', color: 'rgba(79, 84, 80, 0.6)'}}>{'나의 책갈피 전체보기>'}</div>
                    <div className="content_container" style = {{textAlign: 'left', flexWrap: 'nowrap', overflow: 'hidden', padding: '20px 20px', left: '-20px', top: '-20px', width: 'fit-content', boxSizing: 'content-box'}}>
                        {contents?.map((content) => <Contentbox additionalClass = 'big type2' content = {content}/>)}
                    </div>
                    <div className="buttoncontainer" style = {{display: 'flex', gap: '25px', top: '-23px', marginLeft: 'calc(1032px - 81px)'}}>
                        <div className="left button">{leftVector}</div>
                        <div className="right button">{rightVector}</div>
                    </div>
                </div>
            </div>}
            <Footer additionalClass = '' />
        </div>
    );
}

export default MementoNoteMain;