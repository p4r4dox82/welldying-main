import React from 'react';
import QRCode from 'qrcode.react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Xlsx from 'xlsx';
import { Link } from 'react-router-dom';

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


function GenerateQRcode() {
    let inputFileRef = React.useRef<any>(null);
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

    let getCellphoneMidRear = (cellphone: string) => {
        if(!cellphone)
            return "";
        let phoneMidRear = "";
        for(let i = 0; i < cellphone.length; i++) {
            if(!isNaN(Number.parseInt(cellphone[i]))) {
                phoneMidRear = phoneMidRear + cellphone[i];
            }
        }
        return phoneMidRear.substring(3, 11);
    }

    React.useEffect(() => {
        if(!data) return;
        else{
            setHead((<tr>{Object.keys(data[0]).map((k, idx) => <th key = {idx}>{k}</th>)}</tr>));
            setItemList(data.map((item: any, index: number) => {
                let cellphone = item['휴대전화'];
                let cellphoneMidRear = getCellphoneMidRear(cellphone);
                let pid = Number.parseInt(cellphoneMidRear) + 12345678;
                return (
                    <tr key = {'tr' + index}>
                        {Object.keys(item).map((k, idx) => <td key = {'td' + idx}>{item[k]} </td>)}
                        <Link to = {`/mybook?pid=${pid}`}><td>{`mymemento.kr/mybook?pid=${pid}`}</td></Link>
                        <td><QRCode value = {`mymemento.kr/mybook?pid=${pid}`}></QRCode></td>
                    </tr>
                )
            }))
        }
    }, [data]);

    return (
        <>
            <div className="generateQRcode">
                <Header additionalClass = ""></Header>
                <div className="getInformationBlock">
                    <input type="file" onChange = {uploadFile} ref = {inputFileRef} />
                    <button onClick = {() => {
                        clear();
                    }}>Clear</button>
                </div>
                <div className="QRCodeBlock">
                    <table>
                        <thead>
                            {head}
                        </thead>
                        <tbody>
                            {itemList}
                        </tbody>
                    </table>
                </div>
                <Footer additionalClass = ""></Footer>
            </div>
        </>
    )
}

export default GenerateQRcode;