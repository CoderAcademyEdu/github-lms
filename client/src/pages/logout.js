import React from 'react';
import axios from 'axios';

const Logout = (props) => {
  axios.get('/auth/logout')
    .then(resp => {
      localStorage.removeItem('isAuthenticated');
    })
    .catch(error => console.log(error))
    .finally(() => props.history.push('/'));
  return <p>Logging out...</p>;
};

export default Logout;