import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

class Module extends Component {
  state = { lessons: [] };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module } = this.props.match.params;
    const url = `/api/${cohort}/modules/${module}`;
    const cachedContent = JSON.parse(localStorage.getItem(url));
    if (cachedContent) {
      this.setState({ lessons: cachedContent });
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({ promise: source });
    axios.get(url, { cancelToken: source.token })
      .then(({ data }) => {
        if (!cachedContent
          || !isEqual(data, cachedContent)) {
          localStorage.setItem(url, JSON.stringify(data));
          this.setState({ lessons: data })
        }
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { lessons } = this.state;
    const { module } = this.props.match.params;
    return (
      <div>
        { lessons.map((lesson, i) => <Link key={i} to={`/modules/${module}/${lesson.name}`}>{lesson.name}</Link>) }
      </div>
    );
  }
}

export default Module;