import styled from 'styled-components';

const Card = styled.div`
  padding: 40px;
  background-color: #f3f3f3;
  color: #555;
  font-size: 16px;
  a, a:visited {
    color: #333;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 3px 7px 10px -6px rgba(194,186,194,1);
  &:hover {
    transform: scale(1.05);
  }
  transition: transform .1s ease-in-out;
`;

const FullScreen = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const Rotating = styled.img`
  animation: github-logo-spin infinite 1.5s linear;
  @keyframes github-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export {
  Card,
  FullScreen,
  Rotating
};