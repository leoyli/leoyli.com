import React, { Component, Fragment } from 'react';


// modules
import { APIRequest } from '../../../utilities/fetch';
import { WebConfig } from '../../../utilities/contexts';
import Header from '../../../layouts/header';
import SettingsForm from './form';


// container
class Settings extends Component {
  state = { isSubmittable: true };

  _handleOnSubmitUpdatedSettings = (e) => {
    e.preventDefault();
    const { sendPath, updateWebConfigContext } = this.props;
    this.setState(() => ({ isSubmittable: false }));
    return APIRequest(sendPath)({ method: 'PATCH', data: e.target })
      .then(res => {
        if (res.result.nModified === 1) {
          updateWebConfigContext(res.result.config);
          this.setState(() => ({ isSubmittable: true }));
        }
      });
  };

  render = () => {
    const { isSubmittable } = this.state;
    const { config } = this.props;
    return (
      <Fragment>
        <Header title="Website Settings" />
        <SettingsForm
          onSubmit={this._handleOnSubmitUpdatedSettings}
          isSubmittable={isSubmittable}
          {...config}
        />
      </Fragment>
    );
  }
}


// Decorator (HOC)
const SettingWithWebConfigContext = (props) => (
  <WebConfig.Consumer>
    {({ update, ...config }) => (
      <Settings {...props} updateWebConfigContext={update} config={config} />
    )}
  </WebConfig.Consumer>
);


// exports
export default SettingWithWebConfigContext;
