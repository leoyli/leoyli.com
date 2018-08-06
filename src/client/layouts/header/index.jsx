import moment from 'moment';
import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Label } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import { AuthState } from '../../utilities/contexts';
import ConfirmModal from './confirm-modal';


// style
const StyledHeaderPostEditMenu = styled.span`
  @media only screen and (min-width: 768px) {
    display: inline-block;
    float: right;
  }
  display: none;
  
  & button {
    background: none;
    border: none;
    margin: 0;
    padding: 0;
  }

  & svg {
    background: whitesmoke;
    border-radius: .2em;
    color: #333;
    cursor: pointer;
    font-size: 2em;
    margin-top: .75rem;
    margin-right: .5rem;
    opacity: .9;
    padding: .2em;
    transition: .25s;
    &:hover {
      color: whitesmoke;
      background: dimgray;

      &[data-icon="eraser"] {
        background: tomato;
      }

      &[data-icon="pencil-alt"] {
        background: dodgerblue;
      }
    }
  }
`;

const StyledHeader = styled.header`
  background: #232a3d no-repeat center ${({ featured = '' }) => `url('${featured}')`};
  background-size: cover;
  margin-top: 1rem;
  padding-bottom: 2rem;
  position: relative;
  z-index: 1090;
  
  & h1 {
    font-size: 2.5rem;
    text-shadow: 3px 3px rgba(0, 0, 0, .25);
  }
  
  & .grid.container {
    height: ${({ featured }) => (featured ? '22.5rem' : '15rem')};
    &.inverted {
      color: white;
    }
  }
`;


// components
const HeaderPostEditItem = {
  Edit: (props) => (<FontAwesomeIcon {...props} icon="pencil-alt" />),
  Erase: (props) => (<FontAwesomeIcon {...props} icon="eraser" />),
};


// view
// // general -> isPost -> isSignedIn
const HeaderPostEditMenu = ({ post, history }) => (
  <AuthState.Consumer>
    {({ isSignedIn }) => isSignedIn && (
      <StyledHeaderPostEditMenu className="manage">
        <Link to={{ pathname: `/blog/${post._id}/edit`, state: { post } }}>
          <HeaderPostEditItem.Edit />
        </Link>
        <ConfirmModal trigger={HeaderPostEditItem.Erase} post={post} history={history} />
      </StyledHeaderPostEditMenu>
    )}
  </AuthState.Consumer>
);

// // general -> isPost
const HeaderPostMeta = ({ post: { author, category, tags, time }, post, history }) => (
  <Grid.Row column={2}>
    <Grid.Column width={10}>
      <Label size="large" color="grey" image>
        <img src="/static/media/icon.png" alt={author.nickname} />
        {author.nickname}
      </Label>
      <Label size="large" color="blue" image>
        <Icon name="book" />
        {category.toUpperCase()}
        <Label.Detail as="time" dateTime={time._created}>
          {`@ ${moment(time._created).format('MM/DD, YY')}`}
        </Label.Detail>
      </Label>
      <HeaderPostEditMenu post={post} history={history} />
    </Grid.Column>
  </Grid.Row>
);

// // general
const Header = ({ inverted = true, title, subtitle, featured, post, history }) => (
  <StyledHeader featured={featured}>
    <Grid inverted={inverted} container>
      <Grid.Column width={16} verticalAlign="bottom">
        <h1>
          {title}
          {subtitle && ` - ${subtitle}`}
        </h1>
        {post && (<HeaderPostMeta post={post} history={history} />)}
      </Grid.Column>
    </Grid>
  </StyledHeader>
);


// exports
export default Header;
