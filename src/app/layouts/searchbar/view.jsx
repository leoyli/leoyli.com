import classNames from 'classnames';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import Toggle from '../../utilities/toggle';
import $style from './style.scss';


// components
const SearchBarView = ({ onSubmit }) => (
  <Toggle>
    {({ controller, monitored, isHidden }) => {
      const monitoredClassName = classNames({
        '_-search__bar': true,
        '_-search__bar--hidden': isHidden,
      });
      return (
        <div id="searchPanel" className="mr-2 _-search">
          <FontAwesomeIcon icon="search" onClick={controller} />
          <div id="searchBar" className={monitoredClassName} ref={monitored}>
            <form autoComplete="off" className="container" onSubmit={onSubmit}>
              <input id="searchInput" name="search" aria-label="search" placeholder="Search keywords" />
              <button type="button">
                <FontAwesomeIcon icon="sign-in-alt" />
              </button>
            </form>
          </div>
        </div>
      );
    }}
  </Toggle>
);


// exports
export default SearchBarView;
