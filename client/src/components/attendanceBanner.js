import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { isWeekend, isAfter, isBefore, setMinutes, setHours, setSeconds, isSameDay } from 'date-fns';
import { isAuthenticated, isStudent } from '../utils/authentication';

const Signin = styled.button`
  padding: 30px 0;
  background-color: #ff614a;
  color: #fff;
  font-size: 20px;
  :hover {
    cursor: pointer;
  }
`;

const Banner = styled.p`
  margin: 0;
  padding: 30px 0;
  background-color: #ff614a;
  color: #fff;
  font-size: 20px;
  text-align: center;
`;

class AttendanceBanner extends Component {
  state = { loadingAttendance: true };

  fetchLastSignin() {
    const url = `/api/attendance/last-signin`;
    axios.get(url)
      .then(resp => {
        const lastSignin = resp.data.timeIn && new Date(resp.data.timeIn);
        this.setState({ lastSignin });
      })
      .catch(err => console.log(err))
      .finally(() => this.setState({ loadingAttendance: false }))
  }

  componentDidMount() {
    this.fetchLastSignin();
  }

  handleSignin = (e) => {
    this.setState({ loading: true });
    const url = `/api/attendance/signin`;
    const now = new Date();
    const data = { date: now };
    axios.post(url, data)
      .then(resp => this.fetchLastSignin())
      .catch(err => {
        err.response.status === 405
          ? this.setState({ error: 'It appears you are not on campus. Please connect to the wifi and try again.' })
          : this.setState({ error: 'an error occurred' });
      })
      .finally(() => this.setState({ loading: false }));
  }

  currentTimeIsInClassHours() {
    const now = new Date();
    const startOfClass = setSeconds(setMinutes(setHours(now, 8), 0), 0);
    const endOfClass = setSeconds(setMinutes(setHours(now, 18), 0), 0);
    return !isWeekend(now) && isAfter(now, startOfClass) && isBefore(now, endOfClass);
  }

  userHasNotSignedInToday() {
    const { lastSignin } = this.state;
    const now = new Date();
    return !lastSignin || !isSameDay(now, lastSignin);
  }

  shouldDisplaySigninBanner() {
    const { loadingAttendance } = this.state;
    return !loadingAttendance
      && isAuthenticated()
      && isStudent()
      && this.currentTimeIsInClassHours()
      && this.userHasNotSignedInToday();
  }

  render() {
    const { error, loading } = this.state;
    if (error) { return <Banner>{error}</Banner>; }
    if (loading) { return <Banner>signing in...</Banner>; }
    return this.shouldDisplaySigninBanner()
      ? <Signin onClick={this.handleSignin}>You have not signed in today. Click to sign in.</Signin>
      : null;
  }
}

export default AttendanceBanner;