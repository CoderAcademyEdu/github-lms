import React, { Component } from 'react';
import axios from 'axios';

class Lesson extends Component {
  state = { lesson: null };

  componentDidMount() {
    axios.get('/api/M0218/modules/05_MERN/40_fetch_and_promises.md')
      .then(({ data }) => {
        console.log(data);
        this.setState({ lesson: data })
      })
      .catch(error => console.log(error));
  }

  render() {
    const { lesson } = this.state;
    console.log(lesson)
    return (
      <div>
        hi
      </div>
    );
  }
}

export default Lesson;