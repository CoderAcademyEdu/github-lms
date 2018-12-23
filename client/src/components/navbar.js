import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { isAuthenticated } from '../utils/authentication';

const Nav = styled.nav`
  padding: 20px;
  background-color: #222;
  font-size: 32px;
  a, a:visited {
    text-decoration: none;
    color: white;
  }
  display: flex;
  justify-content: space-between;
`;

const Navbar = (props) => {
  return (
    <Nav>
      <NavLink to="/modules">Home</NavLink>
      {
        isAuthenticated() &&
          <NavLink to="/logout">Logout</NavLink>
      }
    </Nav>
  );
};

export default withRouter(Navbar);