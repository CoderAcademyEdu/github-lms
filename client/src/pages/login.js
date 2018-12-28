import React from 'react';
import githubLogo from '../images/github-logo.svg';
import styled from 'styled-components';

const LoginPage = styled.a`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Login = (props) => {

  return (
    <LoginPage href="/auth/login">
      <img src={ githubLogo } width="50px" alt="Github logo" />
      <br />
      Login with Github
    </LoginPage>
  );
}

export default Login;