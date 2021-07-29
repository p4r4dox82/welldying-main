import React from 'react';
import { Link } from 'react-router-dom';
import { postSubscriber } from '../etc/api/subscriber';
import { imageUrl } from '../etc/config';
import EmailForm from './EmailForm';

const itemList = [
    "삶의 기록과 계획", "유언과 상속", "건강 관리", "치료와 자기 결정권",
    "장례식, 삶의 마지막", "죽음의 이해", "반려동물", "함께하는 웰다잉"
];

const descriptionTopList = [
    '지난 나, 오늘의 나, 앞으로의 나', '당신의 소중한 사람들에게', '건강한 삶의 마침표를 위한', '삶의 마지막 순간에',
    '소중한 이들과 함께하는', '당신이 생각하는 죽음은', '당신의 동물 친구를', '당신의 소중한 사람들과',
]

const descriptionBottomList = [
    ': Little history', '당신의 흔적을 전달합니다', '몸과 마음 상태의 점검', '당신의 선택을 존중합니다',
    '삶의 마침표에 대한 계획', '어떤 의미인가요?', '혼자 남겨두지 말아주세요', '후회없이 기억하고 싶은 추억'
]

function MainB() {
    let emailFront = 'memento.welldying';
    let emailBack = 'gmail.com';
    let [currentItem, setCurrentItem] = React.useState<number>(-1);
    let [descriptionActive, setDescriptionActive] = React.useState<boolean>(false);

    return (
        <div className='content'>
            <div className='row'>
                <div className='leftArea'>
                    <h1> 메멘토 베타 테스트 </h1>
                    <h6> 기간: 2021.06.01. - 2021.12.31. </h6>
                </div>
                현재 ‘웰다잉 체크리스트 서비스’의 오픈 베타 테스트 기간입니다.
                <br/>
                베타 테스트 기간 이후에도 서비스 사용을 원하시는 분들은 우측에 있는 ‘베타테스트 설문’을 통해 의견을 들려주시면 감사하겠습니다.

                <div className='rightArea'>
                    <a href='https://forms.gle/TRV6F4D38HVGTm818'>
                        <button className='mainButton'>
                            베타테스트 설문 참여하기
                        </button>
                    </a>
                    {`문의: ${emailFront}@${emailBack}`}
                </div>
            </div>
            <div className='row'>
                <div className='leftArea'>
                    <h1> 웰다잉 체크리스트 </h1>
                    <h6> <Link to='/checklist'> 마이 체크리스트 바로 가기 </Link> </h6>
                </div>
                <h2> 체크리스트는 </h2>
                <ul>
                    <li> 웰다잉 체크리스트는 나의 삶을 기록하고 앞으로의 계획을 세우는 나만의 기록장입니다. </li>
                    <li> 총 8가지의 카테고리로 구성된 삶과 죽음에 대한 질문을 통해 </li>
                    <li> 나와 사랑하는 사람의 Finale를 위한, 웰다잉 플랜을 기획할 수 있습니다.</li>
                    <li className='dialogBox'>
                        <div> 이 세상을 떠나는 마지막 순간, 유족들에게 남기고 싶은 말을 기록해 볼까요. </div>
                        <div className='dialogCheckBox'/>
                        <img className='dialogCheckSign' src={imageUrl('check.png')} />
                    </li>
                </ul>
            </div>
            <div className='row'>
                <h2> 체크리스트 구성 </h2>
                <div className='checklistContainer'>
                    { [...Array(8).keys()].map((i) => (
                        <Link to={`/checklist/${i+1}`} className='checklistItem'>
                            <div>
                                <div onMouseEnter={() => {setCurrentItem(i); setDescriptionActive(true);} } onMouseLeave={() => setDescriptionActive(false) } >
                                    <img className='main' src={imageUrl(`checklists/${i}.png`)}/>
                                </div>
                                <div className='checklistDescription'> { `#${itemList[i]}` } </div>
                            </div>
                        </Link>
                    )) }
                </div>
                <div className='rightArea quoteRightArea'>
                    <div className={ 'quoteImage' + (!descriptionActive ? ' inactive' : '') } style={{backgroundImage: `url(${imageUrl('quote.png')})`}}>
                    { currentItem !== -1 &&
                        <>
                            { descriptionTopList[currentItem] }
                            <br/>
                            { descriptionBottomList[currentItem] }
                        </>
                    }
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='leftArea'>
                    <h1> COMING SOON... </h1>
                </div>
                <ul className='timeline'>
                    <li>
                        <h2> 웰다잉 인증 카드 </h2>
                        <h6> 2021년 상반기 </h6>
                        “나는 존엄한 죽음을 준비하고 있는 사람입니다. 나의 권리를 지켜주세요.”
                        <br/>
                        갑작스러운 죽음을 맞이했을 때 웹사이트에 있는 나의 웰다잉 플랜을 알릴 수 있도록,
                        <br/>
                        21년 상반기에 ‘웰다잉 인증카드’ 출시할 예정입니다.
                    </li>
                    <li>
                        <h2> ‘웰다잉 대화 카드’ 2차 펀딩 </h2>
                        <h6> 2021년 하반기 </h6>
                        작년 가을, 사랑하는 사람과 함께 죽음을 준비할 수 있는 대화 카드인 {"<함께, 기억>"}의
                        <br/>
                        펀딩을 성공적으로 진행했습니다. 후원자분들의 피드백을 통한 리뉴얼 과정을 거쳐
                        <br/>
                        2021년 하반기, {"<함께, 기억> "}카드를 정식 출시할 계획입니다.
                    </li>
                    <li>
                        <h2> 웰다잉 플래닝 프로그램 </h2>
                        <h6> 2022년 하반기 </h6>
                        막막하고 두려운 죽음, 혼자 준비하기 버겁지는 않으신가요?
                        <br/>
                        고용노동부와 kpc의 지원을 통해 개발중인 ‘웰다잉 플래닝 프로그램’을 기대해주세요!
                    </li>
                </ul>
            </div>
            <div className='row'>
                <ul className='timeline'>
                    <li>
                        <h2> 메멘토의 새로운 소식을 가장 먼저 듣고 싶으시다면, 이메일을 남겨주세요! </h2>

                        <EmailForm submit={async (emailFront, emailBack) => {
                          if (emailFront.length < 1 || emailBack.length < 1) {
                            alert('이메일 주소를 입력해 주세요!');
                          } else if (await postSubscriber(emailFront, emailBack)) {
                            alert('앞으로 메멘토의 새로운 소식을 이메일로 보내드리겠습니다! 감사합니다!');
                          }
                        }}/>
                    </li>
                </ul>

            </div>
            <div className='row'>
                <div className='leftArea'>
                    <h1> 팀 메멘토 </h1>
                    <Link to='/aboutus'><h6> 팀 소개 자세히 보기 </h6></Link>
                </div>
                <h2> 팀 메멘토는 </h2>
                <ul>
                    <li> “모든 사람이 준비된 죽음을 맞이하는 사회”라는 비전을 가지고 모인 서울대학교 팀 입니다. </li>
                    <li> ‘죽음의 이면에 있는 삶의 행복을 전하는 일’ 이것이 저희가 생각하는 메멘토의 역할입니다. </li>
                </ul>
                <h2> 팀 메멘토 구성 </h2>
                <img src={imageUrl('members/team.png')} className='teamImage'/>
            </div>
        </div>
    );
}

export default MainB;
