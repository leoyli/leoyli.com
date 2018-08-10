import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Image } from 'semantic-ui-react';


// styles
const StyledUserMenu = styled.div`
  & .dropdown.icon {
    margin-left: 0 !important;
    top: .4rem;
  }
  
  & .menu.visible {
    z-index: 1099;
  }
`;


// components
// eslint-disable-next-line react/jsx-one-expression-per-line
const greet = (<span>Welcome&nbsp;<strong>Leo</strong></span>);
const trigger = (<Image avatar src="/static/media/icon.png" />);


// view
const UserMenu = () => (
  <StyledUserMenu>
    <Dropdown trigger={trigger} pointing="top left">
      <Dropdown.Menu>
        <Dropdown.Item disabled content={greet} as={Link} to="/blog/new" />
        <Dropdown.Divider />
        <Dropdown.Item icon="edit outline" text="New" as={Link} to="/blog/new" />
        <Dropdown.Item icon="book" text="Posts Management" as={Link} to="/util/stacks/posts" />
        <Dropdown.Divider />
        <Dropdown.Item icon="dashboard" text="Dashboard" as={Link} to="/util/settings" />
        <Dropdown.Divider />
        <Dropdown.Item icon="power off" text="Sign Out" as={Link} to="/signout" />
      </Dropdown.Menu>
    </Dropdown>
  </StyledUserMenu>
);


// exports
export default UserMenu;
