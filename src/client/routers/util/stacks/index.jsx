import React, { Component } from 'react';


// vies
import Fetch from '../../../utilities/fetch';
import Pagination from '../../../utilities/pagination';
import Header from '../../../layouts/header';
import StacksView from './view';


// components
class Stacks extends Component {
  state = { command: 'null', checked: [] };

  _onSelectCommand = (e) => {
    const checkedValue = e.target.value;
    this.setState(() => ({ command: checkedValue }));
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
    const {
      props: { fetchPath, location, initialData },
      state: { checked, command },
    } = this;

    return (
      <Fetch fetchPath={fetchPath} initialData={initialData}>
        {({ list, meta }, { isSubmittable, onSubmit }) => {
          const { _onSelectCommand, _onCheckAllItems, _onCheckItem, _onSubmitCB } = this;
          const _onFireAction = onSubmit({ method: 'PATCH', data: { action: command, target: checked } }, _onSubmitCB);
          const event = { _onSelectCommand, _onCheckAllItems, _onCheckItem, _onFireAction };
          return (
            <div className="_-stacks">
              <Header title="Content Manager" subtitle="Posts" />
              <StacksView
                list={list}
                location={location}
                checked={checked}
                command={command}
                event={event}
                isSubmittable={isSubmittable}
              />
              <Pagination meta={meta} />
            </div>
          );
        }}
      </Fetch>
    );
  };
}


// exports
export default Stacks;
