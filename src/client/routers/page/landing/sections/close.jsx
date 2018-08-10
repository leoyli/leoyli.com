import styled from 'styled-components';
import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


// styles
const StyledSectionContainer = styled.h1`
  h1 {
    font-size: 3rem;
  }
  
  .big.button {
    @media only screen and (max-width: 992px) {
      display: block !important;
      margin: .25rem 0;
      width: 100%;
    }
    
    &.yellow {
    color: #333;
      &:hover {
        color: #000;
      }
    }
  }
`;


// view
const Close = () => (
  <Segment basic size="huge" padded="very" textAlign="center" as={StyledSectionContainer}>
    <h1>
      <span role="img" aria-label="Footer Emoji">
        🤔 🙌 🎉
      </span>
    </h1>
    <h2>
      Look for an ideal partner?!
      <br />
      Let us work together and make a better tomorrow!
    </h2>
    <Button color="yellow" size="big" icon labelPosition="right" as={Link} to="/blog/about">
      Learn More
      <Icon name="right arrow" />
    </Button>
    <Button color="blue" size="big" icon labelPosition="right" as={Link} to="/blog/cv">
      My Résumé!
      <Icon name="right arrow" />
    </Button>
  </Segment>
);


// exports
export default Close;
