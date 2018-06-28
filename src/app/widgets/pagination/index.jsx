import qs from 'qs';
import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// style
import style from './style.scss';


// magic-strings
const NAMESPACE = {
  queryName: 'page',
  className: {
    leader: '_-pagination',
    active: '_-pagination--active',
    icon: '_-pagination__icon',
  },
};


// modifiers
const populatePageItem = ({ now = 1, end = 0 } = {}, url = '/', search = '') => {
  const pp = [];
  const query = qs.parse(search, { ignoreQueryPrefix: true, parseArrays: false, depth: 0 });
  const max = Math.min(Math.max(9, now + 4), end);
  const min = Math.max(max - 8, 1);
  const navLink = (i) => (
    <NavLink
      key={`pp-${i}`}
      to={`${url}?${qs.stringify({ ...query, [NAMESPACE.queryName]: i })}`}
      className={NAMESPACE.className.leader}
      activeClassName={NAMESPACE.className.active}
      isActive={() => i === now}
    >{i}
    </NavLink>
  );
  if (min !== 1) {
    pp.push(
      navLink(1),
      (<FontAwesomeIcon
        key="pp-to-head"
        icon="angle-double-right"
        rotation={180}
        className={NAMESPACE.className.icon}
      />),
    );
  }
  if (end) for (let i = min; i <= max; i += 1) pp.push(navLink(i));
  if (max !== end) {
    pp.push((<FontAwesomeIcon
      key="pp-to-end"
      icon="angle-double-right"
      className={NAMESPACE.className.icon}
    />), navLink(end));
  }
  return pp;
};


// components
const Pagination = withRouter(({ meta, match, location }) => {
  if (meta) {
    return (
      <nav id="pagination" className="mt-5">
        {populatePageItem(meta, match.url, location.search)}
      </nav>
    );
  }
  return null;
});


// exports
export default Pagination;
