/* global __isBrowser__ */

import React, { Component } from 'react';
import PostList from '../views/postlist';


// components
class Blog extends Component {
  state = {
    data: __isBrowser__ ? window.__INIT__ : this.props.staticContext,
    loading: false,
  };

  loadData(url) {
    this.setState(() => ({ loading: true }));
    this.props.fetch(url).then(data => this.setState(() => ({ data, loading: false })));
  }

  componentDidMount() {
    if (!this.state.data) this.loadData(this.props.match.url);
    if (__isBrowser__) delete window.__INIT__;
  }

  render() {
    return (
      <div>
        <PostList {...this.state.data} />
      </div>
    );
  }
}


// exports
export default Blog;
