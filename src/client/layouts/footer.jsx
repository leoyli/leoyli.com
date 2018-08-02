import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import { WebConfig } from '../utilities/contexts/index';


// styles
const StyledFooterContainer = styled.footer`
  background: rgba(245, 245, 245, 0.95);
  color: #666;
  font-size: small;
  min-height: 12em;

  & p:first-child {
    font-weight: bold;
  }

  & p a {
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
    color: ${({ hover }) => hover} !important;
    background-position: 0 0;
  }

  & svg {
    font-size: 2.5em;
    padding: .15em;
    transition: .25s;
  }
`;


// view
const IconLink = ({ color = '#333', hover = 'white', icon, ...rest }) => (
  <StyledAnchor color={color} hover={hover} {...rest}>
    <FontAwesomeIcon icon={icon} />
  </StyledAnchor>
);

const Footer = () => (
  <WebConfig.Consumer>
    {({ general: { siteName } }) => (
      <StyledFooterContainer>
        <div id="misc" className="container d-lg-flex text-justify pt-4 mt-5">
          <div className="col-lg-9" id="sitePolicy" role="contentinfo">
            <p id="copyright">
              {moment().format('YYYY')}
              &nbsp;&copy;&nbsp;
              {siteName}
            </p>
            <p id="licence">
              Except as otherwise noted, the content of this site is licensed under the
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="mx-1">
                CC BY-SA 4.0 Licence
              </a>
              , and code samples are licensed under the
              <a href="https://github.com/leoyli/leoyli.com/blob/master/LICENSE" className="mx-1">
                MIT License
              </a>
              .
            </p>
          </div>
          <div id="socialLinks" className="col-lg-3 text-lg-right pb-3" aria-label="socialMedia">
            <IconLink
              color="#333333"
              icon={['fab', 'github']}
              href="https://github.com/leoyli"
              title="GitHub"
            />
            <IconLink
              color="#0077B5"
              icon={['fab', 'linkedin']}
              href="https://www.linkedin.com/in/leoyli"
              title="LinkedIn"
            />
            <IconLink
              color="#3B5998"
              icon={['fab', 'facebook-square']}
              href="https://www.facebook.com/leo.yuxiu.li"
              title="Facebook"
            />
          </div>
        </div>
      </StyledFooterContainer>
    )}
  </WebConfig.Consumer>
);


// exports
export default Footer;
