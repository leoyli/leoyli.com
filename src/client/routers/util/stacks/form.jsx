/* eslint-disable react/jsx-one-expression-per-line */

import qs from 'qs';
import moment from 'moment';
import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Checkbox, Dropdown, Form, Header, Image, Table } from 'semantic-ui-react';


// modules
import Pagination from '../../../utilities/pagination';


// styles
const StyledForm = styled(Form)`
  margin-top: 2rem;
`;


// components
const StacksModeSwitch = ({ location }) => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true, parseArrays: false, depth: 0 });
  const leaveBin = `${location.pathname}?${qs.stringify({ ...query, access: undefined })}`;
  const enterBin = `${location.pathname}?${qs.stringify({ ...query, access: 'bin' })}`;
  return location.search.includes('access=bin')
    ? (<Button floated="right" content="LEAVE BIN" color="blue" as={Link} to={leaveBin} />)
    : (<Button floated="right" content="ENTER BIN" color="green" as={Link} to={enterBin} />);
};

const StacksBatchAction = ({ command, isSubmittable, event, location }) => {
  const regularOptions = [
    { text: 'Select a batch action', value: 'null', disabled: true },
    { text: 'Pin', value: 'pinned' },
    { text: 'Hide', value: 'hidden' },
    { text: 'Recycle', value: 'recycled' },
  ];
  const recycleOptions = [
    { text: 'Select a batch action', value: 'null', disabled: true },
    { text: 'Restore', value: 'restored' },
  ];

  return (
    <Fragment>
      <Dropdown
        selection
        upward={false}
        value={command}
        options={location.search.includes('access=bin') ? recycleOptions : regularOptions}
        onChange={event._onSelectCommand}
      />
      {' '}
      <Button
        type="submit"
        aria-label="Apply"
        content="Apply"
        loading={!isSubmittable && command !== 'null'}
        disabled={!(isSubmittable && command !== 'null')}
        onClick={event._onFireAction}
      />
    </Fragment>
  );
};

const StacksTableCell = ({
  location,
  event,
  checked,
  doc: { _id, canonical, author, time, title, category, tags = '' } = {},
}) => (
  <Table.Row>
    <Table.Cell>
      <Checkbox
        id={_id}
        value={_id}
        onChange={event._onCheckItem}
        checked={checked.includes(_id)}
      />
    </Table.Cell>
    <Table.Cell width={2} singleLine>
      <Header as="h4" image>
        <Image src="/static/media/icon.png" rounded size="mini" />
        <Header.Content>
          {author.nickname}
          <Header.Subheader content="Admin" />
        </Header.Content>
      </Header>
    </Table.Cell>
    <Table.Cell width={9}>
      {
        location.search.includes('access=bin')
          ? (<span>{title}</span>)
          : (<Link to={`/blog/${canonical}`}>{title}</Link>)
      }
    </Table.Cell>
    <Table.Cell width={2} content={category.toUpperCase()} />
    <Table.Cell width={2} content={tags} />
    <Table.Cell width={1} content={moment(time._created).format('MM/DD/YYYY')} />
  </Table.Row>
);

const StacksTable = ({ location, checked, event, list = [], meta = {} }) => (
  <Table selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>
          <Checkbox
            id="select-all"
            onChange={event._onCheckAllItems(list)}
            checked={checked.length && list.length === checked.length}
          />
        </Table.HeaderCell>
        <Table.HeaderCell content="Author" />
        <Table.HeaderCell content="Title" />
        <Table.HeaderCell content="Category" />
        <Table.HeaderCell content="Tags" />
        <Table.HeaderCell content="Date" />
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {list.map(doc => (
        <StacksTableCell key={doc._id} location={location} event={event} checked={checked} doc={doc} />
      ))}
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan={6}>
          <Pagination meta={meta} />
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
);

const StacksForm = ({ command, checked, isSubmittable, event, location, list, meta }) => (
  <Container as={StyledForm}>
    <StacksModeSwitch location={location} />
    <StacksBatchAction location={location} command={command} event={event} isSubmittable={isSubmittable} />
    <StacksTable location={location} checked={checked} event={event} list={list} meta={meta} />
  </Container>
);


// exports
export default StacksForm;
