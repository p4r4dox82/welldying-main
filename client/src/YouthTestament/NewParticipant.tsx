import React from 'react';
import { writeYouthTestament } from '../etc/api/youthTestament';
import { youthTestamentParticipantData } from './YouthTestamentAdmin';

function NewParticipant() {
    let [newParticipantData, setNewParticipantData] = React.useState<youthTestamentParticipantData>({
        pid: 0,
        name: "",
        week1: [""],
        week2: [""],
        week3: [""]
    });
    let [saved, setSaved] = React.useState<boolean>(false);

    return (
        <>
            <div className="youthTestamentParticipant">
                <input type="text" className="pid" value = {newParticipantData.pid} onChange = {(e) => {
                    setNewParticipantData({...newParticipantData, pid: Number.parseInt(e.target.value)});
                }} />
                <input type="text" className="name" value = {newParticipantData.name} onChange = {(e) => {
                    setNewParticipantData({...newParticipantData, name: e.target.value});
                }} />
                {!saved ? <button className="save" onClick={async() => {
                    if(await writeYouthTestament(newParticipantData.pid, newParticipantData.name, newParticipantData.week1, newParticipantData.week2, newParticipantData.week3)) {
                        setSaved(true);
                    }
                }}>{"저장하기"}</button> :
                <button className="link">{"보러가기"}</button>}
            </div>
        </>
    )
}

export default NewParticipant;