import React from 'react';
import { getYouthTestament, writeYouthTestament } from '../etc/api/youthTestament';
import usePromise from '../etc/usePromise';
import { youthTestamentParticipantData } from './YouthTestamentAdmin';
import QRCode from 'qrcode.react';

interface Props {
    pid: number
}

function CurrentParticipant({ pid }: Props) {
    let [currentParticipantData, setCurrentParticipantData] = React.useState<youthTestamentParticipantData>({
        pid: 0,
        name: "",
        week1: [""],
        week2: [""],
        week3: [""]
    });
    let [, _currentParticipantData] = usePromise(() => getYouthTestament(pid));
    let [week1, setWeek1] = React.useState<string[]>();
    let [week2, setWeek2] = React.useState<string[]>();
    let [week3, setWeek3] = React.useState<string[]>();
    let [newContent, setNewContent] = React.useState<string>("");
    let [newContentWeek, setNewContentWeek] = React.useState<number>();
    let [edit, setEdit] = React.useState<boolean>(false);

    let weekContent = React.useCallback((week: number) => {
        let weekContent;
        switch(week) {
            case 1: 
                if(week1) {
                    weekContent = week1;
                }
                break;
            case 2:
                if(week2)
                    weekContent = week2;
                break;
            case 3:
                if(week3)
                    weekContent = week3;
                break;
        }
        if(weekContent) {
            return (
                <>
                    <div className="Line">
                        {weekContent.map((content: string) => {
                            return (
                                <>
                                    <div className="weekContent">{content}</div>
                                </>
                            )
                        })}
                        <input type="text" className="newWeekContent" value = {newContentWeek == week ? newContent : ""} onChange = {(e) => {
                            setNewContentWeek(week);
                            setNewContent(e.target.value);
                        }} />
                        <button className="addContent" onClick={async () => {
                            let newWeek1 = currentParticipantData.week1;
                            let newWeek2 = currentParticipantData.week2;
                            let newWeek3 = currentParticipantData.week3;
                            if(week == 1) {
                                newWeek1.push(newContent);
                            }
                            if(week == 2) {
                                newWeek2.push(newContent);
                            }
                            if(week == 3) {
                                newWeek3.push(newContent);
                            }
                            if(await writeYouthTestament(currentParticipantData.pid, currentParticipantData.name, newWeek1, newWeek2, newWeek3)) {
                                alert("추가되었습니다. ")
                            }
                        }}>{"추가하기"}</button>
                    </div>
                </>
            )
        }
    }, [currentParticipantData, week1, week2, week3, newContent, newContentWeek]);

    React.useEffect(() => {
        if(_currentParticipantData) {
            setCurrentParticipantData(_currentParticipantData);
            setWeek1(_currentParticipantData.week1);
            setWeek2(_currentParticipantData.week2);
            setWeek3(_currentParticipantData.week3);
        }
    }, [_currentParticipantData]);

    if(!currentParticipantData) {
        return (
            <></>
        )
    } else {
        return (
            <>
                <div className="youthTestamentParticipant">
                    <div className="Line">
                        <input type="text" className="pid" disabled = {!edit} value = {currentParticipantData.pid} onChange = {(e) => {
                            setCurrentParticipantData({...currentParticipantData, pid: Number.parseInt(e.target.value)});
                        }} />
                        <input type="text" className="name" disabled = {!edit} value = {currentParticipantData.name} onChange = {(e) => {
                            setCurrentParticipantData({...currentParticipantData, name: e.target.value});
                        }} />
                        <QRCode value = {`mymemento.kr/youthTestament?pid=${currentParticipantData.pid}`} style = {{width: '80px', height: '80px'}}></QRCode>
                        {!edit ? <button className="edit" onClick = {() => setEdit(true)}>{"수정하기"}</button> :
                        <button className="editComplete" onClick={async() => {
                            if(await writeYouthTestament(currentParticipantData.pid, currentParticipantData.name, currentParticipantData.week1, currentParticipantData.week2, currentParticipantData.week3)) {
                                alert("수정되었습니다.");
                                setEdit(false);
                            }
                        }}>{"수정완료"}</button>}
                        <button className="link">{"보러가기"}</button>
                    </div>
                    {[...Array(3).keys()].map((key) => {
                        return (
                            <>
                                {weekContent(key + 1)}
                            </>
                        )
                    })}
                </div>
            </>
        )
    }
}

export default CurrentParticipant;