import React from 'react';
import { Answer, checkAnswer, uncheckAnswer } from '../etc/api/answer';
import { Question } from '../etc/api/question';
import { Section } from '../etc/api/section';
import { imageUrl } from '../etc/config';
import QuillBody from './QuillBody';

interface Props {
    section: Section;
    question: Question;
    answer: Answer | undefined;
    setCurrentEditor: (value: number) => void,
    setEditTime: (value: number) => void,
}

function WriteItem({ section, question, answer, setCurrentEditor, setEditTime } : Props) {
    let sid = section.id;
    let cid = question.id;
    let [isChecked, setIsChecked] = React.useState(answer?.isChecked ?? false);
    let [isEmpty, setIsEmpty] = React.useState(answer ? answer.message.length === 0 : true);

    React.useEffect(() => {
        setIsChecked(answer?.isChecked ?? false);
    }, [answer]);

    React.useEffect(() => {
        if (isEmpty && isChecked) {
            setIsChecked(false);
            uncheckAnswer(question.id);
        }
    }, [isEmpty, isChecked]);

    return (
        <div className='row' id={`question_${sid}_${cid}`}>
            <p>
                { question.title }
                <span className='dialogCheckBox' style={{marginTop: '-2px'}}>
                    <img
                        className={'dialogCheckSign' + (isChecked ? ' active' : '') + (isEmpty ? '' : ' checkable')}
                        src={imageUrl('check.png')}
                        onClick={async () => {
                            if (!question) return;
                            if (!isChecked && isEmpty) {
                                alert('답변 작성 완료 후 체크해주세요!');
                                return;
                            }

                            setIsChecked(!isChecked);

                            if (isChecked) {
                                await uncheckAnswer(question.id);
                            } else {
                                await checkAnswer(question.id);
                            }
                        }}
                        alt = "profile"
                    />
                </span>
            </p>

            <ul>
                { question.message.split('\n').map((str) => <li> {str} </li>) }
            </ul>
            <QuillBody
                id={cid}
                initialAnswer={ answer?.message || question.placeholder || '' }
                initialLength={ answer?.length || 0 }
                setCurrentEditor={setCurrentEditor}
                setEditTime={setEditTime}
                setIsEmpty={setIsEmpty}
            />
        </div>
    )
}

export default WriteItem;
