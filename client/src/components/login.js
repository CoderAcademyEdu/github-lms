import React from 'react';
import githubLogo from '../images/github-logo.svg';
import styled from 'styled-components';

const LoginPage = styled.a`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:visited {
    color: inherit;
  }
  font-size: 32px;
`;

const Login = (props) => {
  return (
    <LoginPage href="/auth/login">
      <img src={ githubLogo } width="50px" alt="Github logo" />
      Login with Github
    </LoginPage>
  );
}

export default Login;