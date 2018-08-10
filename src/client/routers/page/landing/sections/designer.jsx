import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';


// modules
import Section from './section';


// styles
const StyledAside = styled.aside`
  text-align: right;
  @media only screen and (max-width: 576px) {
    text-align: left;
  }
  
  img {
    box-shadow: .5rem .5rem rgba(0, 0, 0, 0.1);
    margin: .5rem;
    width: 22.5%;
    @media only screen and (max-width: 576px) {
      width: 40%;
    }
  }
`;


// components
const Designer = ({ content = [] }) => (
  <Fragment>
    <Grid.Column width={1} />
    <Grid.Column as={StyledAside}>
      {content.map(poster => (
        !poster
          ? (
            <br key={Date.now} />
          )
          : (
            <Link to="/blog/artworks-posters">
              <img src={`/static/media/posters/${poster}.jpg`} alt={`Artworks @${poster}`} />
            </Link>
          )
      ))}
    </Grid.Column>
  </Fragment>
);


// view
const Landing = ({ data }) => (
  <Section color="#55a745" content={Designer} data={data} />
);


// exports
export default Landing;
