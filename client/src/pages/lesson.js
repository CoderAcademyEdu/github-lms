import React, { Component } from 'react';
import axios from 'axios';
import frontmatter from 'front-matter';
import ReactMarkdown from 'react-markdown/with-html';
import isEqual from 'lodash/isEqual';
import Loading from '../components/loading';

class Lesson extends Component {
  state = {
    body: null,
    fm: null
  };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module, lesson } = this.props.match.params;
    const url = `/api/${cohort}/modules/${module}/${lesson}`;
    const cachedContent = JSON.parse(localStorage.getItem(url));
    if (cachedContent && cachedContent.body && cachedContent.attributes) {
      this.setState({ body: cachedContent.body, fm: cachedContent.attributes });
    }
    axios.get(url)
      .then(({ data }) => {
        const content = frontmatter(data);
        const { body, attributes: fm } = content;
        if (!cachedContent
          || body !== cachedContent.body
          || !isEqual(fm, cachedContent.attributes)) {
          localStorage.setItem(url, JSON.stringify(content));
          this.setState({ body, fm });
        }
      })
      .catch(error => console.log(error));
  }

  render() {
    const { body, fm } = this.state;
    return body && fm ? (
      <>
        <h1>{fm.title}</h1>
        { fm.lecture_video && <video controls="controls" src={`${fm.lecture_video}&html5=true`} /> }
        <ReactMarkdown
          source={body}
          escapeHtml={false}
        />
      </>
    ) : <Loading />;
  }
}

export default Lesson;