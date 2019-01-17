import React from 'react';
import LessonTemplate from '../templates/lessonTemplate';
import Cached from '../containers/cached';

const Lesson = (props) => {
  const { REACT_APP_COHORT: cohort } = process.env;
  const { module, lesson } = props.match.params;
  const url = `/api/${cohort}/modules/${module}/${lesson}`;
  return (
    <Cached url={url} component={<LessonTemplate />} />
  );
}

export default Lesson;