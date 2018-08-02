import styled from 'styled-components';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import Toggle from '../utilities/toggle/index';


// style
const StyledSearchBarContainer = styled.div`
  display: inline;
  float: unset;
  position: relative;
  top: .25em;
  z-index: 1098;
  
  & svg {
    cursor: pointer;
  }
`;

const StyledSearchFormContainer = styled.div`
  background: rgba(30, 30, 30, .95);
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
  padding-bottom: .8em;
  padding-top: .8em;
  position: fixed;
  text-align: left;
  top: 0; left: 0;
  width: 100%;
  z-index: 1100;
  
  & input {
    background: none;
    border: none;
    color: white;
    font-size: larger;
    width: 95%;
    &:focus {
      outline: none;
    }
  }

  & button {
    background: none;
    border: none;
    color: #999;
    float: right;
    position: fixed;
    padding: 5px;
    &:hover {
      color: white;
    }
  }
`;


// view
const SearchBarView = ({ onSubmit }) => (
  <Toggle>
    {({ controller, monitored, isHidden }) => {
      return (
        <StyledSearchBarContainer>
          <FontAwesomeIcon icon="search" onClick={controller} className="mr-2" />
          <StyledSearchFormContainer isHidden={isHidden} innerRef={monitored}>
            <form autoComplete="off" onSubmit={onSubmit} className="container">
              <input name="search" aria-label="search" placeholder="Search keywords" />
              <button type="submit">
                <FontAwesomeIcon icon="sign-in-alt" />
              </button>
            </form>
          </StyledSearchFormContainer>
        </StyledSearchBarContainer>
      );
    }}
  </Toggle>
);


// control
class SearchBar extends PureComponent {
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
