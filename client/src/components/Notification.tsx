import React from 'react';
import { PlusVector } from '../img/Vectors';

interface Props {
    text: string;
}

function Notification(props: Props) {
    let [quit, setQuit] = React.useState<boolean>(false);
    return (
        <>
            {!quit && <div className="Notification">
                <div className="text">
                    {props.text}
                </div>
                <button className="quitButton" onClick = {() => setQuit(true)}>{PlusVector}</button>
            </div>}
        </>
    )
}

export default Notification;