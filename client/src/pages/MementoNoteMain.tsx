import React from 'react';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import Header from '../components/Header';
import { imageUrl } from '../etc/config';
import { MementoLogo, UserImage, Colon, leftVector, rightVector } from '../img/Vectors';
import { Link } from 'react-router-dom';
import { getSections } from '../etc/api/section';
import { getQuestions } from '../etc/api/question';
import { getContents } from '../etc/api/content';
import Contentbox from '../components/Contentbox';
import usePromise from '../etc/usePromise';

function MementoNoteMain () {
    let user = useSelector((state: RootReducer) => state.user);
    let [check, setCheck] = React.useState<boolean>(false);
    let [select, setSelect] = React.useState<number>(1);
    let [, sections] = usePromise(getSections);
    let [, questions] = usePromise(getQuestions);
    let [, contents] = usePromise(getContents);
    let [id, setId] = React.useState<number>(0);
    let [position, setPosition] = React.useState<number>(0);
    
    let title = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '메멘토 노트는';
            case 2:
                return '유언 자서전은';
            case 3:
                return '함께쓰는 노트는';
        }
    }, [select]);
    let message = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?... ';
            case 2:
                return '죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  ';
            case 3:
                return '죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?... ';
        }
    }, [select]);
    let explain_main = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '메멘토는 카테고리를 나누어 놓았다. 어쩌구';
            case 2:
                return '오프라인 자서전 제작';
            case 3:
                return '';
        }
    }, [select]);
    let explain_detail  = React.useMemo(() => {
        switch(select) {
            case 1: 
                return '죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있그럼 각 카테고리에는 어떤 질문이 있는지 ㅎ롹인해볼까여ㅛ?              ';
            case 2:
                return '죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감정을 느낄 것 같낄 것 같나요?...  죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요?죽기 전, 어떤 감을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있그럼 각 카테고리에는 어떤 질문이 있는지 ㅎ롹인해볼까여ㅛ?';
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

    return (
        <div className = 'MementoNoteMain'>
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
                    <div className="maintext GB px20 line40" style = {{marginTop: '21px'}}>당신은 죽음을 받아들일 준비가 되어있는 사람인가요?</div>
                    <div className="subtext GB px15 line40" style = {{marginTop: '54px', textAlign: 'justify'}}>메멘토 노트는 당신의 죽음에 대해 작성하고 어쩌구 하는 공간입니다. 당신은 죽음에 대해 충분한 준비에 대한 이해가 충분히 되어있나요? 혹시 현재의 슬픔에 휩싸여 어쩌구 글을 작성하려 하지는 않았나요? 저희 메멘토는 어쩌구 어쩌구 당신의 어쩌구 당신이 어떤 마음으로 죽음을 준비했으면 좋겠고, 자살을 생각하고 있다면 정말 그것은 안될 생각이라는 글을 여기에 적어보려 합니다. 이해하나요?</div>
                    {check && <div className="agreetext px12 line25 op3 bold" style = {{marginTop: '47px'}}>네, 저 OOO은 메멘토의 이야기에 공감합니다.</div>}
                </div>
                <div className="agreeCheck NS px12 line25 op7 bold">
                    네 이해하고 동의합니다
                    <div className={"checkbox" + (check ? ' checked' : '')} onClick = {() => setCheck(!check)}></div>
                </div>
            </div>
            <div className="block" style = {{marginTop: '165px'}}>
                <div className="background" style = {{width: '100%', height: '866px', top: '475px', background: 'rgba(229, 231, 230, 0.2)'}}></div>
                <div className="margin_base">
                    <div className="toolbarContainer">
                        <div className="toolbar GB px16 bold">
                            <div className="text" onClick = {() => setSelect(1)}>메멘토 노트{(select === 1) && <div className="select"></div>}</div>
                            <div className="text" onClick = {() => setSelect(2)}>유언 자서전{(select === 2) && <div className="select"></div>}</div>
                            <div className="text" onClick = {() => setSelect(3)}>함께쓰는 노트{(select === 3) && <div className="select"></div>}</div>
                        </div>
                    </div>
                    <div className="detail" style = {{margin: '60px 15px'}}>
                        <div className="title GB px20 line40 ">{title}</div>
                        <div className="message GB px14 line30 "style = {{marginTop: '37px', paddingBottom: '55px'}}>{message}</div>
                    </div>
                    <div className="block" style = {{paddingBottom: '323px', borderBottom: '1px solid rgba(99, 106, 102, 0.2)'}}>
                        <img src={imageUrl('NotePage/backgroundImage.png')} alt="" className="background" style = {{width: '100%', height: '296px', objectFit: 'none', position: 'absolute', borderRadius: '5px'}}/>
                        <div className="mixblend" style = {{width: '100%', height: '296px', position: 'absolute', background: 'rgba(110, 118, 114, 1)', mixBlendMode: 'multiply', borderRadius: '5px'}}></div>
                        <div className="text GB px13 line20" style = {{position: 'absolute', top: '-30px', left: '620px'}}>메멘토 노트에 작성된 답변은을 유언 자서전으로 옮겨야 전달이 어쩌구</div>
                    </div>
                    <div className="detail" style = {{margin: '101px 15px 62px 15px '}}>
                        <div className="title GB px20 line40 ">{explain_main}</div>
                        <div className="message GB px14 line30 "style = {{marginTop: '37px'}}>{explain_detail}</div>
                    </div>
                    <div className = 'category_container'>
                      <div className = {'category NS px12 line25 bold' + (id === 0 ? ' op7' : ' op4')} onClick = {() => {setId(0); setPosition(0);}}>{'전체'}</div>
                      {sections?.map((section, key) =>{
                        return (
                          <div className = {'category NS px12 line25 bold' + (id === (key + 1) ? ' op7' : ' op4')} onClick = {() => {setId(key + 1); setPosition(0);}}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div>
                        );
                      })}
                  </div>
                  {section_questions && <div className="questionContainer" style = {{ marginTop: '-16px', overflow: 'hidden'}}>
                      <div className="questions" style = {{left: `${(-530 * position) + 'px'}`, display: 'flex', gap: '30px'}}>
                        {section_questions.map((question) => <div className="questionBox" style = {{width: '501px', height: '188px'}}>
                            <div className="question GB px18 line40">{question.title}</div>
                            <div style = {{position: 'absolute', top: '129px', left: 'calc(50% - 155px/2)'}}><Link to ={`/contentpage/${question.contents[0]}`}><button className="gocontent NS px12 whiteop10" style = {{background: 'rgba(141, 151, 145, 1)', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)', borderRadius: '20px', width: '155px', height: '27px', padding: '0px'}}>대표 컨텐츠 바로가기</button></Link></div>
                        </div>)}
                      </div>
                      <div className="left Button" onClick = {() => setPosition(Math.max(position - 2, 0))}>{leftVector}</div>
                      <div className="right Button" onClick = {() => setPosition(Math.min(position + 2, maxQuestionId - 2))}>{rightVector}</div>
                  </div>}
                </div>
            </div>
            <div className="block">
                <div className="contents_bookmark margin_base" style = {{marginTop: '115px', textAlign: 'center', paddingBottom: '105px'}}>
                    <div className="title GB px20 line40">당신을 의미있게 만들어준 책갈피</div>
                    <div className="message GB px14 line25 op5 " style = {{marginTop: '10px'}}>
                        <div>죽기 전, 어떤 감정을 느낄 것 같나요? 혹은 절대 느끼고 싶지 않은 감정이 있나요</div>
                        <div>않은 감정이 있나요?죽기 전?죽기 전. 감정이 있나요</div>
                    </div>
                    <div className="more NS px12 line15 bold" style = {{marginTop: '27px', color: 'rgba(79, 84, 80, 0.6)'}}>{'나의 책갈피 전체보기>'}</div>
                    <div className="content_container" style = {{textAlign: 'left', flexWrap: 'nowrap', overflow: 'hidden', padding: '20px 20px', left: '-20px', top: '-20px', width: '100%', boxSizing: 'content-box'}}>
                        {contents?.map((content) => <Contentbox additionalClass = 'big type2' content = {content}/>)}
                    </div>
                    <div className="buttoncontainer" style = {{display: 'flex', gap: '25px', top: '-23px', left: 'calc(1032px - 81px)'}}>
                        <div className="left button">{leftVector}</div>
                        <div className="right button">{rightVector}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MementoNoteMain;