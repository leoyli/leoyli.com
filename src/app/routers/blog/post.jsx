import React, { Component } from 'react';


// views
import PostView from '../../templates/post/post';
import Header from '../../templates/header';
import Unfounded from '../unfounded';


// router
class Post extends Component {
  state = { data: this.props.initialData(), loading: false };

  componentDidMount() {
    if (!this.state.data && this.props.request) {
      this.setState(() => ({ loading: true }));
      this.props.request()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.location.pathname !== this.props.location.pathname)
        || (prevProps.location.search !== this.props.location.search)) {
      this.setState(() => ({ loading: true }));
      this.props.request()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  }

  render() {
    if (!this.state.data) return null;
    if (this.state.data._status !== 200) return (<Unfounded {...this.props} />);
    return (
      <div>
        <Header
          title={this.state.data.post.title}
          post={this.state.data.post}
          featured={this.state.data.post.featured}
          history={this.props.history}
          isSignedIn={this.props.isSignedIn}
        />
        <PostView {...this.state.data} />
      </div>
    );
  }
}


// exports
export default Post;
