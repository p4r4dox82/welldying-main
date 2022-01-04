import React from 'react'; 
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { getExtensionOfFilename, readExcelFile, workbookToJsonArray } from '../../Data/XlsxData';
import { addNewUser } from '../../etc/api/community/communityUser';

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
            </div>
            <Footer additionalClass=''></Footer>
        </>
    )
}

export default CommunityAdmin;