import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';


// modules
import Section from './section';


// component
const Developer = ({ content = [] }) => {
  return content.map((article) => (
    <Grid.Column key={article.featured}>
      <Link to={article.to}>
        <img src={article.featured} alt={article.title} />
        <br />
        {article.title}
      </Link>
    </Grid.Column>
  ));
};


// view
const SectionDeveloper = ({ data }) => (
  <Section color="#65a2c3" content={Developer} data={data} />
);


// exports
export default SectionDeveloper;
