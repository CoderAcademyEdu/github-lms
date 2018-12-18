import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Modules extends Component {
  state = { modules: [] };

  componentDidMount() {
    const { REACT_APP_COHORT: cohort } = process.env;
    axios.get(`/api/${cohort}/modules`)
      .then(({ data }) => {
        this.setState({ modules: data })
      })
      .catch(error => console.log(error));
  }

  render() {
    const { modules } = this.state;
    return (
      <>
        { modules.map((module, i) => <Link key={i} to={`/modules/${module.name}`}>{module.name}</Link>) }
      </>
    );
  }
}

export default Modules;