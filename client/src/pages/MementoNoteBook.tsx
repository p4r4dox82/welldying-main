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
import usePromise from '../etc/usePromise';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function MementoNoteBook({ match } : Props) {
  let id = Number.parseInt(match.params.id);

  let scroll = useScroll();

  let user = useSelector((state: RootReducer) => state.user);
  let [scrollActive, setScrollActive] = React.useState(false);
  let [, questions] = usePromise(getQuestions);
  let question = questions?.find((question) => question.id === 1);
  let [, sections] = usePromise(() => getSections());
  let [barheight, setBarheight] = React.useState<number>();

  let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);


  let section_questions = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section?.questions?.map((questionId) => {
            let question = questions?.find((question) => question.id === questionId);
            if (!question) return;

            return (
              <NoteQuestion question = {question} written = {true}/>
            );
          })}
      </>
    );
  }, [section]);

  let section_questions_unwritten = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section?.questions?.map((questionId) => {
            let question = questions?.find((question) => question.id === questionId);
            if (!question) return;

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
          <div className = {'leftbar_container short'}>
              <NoteLeftBar additionalClass = {(scroll > 112 ? ' fixed' : '')} id = {id} book = {true} category = {false}/>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'book_container margin_base'>
                  <div className = 'category_container'>
                      <Link to={`/note/book/0`}><div className = {'category NS px12 line25 bold' + (id === 0 ? ' op7' : ' op4')}>{'전체'}</div></Link>
                      {sections?.map((section, key) =>{
                        return (
                          <Link to={`/note/book/${key + 1}`}><div className = {'category NS px12 line25 bold' + (id === (key + 1) ? ' op7' : ' op4')}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div></Link>
                        );
                      })}
                  </div>
                  <div className = 'book_main'>
                      <div className = 'side_bar_container' />
                      <div className = 'left page'>

                      </div>
                      <div className = 'right page'>

                      </div>
                  </div>
              </div>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'written_question margin_note border'>
                  <div className = 'title GB px16 bold'>
                  {section?.title}
                  </div>
                  {section_questions}
              </div>
          </div>
          <div className = 'block note_book_page'>
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

export default MementoNoteBook;
