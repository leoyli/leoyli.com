import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// style
import $style from './style.scss';


// magic-strings
const NAMESPACE = {
  eventList: ['click', 'scroll', 'keyup'],
  className: {
    hidden: '_-search__bar--hidden',
  },
};


// view
const SearchView = ({ onClick, onSubmit }) => (
  <div id="searchPanel" className="mr-2 _-search">
    <FontAwesomeIcon icon="search" onClick={onClick} />
    <div id="searchBar" className="_-search__bar _-search__bar--hidden">
      <form autoComplete="off" className="container" onSubmit={onSubmit}>
        <input
          id="searchInput"
          aria-label="search"
          name="search"
          placeholder="Search keywords"
        />
        <button><FontAwesomeIcon icon="sign-in-alt" /></button>
      </form>
    </div>
  </div>
);


// control
class Search extends Component {
  _stopPropagation = (e) => e.stopPropagation();

  _handleSearchExitEvent = (e) => {
    if (NAMESPACE.eventList.includes(e.type)
        && (!e.keyCode || e.keyCode === 27)) {
      document.getElementById('searchInput').value = '';
      document.getElementById('searchBar').classList.add(NAMESPACE.className.hidden);
      NAMESPACE.eventList.forEach(event => window.removeEventListener(event, this._handleSearchExitEvent));
    }
  };

  _handleOnClickSearch = (e) => {
    e.stopPropagation();
    document.getElementById('searchBar').classList.remove(NAMESPACE.className.hidden);
    document.getElementById('searchBar').addEventListener('click', this._stopPropagation);
    NAMESPACE.eventList.forEach(event => window.addEventListener(event, this._handleSearchExitEvent));
  };

  _handleOnSubmitSearchQuery = (e) => {
    e.preventDefault();
    if (e.target.search.value && this.props.location.pathname !== `/search/${e.target.search.value}`) {
      this.props.history.push(`/search/${e.target.search.value}`);
    }
  };

  render = () => (
    <SearchView onClick={this._handleOnClickSearch} onSubmit={this._handleOnSubmitSearchQuery} />
  );
}


// exports
const SearchBar = withRouter(Search);
export default SearchBar;
