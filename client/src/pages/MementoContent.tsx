import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MainA from '../components/MainA';
import MainB from '../components/MainB';
import useScroll, { useDeltaScroll } from '../etc/useScroll';
import { RootReducer } from '../store';

function MementoContent() {
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

    return (
        <>
            <Header additionalClass='absolute white' />
            <MainA/>
            <MainB/>
            <Footer/>

            <div className='absolute loginButtonForm'>
                { user.loggedIn ? (
                    <>
                        <div><Link to='/checklist'> {`${user.user!.name}님의 웰다잉 공간`} </Link></div>
                        <div><Link to='/logout'> 로그아웃 </Link></div>
                        { user.user?.username === 'admin' && <div><Link to='/admin'> 컨텐츠 관리</Link></div>}
                    </>
                ) : (
                    <>
                        <div><Link to='/console'> 유가족 열람요청 </Link></div>
                        <div><Link to='/login'> 본인 로그인 </Link></div>
                    </>
                )}
            </div>

        </>
    );
}

export default MementoContent;
