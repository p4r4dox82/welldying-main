import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import { RootReducer } from '../store';
import Header from '../components/Header';
import NoteLeftBar from '../components/NoteLeftBar';
import NoteQuestion from '../components/NoteQuestion';
import useScroll from '../etc/useScroll';

import { getQuestions, Question } from '../etc/api/question';
import { getSection, getSections } from '../etc/api/section';
import { getAnswers, addBook } from '../etc/api/answer';
import { getUsers, setBookName, setUsers, UserGiveInfo } from '../etc/api/user';
import usePromise from '../etc/usePromise';
import { kakaoJskey } from '../etc/config';

import { imageUrl } from '../etc/config';
import { parseDate } from '../etc/index';

import { EmailVector, Colon, leftVector, rightVector } from '../img/Vectors';
import { init, send } from 'emailjs-com';

declare global {
  interface Window {
    Kakao: any;
    ClipboardJS: any;
  }
}

const { Kakao, ClipboardJS } = window;

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

let checkbookname = (bookname: string) => {
  let newbookname = bookname;
  if(newbookname.length > 15)
  newbookname = newbookname.slice(0, 14);
  console.log(newbookname);
  return newbookname;
}

function MementoNoteBook({ match } : Props) {
  let id = Number.parseInt(match.params.id);

  let scroll = useScroll();

  let user = useSelector((state: RootReducer) => state.user);
  let [scrollActive, setScrollActive] = React.useState(false);
  let [, sections] = usePromise(getSections);
  let [, questions] = usePromise(getQuestions);
  let [, answers] = usePromise(getAnswers);
  let [block, setBlock] = React.useState<boolean>(false);
  let [addQuestions, setAddQuestions] = React.useState<boolean>(false);
  let [addSectionId, setAddSectionId] = React.useState<number>(0);
  let [categoryTotal, setCategoryTotal] = React.useState<boolean>(false);
  let [total, setTotal] = React.useState<boolean>(false);

  let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);
  let section_add = React.useMemo(() => sections?.find((section) => section.id === addSectionId), [sections, addSectionId]);

  let [search_word, setSearch_word] = React.useState<string>('');

  let [orderContainer, setOrderContainer] = React.useState<boolean>(false);
  let [order, setOrder] = React.useState<number>(0);
  let [update, setUpdate] = React.useState<number>(0);
  let [bookname, setBookname] = React.useState<string>('');
  let [booknameupload, setBooknameupload] = React.useState<string>('');
  let [UsersGive, setUsersGive] = React.useState<UserGiveInfo[]>([]);
  let [UsersGet, setUsersGet] = React.useState<UserGiveInfo[]>([]);

  let [answers_booked, ] = React.useState<{ questionId: number, book: number }[]>([]);

  React.useEffect(() => {
    if(!answers) return;
    answers?.forEach((answer) => {
      answers_booked.push({ questionId: answer.questionId, book: answer.book });
    })
  }, [answers]);

  React.useEffect(() => {
    if(!user.user?.bookname) return;
    setBooknameupload(user.user.bookname[0]);
    setUsersGive(user.user.UsersInfo.give);
    setUsersGet(user.user.UsersInfo.get);
  }, [user]);

  let written_questions = React.useMemo(() => {
    return (
      questions?.filter((question) => {
        let answer = answers?.find((answer) => (answer.questionId === question.id));
        if(!answer) return false;
        else return true;
      })
    );
  }, [questions, answers, update]);

  let questions_written = React.useMemo(() => {
    console.log(written_questions);
    return (
      <>
        {written_questions?.map((question, key) => {
          return (
            <NoteQuestion question = {question} written = {true} type = {(block ? 'small': 'type2')} order = {(block ? key : -1)}/>
          );
        })}
      </>
    );
  }, [questions, answers, written_questions]);

  let section_written_questions = React.useMemo(() => {
    return (
      section?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || !answer) return false;
        else return true;
      })
    );
  }, [section, questions, answers, update]);

  let section_questions_written_added = React.useMemo(() => {
    if(!answers || !answers_booked) {
      console.log(answers_booked);
      return;
    }
    else return (
      section?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        let answer_booked = answers_booked?.find((answer) => answer?.questionId === questionId);
        if (!answer || answer.book === 0 || answer_booked?.book === 0) {
          return false
        }
        else return (
          true
        );
      })
    );
  }, [section, questions, answers, update, answers_booked])

  let section_questions_written = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section_written_questions?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {true} type = {(block ? 'small': 'type2')} order = {(block ? key : -1)}/>
            );
          })}
      </>
    );
  }, [section_written_questions, block]);

  let section_written_questions_add = React.useMemo(() => {
    return (
      section_add?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        let answer_booked = answers_booked?.find((answer_booked) => answer_booked.questionId === questionId);
        if (!question || !answer || answer.book !== 0 || answer_booked?.book !== 0) return false;
        else return true;
      })
    );
  }, [section_add, questions, answers, update, answers_booked]);

  let section_questions_add_written = React.useMemo(() => {
    console.log(section_written_questions_add);
    return (id === undefined) ? undefined : (
      <>
          {section_written_questions_add?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {true} type = {'add'} order = {-1}/>
            );
          })}
      </>
    );
  }, [section_written_questions_add, block]);

  let section_unwritten_questions_add = React.useMemo(() => {
    return (
      section_add?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || answer) return false;
        else return true;
      })
    );
  }, [section_add, questions, answers, update]);

  let section_questions_add_unwritten = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section_unwritten_questions_add?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {false} type = {'add'} order = {-1}/>
            );
          })}
      </>
    );
  }, [section_unwritten_questions_add, block]);

  let written_questions_add = React.useMemo(() => {
    if(!answers || !answers_booked) {
      console.log(answers_booked);
      return;
    }
    else return (
      <>
        {questions?.map((question) => {
          let answer = answers?.find((answer) => answer.questionId === question.id);
          let answer_booked = answers_booked?.find((answer) => answer?.questionId === question.id);
          if (!answer || answer.book !== 0 || answer_booked?.book !== 0) {
            return <></>;
          }
          else return (
            <NoteQuestion question = {question} written = {true} type = {'add'} order = {-1} />
          );
        })}
      </>
    );
  }, [questions, answers, update, answers_booked]);

  let written_questions_added = React.useMemo(() => {
    if(!answers || !answers_booked) {
      console.log(answers_booked);
      return;
    }
    else if(id === 0) return (
      questions?.filter((question) => {
        let answer = answers?.find((answer) => answer.questionId === question.id);
        let answer_booked = answers_booked?.find((answer) => answer?.questionId === question.id);
        if (!answer || answer.book === 0 || answer_booked?.book === 0) {
          return false;
        }
        else return (
          true
        );
      })
    );
    else return (
      questions.filter((question) => section_questions_written_added?.includes(question.id))
    );
  }, [questions, answers, update, answers_booked, section_questions_written_added, id]);

  let empty_section = React.useMemo(() => {
    console.log(section_written_questions_add);
    return (
      section_written_questions_add?.length === 0 && <>
        <div className = 'empty_answered_question'>
            <div className = 'text NS px14 line25 whiteop10'>현재 카테고리에 남은 질문이 존재하지 않습니다.</div>
            <div className = 'text NS px14 line25 whiteop10'>{(section_unwritten_questions_add?.length !== 0 ? '아래의 질문에 대해 답변한 후, 유언 자서전에 추가해보는 것은 어떨까요?' : `추가 질문은 매주 '월요일'에 업로드 됩니다. 감사합니다!`)}</div>
        </div>
        <div className = 'questions_container' style = {{marginTop: '66px', marginLeft: '0px', gap: '30px 30px'}}>
            {section_questions_add_unwritten}
        </div>
    </>
    );
  }, [section_written_questions_add, update, answers_booked]);

  let sort_answered = (questionA: Question, questionB: Question) => {
    let answerA = answers?.find((answer) => answer.questionId === questionA.id);
    let answerB = answers?.find((answer) => answer.questionId === questionB.id);
    if((answerA?.updatedAt !== undefined && answerB?.updatedAt !== undefined) && answerA?.updatedAt < answerB?.updatedAt)
      return 1;
    else return -1;
  };

  let sort_answered_reverse = (questionA: Question, questionB: Question) => {
    let answerA = answers?.find((answer) => answer.questionId === questionA.id);
    let answerB = answers?.find((answer) => answer.questionId === questionB.id);
    if((answerA?.updatedAt !== undefined && answerB?.updatedAt !== undefined) && answerA?.updatedAt > answerB?.updatedAt)
      return 1;
    else return -1;
  };

  let sort_made = (questionA: Question, questionB: Question) => {
    if(questionA?.id > questionB?.id) return 1;
    else return -1;
  };


  React.useEffect(() => {
      setScrollActive(scroll >= 137);
  }, [scroll]);

  let GetBookName = React.useMemo(() => {
    return (
      !booknameupload && <div className="setbookname" style = {{width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.6)', position: 'fixed', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="booknamecontainer" style = {{width: '837px', height: '137px', padding: '38px 50px', background: '#FFFFFF', boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.08)', borderRadius: '5px', display: 'flex', justifyContent: 'space-between'}}>
            <input type="text" className="bookname NS bold px14" style = {{width: '581px', height: '100%', borderRadius: '5px', padding: '18px 30px', color: 'rgba(122, 121, 120, 1)', outline: 'none', border: 'none', boxShadow: 'inset 0px 1px 2px 1px rgba(0, 0, 0, 0.25)', background: 'rgba(249, 249, 249, 1)' }} placeholder = '노트의 제목을 입력해주세요. (15자 이내)' value = {bookname} onChange = {(e) => {setBookname(checkbookname(e.target.value));}} />
            <button className="submit green NS bold px16" style = {{width: '141px', height: '100%', background: 'rgba(39, 57, 47, 1)', borderRadius: '5px'}} onClick = {async () => {
              if(await setBookName(user.user!.username, [bookname]))
                setBooknameupload(bookname);
            }}>제목 입력</button>
          </div>
      </div>
    );
  }, [booknameupload, bookname]);

  let [addUserGive, setAddUserGive] = React.useState<boolean>(false);
  let [method, setMethod] = React.useState<number>(0);
  let [giveusername, setgiveusername] = React.useState<string>('');
  let [giveuserphonenumber, setgiveuserphonenumber] = React.useState<string>('');
  let [giveuseremail, setgiveuseremail] = React.useState<string>('');
  let [, users] = usePromise(getUsers);

  React.useEffect(() => {
    if(!Kakao.isInitialized())
      Kakao.init(kakaoJskey);
  }, []);

  let kakaoShare = () => {
    Kakao.Link.createDefaultButton({
      container: '#kakao-link_btn',
      objectType: 'text',
      text:
        `${user.user!.name}님께서 메멘토 북 수령 요청을 보내셨습니다. 메멘토에 가입 하셔서 ${user.user!.name}님이 남기신 이야기를 소중하게 보관하세요. (이미 가입중이신 경우 마이페이지를 확인해주세요.)`,
      link: {
        mobileWebUrl: 'https://mymemento.kr',
        webUrl:
          'https://mymemento.kr',
      },
    });
  }

  let [pageNumber, setPageNumber] = React.useState<number>(0);
  React.useEffect(() => {
    setPageNumber(0);
  }, [id]);

  let MementoBookPage = React.useMemo(() => {
    if(!written_questions_added) return (
      <></>
    );
    if(written_questions_added.length === 0) return (
      <div className="noquestion" style = {{width: '942px', height: '603px', marginTop: '15px', marginLeft: '13px', background: 'rgba(255, 255, 255, 0)', boxShadow: '0px 1px 4px 2px rgba(0, 0, 0, 0.05)', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
        <div>
          <div className="NS px16 line20 bold" style = {{width: '100%', textAlign: 'center'}}>아직 답변하신 질문이 존재하지 않습니다.</div>
          <div className="NS px15 line20 op7" style = {{width: '100%', textAlign: 'center'}}>좌측의 ‘ + 버튼 ’으로 답변하신 질문들을 이곳에 추가해주세요</div>
        </div>
      </div>
    );
    let pagequestion = written_questions_added[pageNumber];
    if(!pagequestion) return<></>;
    let pageanswer = answers?.find((answer) => answer.questionId === pagequestion.id);
    let section = sections?.find((section) => section.questions.includes(pagequestion.id));
    if(pageanswer?.imageData.imageUrl !== '' && pageanswer!.message.length <= 350) {
      return (
        <>
          <div className="left page" style = {{padding: '20px 20px'}}>
            <div className="imageContainer" style ={{position: 'absolute', top: '20px', paddingBottom: '11px', borderBottom: '1px dashed rgba(147, 156, 151, 1)'}}>
              <img src={pageanswer?.imageData.imageUrl} alt="" style = {{width: '424px', height: '424px', objectFit: 'cover'}}/>
            </div>
            <div className="questioncontainer">
              <div className="Colon">
                {Colon}
              </div>
              <div className="question">
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[0]}</div>
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[1]}</div>
              </div>
            </div>
          </div>
          <div className="right page" style = {{padding: '20px 20px'}}>
              <div className="topContainer">
                <div className="tag GB px9 line25 bold">{section?.tag}</div>
                <div className="date GB px9 line25 op7">{String(parseDate(new Date(Number(pageanswer?.updatedAt))))}</div>
              </div>
              <div className="answerContainer">
                <div className="Colon">{Colon}</div>
                <textarea name="" id="" className = 'GB px12 line25' value = {pageanswer?.message} disabled ></textarea>
              </div>
          </div>  
        </>
      )
    } else if(pageanswer?.imageData.imageUrl !== '' && pageanswer!.message.length <= 550) {
      return (
        <>
          <div className="left page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>
            <div className="questioncontainer" style = {{margin: '35px 0px 0px 53px'}}>
              <div className="Colon">
                {Colon}
              </div>
              <div className="question">
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[0]}</div>
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[1]}</div>
              </div>
            </div>
            <div className="answerContainer" style = {{ margin: '0px 0px 49px 48px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {52} rows = {(Number(pageanswer?.message.length)-210)/26} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(0, pageanswer?.message.length-210)} disabled ></textarea>
            </div>
          </div>
          <div className="right page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>
              <div className="imageContainer" style ={{position: 'absolute', top: '86px', left: '125px'}}>
                <img src={pageanswer?.imageData.imageUrl} alt="" style = {{width: '216px', height: '216px', objectFit: 'cover'}}/>
              </div> 
              <div className="topContainer">
                <div className="tag GB px9 line25 bold">{section?.tag}</div>
                <div className="date GB px9 line25 op7">{String(parseDate(new Date(Number(pageanswer?.updatedAt))))}</div>
              </div>
              <div className="answerContainer" style = {{ margin: '0px 0px 49px 48px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {52} rows = {(210)/26} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(pageanswer?.message.length-210, 551)} disabled ></textarea>
              </div>
          </div>  
        </> 
      )
    } else if(pageanswer?.imageData.imageUrl === '' && pageanswer!.message.length <= 350) {
      return (
        <>
          <div className="left page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>
            <div className="questioncontainer" style = {{margin: '45px 0px 0px 35px'}}>
              <div className="Colon">
                {Colon}
              </div>
              <div className="question">
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[0]}</div>
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[1]}</div>
              </div>
            </div>
            <div className="answerContainer" style = {{ margin: '0px 0px 49px 140px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {34} rows = {(Number(pageanswer?.message.length)/2)/17} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(0, pageanswer?.message.length/2)} disabled ></textarea>
            </div>
          </div>
          <div className="right page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>  
              <div className="topContainer">
                <div className="tag GB px9 line25 bold">{section?.tag}</div>
                <div className="date GB px9 line25 op7">{String(parseDate(new Date(Number(pageanswer?.updatedAt))))}</div>
              </div>
              <div className="Colon" style = {{position: 'absolute', width: '7px', height: '27px', top: '73px', left: '390px'}}>
                {Colon}
              </div>
              <div className="answerContainer" style = {{ margin: '0px 0px 49px 48px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {34} rows = {(Number(pageanswer?.message.length)/2)/17} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(pageanswer?.message.length/2, 551)} disabled ></textarea>
              </div>
          </div>  
        </> 
      )
    } else if(pageanswer?.imageData.imageUrl === '' && pageanswer!.message.length <= 420) {
      return (
        <>
          <div className="left page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>
            <div className="questioncontainer" style = {{margin: '35px 0px 0px 53px'}}>
              <div className="Colon">
                {Colon}
              </div>
              <div className="question">
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[0]}</div>
                <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[1]}</div>
              </div>
            </div>
            <div className="answerContainer" style = {{ margin: '0px 0px 140px 54px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {34} rows = {(350/2)/17} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(0, 350/2)} disabled ></textarea>
            </div>
          </div>
          <div className="right page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>  
              <div className="topContainer">
                <div className="tag GB px9 line25 bold">{section?.tag}</div>
                <div className="date GB px9 line25 op7">{String(parseDate(new Date(Number(pageanswer?.updatedAt))))}</div>
              </div>
              <div className="Colon" style = {{position: 'absolute', width: '7px', height: '27px', top: '156px', left: '226px'}}>
                {Colon}
              </div>
              <div className="answerContainer" style = {{ margin: '0px 0px 49px 48px', alignSelf: 'end'}}>
                <textarea name="" id="" cols = {52} rows = {(Number(pageanswer?.message.length) - (350/2))/26} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(350/2, 551)} disabled ></textarea>
              </div>
          </div>  
        </> 
      )
    } else if(pageanswer?.imageData.imageUrl === '' && pageanswer!.message.length <= 550) {
        return (
          <>
            <div className="left page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>
              <div className="questioncontainer" style = {{margin: '35px 0px 0px 53px'}}>
                <div className="Colon">
                  {Colon}
                </div>
                <div className="question">
                  <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[0]}</div>
                  <div className = 'GB px14 line25'>{pagequestion.title.split('\n')[1]}</div>
                </div>
              </div>
            </div>
            <div className="right page" style = {{padding: '20px 20px', display: 'flex', flexWrap: 'wrap'}}>  
                <div className="topContainer">
                  <div className="tag GB px9 line25 bold">{section?.tag}</div>
                  <div className="date GB px9 line25 op7">{String(parseDate(new Date(Number(pageanswer?.updatedAt))))}</div>
                </div>
                <div className="answerContainer" style = {{ margin: '10px 0px 0px 53px', alignSelf: 'end'}}>
                  <textarea name="" id="" cols = {52} rows = {(Number(pageanswer?.message.length))/26} style = {{width: 'fit-content', height: 'fit-content', textAlign: 'justify'}} className = 'GB px12 line25' value = {pageanswer?.message.slice(0, 551)} disabled ></textarea>
                </div>
            </div>  
          </> 
        )
    }
  }, [written_questions_added, pageNumber]);

  let bottomContainer = React.useMemo(() => {
    return (
      <div className="bottomContainer">
        {written_questions_added?.length !== 0 && <>
            <div className="number NS px12 bold line25 op3" style = {{margin: '2px 13px 0px 0px'}} >{1}</div>
            <div className="pageBar">
              <div className="circle" style = {{marginLeft: '4px', boxSizing: 'content-box'}}></div>
              <div className="circle"></div>
              <div className="circle" style = {{marginRight: '4px', boxSizing: 'content-box'}}></div>
              <div className="pageContainer" style ={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '14px', top: '7px', position: 'absolute', left: `${pageNumber/(Number(written_questions_added?.length) - 1) * 407+ 'px'}`}}>
                <div className="Big circle"></div>
                <div className="number NS px12 bold line25 op3" style = {{margin: '4px', color: 'rgba(103, 116, 109, 1)', textAlign: 'center'}} >{pageNumber + 1}</div>
              </div>
              <div className="bar"></div>
            </div>
            <div className="number NS px12 bold line25 op3" style = {{margin: '2px 0px 0px 15px'}}>{written_questions_added?.length}</div>
          <div className="buttonContainer">
            <button className="left" onClick = {() => setPageNumber(Math.max(0, pageNumber - 1))}>{leftVector}</button>
            <button className="right" onClick = {() => setPageNumber(Math.min(Number(written_questions_added?.length) - 1, pageNumber + 1))}>{rightVector}</button>
          </div>
        </>}
      </div>
    );
  }, [written_questions_added, pageNumber]);

  let kakaobutton = React.useRef<any>(null);
  let kakaobuttonClick = () => kakaobutton.current.click();

  React.useEffect(() => {
    init('user_efVYvnzs9Sl5DA3GNmTO5');
  })

  if (!user.loggedIn) return <Redirect to='/login' />;
  else return (
    <>
      {GetBookName}
      <Header additionalClass = '' />
      <div className = 'MementoNoteBook'>
          <div className = {'leftbar_container short'}>
              <NoteLeftBar additionalClass = {(scroll > 112 ? ' fixed' : '')} id = {id} book = {true} category = {false} setAddUserGive = {setAddUserGive}/>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'book_container margin_base'>
                  <div className = 'category_container'>
                      <Link to={`/notebook/0`}><div className = {'category NS px12 line25 bold' + (id === 0 ? ' op7' : ' op4')}>{'전체'}</div></Link>
                      {sections?.map((section, key) =>{
                        return (
                          <Link to={`/notebook/${key + 1}`}><div className = {'category NS px12 line25 bold' + (id === (key + 1) ? ' op7' : ' op4')}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div></Link>
                        );
                      })}
                  </div>
                  <div className = 'book_main'>
                      <div className = 'side_bar_container'>
                          <img className = 'zoom_button' src = {imageUrl('NotePage/zoom_image.png')} />
                          <img className = 'add_button' src = {imageUrl('NotePage/add_image.png')} onClick = {() => {setAddQuestions(true); setUpdate(update + 1);}}/>
                          <div className = 'title GB px13 line30'>{booknameupload ? booknameupload : ''}</div>
                          <img className = 'edit_button' style = {{margin: '483px 0px 0px 0px'}} src = {imageUrl('NotePage/edit_image.png')} />
                      </div>
                      {MementoBookPage}
                  </div>
                  {bottomContainer}
              </div>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'submenu_container'>
                  <div className = 'searchContainer'>
                      <img src = {imageUrl('search_image.png')} />
                      <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)감동'/>
                  </div>
                  <div className = 'button_container'>
                      <img className = 'block_button' src = {imageUrl('ContentPage/block_button.svg')} onClick = {() => setBlock(!block)}/>
                      <img className = 'order_button' src = {imageUrl('NotePage/sort_image.png')} onClick = {() => setOrderContainer(!orderContainer)}/>
                  {orderContainer && <div className="orderContainer">
                      <div className={"NS px12 bold " + (order !== 1 ? 'op3' : 'op10')} onClick = {() => {questions = questions.sort(sort_answered); setUpdate(update + 1); console.log(questions); setOrder(1);}}>최근 답변순</div>
                      <div className={"NS px12 bold " + (order !== 2 ? 'op3' : 'op10')} onClick = {() => {questions = questions.sort(sort_answered_reverse); setUpdate(update + 1); console.log(questions); setOrder(2);}}>과거 답변순</div>
                      <div className={"NS px12 bold " + (order !== 0 ? 'op3' : 'op10')} onClick = {() => {questions = questions.sort(sort_made); setUpdate(update + 1); setOrder(0);}}>질문 생성일</div>
                  </div>}
                      <img src = {imageUrl('NotePage/add_image_.png')} onClick = {() => {setAddQuestions(true); window.scrollTo(0, 0);}}/>
                  </div>
              </div>
              <div className = 'written_question margin_note' style = {{marginTop: '-23px'}}>
                  <div className = 'questions_container'>
                      {(id === 0 ? questions_written : section_questions_written)}
                  </div>
              </div>
          </div>
          {addQuestions && <div className = 'block fixed'>
              <div className = 'add_questions_container margin_base'>
                  <div className = 'category_container'>
                      <div className = {'category NS px12 line25 bold' + (addSectionId === 0 ? ' whiteop10' : ' whiteop7')} onClick = {() => setAddSectionId(0)}>{'전체'}</div>
                      {sections?.map((section, key) =>{
                        return (
                          <div className = {'category NS px12 line25 bold' + (addSectionId === (key + 1) ? ' whiteop10' : ' whiteop7')} onClick = {() => {setAddSectionId(key + 1);}}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div>
                        );
                      })}
                  </div>
                  <img src = {imageUrl('NotePage/quit_vector.svg')} style = {{position: 'absolute', right: '0px', top: '0px'}} onClick = {() => setAddQuestions(false)}/>
                  <div className = 'questions_container' style = {{margin: '20px 0px 0px 0px', gap: '30px'}}>
                      {(addSectionId === 0 ? written_questions_add : section_questions_add_written)}
                  </div>
                  {empty_section}
                  <div className = 'add_button_container'>
                      {(section_written_questions_add?.length !== 0 && addSectionId !== 0) && <button className = 'category_total NS px14 bold whiteop10' onClick = {() => setCategoryTotal(!categoryTotal)}>카테고리 전체 질문 추가하기</button>}
                      {categoryTotal && <div className = 'category_total_container'>
                          <div className = 'text NS px14 line25 whiteop10 nospacing' style = {{height: '46px'}} >
                            <div>현재 카테고리의 작성된 질문을</div>
                            <div>모두 추가하시겠습니까?</div>
                          </div>
                          <button className = 'cancel NS px12 bold whiteop10' onClick = {() => setCategoryTotal(false)}>취소하기</button>
                          <button className = 'add NS px12 bold whiteop10' onClick = {() => {
                            section_written_questions_add?.forEach(async (questionId) => {
                              await addBook(Number(questionId), 1);
                              answers_booked?.forEach((answer) => {
                                if(answer.questionId === questionId) {
                                  answer.book = 1;
                                }
                              });
                              console.log(answers_booked);
                            })
                            setTimeout(() => setUpdate(update + 1), 1000);
                            setCategoryTotal(false);
                          }}>추가하기</button>
                      </div>}
                      <button className = 'total NS px14 bold whiteop10' onClick = {() => setTotal(!total)}>전체 질문 추가하기</button>
                      {total && <div className = 'total_container'>
                          <div className = 'text NS px14 line25 whiteop10 nospacing' style = {{height: '46px'}}>
                            <div>메멘토 노트에 작성된 질문을</div>
                            <div>모두 추가하시겠습니까?</div>
                          </div>
                          <button className = 'cancel NS px12 bold whiteop10' onClick = {() => setTotal(false)}>취소하기</button>
                          <button className = 'add NS px12 bold whiteop10' onClick = {() => {
                            questions?.forEach(async (question) => {
                              let answer = answers?.find((answer) => answer.questionId === question.id);
                              let answer_booked = answers_booked?.find((answer) => answer?.questionId === question.id);
                              if (!answer || answer.book !== 0 || answer_booked?.book !== 0) return;
                              else {
                                await addBook(Number(question.id), 1);
                                answers_booked?.forEach((answer) => {
                                  if(answer.questionId === question.id) {
                                    answer.book = 1;
                                  }
                                });
                                console.log(answers_booked);
                              }
                            })
                            setTimeout(() => setUpdate(update + 1), 1000);
                            setTotal(false);
                          }}>추가하기</button>
                      </div>}
                      <button className="resume" onClick = {() => {
                        questions?.forEach(async (question) => {
                          if (await addBook(Number(question.id), 0))
                            console.log('resume');
                          else
                            console.log('fail');
                        });
                      }}>새로고침</button>
                  </div>
              </div>
          </div>}
      </div>
      {addUserGive && <div className="addUserGive" style = {{position: 'fixed', width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.6)', zIndex: 200, top: '0px'}}>
          <div className="addUserGiveContainer" style = {{width: '837px', height: 'fit-content', margin: 'calc(50vh - 283px/2) 0px 0px calc(50% - 837px/2)', background: 'rgba(255, 255, 255, 1)', borderRadius: '5px', padding: '36px 0px 38px 55px'}}>
              <img src = {imageUrl('NotePage/quit_vector.svg')} style = {{position: 'absolute', right: '0px', top: '-30px'}} onClick = {() => setAddUserGive(false)}/>
              <div className="methodContainer NS px12 line25 bold"> 
                  <button className="imagecontainer" style = {{width: '28px', height: '28px', display: 'flex', justifyContent:'center', alignItems: 'center', borderRadius: '50%', background: 'rgba(0, 0, 0, 0)', padding: '0px', border: (method === 0 ? '2px solid rgba(99, 111, 104, 0.9)' : ''), boxSizing: 'content-box'}} onClick = {() => setMethod(0)}>{EmailVector}</button>
                  <div className="" style = {{color: (method === 0 ? 'rgba(99, 111, 104, 0.8)' : 'rgba(99, 111, 104, 0.4)')}} onClick = {() => setMethod(0)}>문자 메시지</div>
                  <button className="imagecontainer" style = {{width: '28px', height: '28px', display: 'flex', justifyContent:'center', alignItems: 'center', borderRadius: '50%', background: 'rgba(0, 0, 0, 0)', padding: '0px', border: (method === 1 ? '2px solid rgba(99, 111, 104, 0.9)' : ''), boxSizing: 'content-box'}} onClick = {() => setMethod(1)}>
                    <img src={imageUrl('NotePage/GoogleImage.png')} alt="" className="" />
                  </button>
                  <div className="" style = {{color: (method === 1 ? 'rgba(99, 111, 104, 0.8)' : 'rgba(99, 111, 104, 0.4)')}} onClick = {() => setMethod(1)}>이메일</div>
                  <button className="imagecontainer" style = {{width: '28px', height: '28px', display: 'flex', justifyContent:'center', alignItems: 'center', borderRadius: '50%', background: 'rgba(0, 0, 0, 0)', padding: '0px', border: (method === 2 ? '2px solid rgba(99, 111, 104, 0.9)' : ''), boxSizing: 'content-box'}} onClick = {() => setMethod(2)}><img src={imageUrl('NotePage/KakaoImage.png')} alt="" className="" style = {{top: '1px'}}/></button>
                  <div className="" style = {{color: (method === 2 ? 'rgba(99, 111, 104, 0.8)' : 'rgba(99, 111, 104, 0.4)')}} onClick = {() => setMethod(2)}>카카오톡</div>
              </div>
              <div className="UserDataContainer NS px12 line25 bold">
                  <div className="UserDataElement">
                    <div className="text">희망 수령인의 성함</div>
                    <input type="text" style = {{width: '202px', height: '61px', padding: '18px 30px'}} value = {giveusername} onChange = {(e) => setgiveusername(e.target.value)} placeholder = '성함을 입력해주세요.'/>
                  </div>
                  <div className="UserDataElement">
                    <div className="text">희망 수령인의 전화번호</div>
                    <input type="text" style = {{width: '362px', height: '61px', padding: '18px 30px'}} value = {giveuserphonenumber} onChange = {(e) => setgiveuserphonenumber(e.target.value)} placeholder = {`'-'없이 전화번호를 입력해주세요.`}/>
                  </div>
                  {method === 1 && <div className="UserDataElement">
                    <input type="text" style = {{width: '581px', height: '61px', padding: '18px 30px'}} value = {giveuseremail} onChange = {(e) => setgiveuseremail(e.target.value)} placeholder = {`희망 수령인의 이메일 주소를 입력해주세요.`}/>
                  </div>}
                  <button className="submit" id = 'kakao-link_button' onClick = {async () => {
                    let giveuser = users.find((user_) => user_.cellphone === ('+82' + giveuserphonenumber.slice(1, 11)));
                    let name = user.user!.name;
                    if(UsersGive.find((UserInfo) => UserInfo.phonenumber === ('+82' + giveuserphonenumber.slice(1, 11)))) alert('이미 등록된 사용자입니다.');
                    else {
                      if(giveuser) {
                        let newUsersGive = UsersGive.concat([{username: giveuser.username, name: giveuser.name, phonenumber: giveuser.cellphone}]);
                        setUsersGive(newUsersGive);
                        if(method === 0) {
                          if (await setUsers(user.user!.username, { give: newUsersGive, get: UsersGet}, newUsersGive.length, true, name)) console.log('asd');
                        } else {
                          if (await setUsers(user.user!.username, { give: newUsersGive, get: UsersGet}, newUsersGive.length, false, name)) console.log('asd');
                        }
                        
                        if (await setUsers(giveuser.username, {...giveuser.UsersInfo, get: giveuser.UsersInfo.get.concat([{username: user.user!.username, name: user.user!.name, phonenumber: user.user!.cellphone}])}, 0, false, name)) console.log('dfgh');
                      }
                      else {
                        let newUsersGive = UsersGive.concat([{username: '', name: giveusername, phonenumber: ('+82' + giveuserphonenumber.slice(1, 11))}]);
                        setUsersGive(newUsersGive);
                        if(method === 0) {
                          if (await setUsers(user.user!.username, { give: newUsersGive, get: UsersGet}, newUsersGive.length, true, name)) console.log('qwe');
                        } else {
                          if (await setUsers(user.user!.username, { give: newUsersGive, get: UsersGet}, newUsersGive.length, false, name)) console.log('qwe');
                        }
                      }
                      if(method === 2) {
                        kakaobuttonClick();
                        setTimeout(() => kakaobuttonClick(), 1000);
                      }
                      if(method === 1) {
                        send('service_cp2012s', 'template_zdplcw4', {to_name: 'asd', from_name: 'asd', message: 'asd', toEmail: 'p4r4dox82@gmail.com', reply_to: 'asd'});
                      }
                    } 
                  }}>전송</button>
                  {method === 2 && <button className="submit" id = 'kakao-link_btn' ref = {kakaobutton} style = {{display: 'none'}} onClick = {async () => {
                      kakaoShare();
                  }}>전송</button>}
              </div>
          </div>
      </div>} 
    </>
  );
}

export default MementoNoteBook;
