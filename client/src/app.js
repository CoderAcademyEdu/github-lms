import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Logout from './pages/logout';
import Register from './pages/register';
import Modules from './pages/modules';
import Module from './pages/module';
import Lesson from './pages/lesson';
import Github from './pages/github';
import Challenge from './pages/challenge';
import NotFound from './pages/notFound';
import { isAuthenticated } from './utils/authentication';
import styled from 'styled-components';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated()
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
);

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr minmax(700px, 75%) 1fr;
  a, a:visited {
    text-decoration: none;
  }
`;

const Page = styled.div`
  background-color: #fff;
`;

const Side = styled.div`
  background-color: #efefef;
`;

const App = () => (
  <Wrapper>
    <Side></Side>
    <Page>
      <Navbar />
      <Switch>
        <Route exact path="/" render={ () => <Redirect to="/modules"/> } />
        <Route path="/login" component={ Login } />
        <Route path="/register" component={ Register } />
        <Route path="/logout" component={ Logout } />
        <Route path="/github/callback" component={ Github } />
        <PrivateRoute exact path="/modules" component={ Modules } />
        <PrivateRoute exact path="/modules/:module" component={ Module } />
        <PrivateRoute exact path="/modules/:module/:lesson" component={ Lesson } />
        <PrivateRoute exact path="/challenges/:module/:challenge" component={ Challenge } />
        <Route path="/*" component={ NotFound } />
      </Switch>
    </Page>
    <Side></Side>
  </Wrapper>
);

export default App;
