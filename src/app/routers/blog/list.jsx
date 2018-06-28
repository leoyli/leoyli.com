import React, { Component } from 'react';


// views
import Header from '../../templates/header';
import PostList from '../../templates/post/list';
import Pagination from '../../widgets/pagination';


// router
class List extends Component {
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
    return (
      <div>
        <Header title={this.props.location.pathname === '/blog' ? 'Post List' : 'Searched Results'} />
        {this.state.data.list ? (<PostList {...this.state.data} />) : (<div>NO RESULTS.</div>)}
        {this.state.data && <Pagination meta={this.state.data.meta} />}
      </div>
    );
  }
}


// exports
export default List;
