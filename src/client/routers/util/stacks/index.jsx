import React, { Component } from 'react';


// modules
import Fetch from '../../../utilities/fetch';
import Header from '../../../layouts/header';
import StacksForm from './form';


// component
const StackDataFetchLayer = ({ location, fetchPath, initialData, checked, command, event: eRaw }) => (
  <Fetch fetchPath={fetchPath} initialData={initialData}>
    {({ list, meta }, { isSubmittable, onSubmit }) => {
      const event = {
        ...eRaw,
        _onFireAction: onSubmit({ method: 'PATCH', data: { action: command, target: checked } }, eRaw._onSubmitCB),
      };
      return (
        <div className="_-stacks">
          <Header title="Content Manager" subtitle="Posts" />
          <StacksForm
            location={location}
            checked={checked}
            command={command}
            event={event}
            isSubmittable={isSubmittable}
            list={list}
            meta={meta}
          />
        </div>
      );
    }}
  </Fetch>
);


// container
class Stacks extends Component {
  state = { command: 'null', checked: [] };

  _onSelectCommand = (e, { value }) => {
    this.setState(() => ({ command: value }));
  };

  _onCheckItem = (e) => {
    const { checked } = this.state;
    const checkedValue = e.target.value;
    this.setState(() => ({
      checked: checked.includes(checkedValue)
        ? checked.filter(_id => _id !== checkedValue)
        : checked.concat(checkedValue),
    }));
  };

  _onCheckAllItems = (items = []) => (e) => {
    const { checked } = this.state;
    this.setState(() => ({
      checked: items.length !== checked.length
        ? items.map(item => item._id)
        : [],
    }));
  };

  _onSubmitCB = (err, res) => {
    const { checked } = this.state;
    if (res.result.nModified === checked.length) {
      this.setState(() => ({ isSubmittable: true, command: 'null', checked: [] }));
    }
  };

  render = () => {
    const { _onSelectCommand, _onCheckItem, _onCheckAllItems, _onSubmitCB } = this;
    const event = { _onSelectCommand, _onCheckItem, _onCheckAllItems, _onSubmitCB };
    return (<StackDataFetchLayer event={event} {...this.props} {...this.state} />
    );
  };
}


// exports
export default Stacks;
