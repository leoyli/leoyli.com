import moment from 'moment';
import styled from 'styled-components';
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Grid } from 'semantic-ui-react';


// modules
import { WebConfig } from '../../utilities/contexts';


// styles
const StyledFooterContainer = styled.footer`
  background: rgba(245, 245, 245, 0.95);
  color: #666;
  font-size: small;
  margin-top: 6rem;
  min-height: 14rem;
  padding-top: 2rem;
  
  & .one.column.row {
    padding: 0;
  }

  & #social-connect {
    @media only screen and (min-width: 768px) {
      text-align: right;
    }
  }
  
  & #declaration a {
    color: #333;
    text-decoration: underline;
    &:hover {
      color: #666;
    }
  }
`;

const StyledAnchor = styled.a`
  background: linear-gradient(
    to bottom,
    ${({ color }) => color},
    ${({ color }) => color} 50%, 
    transparent 50%,
    transparent
  ) 0 -100%;
  background-size: 100% 200%;
  color: #333;
  display: inline-block;
  height: 2.5em;
  margin: 0 .2em;
  text-align: center;
  text-decoration: none;
  transition: background-position .2s ease-in;
  width: 2.5em;
  &:hover {
    background-position: 0;
    color: ${({ hover }) => hover} !important;
  }

  & svg {
    font-size: 2.5em;
    padding: .15em;
    transition: .25s;
  }
`;


// data
const licence = 'Except as otherwise noted, the content of this site is licensed '
  + 'under the [CC BY-SA 4.0 Licence](https://creativecommons.org/licenses/by-sa/4.'
  + '0/), and code samples are licensed under the [MIT License](https://github.com/'
  + 'leoyli/leoyli.com/blob/master/LICENSE).';

const socialLinks = [
  {
    key: 'GitHub',
    title: 'GitHub',
    color: '#333333',
    icon: ['fab', 'github'],
    href: 'https://github.com/leoyli',
  },
  {
    key: 'LinkedIn',
    title: 'LinkedIn',
    color: '#0077B5',
    icon: ['fab', 'linkedin'],
    href: 'https://www.linkedin.com/in/leoyli',
  },
  {
    key: 'Facebook',
    title: 'Facebook',
    color: '#3B5998',
    icon: ['fab', 'facebook-square'],
    href: 'https://www.facebook.com/leo.yuxiu.li',
  },
];


// component
const IconLink = ({ color = '#333', hover = 'white', icon, ...rest }) => (
  <StyledAnchor color={color} hover={hover} {...rest}>
    <FontAwesomeIcon icon={icon} />
  </StyledAnchor>
);


// view
const Footer = () => (
  <WebConfig.Consumer>
    {({ general: { siteName } }) => (
      <StyledFooterContainer>
        <Grid divided="vertically" as={Container}>
          <Grid.Column id="copyright" computer={12} tablet={12} mobile={16} verticalAlign="middle">
            <strong>
              {moment().format('YYYY')}
              &nbsp;&copy;&nbsp;
              {siteName}
            </strong>
          </Grid.Column>
          <Grid.Column id="social-connect" computer={4} tablet={4} mobile={16}>
            {socialLinks.map(props => (<IconLink {...props} />))}
          </Grid.Column>

          <Grid.Row columns={1}>
            <Grid.Column id="declaration">
              <Markdown>
                {licence}
              </Markdown>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledFooterContainer>
    )}
  </WebConfig.Consumer>
);


// exports
export default Footer;
