import React from 'react';
import ChallengeTemplate from '../templates/challengeTemplate';
import Cached from '../containers/cached';

const Challenge = (props) => {
  const { REACT_APP_COHORT: cohort } = process.env;
  const { module, challenge } = props.match.params;
  const url = `/api/${cohort}/challenges/${module}/${challenge}`;
  return (
    <Cached url={url} component={<ChallengeTemplate />} />
  );
}

export default Challenge;