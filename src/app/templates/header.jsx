import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fetchData from '../libs/fetch/';


// components
class EditOptions extends Component {
  _handleOnClickButton = () => {
    if (window.confirm('Are you sure you want to trash this article?' +
        '\n(Note: You may recover it later from the trash bin.)')) {
      const send = fetchData('/blog/:key');
      send({ path: `/blog/${this.props.post._id}`, method: 'DELETE' })
        .then(({ result = {} }) => {
          if (result.ok) this.props.history.replace('/blog');
        });
    }
  };

  render = () => (
    <div className="align-self-end text-right _-section__header__edit">
      <Link to={{ pathname: `/blog/${this.props.post._id}/edit`, state: { post: this.props.post } }}>
        <FontAwesomeIcon icon="pencil-alt" />
      </Link>
      <button className="_-section__header__edit__button" onClick={this._handleOnClickButton}>
        <FontAwesomeIcon icon="eraser" />
      </button>
    </div>
  );
}

const MetaBox = ({ post: { author, category, tags, time }, post, history, isSignedIn }) => (
  <div className="d-flex justify-content-between mb-3">
    <div className="d-sm-flex flex-row-reverse mb-4 mb-sm-2 _-section__header__meta">
      <div className="ml-sm-2">
        <span>By {author.nickname}</span>
        <time dateTime={time._created}>&nbsp;@&nbsp;{moment(time._created).format('MM/DD/YYYY')}</time>
      </div>
      <div className="d-sm-inline-block ml-sm-0 ml-1">
        <span className="badge badge-pill badge-warning text-capitalize">{category}</span>
      </div>
    </div>
    {isSignedIn && <EditOptions post={post} history={history} />}
  </div>
);

const Header = ({ title, subtitle, featured, post, isSignedIn, history }) => (
  <header
    className={`d-flex mb-4 _-section__header ${featured ? '_-section__header--with-overlay' : ''}`}
    style={featured ? { backgroundImage: `url('${featured}')` } : {}}
  >
    <div className="container align-self-end">
      <h2>{title}{subtitle && ` - ${subtitle}`}</h2>
      {post ? (<MetaBox post={post} history={history} isSignedIn={isSignedIn} />) : (<div>&nbsp;</div>)}
    </div>
  </header>
);


// exports
export default Header;
