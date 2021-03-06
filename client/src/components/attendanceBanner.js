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
    const { REACT_APP_COHORT: cohort } = process.env;
    const url = `/api/${cohort}/attendance/last-signin`;
    axios.get(url)
      .then(resp => {
        const lastSignin = resp.data.timeIn && new Date(resp.data.timeIn);
        this.setState({ lastSignin });
      })
      .catch(err => console.log(err))
      .finally(() => this.setState({ loadingAttendance: false }))
  }

  componentDidMount() {
    this.shouldDisplaySigninBanner() && this.fetchLastSignin();
  }

  handleSignin = async (e) => {
    this.setState({ loading: true });
    const { REACT_APP_COHORT: cohort } = process.env;
    const url = `/api/${cohort}/attendance/signin`;
    const now = new Date();
    const { data: ip } = await axios.get('https://api.ipify.org');
    const data = {
      date: now,
      ip
    };
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
    return isAuthenticated()
      && isStudent()
      && this.currentTimeIsInClassHours()
      && this.userHasNotSignedInToday();
  }

  render() {
    const { error, loading, loadingAttendance } = this.state;
    if (error) { return <Banner>{error}</Banner>; }
    if (loading) { return <Banner>signing in...</Banner>; }
    return (!loadingAttendance && this.shouldDisplaySigninBanner())
      ? <Signin onClick={this.handleSignin}>You have not signed in today. Click to sign in.</Signin>
      : null;
  }
}

export default AttendanceBanner;