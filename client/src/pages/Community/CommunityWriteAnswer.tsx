import React from 'react';
import CommunityHeader from '../../components/community/CommunityHeader';
import { getCategory } from '../../etc/api/category';
import { getCommunityAnswer, getCommunityAnswers, writeCommunityAnswer } from '../../etc/api/community/communityAnswer';
import usePromise from '../../etc/usePromise';
import { match } from 'react-router-dom';

interface MatchParams {
    id: string
};

interface Props {
    match: match<MatchParams>;
};

function CommunityWriteAnswer({ match }: Props) {
    let id = Number.parseInt(match.params.id);
    let [, communityAnswer] = usePromise(getCommunityAnswers);
    let [title, setTitle] = React.useState<string>("");
    let [answer, setAnswer] = React.useState<string>("");
    let [imageUri, setImageUri] = React.useState<string>("");

    let uploadAnswer = async() => {
        if(await writeCommunityAnswer(1, "asd", { imageUri: "", answer: "asd"}, "")) {
            console.log("success");
        }
    };
    React.useEffect(() => {
        if(communityAnswer) console.log(communityAnswer);
    }, [communityAnswer])

    return (
        <>
            <CommunityHeader></CommunityHeader>
            <button onClick ={uploadAnswer}>등록</button>
            {communityAnswer && <div>{new Date(communityAnswer[0].updatedDate).getFullYear()}</div>}
        </>
    )
}

export default CommunityWriteAnswer