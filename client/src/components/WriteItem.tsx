import React from 'react';
import { Answer, checkAnswer, uncheckAnswer } from '../etc/api/answer';
import { Content } from '../etc/api/content';
import { Section } from '../etc/api/section';
import { imageUrl } from '../etc/config';
import QuillBody from './QuillBody';

interface Props {
    section: Section;
    content: Content;
    answer: Answer | undefined;
    setCurrentEditor: (value: number) => void,
    setEditTime: (value: number) => void,
}

function WriteItem({ section, content, answer, setCurrentEditor, setEditTime } : Props) {
    let sid = section.id;
    let cid = content.id;
    let [isChecked, setIsChecked] = React.useState(answer?.isChecked ?? false);
    let [isEmpty, setIsEmpty] = React.useState(answer ? answer.message.length === 0 : true);

    React.useEffect(() => {
        setIsChecked(answer?.isChecked ?? false);
    }, [answer]);

    React.useEffect(() => {
        if (isEmpty && isChecked) {
            setIsChecked(false);
            uncheckAnswer(content.id);
        }
    }, [isEmpty, isChecked]);

    return (
        <div className='row' id={`content_${sid}_${cid}`}>
            <p> 
                { content.title } 
                <span className='dialogCheckBox' style={{marginTop: '-2px'}}>
                    <img 
                        className={'dialogCheckSign' + (isChecked ? ' active' : '') + (isEmpty ? '' : ' checkable')} 
                        src={imageUrl('check.png')} 
                        onClick={async () => {
                            if (!content) return;
                            if (!isChecked && isEmpty) {
                                alert('답변 작성 완료 후 체크해주세요!');
                                return;
                            }
                            
                            setIsChecked(!isChecked);

                            if (isChecked) {
                                await uncheckAnswer(content.id);
                            } else {
                                await checkAnswer(content.id);
                            }
                        }}
                    />
                </span>
            </p>

            <ul>
                { content.message.split('\n').map((str) => <li> {str} </li>) }
            </ul>
            <QuillBody 
                id={cid} 
                initialAnswer={ answer?.message || content.placeholder || '' }
                initialLength={ answer?.length || 0 }
                setCurrentEditor={setCurrentEditor} 
                setEditTime={setEditTime}
                setIsEmpty={setIsEmpty}
            />
        </div>
    )
}

export default WriteItem;