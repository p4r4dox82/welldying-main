import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import { RootReducer } from '../store';
import Header from '../components/Header';
import NoteLeftBar from '../components/NoteLeftBar';
import NoteQuestion from '../components/NoteQuestion';
import useScroll from '../etc/useScroll';

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

  let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);


  let section_questions = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section?.questions?.map((questionId) => {
            let question = questions?.find((question) => question.id === questionId);
            let answer = answers?.find((answer) => answer.questionId === questionId);
            if (!question || !answer) return;

            return (
              <NoteQuestion question = {question} written = {true}/>
            );
          })}
      </>
    );
  }, [section, answers, questions]);

  let section_questions_unwritten = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section?.questions?.map((questionId) => {
            let question = questions?.find((question) => question.id === questionId);
            let answer = answers?.find((answer) => answer.questionId === questionId);
            if (!question || answer) return;

            return (
              <NoteQuestion question = {question} written = {false}/>
            );
          })}
      </>
    );
  }, [section]);


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
                  <div className = 'title GB px16 bold'>
                  {section?.title}
                  </div>
                  {section_questions}
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
