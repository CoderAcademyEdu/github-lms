import React, { Component } from 'react';
import axios from 'axios';
import { FullScreen, Rotating } from '../styles/shared';
import githubLogo from '../images/github-logo.svg';
import Error from '../components/error';

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
      })
      .catch(error => this.setState({ error: 'Could not authenticate user ☹️' }));
  }

  render() {
    const { error } = this.state;
    if (error) return <Error msg={error} />;
    return (
      <FullScreen>
        <Rotating src={ githubLogo } width="50px" alt="Github logo" />
        Authenticating
      </FullScreen>
    );
  }
}

export default Github;