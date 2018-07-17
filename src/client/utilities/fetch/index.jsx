import React, { Component } from 'react';
import { withRouter } from 'react-router';


// modules
import { APIRequest } from './lib';
import Unfounded from '../../routers/unfounded';


class Fetch extends Component {
  initialData = this.props.initialData();
  state = { data: this.initialData, loading: !this.initialData, isSubmittable: true };

  _handleFormSubmit = ({ pathOverride, ...option }, cb) => {
    const {
      fetchPath: predefinedPathname,
      location: { pathname: locationPathname },
    } = this.props;
    const pathname = pathOverride || predefinedPathname || locationPathname;
    return (e) => {
      e.preventDefault();
      this.setState(() => ({ isSubmittable: false }));
      return APIRequest(pathname)({ method: 'PUT', data: e.target, ...option })
        .then(data => {
          this.setState(() => ({ data, isSubmittable: true }));
          if (typeof cb === 'function') return cb(null, data);
        })
        .catch(err => {
          if (typeof cb === 'function') return cb(err);
          throw err;
        });
    };
  };

  componentDidMount = () => {
    const { loading } = this.state;
    const {
      fetchPath: predefinedPathname,
      location: { pathname: locationPathname },
    } = this.props;
    const pathname = predefinedPathname || locationPathname;
    if (loading) {
      return APIRequest(pathname)()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  componentDidUpdate = ({
    location: {
      pathname: prevPathname,
      search: prevSearch,
    },
  }) => {
    const {
      fetchPath: predefinedPathname,
      location: { pathname: locationPathname, search },
    } = this.props;
    const pathname = predefinedPathname || locationPathname;
    if (prevPathname !== locationPathname || prevSearch !== search) {
      this.setState(() => ({ loading: true }));
      return APIRequest(pathname)()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  render = () => {
    const { children } = this.props;
    const { loading, data = {}, isSubmittable } = this.state;
    if (loading) return null;
    if (data._status !== 200) return (<Unfounded />);
    return children(data, { isSubmittable, onSubmit: this._handleFormSubmit });
  }
}


// exports
export default withRouter(Fetch);
export { APIRequest };
