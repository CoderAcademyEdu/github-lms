import React, { Component } from 'react';
import axios from 'axios';

class Courses extends Component {
  state = { courses: [] };

  componentDidMount() {
    axios.get('/api/cohorts')
      .then(({ data }) => {
        console.log(data);
        this.setState({ courses: data })
      })
      .catch(error => console.log(error));
  }

  render() {
    const { courses } = this.state;
    return (
      <div>
        { courses.map(course => <p key={course.name}>{course.name}</p>) }
      </div>
    );
  }
}

export default Courses;