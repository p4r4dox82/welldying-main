import React from 'react';
import ReactQuill from 'react-quill';
import { uploadImage } from '../etc/api/image';
import { writeAnswer } from '../etc/api/answer';

interface Props {
    id: number;
    initialAnswer: string;
    initialLength: number;
    setIsEmpty: (isEmpty: boolean) => void;
    setCurrentEditor: (id: number) => void;
    setEditTime: (time: number) => void;
}

function dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)
  
    return new Blob([ia], { type: mimeString })
}

function QuillBody({ id, initialAnswer, initialLength, setIsEmpty, setCurrentEditor, setEditTime }: Props) {
    let [answer, setAnswer] = React.useState<string>(initialAnswer);
    let [length, setLength] = React.useState<number>(initialLength);

    const maxLength = 5000;

    return (
        <>
            <div className='message'> { length !== undefined && `${length} / ${maxLength}` }</div>
            <ReactQuill 
                theme="snow" 
                modules={{
                    toolbar: `.quill-toolbar${id}`,
                    clipboard: {
                        matchVisual: false,
                    }
                }}
                onChange={async (content, delta, source, editor) => {
                    let imageElements = editor.getHTML().match(/<img src="data:image\/[A-Za-z]*;base64,[A-Za-z0-9+/=]*">/);

                    let newLength = editor.getLength() - 1;
                    let newAnswer = newLength > 0 ? editor.getHTML() : '';

                    if (imageElements) await Promise.all(imageElements.map(async (element) => {
                        let base64Uri = element.substr(10, element.length - 12);
                        console.log(dataURIToBlob(base64Uri));
                        const s3Uri = await uploadImage(dataURIToBlob(base64Uri));

                        newAnswer = newAnswer.replace(element, `<img src="${s3Uri}">`);
                    }));

                    if (newLength <= maxLength) {
                        setAnswer(newAnswer);
                        setLength(newLength);
                        setEditTime(new Date().getTime());
                        setIsEmpty((newAnswer === initialAnswer) || (newAnswer.length === 0));
                        await writeAnswer(id, (newAnswer === initialAnswer) ? '' : newAnswer, newLength);
                    } else {
                        setAnswer(answer + ' ');
                    }
                }}
                value={answer}
                onFocus={() => setCurrentEditor(id)}
            />
        </>
    )
}

export default QuillBody;