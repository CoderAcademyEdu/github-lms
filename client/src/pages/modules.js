import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';

const Card = styled.div`
  padding: 20px;
  background-color: #cfcfcf;
  font-size: 16px;
  a, a:visited {
    color: #333;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: 10px;
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
        // console.log(error)
        // DO SOMETHING HERE
        // this.setState({ error: error.response.message })
      });
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { modules } = this.state;
    return (
      <Grid>
        {
          modules.map((module, i) => {
            return (
              <Card key={i}>
                <Link to={`/modules/${module.name}`}>
                  {module.name}
                </Link>
              </Card>
            )
          })
        }
      </Grid>
    );
  }
}

export default Modules;