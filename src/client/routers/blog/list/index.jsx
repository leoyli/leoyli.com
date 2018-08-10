import moment from 'moment';
import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Label, Segment } from 'semantic-ui-react';


// modules
import Fetch from '../../../utilities/fetch';
import Pagination from '../../../utilities/pagination';
import Header from '../../../layouts/header';


// styles
const StyledArticle = styled.article`
  & section {
    background: #232a3d no-repeat center ${({ featured = '' }) => `url('${featured}')`};
    background-size: cover;
    margin-top: 2rem;
    position: relative;
    @media only screen and (max-width: 768px) {
      height: 45vw;
    }
    @media only screen and (min-width: 769px) and (max-width: 993px) {
      height: 22.5vw;
    }
    height: 13.5rem;
  }
  
  & header{
    margin-top: 1rem;

    & a {
      color: #555;
      font-size: 1.1rem;
      font-weight: 600; 
      &:hover {
        color: #777;
      }
    }
  }
  
  & .ribbon.label {
    top: 1rem;
    left: -1rem;
  }
  
  & .ribbon.label + .label {
    right: .75rem;
    bottom: .75rem;
    position: absolute;
  }
`;


// components
const PostTile = ({ post: { _id, author, featured, canonical, category, state, time, title } }) => (
  <Grid.Column as={StyledArticle} id={_id} featured={featured}>
    <Link to={`/blog/${canonical}`}>
      <section>
        <Label color="red" ribbon content={category.toUpperCase()} />
        <Label size="small" color="grey" image>
          <img src="/static/media/icon.png" alt={author.nickname} />
          {author.nickname}
          <Label.Detail as="time" dateTime={time._created}>
            {moment(time._created).format('MM/DD')}
          </Label.Detail>
        </Label>
      </section>
    </Link>
    <header>
      <Link to={`/blog/${canonical}`}>
        {title}
      </Link>
    </header>
  </Grid.Column>
);

const ListView = ({ meta, list }) => (
  <Grid doubling stackable container columns={3}>
    <Grid.Row>
      {!!list.length && list.map(post => (<PostTile key={post._id} post={post} />))}
    </Grid.Row>
    <Grid.Row columns={1}>
      {meta && <Segment basic padded as={Pagination} meta={meta} />}
    </Grid.Row>
  </Grid>
);


// view
const List = ({ fetchPath, location, initialData }) => (
  <Fetch fetchPath={fetchPath} initialData={initialData}>
    {({ list = [], meta }) => (
      <Fragment>
        <Header title={location.pathname === '/blog' ? 'Post List' : 'Searched Results'} />
        {list.length
          ? (<ListView list={list} meta={meta} />)
          : (<Segment basic size="massive" padded="very" content="No Results." as={Container} />)
        }
      </Fragment>
    )}
  </Fetch>
);


// exports
export default List;
