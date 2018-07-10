import React, { Component, Fragment } from 'react';


// modules
import Fetch from '../../../utilities/fetch';
import Header from '../../../layouts/header';
import EditorView from './view';


// components
class Editor extends Component {
  _loadInitialData = () => {
    const { initialData, location } = this.props;
    const serverData = initialData();
    const passedData = location.state || (location.pathname === '/blog/new' && {});
    return serverData || (passedData && { ...passedData, _status: 200 });
  };

  _onSubmitCB = (err, doc) => {
    const { history } = this.props;
    if (doc && doc.post) history.push(`/blog/${doc.post.canonical}`);
  };

  render = () => {
    const { fetchPath, sendPath, location } = this.props;
    return (
      <Fetch fetchPath={fetchPath} initialData={this._loadInitialData}>
        {({ post = {} }, { isSubmittable, onSubmit }) => (
          <Fragment>
            <Header title="Post Editor" />
            <EditorView
              post={post}
              isSubmittable={isSubmittable}
              onSubmit={onSubmit({
                pathOverride: sendPath,
                method: location.pathname === '/blog/new' ? 'POST' : 'PUT',
              }, this._onSubmitCB)}
            />
          </Fragment>
        )}
      </Fetch>
    );
  }
}


// exports
export default Editor;
