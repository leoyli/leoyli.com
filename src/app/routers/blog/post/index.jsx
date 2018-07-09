import React, { Fragment } from 'react';


// modules
import Fetch from '../../../utilities/fetch';
import Header from '../../../layouts/header';
import PostView from './view';


// components
const Post = ({ location, history, initialData, isSignedIn }) => (
  <Fetch location={location} initialData={initialData}>
    {({ post = {} }) => (
      <Fragment>
        <Header
          post={post}
          title={post.title}
          featured={post.featured}
          history={history}
          isSignedIn={isSignedIn}
        />
        <PostView post={post} />
      </Fragment>
    )}
  </Fetch>
);


// exports
export default Post;
