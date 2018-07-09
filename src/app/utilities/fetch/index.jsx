import React, { Component } from 'react';
import { fetchData } from './lib';


// component
import Unfounded from '../../routers/unfounded';


class Fetch extends Component {
  initialData = this.props.initialData();
  state = { data: this.initialData, loading: !this.initialData };

  componentDidMount = () => {
    const {
      props: {
        pathname: predefinedPathname,
        location: { pathname: locationPathname },
      },
      state: { loading },
    } = this;
    const pathname = predefinedPathname || locationPathname;

    if (loading) {
      fetchData(pathname)()
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
      props: {
        pathname: predefinedPathname,
        location: { pathname: locationPathname, search },
      },
    } = this;
    const pathname = predefinedPathname || locationPathname;

    if (prevPathname !== locationPathname || prevSearch !== search) {
      this.setState(() => ({ loading: true }));
      fetchData(pathname)()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  render = () => {
    const {
      props: { children },
      state: { loading, data = {} },
    } = this;
    //
    if (loading) return null;
    if (data._status !== 200) return (<Unfounded />);
    return children(data);
  }
}


// exports
export default Fetch;
