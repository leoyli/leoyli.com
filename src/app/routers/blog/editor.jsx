import React, { Component } from 'react';


// views
import Header from '../../templates/header';
import PostEditor from '../../templates/post/editor';
import Unfounded from '../unfounded';


// router
class Editor extends Component {
  state = { data: this.props.initialData() || this.props.location.state, loading: false };

  _handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(1);
    this.setState(() => ({ loading: true }));
    this.props.send({ method: this.state.data ? 'PUT' : 'POST', data: e.target })
      .then(doc => {
        if (doc && doc.post) this.props.history.push(`/blog/${doc.post.canonical}`);
      });
  };

  componentDidMount = () => {
    if (!this.state.data && this.props.request) {
      this.setState(() => ({ loading: true }));
      this.props.request().then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  render = () => {
    if (this.state.data && this.state.data._status === 404) return (<Unfounded {...this.props} />);
    return (
      <div>
        <Header title="Post Editor" />
        <PostEditor onSubmit={this._handleOnSubmit} isSubmittable={!this.state.loading} {...this.state.data} />
      </div>
    );
  };
}


// exports
export default Editor;
