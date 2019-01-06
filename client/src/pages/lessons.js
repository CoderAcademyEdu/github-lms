import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { convertFilePathAndExtensionToDisplay } from '../utils/pathToDisplay';
import { Card } from '../styles/shared';
import Loading from '../components/loading';
import Error from '../components/error';

class Lessons extends Component {
  state = {
    lessons: [],
    loading: true
  };

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
        document.title = `${cohort} - Lessons`;
        if (!cachedContent
          || !isEqual(data, cachedContent)) {
          localStorage.setItem(url, JSON.stringify(data));
          this.setState({ lessons: data })
        }
      })
      .catch(error => {
        let msg = "ERROR!";
        if (error.response && error.response.status === 403) {
          msg = "You have not been enrolled in this cohort. Please ask a teacher to enrol you 🙂";
        }
        this.setState({ error: msg });
      })
      .finally(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { lessons, loading, error } = this.state;
    const { module } = this.props.match.params;
    if (error) return <Error msg={error} />;
    if (loading) return <Loading />;
    return (
      lessons.map((lesson, i) => (
        <Link key={i} to={`/modules/${module}/${lesson.name}`}>
          <Card>
            {convertFilePathAndExtensionToDisplay(lesson.name)}
          </Card>
        </Link>
      ))
    );
  }
}

export default Lessons;