import styled from 'styled-components';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// style
const StyledSectionContainer = styled.section`
  background: linear-gradient(
    90deg,
    ${({ color }) => color} 65%,
    ${({ color }) => color} 35%
  );
  color: white;
  padding: 5rem 0;
  min-height: 20rem;
  
  & a {
    font-size: 1.2rem;
    font-weight: 400;
    color: white;
    &:hover {
      color: #ddd;
    }
  }
`;

const StyledSectionHeader = styled.header`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: initial;

  .mainTitle {
    font-size: 5.5rem;
    font-weight: 700;
    margin: .5rem 0;
    @media only screen and (max-width: 576px) {
      font-size: 4rem;
    }
  }
  
  .subTitle {
    margin-bottom: 2rem;
  }
`;

const StyledSkillContainer = styled.div`
  span {
    align-items: center;
    border: .25rem solid white;
    border-radius: .75rem;
    cursor: pointer;
    display: inline-flex;
    font-size: 2rem;
    font-weight: 700;
    justify-content: center;
    margin: .5rem;
    text-align: center;
    height: 4rem;
    width: 4rem;
  }
`;


// components
const SectionHeader = ({ sup, main, sub }) => (
  <Grid.Row as={StyledSectionHeader}>
    <Grid.Column width={16}>
      <div className="superTitle">
        {sup}
      </div>
      <div className="mainTitle">
        {main}
      </div>
      <div className="subTitle">
        {sub}
      </div>
    </Grid.Column>
  </Grid.Row>
);

const SkillIcon = ({ icon, name }) => (
  icon
    // eslint-disable-next-line react/jsx-one-expression-per-line
    ? (<span><FontAwesomeIcon icon={['fab', name]} /></span>)
    // eslint-disable-next-line react/jsx-one-expression-per-line
    : (<span>{name}</span>)
);

const SkillTile = ({ icon, list }) => (
  <Grid.Column mobile={16} tablet={16} computer={5} as={StyledSkillContainer}>
    {list.map(name => (
      name
        ? (<SkillIcon key={name} icon={icon} name={name} />)
        : (<br key={Date.now} />)
    ))}
  </Grid.Column>
);


// view
const Section = ({ color, content: C, data = {} }) => (
  <StyledSectionContainer color={color}>
    <Grid stackable container columns="equal">
      <SectionHeader {...data.title} />
      <Grid.Row>
        {data.skill && <SkillTile {...data.skill} />}
        {C && <C content={data.content} />}
      </Grid.Row>
    </Grid>
  </StyledSectionContainer>
);


// exports
export default Section;
