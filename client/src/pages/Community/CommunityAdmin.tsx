import React from 'react'; 
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { getExtensionOfFilename, readExcelFile, workbookToJsonArray } from '../../Data/XlsxData';
import { getCommunityQuestions, writeCommunityQuestion } from '../../etc/api/community/communityQuestion';
import { addNewUser } from '../../etc/api/community/communityUser';
import usePromise from '../../etc/usePromise';

let covertPhoneNumberToNoHyphen = (cellphone: string) => {
    if(!cellphone) {
        return "";
    }
    let result = "";
    for(let i = 0; i < cellphone.length; i++) {
        if(!isNaN(Number.parseInt(cellphone[i]))) {
            result = result + cellphone[i];
        }
    }
    return result;
}

function CommunityAdmin() {
    let inputFileRef = React.useRef<any>(null);
    let [data, setData] = React.useState<Array<any>>();
    let [, questions] = usePromise(() => getCommunityQuestions());
    let [totalQuestionsNumber, setTotalQuestionsNumber] = React.useState<number>(0);
    let [question, setQuestion] = React.useState<string>("");
    let [tag, setTag] = React.useState<string>("");

    React.useEffect(() => {
        if(questions) {
            setTotalQuestionsNumber(questions.length);
        }
    }, [questions])

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.item(0)) {
            const file = e.target.files[0];
            if(getExtensionOfFilename(file) !== '.xlsx') {
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

    React.useEffect(() => {
        if(!data) {
            return;
        } else {
            data.forEach(async (item: any, index: number) => {
                let phoneNumber = covertPhoneNumberToNoHyphen(item["휴대폰 번호"]);
                let name = item["이름"];
                let username = "community" + phoneNumber;
                let password = phoneNumber.slice(7, 11);
                console.log(name);
                if(await addNewUser(username, password, name, phoneNumber)) {
                    console.log("success");
                }
            })
        }
    }, [data])

    return (
        <>
            <Header additionalClass=''></Header>
            <div className="CommunityAdmin">
                <div className="userManagementBlock">
                    <div className="title">유저 등록</div>
                    <input type="file" onChange={uploadFile} ref = {inputFileRef} />
                    <button onClick={clear}>clear</button>
                </div>
                <div className="questionManagementBlock">
                    <div className="title">질문 등록</div>
                    <input type="text" className="id" value = {totalQuestionsNumber + 1} />
                    <input type="text" className="question" placeholder='질문' value = {question} onChange={(e) => setQuestion(e.target.value)} />
                    <input type="text" className="tag" placeholder='태그' value = {tag} onChange={(e) => setTag(e.target.value)} />
                    <button className="save" onClick={async() => {
                        if(!question || !tag) {
                            alert("질문과 태그 모두 입력해주세요");
                        } else {
                            if(await writeCommunityQuestion(totalQuestionsNumber + 1, "admin", question, tag)) {
                                alert("저장되었습니다");
                                setQuestion("");
                                setTag("");
                                setTotalQuestionsNumber(totalQuestionsNumber + 1);
                            }
                        }
                    }}>저장</button>
                </div>
            </div>
            <Footer additionalClass=''></Footer>
        </>
    )
}

export default CommunityAdmin;