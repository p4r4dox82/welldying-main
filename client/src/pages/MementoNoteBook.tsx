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
import { setBookName } from '../etc/api/user';
import usePromise from '../etc/usePromise';

import { imageUrl } from '../etc/config';

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

  let empty_section = React.useMemo(() => {
    console.log(section_written_questions_add);
    return (
      section_written_questions_add?.length === 0 && <>
        <div className = 'empty_answered_question'>
            <div className = 'text NS px14 line25 whiteop10'>현재 카테고리에 남은 질문이 존재하지 않습니다.</div>
            <div className = 'text NS px14 line25 whiteop10'>{(section_unwritten_questions_add?.length !== 0 ? '아래의 질문에 대해 답변한 후, 유언 자서전에 추가해보는 것은 어떨까요?' : `추가 질문은 매주 '월요일'에 업로드 됩니다. 감사합니다!`)}</div>
        </div>
        <div className = 'questions_container' style = {{marginTop: '66px', marginLeft: '0px'}}>
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

  if (!user.loggedIn) return <Redirect to='/login' />;
  else return (
    <>
      {GetBookName}
      <Header additionalClass = '' />
      <div className = 'MementoNoteBook'>
          <div className = {'leftbar_container short'}>
              <NoteLeftBar additionalClass = {(scroll > 112 ? ' fixed' : '')} id = {id} book = {true} category = {false}/>
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
                      <div className = 'left page'>

                      </div>
                      <div className = 'right page'>

                      </div>
                  </div>
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
    </>
  );
}

export default MementoNoteBook;
