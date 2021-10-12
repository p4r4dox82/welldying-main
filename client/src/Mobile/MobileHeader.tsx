import { MementoLogo, toggleVector, UserImage } from "../img/Vectors";

function MobileHeader() {
    return (
        <>
            <div className="Header">
                <div className="userimage">{UserImage}</div>
                <div className="MementoLogo">{MementoLogo}</div>
                <div className="toggle">{toggleVector}</div>
            </div>
        </>
    )
}

export default MobileHeader;