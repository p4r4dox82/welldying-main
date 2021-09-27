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
import { leftVector, MementoDotVector, PlusVector } from '../img/Vectors';

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
    if(isMobile) return(
        <>
            <img src={imageUrl('mobileImage.png')} alt="" style = {{width: '100vw', objectFit: 'cover'}}/>
            <div className = 'mobile' style = {{display: 'flex', flexWrap: 'wrap', justifyContent: 'center',background: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: '0px', height: '100vh', alignContent: 'flex-start'}}>
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
