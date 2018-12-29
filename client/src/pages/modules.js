import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { convertFilePathToDisplay } from '../utils/pathToDisplay';
import { Card } from '../styles/shared';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: 10px;
  a, a:visited {
    color: #333;
  }
`;

class Modules extends Component {
  state = { modules: [] };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    const url = `/api/${cohort}/modules`;
    const cachedContent = JSON.parse(localStorage.getItem(url));
    if (cachedContent) {
      this.setState({ modules: cachedContent });
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.setState({ promise: source });
    axios.get(url, { cancelToken: source.token })
      .then(({ data }) => {
        if (!cachedContent
          || !isEqual(data, cachedContent)) {
          localStorage.setItem(url, JSON.stringify(data));
          this.setState({ modules: data })
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          const msg = "You have not been enrolled in this cohort. Please ask a teacher to enrol you 🙂";
          this.setState({ error: msg });
        }
      });
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { modules, error } = this.state;
    return (
      <>
        {error && <p>{error}</p>}
        <Grid>
          {
            modules.map((module, i) => {
              return (
                <Link key={i} to={`/modules/${module.name}`}>
                  <Card>
                    {convertFilePathToDisplay(module.name)}
                  </Card>
                </Link>
              )
            })
          }
        </Grid>
      </>
    );
  }
}

export default Modules;