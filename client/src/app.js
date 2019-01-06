import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import Logout from './components/logout';
import Modules from './pages/modules';
import Lessons from './pages/lessons';
import Lesson from './pages/lesson';
import Github from './pages/github';
import Challenge from './pages/challenge';
import NotFound from './components/notFound';
import Enrolment from './pages/enrolment';
import { isAuthenticated } from './utils/authentication';
import styled from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAmbulance } from '@fortawesome/free-solid-svg-icons';

library.add(faAmbulance);

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
  display: grid;
  grid-template-columns: 1fr minmax(700px, 75%) 1fr;
  a, a:visited {
    text-decoration: none;
  }
`;

const Page = styled.div`
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Side = styled.div`
  background-color: #efefef;
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const App = () => (
  <Wrapper>
    <Side></Side>
    <Page>
      <Navbar />
      <Main>
        <Switch>
          <Route exact path="/" render={ () => <Redirect to="/modules"/> } />
          <Route path="/login" component={ Login } />
          <Route path="/logout" component={ Logout } />
          <Route path="/github/callback" component={ Github } />
          <PrivateRoute exact path="/modules" component={ Modules } />
          <PrivateRoute exact path="/modules/:module" component={ Lessons } />
          <PrivateRoute exact path="/modules/:module/:lesson" component={ Lesson } />
          <PrivateRoute exact path="/challenges/:module/:challenge" component={ Challenge } />
          <PrivateRoute exact path="/enrolment" component={ Enrolment } />
          <Route path="/*" component={ NotFound } />
        </Switch>
      </Main>
    </Page>
    <Side></Side>
  </Wrapper>
);

export default App;
