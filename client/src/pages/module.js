import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Module extends Component {
  state = { lessons: [] };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module } = this.props.match.params;
    axios.get(`/api/${cohort}/modules/${module}`)
      .then(({ data }) => {
        this.setState({ lessons: data })
      })
      .catch(error => console.log(error));
  }

  render() {
    const { lessons } = this.state;
    const { module } = this.props.match.params;
    return (
      <>
        { lessons.map((lesson, i) => <Link key={i} to={`/modules/${module}/${lesson.name}`}>{lesson.name}</Link>) }
      </>
    );
  }
}

export default Module;