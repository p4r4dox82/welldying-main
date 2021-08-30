import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Maincontent from '../components/Maincontent';
import useScroll, { useDeltaScroll } from '../etc/useScroll';
import { RootReducer } from '../store';

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

    return (
        <>
            <Header additionalClass='absolute ' />
            <Maincontent/>
            <Footer additionalClass=' '/>
        </>
    );
}

export default Main;
