


interface Props {
    currentEditor?: number;
    currentFormats?: number;
    id?: number;
    visible?: boolean;
    scroll?: boolean;
    image?: boolean;
}

let invisibleStyle : React.CSSProperties = {
    display: 'none',
};

let scrollStyle : React.CSSProperties = {
    position: 'fixed',
    top: '-1px',
    marginTop: 0,
    backgroundColor: 'white',
}

export default function QuillToolbar({ id, visible = true, scroll = false, image = true }: Props) {
    let style : React.CSSProperties = {};

    if (!visible) style = {...style, ...invisibleStyle };
    if (scroll) style = {...style, ...scrollStyle };

    return (
        <nav className={`nav-toolbar quill-toolbar${id === undefined ? '' : id}`} style={style}>

            <span className="ql-formats">
                <select className="ql-size" defaultValue="medium">
                    <option value="small"> 크기 작음</option>
                    <option value="medium"> 크기 중간</option>
                    <option value="large"> 크기 큼</option>
                </select>
            </span>

            <span className="ql-formats">
                <select className="ql-color" title="Colour" defaultValue="rgb(0,0,0)">
                    <option value="rgb(0,0,0)" />
                    <option value="rgb(127,0,0)" />
                    <option value="rgb(255,0,0)" />
                    <option value="rgb(0,100,0)" />
                    <option value="rgb(0,200,0)" />
                    <option value="rgb(0,0,127)" />
                    <option value="rgb(0,0,255)" />
                    <option value="rgb(127,127,127)" />
                    <option value="rgb(127,100,0)" />
                    <option value="rgb(255,200,0)" />
                    <option value="rgb(0,100,127)" />
                    <option value="rgb(0,200,255)" />
                    <option value="rgb(127,0,127)" />
                    <option value="rgb(255,0,255)" />
                </select>
            </span>

            <span className="ql-formats">
                <button className="ql-bold" id="bold">
                    <span className="fa fa-bold"></span>
                </button>
                <button className="ql-italic" id="italic">
                    <span className="fa fa-italic"></span>
                </button>
                <button className="ql-underline" id="underline">
                    <span className="fa fa-underline"></span>
                </button>
                <button className="ql-strike" id="strike">
                    <span className="fa fa-strikethrough"></span>
                </button>
            </span>

{/*
            <span className="ql-align">
                <button className="ql-align-left" id="align-left" onClick={()=>onAlignLeftClick()}>
                    <span className="fa fa-align-left"></span>
                </button>
                <button className="ql-align-right" id="align-right" onClick={()=>onAlignRightClick()}>
                    <span className="fa fa-align-right"></span>
                </button>
                <button className="ql-align-center" id="align-center" onClick={()=>onAlignCenterClick()}>
                    <span className="fa fa-align-center"></span>
                </button>
                <button className="ql-align-justify" id="align-justify" onClick={()=>onAlignJustifyClick()}>
                    <span className="fa fa-align-justify"></span>
                </button>
            </span>
*/}

            <span className="ql-formats">
                <button type="button" className="ql-list" value="bullet">
                    <span className="fa fa-list"></span>
                </button>
                <button type="button" className="ql-list" value="ordered">
                    <span className="fa fa-list-ol"></span>
                </button>
                { image && (
                    <button type="button" className="ql-image" value="bullet">
                        <span className="fa fa-list"></span>
                    </button>
                )}
            </span>

{/*
            <span className="ql-formats">
                <button type="button" className="ql-blockquote" value="blockquote">
                    <span className="fa fa-quote-right"/>
                </button>
            </span> */}
        </nav>

    );
}
