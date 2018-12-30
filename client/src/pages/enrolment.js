import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../components/loading';
import styled from 'styled-components';

const Student = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.isEnrolled ? '#7affc6' : ''};
  padding: 20px;
  :hover {
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

class Enrolment extends Component {
  state = { students: [] };

  fetchStudents() {
    const url = `/api/students`;
    const { promise } = this.state;
    axios.get(url, { cancelToken: promise.token })
      .then(({ data }) => {
        const students = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return (dateA > dateB) ? -1 : 1;
        });
        this.setState({ students });
      })
      .catch(error => {
        if (error.response.status === 403) {
          const msg = "You are not authorised to modify enrolments 🙂";
          this.setState({ error: msg });
        }
      });
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({ promise: source }, this.fetchStudents);
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
      .then(resp => this.fetchStudents());
  }

  renderStudent = (student) => {
    const { REACT_APP_COHORT: cohort } = process.env;
    const isEnrolled = student.cohorts.filter(c => c.code === cohort).length > 0;
    const verb = (isEnrolled) ? 'unenrol' : 'enrol';
    return (
      <Student key={student.id} isEnrolled={isEnrolled} onClick={this.handleEnrolment.bind(this, student.login, verb)}>
        <img src={student.image} alt="Student profile" width="100px" />
        {student.login}
      </Student>
    )
  }

  render() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { students, error } = this.state;
    return (
      <>
        {error && <p>{error}</p>}
        {
          (students.length > 0)
            ? (
              <>
                <h1>Enrol students in {cohort}</h1>
                <Grid>
                  { students.map(this.renderStudent) }
                </Grid>
              </>
            )
            : (!error) ? <Loading /> : null
        }
      </>
    );
  }
}

export default Enrolment;