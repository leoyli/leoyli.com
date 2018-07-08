import React, { Component, Fragment } from 'react';


// views
import Header from '../../templates/header';
import PostEditor from '../../templates/post/editor';
import Fetch from '../../widgets/fetch';


// router
class Editor extends Component {
  state = { isSubmittable: true };

  _handleOnSubmit = (e) => {
    e.preventDefault();
    const { location, history, send } = this.props;

    this.setState(() => ({ processing: false }));
    send({ method: location.pathname === '/blog/new' ? 'POST' : 'PUT', data: e.target })
      .then(doc => {
        if (doc && doc.post) history.push(`/blog/${doc.post.canonical}`);
      });
  };

  render = () => {
    const {
      state: { isSubmittable },
      props: { location, initialData },
    } = this;
    const loadInitialData = () => {
      const serverData = initialData();
      const passedData = location.state || (location.pathname === '/blog/new' && {});
      return serverData || (passedData && { ...passedData, _status: 200 });
    };

    return (
      <Fetch pathname="/blog/:key" location={location} initialData={loadInitialData}>
        {({ post = {} }) => (
          <Fragment>
            <Header title="Post Editor" />
            <PostEditor onSubmit={this._handleOnSubmit} isSubmittable={isSubmittable} post={post} />
          </Fragment>
        )}
      </Fetch>
    );
  }
}


// exports
export default Editor;
