import React, { Fragment } from 'react';


// views
import Header from '../../templates/header';
import PostList from '../../templates/post/list';
import Pagination from '../../widgets/pagination';
import Fetch from '../../widgets/fetch';


// router
const List = ({ location, initialData }) => (
  <Fetch location={location} initialData={initialData}>
    {({ list = [], meta }) => (
      <Fragment>
        <Header title={location.pathname === '/blog' ? 'Post List' : 'Searched Results'} />
        {list.length ? (<PostList list={list} />) : (
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
