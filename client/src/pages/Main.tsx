import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Maincontent from '../components/Maincontent';
import useScroll, { useDeltaScroll } from '../etc/useScroll';
import { RootReducer } from '../store';
import { isMobile } from 'react-device-detect';
import { imageUrl } from '../etc/config';
import { Colon, leftVector, MainImageVector, MementoDotVector, MementoLogo, PlusVector } from '../img/Vectors';

function Main() {
    let user = useSelector((state: RootReducer) => state.user);
    let scroll = useScroll();
    let deltaScroll = useDeltaScroll();
    let [reachBottom, setReachBottom] = React.useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    React.useEffect(() => {
        if (reachBottom) return;

        let maxScroll = window.innerHeight - 150;

        if (scroll >= maxScroll) setReachBottom(true);

        if (deltaScroll > 0 && scroll < maxScroll) {
            let nextScroll = Math.min(scroll + 1.08 * deltaScroll, scroll + 0.07*(maxScroll - scroll));
            if (nextScroll < scroll + 1) nextScroll = scroll + 1;
            setTimeout(() => window.scrollTo(0, nextScroll), 10);

            if (nextScroll >= maxScroll) setReachBottom(true);
        }
    }, [scroll]);

    let [quit, setQuit] = React.useState<boolean>(false);
    let [quit2, setQuit2] = React.useState<boolean>(false);
    let [mobileMainNumber, setMobileMainNumber] = React.useState<number>(0);

    interface MementoInfo {
        name: string;
        maintext: string;
        subtext: string;
    }

    let MementoInfo: MementoInfo[] = React.useMemo(() => {
        let result = [];
        result.push({
            name: '메멘토 소개',
            maintext: `메멘토는 당신의 이야기를
            소중하게 전달합니다.`,
            subtext: '웰다잉 플랫폼 메멘토는 남녀노소 누구나 자신의 죽음을 준비해보는 시간을 가질 수 있는 공간입니다. 메멘토에서 인생을 기록하고, 유언을 작성하고, 책과 영상을 통해 죽음에 대해 철학적으로 고민해보며 죽음 이면에 있는 삶의 축복을 발견하세요.'
        });
        result.push({
            name: '메멘토 컨텐츠', 
            maintext: `여러분은 죽음에 대해
            얼만큼 알고 계신가요?`,
            subtext: '메멘토 컨텐츠란, 다양한 책, 영화, 강연을 통해 죽음에 대한 궁금증을 해소하고, 삶에 대한 나만의 철학을 완성해나가는 공간입니다. 컨텐츠 감상 후 제시되는 질문에 답하며 당신만의 삶과 죽음에 관한 생각을 정리해보세요. ',
        });
        result.push({
            name: '메멘토 노트',
            maintext: `당신의 이야기를 작성하는
            당신만의 공간`,
            subtext: '메멘토가 제시하는 질문에 대한 나의 생각을 정리할 수 있는 프라이빗한 공간입니다. 질문은 삶과 죽음에 관한 총 6가지 카테고리로 구성되어 있으며, 질문에 대해 하나씩 답을 작성하면서 나만의 인생 기록이 담긴 특별한 유언을 완성할 수 있습니다. ',
        });
        result.push({
            name: '메멘토 북', 
            maintext: `당신의 이야기를 엮어
            소중한 사람에게 전달하세요.`,
            subtext: '메멘토 노트에 적은 답변을 온라인 책 형태로 엮어 소중한 이들에게 전달하는 공간입니다. 메멘토 노트의 답변 중 전달하고 싶은 답변을 선택하면 자동적으로 메멘토가 당신의 인생 기록이자 유언이 담긴 전자책을 만들어드립니다. ',
        });
        result.push({
            name: '유언 자서전',
            maintext: `여러분의 소중한 이야기를 
            책으로 남겨보세요.`,
            subtext: '메멘토 북을 모두 완성하셨다면, 소중한 이들에게 남길 수 있는 책을 제작해보세요. 메멘토가 당신의 이야기를 섬세하게 엮어 보내드립니다. 당신을 그리워 할 소중한 사람들을 위해 당신의 빈자리에 위로와 온기를 남겨주세요.'
        });
        return result;
    }, []);

    let signupLink = React.useRef<any>(null);
    let SignupLinkClick = () => signupLink.current.click();

    let MobileMainContent = React.useMemo(() => {
        return (
            <>
            <Link to ='/signup' ref = {signupLink} style = {{display: 'none'}}></Link>
            <div className = 'mobileMainInfo' style = {{display: 'flex', justifyContent: 'center', width: '100vw', height: '100vh', flexWrap: 'nowrap', alignContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                <img src={imageUrl('main_background.png')} alt="" className="background" style = {{width: '100vw', height: '100vh', objectFit: 'cover', position: 'absolute', opacity: '0.4'}}/>
                <div className="GB px14 op4">{MementoInfo[mobileMainNumber].name}</div>
                <div className="MementoLogo">{MementoLogo}</div>
                <div className="imageContainer">
                    <div className="circleBorder"></div>
                    <img src={imageUrl(`MainImage${mobileMainNumber + 1}.png`)} alt="" className="MainImage" />
                    <div className="vector">{MainImageVector}</div>
                </div>
                <div className="MainText GB px20 line30 ">
                    <div>{MementoInfo[mobileMainNumber].maintext.split('\n')[0]}</div>
                    <div>{MementoInfo[mobileMainNumber].maintext.split('\n')[1]}</div>
                </div>
                <div className="Colon">{Colon}</div>
                <div className="subtext GB px12 line30 op7">
                    {MementoInfo[mobileMainNumber].subtext}
                </div>
                <div className="DotContainer">
                    {[...Array(5).keys()].map((i, key) => {
                        return(
                            <div className={"dot" + (mobileMainNumber === key ? ' selected' : '')}>{MementoDotVector}</div>
                        )
                    })}
                </div>
                <button className="Next NS px16 bold whiteop10" onClick = {mobileMainNumber === 4 ? () => SignupLinkClick() : () => setMobileMainNumber(mobileMainNumber + 1)} style = {{background: (mobileMainNumber === 4 ? 'rgba(35, 52, 42, 1)': '')}}>{(mobileMainNumber === 4 ? '회원가입': '다음>')}</button>
            </div>
            </>
        )
    }, [mobileMainNumber]);

    if(isMobile) return(
        <div className = 'mobile'>
            {mobileMainNumber !== 5 && MobileMainContent}
            {mobileMainNumber === 5 && <>
            <img src={imageUrl('mobileImage.png')} alt="" style = {{width: '100vw', objectFit: 'cover'}}/>
            <div className = 'notification' style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center',background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: '0px', height: '100vh', alignContent: 'flex-start'}}>
                <div className="GB px25 line40 whiteop10" style = {{paddingTop: '97px'}}>메멘토 모바일 서비스는</div>
                <div className="GB px25 line40 whiteop10">오픈 준비중 입니다.</div>
                <div className = 'px14 line30 whiteop7'>2021년 11월 초 출시 예정</div>
                <div className="dot" style = {{display: 'flex', gap: '7px', width: '30px', marginTop: '34px'}}>
                    <div>{MementoDotVector}</div>
                    <div>{MementoDotVector}</div>
                    <div>{MementoDotVector}</div>
                </div>
                <div className = 'NS px14 line30 whiteop7' style = {{marginTop: '57px', letterSpacing: '-0.05em'}}>
                    <div>메멘토의 <span className = 'bold'>MVP</span> 서비스에 관심을 가져주셔서 감사합니다.</div>
                    <div>현재 메멘토의 모바일 서비스에서는 서비스 이용을 위한</div>
                    <div>‘<span className = 'bold'>회원가입</span>’ 기능만을 제공하고 있습니다.</div>
                    <div style = {{width: '50px', height: '30px'}}></div>
                    <div>이외의 모든 서비스는</div>
                    <div>‘<span className = 'bold'>{'크롬(Chrome)'}</span>’을 통한 웹 환경에서 이용이 가능하며</div>
                    <div>11월 2차 오픈을 통해 최적화를 진행할 예정입니다.</div>
                    <div style = {{width: '50px', height: '30px'}}> </div>
                    <div>메멘토를 향한 여러분의 관심에</div>
                    <div>더욱 편리한 서비스로 보답하겠습니다. 감사합니다.</div>
                </div>
                <Link to ={'/signup'}><button className = 'NS bold px14 whiteop10'>회원가입</button></Link>
            </div>
            </>
            }
        </div>
    )
    return (
        <div style = {{overflow: 'hidden'}}>
            <Header additionalClass='' />
            {!quit && <div className="TopBar white NS px13 bold whiteop10" style = {{width: '100vw', height: '56px', background: 'rgba(191, 196, 193, 1)', display: 'flex', alignItems: 'center'}}>
                <div style = {{width: '1032px', left: 'calc(50% - 1032px/2)'}}>{'최적화된 서비스를 위하여 크롬(Chrome) 브라우저를 이용해주세요!'}
                <img src = {imageUrl('NotePage/quit_vector.svg')} style = {{position: 'absolute', right: '0px', top: '0px', width: '12.5px', height: '12.5px'}} onClick = {() => setQuit(true)}/>
                </div>
            </div>}
            <Maincontent/>
            <Footer additionalClass=' '/>
        </div>
    );
}

export default Main;
