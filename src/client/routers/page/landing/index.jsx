import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';


// modules
import Intro from './intro';
import Developer from './developer';
import Designer from './designer';
import Marketer from './marketer';
import style from './style.scss';


// components
const Landing = () => (
  <Fragment>
    <Intro />
    <Developer />
    <Designer />
    <Marketer />
  </Fragment>
);


// exports
export default Landing;
