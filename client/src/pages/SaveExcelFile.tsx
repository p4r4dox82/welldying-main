import React from 'react';
import QRCode from 'qrcode.react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Xlsx from 'xlsx';
import { Link } from 'react-router-dom';
import { ProgramAnswerData, programAnswer, writeProgramAnswers } from '../etc/api/programAnswer';

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
    let jArray: Array<any> = [];
    workbook.SheetNames.forEach(function (sheetname) {
        const roa = Xlsx.utils.sheet_to_json(workbook.Sheets[sheetname],{});
        if(roa.length > 0) 
            jArray.push(roa);
    })
    return jArray[0];
}

function SaveExcelFile() {
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
            console.log(data);
            data.forEach(async (item: any, index: number) => {
                let cellphone = item['휴대폰 번호'];
                let cellphoneMidRear = getCellphoneMidRear(cellphone);
                let pid = Number.parseInt(cellphoneMidRear) + 12345678;
                let programAnswer = {pid: pid, answerData: [{ imageUri: item["1-1 이미지"], answer: item["1-1 글"]}, { imageUri: item["1-2 이미지"], answer: item["1-2 글"]}, { imageUri: item["1-3 이미지"], answer: item["1-3 글"]}, { imageUri: item["2-1 이미지"], answer: item["2-1 글"]}, { imageUri: item["2-2 이미지"], answer: item["2-2 글"]}, { imageUri: item["2-3 이미지"], answer: item["12-3글"]}, { imageUri: item["3-1 이미지"], answer: item["3-1 글"]}, { imageUri: item["3-2 이미지"], answer: item["3-2 글"]}, { imageUri: item["3-3 이미지"], answer: item["3-3 글"]}], name: item["성함"]}
                if(await writeProgramAnswers(programAnswer)) {
                    console.log("success" + index)
                } else {
                    console.log("fail" + index);
                }
            })
        }
    }, [data]);

    return (
        <>
            <div className="SaveExcelFile">
                <Header additionalClass = ""></Header>
                <div className="getInformationBlock">
                    <input type="file" onChange = {uploadFile} ref = {inputFileRef} />
                    <button onClick = {() => {
                        clear();
                    }}>Clear</button>
                </div>
                <div className="QRCodeBlock">
                    <table>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <Footer additionalClass = ""></Footer>
            </div>
        </>
    )
}

export default SaveExcelFile;