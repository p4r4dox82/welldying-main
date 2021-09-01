import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import { RootReducer } from '../store';
import Header from '../components/Header';
import NoteLeftBar from '../components/NoteLeftBar';
import NoteQuestion from '../components/NoteQuestion';
import useScroll from '../etc/useScroll';
import { imageUrl } from '../etc/config';

import { getQuestions } from '../etc/api/question';
import { getSection, getSections } from '../etc/api/section';
import { getAnswers } from '../etc/api/answer';
import usePromise from '../etc/usePromise';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function MementoNote({ match } : Props) {
  let id = Number.parseInt(match.params.id);

  let scroll = useScroll();

  let user = useSelector((state: RootReducer) => state.user);
  let [scrollActive, setScrollActive] = React.useState(false);
  let [, questions] = usePromise(getQuestions);
  let [, sections] = usePromise(getSections);
  let [, answers] = usePromise(getAnswers);
  let [barheight, setBarheight] = React.useState<number>();
  let [block, setBlock] = React.useState<boolean>(false);

  let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);

  let written_questions = React.useMemo(() => {
    return (
      section?.questions?.filter((questionId) => {
        let question = questions?.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || !answer) return false;
        else return true;
      })
    );
  }, [questions, answers, section]);

  let unwritten_questions = section?.questions?.filter((questionId) => {
    let question = questions?.find((question) => question.id === questionId);
    let answer = answers?.find((answer) => answer.questionId === questionId);
    if (!question || answer) return false;
    else return true;
  });

  let section_questions = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {written_questions?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {true} type = {(block ? 'small': '')} order = {key}/>
            );
          })}
      </>
    );
  }, [section, answers, questions, block]);

  let section_questions_unwritten = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {unwritten_questions?.map((questionId) => {
            let question = questions?.find((question) => question.id === questionId);
            let answer = answers?.find((answer) => answer.questionId === questionId);
            if (!question || answer) return;

            return (
              <NoteQuestion question = {question} written = {false} type = {'unwritten'} order = {-1}/>
            );
          })}
      </>
    );
  }, [section, answers, questions]);


  React.useEffect(() => {
      setScrollActive(scroll >= 137);
  }, [scroll]);

  if (!user.loggedIn) return <Redirect to='/login' />;
  else return (
    <>
      <Header additionalClass = '' />
      <div>
          <div className = 'leftbar_container'>
              <NoteLeftBar additionalClass = {(scroll > 112 ? ' fixed' : '')} id = {id} book = {false} category = {true}/>
          </div>
          <div className = 'block note_page'>
              <div className = 'written_question margin_note border'>
                  <div className = 'title GB px16 bold line30'>
                  {section?.title}
                  </div>
                  <img className = 'block_button' src = {imageUrl('ContentPage/block_button.svg')} onClick = {() => setBlock(!block)}/>
                  <img className = 'order_button' src = {imageUrl('ContentPage/order_button.svg')} />
                  <div className = 'questions_container'>
                      {section_questions}
                  </div>
                  {written_questions?.length === 0 && <>
                    <div className = 'NS px18 bold line25' style = {{marginTop: '173px', textAlign: 'center'}}>{`아직 답변하신 질문이 존재하지 않습니다.`}</div>
                    <div className = 'NS px15 line20' style = {{textAlign: 'center', marginBottom: '72px'}}>{`아래의 '작성하지 않은 질문'을 선택하여 질문에 대한 답변을 남겨보세요`}</div>
                  </>}
              </div>
          </div>
          <div className = 'block note_page'>
              <div className = 'unwritten_question margin_note'>
                  <div className = 'title GB px16 bold'>
                  {'아직 작성하지 않은 질문'}
                  </div>
                  {section_questions_unwritten}
              </div>
          </div>
      </div>
    </>
  );
}

export default MementoNote;
