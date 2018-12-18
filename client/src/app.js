import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Logout from './pages/logout';
import Register from './pages/register';
import Modules from './pages/modules';
import Module from './pages/module';
import Lesson from './pages/lesson';
import Challenge from './pages/challenge';
import NotFound from './pages/notFound';
import { isAuthenticated } from './utils/authentication';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated()
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

const App = () => (
  <div>
    <Navbar />
    <Switch>
      <Route exact path="/" render={ () => <Redirect to="/modules"/> } />
      <Route path="/login" component={ Login } />
      <Route path="/register" component={ Register } />
      <Route path="/logout" component={ Logout } />
      <PrivateRoute exact path="/modules" component={ Modules } />
      <PrivateRoute exact path="/modules/:module" component={ Module } />
      <PrivateRoute exact path="/modules/:module/:lesson" component={ Lesson } />
      <PrivateRoute exact path="/challenges/:module/:challenge" component={ Challenge } />
      <Route path="/*" component={ NotFound } />
    </Switch>
  </div>
);

export default App;
