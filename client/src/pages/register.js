import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  state = { error: null };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handleRegistration = () => {
    const { email, password } = this.state;
    axios.post('/auth/register', { email, password })
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
        <button onClick={this.handleRegistration}>Register</button>
        <p>{error}</p>
        <p>Already got an account? <a href="/login">Login here</a></p>
      </div>
    );
  }
}

export default Register;