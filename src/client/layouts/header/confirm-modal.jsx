import React, { Component } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';


// modules
import { APIRequest } from '../../utilities/fetch';


// view
const PostModalDeleteView = ({ open, trigger, eToggle, eDelete }) => (
  <Modal trigger={trigger} basic size="small" open={open}>
    <Header icon="archive" content="Please Confirm" />
    <Modal.Content>
      <h3>
        Are you sure you want to delete this article?
      </h3>
      <h4>
        * You may recover it later from the trash bin within 14 days.
      </h4>
    </Modal.Content>
    <Modal.Actions>
      <Button inverted color="red" onClick={eToggle}>
        <Icon name="remove" />
        No
      </Button>
      <Button inverted color="green" onClick={eDelete}>
        <Icon name="checkmark" />
        Yes
      </Button>
    </Modal.Actions>
  </Modal>
);


// control
class ConfirmModal extends Component {
  state = { open: false };

  _handleOnClickToggle = () => {
    const { open } = this.state;
    this.setState(() => ({ open: !open }));
  };

  _handleOnClickDelete = (e) => {
    const { history, post } = this.props;
    return APIRequest('/blog/:key')({ path: `/blog/${post._id}`, method: 'DELETE' })
      .then(({ result = {} }) => {
        this.setState(() => ({ open: false }));
        if (result.ok) history.replace('/blog');
      });
  };

  render = () => {
    const { trigger: Trigger } = this.props;
    const trigger = (<Trigger onClick={this._handleOnClickToggle} />);
    return (
      <PostModalDeleteView
        {...this.state}
        trigger={trigger}
        eToggle={this._handleOnClickToggle}
        eDelete={this._handleOnClickDelete}
      />
    );
  }
}


// exports
export default ConfirmModal;
