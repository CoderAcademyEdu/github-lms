import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Logout from './pages/logout';
import Register from './pages/register';
import Courses from './pages/courses';
import Lesson from './pages/lesson';
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
      <Route exact path="/" render={ () => <Redirect to="/courses"/> } />
      <Route path="/login" component={ Login } />
      <Route path="/register" component={ Register } />
      <Route path="/logout" component={ Logout } />
      <PrivateRoute exact path="/courses" component={ Courses } />
      <PrivateRoute exact path="/lesson" component={ Lesson } />
      <Route path="/*" component={ NotFound } />
    </Switch>
  </div>
);

export default App;
