import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { Helmet } from 'react-helmet';

const ChallengeTemplate = (props) => {
  const { fm, body } = props;
  return (
    <>
      <Helmet>
        <title>{process.env.REACT_APP_COHORT} - {fm.title}</title>
      </Helmet>
      { fm && fm.title && <h1>{fm.title}</h1> }
      { body &&
        <ReactMarkdown
          source={body}
          escapeHtml={false}
        />
      }
    </>
  );
}

export default ChallengeTemplate;