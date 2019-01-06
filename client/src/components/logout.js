import React from 'react';
import axios from 'axios';
import { FullScreen, Rotating } from '../styles/shared';
import githubLogo from '../images/github-logo.svg';

const handleLogout = (props) => {
  axios.get('/auth/logout')
    .then(resp => {
      Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
    })
    .catch(error => console.log(error))
    .finally(() => props.history.push('/'));
}
const Logout = (props) => {
  handleLogout(props);
  return (
    <FullScreen>
      <Rotating src={ githubLogo } width="50px" alt="Github logo" />
      Logout
    </FullScreen>
  );
};

export default Logout;