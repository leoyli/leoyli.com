import React from 'react';
import { Grid } from 'semantic-ui-react';


// modules
import Section from './section';


// component
const Marketer = () => (
  <Grid.Column>
    &nbsp;
  </Grid.Column>
);


// view
const Landing = ({ data }) => (
  <Section color="#ff9800" content={Marketer} data={data} />
);


// exports
export default Landing;
