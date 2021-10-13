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
    if(!content) return <></>;
    else return (
        <>
            <div className="Contentbox">
                <img src={content.imageData.imageUrl} alt="" />
                <div className="cover">
                    <div className="Colon">{Colon}</div>
                    <div className="type">{convertType(content.type)}</div>
                    <div className="tag">{content.tag}</div>
                    <div className="title">{'[' + content.type + ']' + content.title}</div>
                </div>
            </div>
        </>
    )
}

export default MobileContentbox;