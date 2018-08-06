import styled from 'styled-components';
import React  from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Icon } from 'semantic-ui-react';


// style
const StyledIntroContainer = styled.div`
  background: linear-gradient(90deg, #7db00e 65%, #232a3d 35%);
  color: white;
  @media only screen and (max-width: 992px) {
    background: #7db00e;
  }

  .grid.container {
    height: 37.5rem;
    margin: 0;
  }
  
  .big.button {
    @media only screen and (max-width: 992px) {
      display: block !important;
      margin: .25rem 0;
      width: 100%;
    }
    
    &.blue {
      display: none;
    }
    
    &.yellow {
    color: #333;
      &:hover {
        color: #000;
      }
    }
  }
  
  .middle.aligned.column {
    z-index: 1001;
    & h1 {
      font-size: 4rem;
    }
  }
  
  .stretched.computer.only.column {
    position: relative;
    background: #232a3d;
    &::after {
      background: #232a3d;
      content: '';
      display: block;
      height: 100%;
      left: -5rem;
      position: absolute;
      top: 0;
      transform: skewX(-10deg);
      width: 50%;
      z-index: 1000;
    }
    
    & span {
      bottom: 7.5rem;
      position: absolute;
      z-index: 1001;
    }
    
    & a {
      color: white;
      &:hover {
        color: #ddd;
      }
    }
  }
`;


// components
const Intro = () => (
  <StyledIntroContainer as="section">
    <Grid container columns="equal">
      <Grid.Column verticalAlign="middle">
        <h1>
          Leo Y. Li
        </h1>
        <h2 className="mb-4">
          A self-motivated web developer solves problems with elegant code!
        </h2>
        <Button color="yellow" size="big" icon labelPosition="right" as={Link} to="/blog/about">
          Learn More
          <Icon name="right arrow" />
        </Button>
        <Button color="blue" size="big" icon labelPosition="right" as={Link} to="/blog/cv">
          My Résumé!
          <Icon name="right arrow" />
        </Button>
      </Grid.Column>

      <Grid.Column only="computer" width={2} />
      <Grid.Column stretched only="computer" width={6} textAlign="right">
        <span>
          <Link to="/blog/cv">
            <h1>
              Have a look on my résumé!
            </h1>
            <img src="/static/media/cv.png" alt="CV" />
          </Link>
        </span>
      </Grid.Column>
    </Grid>
  </StyledIntroContainer>
);


// exports
export default Intro;
