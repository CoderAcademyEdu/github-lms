import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { isAuthenticated, isTeacher } from '../utils/authentication';

const Nav = styled.nav`
  flex-shrink: 0;
  padding: 20px;
  background-color: rgb(95, 165, 194);
  font-size: 24px;
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

const Logout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
`;

const RightNav = styled.div`
  display: flex;
  flex-grow: 0.2;
  justify-content: space-between;
  align-items: center;
`;

const LeftNav = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 32px;
`;

const ActiveLink = styled(NavLink)`
  &.active {
    border-bottom: 2px solid #afafaf;
  }
  transition : border-bottom 0.2s ease;
`;

const Navbar = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Nav>
      <LeftNav>
        <NavLink to="/modules">{process.env.REACT_APP_COHORT}</NavLink>
      </LeftNav>
      {
        isAuthenticated() && user &&
          <RightNav>
            <ActiveLink to="/modules">Modules</ActiveLink>
            { isTeacher() && <ActiveLink to="/enrolment">Enrolment</ActiveLink>}
            <Logout>
              <Img src={user.image} alt="user profile picture" />
              <Link to="/logout">Logout</Link>
            </Logout>
          </RightNav>
      }
    </Nav>
  );
};

export default withRouter(Navbar);