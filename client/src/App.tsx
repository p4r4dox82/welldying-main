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
import Checklist from './pages/Checklist';
import ChecklistPrint from './pages/ChecklistPrint';
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
import Write from './pages/Write';
import WriteQnA from './pages/WriteQnA';
import WriteQnAanswer from './pages/WriteQnAanswer';
import WriteNotice from './pages/WriteNotice';
import WriteNews from './pages/WriteNews';
import Findid from './pages/Findid';
import Findpassword from './pages/Findpassword';
import ContentMain from './pages/ContentMain';

function App() {
  let [userInfoLoading] = usePromise(() => setUserInfo());

  if (userInfoLoading) return <></>;
  else return (
    <BrowserRouter>
      <Switch>
        <Route path='/admin/question/:id' component={AdminWriteQuestion} />
        <Route path='/admin/section/:id' component={AdminWriteSection} />
        <Route path='/admin/content/:id' component={AdminWriteContent} />
        <Route path='/admin' component={Admin} />
        <Route path='/login/connect/:service/:id/:token' component={LoginConnect} />
        <Route path='/login' component={Login} />
        <Route path='/logout' component={Logout} />
        <Route path='/signup/done' component={SignupDone} />
        <Route path='/signup' component={Signup} />
        <Route path='/console' component={Console} />
        <Route path='/mypage' component={Mypage} />
        <Route path='/checklist/print' component={ChecklistPrint} />
        <Route path='/checklist/:id' component={Checklist} />
        <Route path='/checklist' component={Checklist} />
        <Route path='/write/:sectionId/:questionId' component={Write} />
        <Route path='/write/:sectionId' component={Write} />
        <Route path='/write' component={Write} />
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
        <Route path='/content' component = {ContentMain} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
