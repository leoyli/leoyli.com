import React, { Fragment } from 'react';


// views
import PostView from '../../templates/post/post';
import Header from '../../templates/header';
import Fetch from '../../widgets/fetch';


// router
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
