import React, { Component } from 'react';
import axios from 'axios';
import frontmatter from 'front-matter';
import ReactMarkdown from 'react-markdown/with-html';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import isEqual from 'lodash/isEqual';
import Loading from '../components/loading';
import Error from '../components/error';

class Lesson extends Component {
  state = {
    body: null,
    fm: null,
    loading: true
  };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module, lesson } = this.props.match.params;
    const url = `/api/${cohort}/modules/${module}/${lesson}`;
    const cachedContent = JSON.parse(localStorage.getItem(url));
    if (cachedContent && cachedContent.body && cachedContent.attributes) {
      this.setState({ body: cachedContent.body, fm: cachedContent.attributes });
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({ promise: source });
    axios.get(url, { cancelToken: source.token })
    .then(({ data }) => {
      const content = frontmatter(data);
      const { body, attributes: fm } = content;
      if (fm && fm.title) document.title = `${cohort} - ${fm.title}`;
      if (!cachedContent
        || body !== cachedContent.body
        || !isEqual(fm, cachedContent.attributes)) {
          localStorage.setItem(url, JSON.stringify(content));
          this.setState({ body, fm });
        }
      })
      .catch(error => {
        let msg = "ERROR!";
        if (error.response && error.response.status === 403) {
          msg = "You have not been enrolled in this cohort. Please ask a teacher to enrol you 🙂";
        }
        this.setState({ error: msg });
      })
      .finally(() => this.setState({ loading: false }))
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  renderFrontMatter() {
    const { title, lecture_video } = this.state.fm;
    return (
      <>
        { title && <h1>{title}</h1> }
        { lecture_video &&
            <YouTubePlayer
              url={lecture_video}
              controls
              width="100%"
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
        }
      </>
    )
  }

  render() {
    const { body, fm, loading, error } = this.state;
    if (error) return <Error msg={error} />;
    if (loading) return <Loading />;
    return (
      <>
        { fm && this.renderFrontMatter() }
        { body &&
            <ReactMarkdown
              source={body}
              escapeHtml={false}
            />
        }
      </>
    );
  }
}

export default Lesson;