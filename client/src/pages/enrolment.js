import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Loading from '../components/loading';
import styled from 'styled-components';
import Error from '../components/error';

const User = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.isEnrolled ? '#7affc6' : ''};
  padding: 20px;
  :hover {
    cursor: pointer;
  }
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
`;

const RoleButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  margin: 10px;
  background-color: ${props => props.isTeacher ? '#ff7a7a' : '#5fa5c2'};
  color: #222;
  font-size: 12px;
  padding: 6px 20px;
  border: 1px solid #555;
  :hover {
    cursor: pointer;
  }
`;

class Enrolment extends Component {
  state = {
    users: [],
    loading: true
  };

  reverseSort = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return (dateA > dateB) ? -1 : 1;
    });
  }

  fetchUsers = () => {
    const url = `/api/users`;
    const { promise } = this.state;
    axios.get(url, { cancelToken: promise.token })
      .then(({ data }) => {
        const users = this.reverseSort(data);
        this.setState({ users });
      })
      .catch(error => {
        let msg = "ERROR!";
        if (error.response.status === 403) {
          msg = "You are not authorised to modify enrolments 🙂";
        }
        this.setState({ error: msg });
      })
      .finally(() => this.setState({ loading: false }));
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({ promise: source }, this.fetchUsers);
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  handleEnrolment(login, verb, e) {
    const { REACT_APP_COHORT: cohort } = process.env;
    const url = `/auth/${cohort}/${verb}`;
    const { promise } = this.state;
    const options = {
      cancelToken: promise.token,
      login
    }
    axios.post(url, options)
      .then(resp => this.fetchUsers());
  }

  handleRoleChange(login, role, e) {
    e.stopPropagation();
    const url = `/auth/users/${login}/role`;
    const { promise } = this.state;
    const options = {
      cancelToken: promise.token,
      role
    }
    axios.put(url, options)
      .then(this.fetchUsers);
  }

  renderUser = (user) => {
    const { REACT_APP_COHORT: cohort } = process.env;
    const isEnrolled = user.cohorts.filter(c => c.code === cohort).length > 0;
    const verb = (isEnrolled) ? 'unenrol' : 'enrol';
    const isTeacher = user.role === 'teacher';
    const newRole = (isTeacher) ? 'student' : 'teacher';
    return (
      <User key={user.id} isEnrolled={isEnrolled} onClick={this.handleEnrolment.bind(this, user.login, verb)}>
        <img src={user.image} alt="user profile" width="100px" />
        {user.login}
        <RoleButton isTeacher={isTeacher} onClick={this.handleRoleChange.bind(this, user.login, newRole)}>{user.role}</RoleButton>
      </User>
    )
  }

  render() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { users, error, loading } = this.state;
    if (error) return <Error msg={error} />;
    if (loading) return <Loading />;
    return (
      <>
        <Helmet>
          <title>{process.env.REACT_APP_COHORT} - Enrolment</title>
        </Helmet>
        <h1>Enrol users in {cohort}</h1>
        <Grid>
          { users.map(this.renderUser) }
        </Grid>
      </>
    );
  }
}

export default Enrolment;