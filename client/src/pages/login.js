import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  state = { error: null };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handleLogin = () => {
    const { email, password } = this.state;
    axios.post('/auth/login', { email, password })
      .then(({ data }) => {
        localStorage.setItem('isAuthenticated', true);
        this.props.history.push(this.props.location.state.from.pathname);
      })
      .catch(error => {
        this.setState({ error: 'Could not authenticate that user' });
      });
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <input type="text" name="email" onChange={this.handleInput} />
        <input type="password" name="password" onChange={this.handleInput} />
        <button onClick={this.handleLogin}>login</button>
        <p>{error}</p>
        <p>Haven't got an account? <a href="/register">Register here</a></p>
      </div>
    );
  }
}

export default Login;