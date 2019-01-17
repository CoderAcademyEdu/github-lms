import React, { Component } from 'react';
import axios from 'axios';
import frontmatter from 'front-matter';
import isEqual from 'lodash/isEqual';
import Loading from '../components/loading';
import Error from '../components/error';

class Challenge extends Component {
  state = { loading: true };

  fetchCachedContent() {
    const { url } = this.props;
    const cachedContent = JSON.parse(localStorage.getItem(url));
    if (cachedContent && cachedContent.body && cachedContent.fm) {
      this.setState({ body: cachedContent.body, fm: cachedContent.fm });
    }
  }

  fetchNewContent() {
    const { url } = this.props;
    const { promise } = this.state;
    axios.get(url, { cancelToken: promise.token })
      .then(({ data }) => {
        const { body, attributes: fm } = frontmatter(data);
        const { body: cachedBody, fm: cachedFm } = this.state;
        if (!cachedBody
          || !cachedFm
          || body !== cachedBody
          || !isEqual(fm, cachedFm)) {
            const newContent = { body, fm };
            localStorage.setItem(url, JSON.stringify(newContent));
            this.setState(newContent);
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

  componentDidMount() {
    this.fetchCachedContent();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({
      promise: source
    }, () => {
      this.fetchNewContent();
    });
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { body, fm, loading, error } = this.state;
    const Component = React.cloneElement(this.props.component, { body, fm });

    if (error) return <Error msg={error} />;
    if (loading) return <Loading />;

    return Component;
  }
}

export default Challenge;