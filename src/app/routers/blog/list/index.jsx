import React, { Fragment } from 'react';


// modules
import Fetch from '../../../utilities/fetch';
import Pagination from '../../../utilities/pagination';
import Header from '../../../layouts/header';
import ListView from './view';


// components
const List = ({ location, initialData }) => (
  <Fetch location={location} initialData={initialData}>
    {({ list = [], meta }) => (
      <Fragment>
        <Header title={location.pathname === '/blog' ? 'Post List' : 'Searched Results'} />
        {list.length ? (<ListView list={list} />) : (
          <span>
              NO POSTS.
          </span>
        )}
        {meta && <Pagination meta={meta} />}
      </Fragment>
    )}
  </Fetch>
);


// exports
export default List;
