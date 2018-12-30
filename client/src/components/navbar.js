import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { isAuthenticated, isTeacher } from '../utils/authentication';

const Nav = styled.nav`
  padding: 20px;
  background-color: #222;
  font-size: 32px;
  a, a:visited {
    text-decoration: none;
    color: white;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
`;

const Navbar = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Nav>
      <NavLink to="/modules">Modules</NavLink>
      { isTeacher() && <NavLink to="/enrolment">Enrolment</NavLink>}
      {
        isAuthenticated() && user &&
          <RightNav>
            <Img src={user.image} alt="user profile picture" />
            <Link to="/logout">Logout</Link>
          </RightNav>
      }
    </Nav>
  );
};

export default withRouter(Navbar);