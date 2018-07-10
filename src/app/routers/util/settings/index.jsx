import React, { Component } from 'react';


// vies
import { APIRequest } from '../../../utilities/fetch';
import Header from '../../../layouts/header';
import SettingsView from './view';


// components
class Settings extends Component {
  state = { isSubmittable: true };

  _handleOnSubmitUpdatedSettings = (e) => {
    e.preventDefault();
    const { sendPath } = this.props;
    this.setState(() => ({ isSubmittable: false }));
    return APIRequest(sendPath)({ method: 'PATCH', data: e.target })
      .then(res => {
        if (res.result.nModified === 1) {
          document.dispatchEvent(new Event('_configUpdated'));
          this.setState(() => ({ isSubmittable: true }));
        }
      });
  };

  render = () => {
    const {
      props: { _$CONFIG },
      state: { isSubmittable },
    } = this;
    return (
      <div className="_-settings">
        <Header title="Website Settings" />
        <SettingsView
          _$CONFIG={_$CONFIG}
          onSubmit={this._handleOnSubmitUpdatedSettings}
          isSubmittable={isSubmittable}
        />
      </div>
    );
  }
}


// exports
export default Settings;
