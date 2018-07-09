import React, { Component } from 'react';


// vies
import Header from '../../../layouts/header';
import Pagination from '../../../utilities/pagination';
import StacksView from './view';


// components
class Stacks extends Component {
  state = { data: this.props.initialData(), loading: false, command: 'null', checked: [] };
  event = {
    _onSelectCommand: (e) => {
      const checkedValue = e.target.value;
      this.setState(() => ({ command: checkedValue }));
    },

    _onCheckDoc: (e) => {
      const checkedValue = e.target.value;
      this.setState(() => ({
        checked: this.state.checked.includes(checkedValue)
          ? this.state.checked.filter(_id => _id !== checkedValue)
          : this.state.checked.concat(checkedValue),
      }));
    },

    _onCheckAllDocs: (e) => {
      this.setState(() => ({
        checked: this.state.data && (this.state.data.list.length !== this.state.checked.length)
          ? this.state.data.list.map(item => item._id)
          : [],
      }));
    },

    _onFireAction: (e) => {
      e.preventDefault();
      this.setState(() => ({ loading: true }));
      this.props.send({ method: 'PATCH', data: { action: this.state.command, target: this.state.checked } })
        .then(res => {
          if (res.result.nModified === this.state.checked.length) {
            const data = { list: res.list, meta: res.meta };
            this.setState(() => ({ data, loading: false, command: 'null', checked: [] }));
          }
        });
    },
  };

  componentDidMount = () => {
    if (!this.state.data && this.props.request) {
      this.setState(() => ({ loading: true }));
      this.props.request()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.location.path === this.props.location.path
    && prevProps.location.search !== this.props.location.search) {
      this.props.request()
        .then(data => this.setState(() => ({ data, loading: false })));
    }
  };

  render = () => {
    if (!this.state.data) return null;
    return (
      <div className="_-stacks">
        <Header title="Content Manager" subtitle="Posts" />
        <StacksView state={this.state} event={this.event} location={this.props.location} />
        <Pagination meta={this.state.data.meta} />
      </div>
    );
  };
}


// exports
export default Stacks;
