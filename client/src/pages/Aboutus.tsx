import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { imageUrl } from '../etc/config';

const maxId = 5;

function Aboutus() {
    return (
        <>
            <Header additionalClass='grey borderBottom' />
            <div className='content aboutus' style={{minHeight: 0, height: 0, margin: 0}}>
                <div className='row' style={{margin: 0}}>
                    <div className='leftArea'>
                        <h1> TEAM <br/> MEMENTO </h1>
                        <h6> (2020. 03 - ) </h6>
                    </div>
                </div>
            </div>
            <div className='aboutusMain'>
                <h1>
                    Team Memento
                    <span style={{marginLeft: '10px'}}> 20대, 죽음을 이야기하다 </span>

                    <Link to={`/aboutus/${maxId}`} className='moveButton leftButton'>
                        {'<'}
                    </Link>
                    <Link to={`/aboutus/1`} className='moveButton rightButton'>
                        {'>'}
                    </Link>
                </h1>
                <div style={{marginBottom: '60px'}}/>
                <ul>
                    <li> “모든 사람이 준비된 죽음을 맞이하는 사회를 만들자.”는 비전을 가지고 모인 서울대학교 창업팀 입니다. </li>
                    <li> ‘죽음의 이면에 있는 삶의 축복을 전하는 일.’ 이것이 저희가 생각하는 메멘토의 역할입니다. </li>
                </ul>
                <div style={{marginBottom: '30px'}}/>
                <img src={imageUrl('members/team.png')} className='teamImage' alt = "profile"/>
            </div>
            <Footer additionalClass= ' '/>
        </>
    );
}

export default Aboutus;
