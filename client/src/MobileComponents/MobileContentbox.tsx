import { parseDate } from "../etc";
import { Content } from "../etc/api/content";
import { imageUrl } from "../etc/config";
import { Colon } from "../img/Vectors";

interface Props {
    type: string;
    content: Content;
}

function MobileContentbox(props: Props) {
    let content = props.content;
    let convertType = (type: string) => {
        if(type === '동영상')
            return 'video';
        else if(type === '책')
            return 'book';
        else
            return 'else';
    }
    let contentTitle = content ? (content.title.slice(0, 30) + (content.title.length > 30 ? '...' : '')) : '';
    if(!content) return <></>;
    else if(props.type === 'big') return (
        <>
            <div className="Contentbox big">
                <img src={content.imageData.imageUrl} alt="" />
                <div className="cover">
                    <div className="tag">{content.tag}</div>
                    <div className="more">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                    <div className="title">{'[' + content.type + ']' + contentTitle}</div>
                    <div className="date">{parseDate(new Date(Number(content.date)))}</div>
                </div>
            </div>
        </>
    )
    else return (
        <>
            <div className="Contentbox small">
                <img src={content.imageData.imageUrl} alt="" />
                <div className="cover">
                    <div className="Colon">{Colon}</div>
                    <div className="type">{convertType(content.type)}</div>
                    <div className="tag">{content.tag}</div>
                    <div className="title">{'[' + content.type + ']' + contentTitle}</div>
                </div>
            </div>
        </>
    )
}

export default MobileContentbox;