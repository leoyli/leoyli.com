import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// components
const Footer = ({ _$CONFIG }) => (
  <footer className="mt-5 _-footer">
    <div id="misc" className="container d-lg-flex text-justify pt-4">
      <div className="col-lg-9" id="sitePolicy" role="contentinfo">
        <p id="copyright">2017&nbsp;-&nbsp;{moment().format('YYYY')}&nbsp;&copy;&nbsp;{_$CONFIG.siteName}</p>
        <p id="licence">
          Except as otherwise noted, the content of this site is licensed under the&nbsp;
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0 Licence</a>,
          and code samples are licensed under the&nbsp;
          <a href="https://github.com/leoyli/leoyli.com/blob/master/LICENSE">MIT License</a>.
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
);


// exports
export default Footer;
