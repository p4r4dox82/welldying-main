import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { imageUrl } from '../etc/config';
import { Colon, MementoLogo } from '../img/Vectors';

interface PromiseInfo {
    imageUri: string;
    title: string;
    message: string;
    submessage: string;
}

function Aboutus() {
    let PromiseInfo: PromiseInfo[] = React.useMemo(() => {
        let result = [];
    
        result.push({
            imageUri: imageUrl('Aboutus/RespectImage.png'),
            title: 'Respect',
            message: '고인의 의지를 존중합니다.',
            submessage: `당신의 이야기가 진솔하고 담담하게
    쓰여질 수 있도록`
        });
    
        result.push({
            imageUri: imageUrl('Aboutus/EarnestImage.png'),
            title: 'Earnest',
            message: '죽음을 가볍게 다루지 않겠습니다.',
            submessage: `고인과 유족의 이야기가
    서로에게 상철르 남기지 않도록록`
        });
    
        result.push({
            imageUri: imageUrl('Aboutus/SecureImage.png'),
            title: 'Secure',
            message: '안전하게 보관합니다.',
            submessage: `당신의 유언과 이야기를
    남에게 보여 부담을 주지 않도록`
        });
    
        return result;
    }, [])

    let topTimeline = React.useMemo(() => {
        let result = [];

        result.push({
            detail: `서울대학교 해동주니어 육성프로그램
선발 및 교수진 멘토링 진행`,
            date: '2020.04'
        });

        result.push({
            detail: `서울대학교 창업동아리 지원사업
최종 선발 및 지원금 유치치`,
            date: '2020.07'
        });

        result.push({
            detail: `웰다잉 대화 카드 '함께, 기억'
텀블벅 펀딩 성공`,
            date: '2020.10'
        });

        result.push({
            detail: `해동주니어 육성프로그램 우수팀 선정
및 사업화지원금 유치`,
            date: '2021.03'
        });

        return result;
    }, []);

    let bottomTimeline = React.useMemo(() => {
        let result = [];

        result.push({
            detail: `교내 창업동아리 내
웰다잉 프로젝트 시작`,
            date: '2020.04'
        });

        result.push({
            detail: `학생창업유망팀300
최종선발 300팀 선정`,
            date: '2020.06'
        });

        result.push({
            detail: `생산성본부 신작업 메이킹랩
선정 및 지원금 유치
(웰다잉 플래너 직업 유치)`,
            date: '2020.08'
        });

        result.push({
            detail: `서울대학교교 사회공헌 PLUS
경진대회 수상`,
            date: '2020.11'
        });

        result.push({
            detail: `예비 창업 패키지 선정
및 사업화 지원금 유치`,
            date: '2021.06'
        });

        return result;
    }, []);

    return (
        <>
            <Header additionalClass='' />
            <div className="Aboutus">
                <div className="block">
                    <div className="MainImage">
                        <div className="main">
                            <img src={imageUrl('CommentMainBackground.png')} alt="" />
                            <div className="imgcover"></div>
                            <div className="textContainer">
                                <div className="mementoLogo">{MementoLogo}</div>
                                <div className="title">
                                    <div>메멘토는 단순하고 쉬운 솔루션과 가이드를 통한, 유언 작성 및 전달 서비스를 제공하는 브랜드로</div>
                                    <div>‘모든 사람이 죽음을 준비할 수 있는 사회와 문화’를 만들어 나갑니다.</div>
                                </div>
                            </div>
                        </div>
                        <div className="border"></div>
                    </div>
                    <div className="MementoPromise margin_base">
                        <div className="textContainer">
                            <div className="title">
                                메멘토는 약속합니다.
                            </div>
                            <div className="subtitle">
                                memento appointment
                            </div>
                            <div className="detail">
                                <div>메멘토는 2020년 4월을 시작으로 현재까지 다양한 사회적 공감과 지지를 얻으며 성장해나가고 있습니다.</div>
                                <div>앞으로도 메멘토만의 가치와 비전에 공감해주시는 분들과 함께 신뢰할 수 있는 브랜드를 만들어나가고자 합니다.</div>
                            </div>
                        </div>
                        <div className="ImageContainer">
                            <div className="vector"></div>
                            {PromiseInfo.map((promiseInfo) => {
                                return (
                                    <div className="ImageElement">
                                        <img src={promiseInfo.imageUri} alt="" />
                                        <div className="cover"></div>
                                        <div className="title">
                                            <span className="Colon">{Colon}</span>
                                            <span className="text">{promiseInfo.title}</span>
                                        </div>
                                        <div className="message">
                                            {promiseInfo.message}
                                        </div>
                                        <div className="submessage">
                                            <div>{promiseInfo.submessage.split('\n')[0]}</div>
                                            <div>{promiseInfo.submessage.split('\n')[1]}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="MementoHistory margin_base" style = {{paddingTop: '74px'}}>
                        <div className="textContainer">
                            <div className="title">
                                메멘토는 성장합니다.
                            </div>
                            <div className="subtitle">
                                memento history
                            </div>
                            <div className="detail">
                                <div>메멘토는 2020년 4월을 시작으로 현재까지 다양한 사회적 공감과 지지를 얻으며 성장해나가고 있습니다.</div>
                                <div>앞으로도 메멘토만의 가치와 비전에 공감해주시는 분들과 함께 신뢰할 수 있는 브랜드를 만들어나가고자 합니다.</div>
                            </div>
                        </div>
                        <div className="timelineContainer">
                            <div className="background"></div>
                            <div className="timeline">
                                <div className="vector"></div>
                                {[...Array(9).keys()].map((key) => {
                                    return(
                                        <div className="dot"></div>
                                    )
                                })}
                            </div>
                            <div className="timelineDetail">
                                <div className="topContainer">
                                   {topTimeline.map((timelineinfo) => {
                                       return (
                                        <div className="element">
                                            <div className="detail">
                                                <div>{timelineinfo.detail.split('\n')[0]}</div>
                                                <div>{timelineinfo.detail.split('\n')[1]}</div>
                                            </div>
                                            <div className="dotContainer">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <div className="date">{timelineinfo.date}</div>
                                        </div>
                                       )
                                   })}
                                </div>
                                <div className="bottomContainer">
                                   {bottomTimeline.map((timelineinfo) => {
                                       return (
                                        <div className="element">
                                            <div className="date">{timelineinfo.date}</div>
                                            <div className="dotContainer">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <div className="detail">
                                                <div>{timelineinfo.detail.split('\n')[0]}</div>
                                                <div>{timelineinfo.detail.split('\n')[1]}</div>
                                                <div>{timelineinfo.detail.split('\n')[2]}</div>
                                            </div>
                                        </div>
                                       )
                                   })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer additionalClass= ' '/>
        </>
    );
}

export default Aboutus;
