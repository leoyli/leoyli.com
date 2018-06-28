import qs from 'qs';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';


// views
const StacksSwitch = ({ location }) => {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true, parseArrays: false, depth: 0 });
  const leaveBin = `${location.pathname}?${qs.stringify({ ...query, access: undefined })}`;
  const enterBin = `${location.pathname}?${qs.stringify({ ...query, access: 'bin' })}`;
  return location.search.includes('access=bin')
    ? (<Link className="btn btn-sm btn-outline-primary float-right" to={leaveBin}>LEAVE BIN</Link>)
    : (<Link className="btn btn-sm btn-outline-success float-right" to={enterBin}>ENTER BIN</Link>);
};

const StacksAction = ({ state, event, location }) => {
  const regularOptions = [
    <option value="pinned" key="option-pin">Pin</option>,
    <option value="hidden" key="option-hide">Hide</option>,
    <option value="recycled" key="option-recycle">Recycle</option>,
  ];
  const binOptions = [
    <option value="restored" key="option-restore">Restore</option>,
  ];
  return (
    <div className="my-3 d-inline">
      <select
        className="custom-select custom-select-sm col-2 mr-2"
        name="command"
        value={state.command}
        onChange={event._onSelectCommand}
      >
        <option value="null">Select a bulk command</option>
        {location.search.includes('access=bin') ? binOptions : regularOptions}
      </select>
      <button
        className="btn btn-sm btn-outline-primary"
        aria-label="Apply"
        onClick={event._onFireAction}
      >Apply
      </button>
    </div>
  );
};

const StacksCell = ({ event, checked, doc = {} }) => (
  <tr>
    <th className="text-center" scope="row">
      <label htmlFor={doc._id} className="m-0">
        <input
          type="checkbox"
          id={doc._id}
          value={doc._id}
          onChange={event._onCheckDoc}
          checked={checked.includes(doc._id)}
        />
      </label>
    </th>
    <td>{doc.author.nickname}</td>
    <td><Link to={`/blog/${doc.canonical}`}>{doc.title}</Link></td>
    <td>{doc.category}</td>
    <td>{doc.tags || 'null'}</td>
    <td>{moment(doc.time && doc.time._created).format('MM/DD/YYYY')}</td>
  </tr>
);

const StacksList = ({ event, state: { checked, data: { list = [] } } }) => (
  <table className="table table-sm table-hover mt-3">
    <thead>
      <tr>
        <th className="text-center" scope="col" width="3%">
          <label htmlFor="select-all" className="m-0">
            <input
              id="select-all"
              type="checkbox"
              onChange={event._onCheckAllDocs}
              checked={checked.length && list.length === checked.length}
            />
          </label>
        </th>
        <th scope="col" width="10%">Author</th>
        <th scope="col" width="50%">Title</th>
        <th scope="col" width="14%">Category</th>
        <th scope="col" width="14%">Tags</th>
        <th scope="col" width="12%">Date</th>
      </tr>
    </thead>
    <tbody>
      {list.map(doc => (
        <StacksCell key={doc._id} event={event} checked={checked} doc={doc} />
      ))}
    </tbody>
  </table>
);

const Stacks = (props) => (
  <form className="container text-justify pt-3">
    <StacksSwitch {...props} />
    <StacksAction {...props} />
    <StacksList {...props} />
  </form>
);


// exports
export default Stacks;
