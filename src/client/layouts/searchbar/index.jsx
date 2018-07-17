import React, { Component } from 'react';
import { withRouter } from 'react-router';


// modules
import SearchBarView from './view';


// components
class SearchBar extends Component {
  _handleOnSubmitSearchQuery = (e) => {
    e.preventDefault();
    const { location, history } = this.props;
    if (e.target.search.value && location.pathname !== `/search/${e.target.search.value}`) {
      history.push(`/search/${e.target.search.value}`);
    }
  };

  render = () => (<SearchBarView onSubmit={this._handleOnSubmitSearchQuery} />);
}


// exports
const Search = withRouter(SearchBar);
export default Search;
