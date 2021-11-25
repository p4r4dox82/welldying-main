import React, { useRef } from 'react';
import Xlsx from 'xlsx';

interface WorkBookCallBack {
    (workbook: Xlsx.WorkBook) : void;
}

let getExtensionOfFilename = (file: File) => {
    const filename = file.name;
    const _lastDot = filename.lastIndexOf('.');
    const _fileExt = filename.slice(_lastDot).toLowerCase();
    
    let result = (_fileExt === '.xlsx') ? true : false;

    return result;
}

let fixdata = (data: ArrayBuffer) => {
    let arrayBuffer = new Uint8Array(data);
    let array = [];
    for( let i = 0; i < arrayBuffer.byteLength; i++) {
        array[i] = arrayBuffer[i];
    }
    let arr = String.fromCharCode.apply(null, array);

    return arr;
}

let readExcelFile = (file: File, callback: WorkBookCallBack) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e: ProgressEvent<FileReader>) {
        const data = e.target?.result as ArrayBuffer;
        const arr = fixdata(data);
        const workbook = Xlsx.read(btoa(arr), { type : 'base64' });
        callback(workbook);
    }
}

let workbookToJsonArray = (workbook: Xlsx.WorkBook) => {
    let jArray = new Array();
    workbook.SheetNames.forEach(function (sheetname) {
        const roa = Xlsx.utils.sheet_to_json(workbook.Sheets[sheetname],{});
        if(roa.length > 0) 
            jArray.push(roa);
    })
    return jArray[0];
}

function XlsxData() {
    let inputFileRef = useRef<any>(null);
    let [data, setData] = React.useState<Array<any>>([{데이터레이블: '데이터가 존재하지 않습니다, 엑셀파일을 불러와주세요.'}]);

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.item(0)) {
            const file = e.target.files[0];
            if(!getExtensionOfFilename(file)) {
                alert('엑셀 파일이 아닙니다. .xlsx 파일만 가능');
                clear();
                return;
            }
            readExcelFile(file, function(workBook) {
                const json = workbookToJsonArray(workBook);
                setData(json);
            })
        }
    }
    const clear = () => {
        if(inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }

    let [head, setHead] = React.useState<any>();
    let [itemList, setItemList] = React.useState<any>(null);

    React.useEffect(() => {
        if(!data) return;
        else{
            setHead((<tr>{Object.keys(data[0]).map((k, idx) => <th key = {idx}>{k}</th>)}</tr>));
            setItemList(data.map((item: any, index: number) => {
                return (
                    <tr key = {'tr' + index}>
                        {Object.keys(item).map((k, idx) => <td key = {'td' + idx}>{item[k]} </td>)}
                    </tr>
                )
            }))
        }
    }, [data]);

        
    return (
        <>
            <input type="file" onChange = {uploadFile} ref = {inputFileRef} />
            <button onClick = {() => {
                clear();
            }}>Clear</button>
            <table>
                <thead>
                    {head}
                </thead>
                <tbody>
                    {itemList}
                </tbody>
            </table>
        </>
    )
}

export default XlsxData;