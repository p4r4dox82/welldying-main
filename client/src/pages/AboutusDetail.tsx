import React from 'react';
import { Link, match } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { imageUrl } from '../etc/config';

const maxId = 5;

interface Member {
    name: string;
    emailFront: string;
    emailBack: string;
    school: string;
    spec: string;
    role: string;
    slogan: string;
    message: string;
}

const members : Member[] = [
    {
        name: '신동경',
        emailFront: 'mscmj2006', emailBack: 'naver.com',
        school: '서울대학교 자유전공학부 재학',
        spec: `2018-1 법동아리 DIKE의 부장으로 세월호 추모 행사를 주도함
2019-s Asian undergraduate summit 참가 1st grade 수상 
2019-2 해외의 시장 구조와 경제 정책 연구 진행 
2019-2 테크톤 플러스 참가`,
        role: '기획, 경영',
        slogan: '유족들의 슬픔을 덜어줄 수 있도록',
        message: `현재 한국사회에서 죽음은 언제나 '갑작'스럽습니다. 준비되지 못한 죽음은 아쉬움과 후회를 키우고, 유족에게 버티기 어려운 큰 슬픔으로 다가옵니다.
가히 3개월은 본업에 돌아가지 못하고 슬픔에 잠겨 살곤 하죠. 저는 그 고통을 알고 있기에 사랑하는 사람의 마지막을 겪은 누군가의 슬픔을 덜어드리고 싶었습니다.`,
    }, {
        name: '김연수',
        emailFront: 'irene_0630', emailBack: 'naver.com',
        school: '서울대학교 사회복지학과 재학',
        spec: `지역아동센터 상담 실습 진행 
지역사회 장애인복지관 네트워크에 관한 프로젝트 진행 
서울대학교 호스피스 실습특강 수강`,
        role: '상담, 심리',
        slogan: '내 삶에 위로를 건내는 기회',
        message: `한 사람의 죽음은 주변인의 삶에 거대한 파장을 일으킵니다. 그럼에도 우리는 그것을 미처 알지 못한 채 대수롭지 않은 농담의 소재로 사용하기도, 문제의 해결책인 양 묘사하기도 합니다. 
그러나 막상 다가오는 죽음은 결코 가벼울 수 없을 것입니다. 죽음을 준비하는 과정이 현재의 시간에 대한 고민의 기회가 되고, 나아가 머금고 있던 마음들을 스스로에게, 그리고 내 곁의 소중한 이들에게 훗날 전할 수 있는 계기가 되었으면 좋겠습니다.`
    }, {
        name: '우용훈',
        emailFront: 'yongman95', emailBack: 'naver.com',
        school: '서울대학교 시각디자인학과 재학',
        spec: `졸업 추천 어플리케이션 저작권 등록 진행 
디자인 학회에 참가하여 논문 발표 진행 
‘죽음 가이드북’ 제작 경험`,
        role: '디자인',
        slogan: '자그마한 흔적으로 치유 되길 바라며',
        message: `소중한 사람의 죽음을 경험하는 것 만큼 가슴 아픈 일은 없을 것입니다. 그 상실감에, 남겨진 누군가에게는 따뜻한 위로도, 작은 토닥임도 와닿지 않을 지 모르겠습니다. 
        때문에 그들에게 고인의 흔적을 전달해 드리고자 합니다. 고인의 밝게 웃는 목소리가 위로가 될 수 있지 않을까 하며, 고인의 사진 속 웃음이 유족에게 닿길 바라는 마음으로.`,
    }, {
        name: '임혜지',
        emailFront: 'holly0816', emailBack: 'snu.ac.kr',
        school: '서울대학교 자유전공학부(경영학, 언론정보학 전공) 재학',
        spec: `Asian Undergraduate Summit에서 한국대학 부대표 
제 6회 청소년경제세미나(한국경제신문 후원, 2017) 주관 
잔돈 저축·투자 앱 티클의 SNS 마케팅팀 1기`,
        role: '마케팅, 경영 전략',
        slogan: '필요한 순간에 필요한 준비를',
        message: `웰다잉의 핵심은 ‘타이밍’입니다. 누구에게나 공평한 ‘죽음’이 나에게 방문하기 전에 현명하게 대비하는 것. 사랑하는 사람이 떠나기 전에 그 사람과 충분히 교제하는 것. 그 사람이 더 이상 남아있지 않을지라도 무너지지 말고 위로를 통해 다시 일어서는 것. 
        저희는 죽음과 관련된 이 모든 ‘타이밍’이 너무 늦지 않기를 바라는 절박한 마음으로 오늘도 달립니다.`,
    }, {
        name: '장민혁',
        emailFront: 'minhyukjang', emailBack: 'gmail.com',
        school: '서울대학교 자유전공학부(컴퓨터공학) 재학',
        spec: `제31회 한국정보올림피아드 공모부문(2014) 은상 
제30회 한국정보올림피아드 공모부문(2013) 은상 
네이버 웨일 확장앱 콘테스트 2019 특별상 
Intel ISEF 2015 Finalist`,
        role: '소프트웨어 개발',
        slogan: '...',
        message: `작년에 할아버지와 영영 헤어지게 됐습니다. 헤어짐을 마주하고 나니 세상이 결코 이전과 같지 않더랍니다. 죽음에 대해 제아무리 담담하다 할지언정, 천하와 헤어지기 전에 반드시 해야할 일들이 있을 것입니다. 
바로 그것을 도와드리고 싶은 마음입니다.`
    }
];

interface MatchParams {
    id?: string;
};

interface Props {
    match: match<MatchParams>;
};

function AboutusDetail({ match } : Props) {
    let id = Number.parseInt(match.params.id || '1') - 1;

    let content = React.useMemo(() => (
        <div className='content aboutus'>
            <div className='row'>
                <div className='leftArea'>
                    <h1> TEAM <br/> MEMENTO </h1>
                    <h6> (2020. 03 - ) </h6>
                    <div style={{marginBottom: '50px'}} className='desktopOnly' />
                    <h2> { members[id].role } </h2>
                </div>
                <div className='cardContainer' style={{backgroundImage: `url(${imageUrl(`members/${id}.png`)})`}}>
                    <div className='card'>
                        <div className='memberInfo'>
                            <div className='memberName'> { members[id].name } </div>
                            <div className='memberSchool'> { members[id].school } </div>
                            <div className='memberSpec'> { members[id].spec.split('\n').map((line) => <div> { line } </div> ) } </div>
                        </div>
                    </div>
                    <Link to={`/aboutus/${id}`} className='moveButton leftButton'>
                        {'<'}
                    </Link>
                    <Link to={`/aboutus/${Math.min(maxId, id+2)}`} className='moveButton rightButton'>
                        {'>'}
                    </Link>
                </div>
                <div className='introduceContainer'>
                    <h1> '{ members[id].slogan }' </h1>
                    <ul>
                        { members[id].message?.split('\n').map((line) => <li> { line } </li>) }
                    </ul>
                </div>
                <div className='indexPointContainer'>
                    {[...Array(maxId)].map((_, k) => 
                        <Link to={`/aboutus/${k}`}>
                            <div 
                                className={'link indexPoint' + ((k === id) ? ' active' : '')} 
                                style={{ right: `${25*(maxId-k)}px` }}
                            /> 
                        </Link>
                    )}
                </div>
            </div>
        </div>
    ), [id]);

    return (
        <>
            <Header additionalClass='grey borderBottom' />
            { content }
            <Footer/>
        </>
    );
}

export default AboutusDetail;