import React, { Component } from 'react';
import axios from 'axios';
import { FullScreen, Rotating } from '../styles/shared';
import githubLogo from '../images/github-logo.svg';

class Github extends Component {
  componentDidMount() {
    const { search } = this.props.location;
    const idx = search.indexOf('=') + 1;
    const code = search.substr(idx);
    axios.post('/auth/github/callback', { code })
      .then(resp => {
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('user', JSON.stringify(resp.data));
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <FullScreen>
        <Rotating src={ githubLogo } width="50px" alt="Github logo" />
        Authenticating
      </FullScreen>
    );
  }
}

export default Github;