import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import { WebConfig } from '../../utilities/contexts';
import $style from './style.scss';


// components
const Index = () => (
  <WebConfig.Consumer>
    {({ siteName }) => (
      <footer className="mt-5 _-footer">
        <div id="misc" className="container d-lg-flex text-justify pt-4">
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
            <a href="https://github.com/leoyli" title="GitHub">
              <FontAwesomeIcon icon={['fab', 'github']} />
            </a>
            <a href="https://www.linkedin.com/in/leoyli" title="LinkedIn">
              <FontAwesomeIcon icon={['fab', 'linkedin']} />
            </a>
            <a href="https://www.facebook.com/leo.yuxiu.li" title="Facebook">
              <FontAwesomeIcon icon={['fab', 'facebook-square']} />
            </a>
          </div>
        </div>
      </footer>
    )}
  </WebConfig.Consumer>
);


// exports
export default Index;