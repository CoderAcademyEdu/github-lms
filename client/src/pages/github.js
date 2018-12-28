import React, { Component } from 'react';
import axios from 'axios';

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
      <div>
        Authenticating with Github
      </div>
    );
  }
}

export default Github;