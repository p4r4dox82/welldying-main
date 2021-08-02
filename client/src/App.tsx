import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { setUserInfo } from './etc/api/user';
import usePromise from './etc/usePromise';
import Aboutus from './pages/Aboutus';
import AboutusDetail from './pages/AboutusDetail';
import Admin from './pages/Admin';
import AdminWriteContent from './pages/AdminWriteContent';
import AdminWriteSection from './pages/AdminWriteSection';
import Checklist from './pages/Checklist';
import ChecklistPrint from './pages/ChecklistPrint';
import Console from './pages/Console';
import Login from './pages/Login';
import LoginConnect from './pages/LoginConnect';
import Logout from './pages/Logout';
import Main from './pages/Main';
import Mypage from './pages/Mypage';
import Signup from './pages/Signup';
import SignupDone from './pages/SignupDone';
import Write from './pages/Write';
import Survey from './pages/Survey';
import Practice from './pages/Practice';
import MementoContent from './pages/MementoContent';

function App() {
  let [userInfoLoading] = usePromise(() => setUserInfo());

  if (userInfoLoading) return <></>;
  else return (
    <BrowserRouter>
      <Switch>
        <Route path='/admin/content/:id' component={AdminWriteContent} />
        <Route path='/admin/section/:id' component={AdminWriteSection} />
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
        <Route path='/write/:sectionId/:contentId' component={Write} />
        <Route path='/write/:sectionId' component={Write} />
        <Route path='/write' component={Write} />
        <Redirect path='/aboutus/0' to='/aboutus'/>
        <Route path='/aboutus/:id' component={AboutusDetail} />
        <Route path='/aboutus' component={Aboutus} />
        <Route path='/survey' component={Survey} />
        <Route path='/practice' component={Practice} />
        <Route path='/content' component={MementoContent} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
