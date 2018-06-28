import React, { Component } from 'react';


// vies
import SettingsView from '../../templates/util/settings';
import Header from '../../templates/header';


// components
class Settings extends Component {
  state = { isSubmittable: true };

  _handleOnSubmitUpdatedSettings = (e) => {
    e.preventDefault();
    this.setState(() => ({ isSubmittable: false }));
    this.props.send({ method: 'PATCH', data: e.target })
      .then(res => {
        if (res.result.nModified === 1) {
          document.dispatchEvent(new Event('_configUpdated'));
          this.setState(() => ({ isSubmittable: true }));
        }
      });
  };

  render = () => (
    <div className="_-settings">
      <Header title="Website Settings" />
      <SettingsView
        _$CONFIG={this.props._$CONFIG}
        onSubmit={this._handleOnSubmitUpdatedSettings}
        isSubmittable={this.state.isSubmittable}
      />
    </div>
  );
}


// exports
export default Settings;
