import React from 'react';
import Header from '../components/Header';
import { getYouthTestaments } from '../etc/api/youthTestament';
import usePromise from '../etc/usePromise';
import QRCode from 'qrcode.react';
import NewParticipant from './NewParticipant';
import CurrentParticipant from './CurrentParticipant';

export interface youthTestamentParticipantData {
    pid: number,
    name: string,
    week1: string[],
    week2: string[],
    week3: string[]
}

function YouthTestamentAdmin() {
    let [, youthTestamentParticipants] = usePromise(() => getYouthTestaments());
    let [addButtonClicked, setAddButtonClicked] = React.useState<boolean>(false);
    let [newParticipantNumber, setNewParticipantNumber] = React.useState<number>(0);
    let [str, setStr] = React.useState<string>();

    let addYouthTestamentParticipant = (id: number) => {
        return (
            <>
                <div className="youthTestamentParticipant">
                    <input type="text" className="pid"  />
                    <input type="text" className="name"  />
                    <button className="link">{"보러가기"}</button>
                </div>
            </>
        )
    }

    let youthTestamentParticipantsData = React.useMemo(() => {
        if(!youthTestamentParticipants) {
            return;
        } else {
            return (
                <>
                    {youthTestamentParticipants.map((youthTestamentParticipant) => {
                        return (
                            <CurrentParticipant pid = {youthTestamentParticipant.pid}></CurrentParticipant>
                        )
                    })}
                    {[...Array(newParticipantNumber)].map(() => {
                        return (
                            <NewParticipant></NewParticipant>
                        )
                    })}
                </>
            )
        }
    }, [newParticipantNumber, youthTestamentParticipants])

    return (
        <>
            <Header additionalClass=''></Header>
            <div className="YouthTestamentAdmin">
                <div className="title">{"청춘유언 관리 페이지"}</div>
                <div className="youthTestamentParticipantsDataList">
                    {youthTestamentParticipantsData}
                    <button onClick = {() => setNewParticipantNumber(newParticipantNumber + 1)}>{"추가하기"}</button>
                </div>
                {/* <QRCode value = {"mymemento.kr/youthTestament?pid=356219"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=769867"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=584708"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=865288"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=638366"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=742223"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=880688"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=599819"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=367945"}></QRCode>
                <QRCode value = {"mymemento.kr/youthTestament?pid=299470"}></QRCode> */}
            </div>
        </>
    )
}

export default YouthTestamentAdmin;