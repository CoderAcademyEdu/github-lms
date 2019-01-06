import React from 'react';
import { FullScreen, Rotating } from '../styles/shared';
import githubLogo from '../images/github-logo.svg';

const Loading = (props) => {
  const { REACT_APP_COHORT: cohort } = process.env;
  document.title = `${cohort} - Loading`;

  return (
    <FullScreen>
      <Rotating src={ githubLogo } width="50px" alt="Github logo" />
      Loading
    </FullScreen>
  );
};

export default Loading;