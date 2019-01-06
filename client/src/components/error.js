import React from 'react';
import { FullScreen } from '../styles/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Message = styled.p`
  font-size: 16px;
`;

const Error = ({ msg }) => {
  const { REACT_APP_COHORT: cohort } = process.env;
  document.title = `${cohort} - Error`;

  return (
    <FullScreen>
      <FontAwesomeIcon icon="ambulance" size="2x" />
      <Message>{ msg }</Message>
    </FullScreen>
  );
};

export default Error;