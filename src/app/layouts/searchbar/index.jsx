import classNames from 'classNames';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import Toggle from '../../utilities/toggle';
import $style from './style.scss';


// view
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


// control
class SearchBar extends Component {
  _handleOnSubmitSearchQuery = (e) => {
    e.preventDefault();
    const { location, history } = this.props;
    if (e.target.search.value && location.pathname !== `/search/${e.target.search.value}`) {
      history.push(`/search/${e.target.search.value}`);
    }
  };

  render = () => (
    <SearchBarView onSubmit={this._handleOnSubmitSearchQuery} />
  );
}


// exports
const Search = withRouter(SearchBar);
export default Search;
