import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { convertFilePathToDisplay } from '../utils/pathToDisplay';
import { Card } from '../styles/shared';
import Loading from '../components/loading';
import Error from '../components/error';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  a, a:visited {
    color: #333;
  }
`;

class Modules extends Component {
  state = {
    loading: true,
    modules: []
  };

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
          this.setState({ modules: data });
        }
      })
      .catch(error => {
        let msg = "ERROR!";
        if (error.response && error.response.status === 403) {
          msg = "You have not been enrolled in this cohort. Please ask a teacher to enrol you 🙂";
        }
        this.setState({ error: msg });
      })
      .finally(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    const { promise } = this.state;
    promise && promise.cancel('component was unmounted');
  }

  render() {
    const { modules, error, loading } = this.state;
    if (error) return <Error msg={error} />;
    if (loading) return <Loading />;
    return (
      <>
        <Helmet>
          <title>{process.env.REACT_APP_COHORT} - Modules</title>
        </Helmet>
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