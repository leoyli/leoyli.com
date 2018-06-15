/* global __isBrowser__ */
import React from 'react';
import PostList from '../views/postlist';


// components
class Blog extends React.Component {
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
  }

  render() {
    // if (__isBrowser__) delete window.__INIT__;
    return (
      <div>
        <PostList {...this.state.data} />
      </div>
    );
  }
}


// exports
export default Blog;
