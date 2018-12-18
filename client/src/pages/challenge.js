import React, { Component } from 'react';
import axios from 'axios';
import fm from 'front-matter';
import ReactMarkdown from 'react-markdown/with-html';

class Challenge extends Component {
  state = { challenge: null };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const { module, challenge } = this.props.match.params;
    axios.get(`/api/${cohort}/challenges/${module}/${challenge}`)
      .then(({ data }) => {
        const content = fm(data);
        this.setState({ challenge: content.body });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { challenge } = this.state;
    return (
      <>
        <ReactMarkdown
          source={challenge}
          escapeHtml={false}
        />
      </>
    );
  }
}

export default Challenge;