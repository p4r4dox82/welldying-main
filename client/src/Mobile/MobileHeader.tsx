import { Link } from "react-router-dom";
import { MementoLogo, toggleVector, UserImage } from "../img/Vectors";

function MobileHeader() {
    return (
        <>
            <div className="Header">
                <div className="userimage">{UserImage}</div>
                <Link to = '/test'><div className="MementoLogo">{MementoLogo}</div></Link>
                <div className="toggle">{toggleVector}</div>
            </div>
        </>
    )
}

export default MobileHeader;