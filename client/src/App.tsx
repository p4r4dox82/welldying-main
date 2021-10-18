import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { setUserInfo } from './etc/api/user';
import usePromise from './etc/usePromise';
import Aboutus from './pages/Aboutus';
import AboutusDetail from './pages/AboutusDetail';
import Admin from './pages/Admin';
import AdminWriteQuestion from './pages/AdminWriteQuestion';
import AdminWriteSection from './pages/AdminWriteSection';
import AdminWriteContent from './pages/AdminWriteContent';
import AdminWriteCategory from './pages/AdminWriteCategory';
import Console from './pages/Console';
import Login from './pages/Login';
import LoginConnect from './pages/LoginConnect';
import Logout from './pages/Logout';
import Main from './pages/Main';
import Mypage from './pages/Mypage';
import Notice from './pages/Notice';
import News from './pages/News';
import QnA from './pages/QnA';
import ReadQnA from './pages/ReadQnA';
import ReadNotice from './pages/ReadNotice';
import Signup from './pages/Signup';
import SignupDone from './pages/SignupDone';
import WriteQnA from './pages/WriteQnA';
import WriteQnAanswer from './pages/WriteQnAanswer';
import WriteNotice from './pages/WriteNotice';
import WriteNews from './pages/WriteNews';
import Findid from './pages/Findid';
import Findpassword from './pages/Findpassword';
import ContentMain from './pages/ContentMain';
import ContentPage from './pages/ContentPage';
import MementoNote from './pages/MementoNote';
import MementoNoteBook from './pages/MementoNoteBook';
import MementoNoteMain from './pages/MementoNoteMain';
import ConfirmMementoBook from './pages/ConfirmMementoBook';
import Survey from './pages/Survey';
import { isMobile } from 'react-device-detect';
import MobileMain from './Mobile/MobileMain';
import MobileNote from './Mobile/MobileNote';
import MobileContent from './Mobile/MobileContent';
import MobileContentPage from './Mobile/MobileContentPage';

function App() {
  let [userInfoLoading] = usePromise(() => setUserInfo());

  if (userInfoLoading) return <></>;
  else if(isMobile) 
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login/connect/:service/:id/:token' component={LoginConnect} />
          <Route path='/login' component={Login} />
          <Route path='/logout' component={Logout} />
          <Route path='/signup/done' component={SignupDone} />
          <Route path='/signup' component={Signup} />
          <Route path='/test/note' component = {MobileNote} />
          <Route path='/test/content/:id' component = {MobileContent} />
          <Route path='/test/contentpage/:id' component = {MobileContentPage} />
          <Route path='/test' component = {MobileMain}/>
          <Route path='/' component={Main} />
        </Switch>
      </BrowserRouter>
    )
  else return (
    <BrowserRouter>
      <Switch>
        <Route path='/admin/question/:id' component={AdminWriteQuestion} />
        <Route path='/admin/section/:id' component={AdminWriteSection} />
        <Route path='/admin/content/:id' component={AdminWriteContent} />
        <Route path='/admin/category/:id' component={AdminWriteCategory} />
        <Route path='/admin' component={Admin} />
        <Route path='/login/connect/:service/:id/:token' component={LoginConnect} />
        <Route path='/login' component={Login} />
        <Route path='/logout' component={Logout} />
        <Route path='/signup/done' component={SignupDone} />
        <Route path='/signup' component={Signup} />
        <Route path='/console' component={Console} />
        <Route path='/mypage' component={Mypage} />
        <Route path='/writeqna/answer/:id' component = {WriteQnAanswer} />
        <Route path='/writeqna/:id' component={WriteQnA} />
        <Route path='/writenotice/:id' component = {WriteNotice} />
        <Route path='/writenews/:id' component = {WriteNews} />
        <Redirect path='/aboutus/0' to='/aboutus'/>
        <Route path='/aboutus/:id' component={AboutusDetail} />
        <Route path='/aboutus' component={Aboutus} />
        <Route path='/qna/:id' component = {ReadQnA} />
        <Route path='/qnalist/:id' component={QnA} />
        <Route path='/notice/:id' component = {ReadNotice} />
        <Route path='/noticelist/:id' component = {Notice} />
        <Route path='/newslist/:id' component = {News} />
        <Route path='/findid' component = {Findid} />
        <Route path='/findpassword' component = {Findpassword} />
        <Route path='/content/:id' component = {ContentMain} />
        <Route path='/contentpage/:id' component = {ContentPage} />
        <Route path='/notebook/:id' component = {MementoNoteBook} />
        <Route path='/note/:id' component = {MementoNote} />
        <Route path='/note' component = {MementoNoteMain} />
        <Route path='/confirmbook/:id' component = {ConfirmMementoBook} />
        <Route path='/survey' component = {Survey} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
