import Markdown from 'markdown-to-jsx';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Container, Segment, Table } from 'semantic-ui-react';


// modules
import Sticky from '../../../utilities/sticky';
import Gist from  '../../../utilities/gist';


// markdown
const configs = {
  overrides: {
    Gist: (props) => (
      <Gist {...props} />
    ),
    Sticky: ({ children, ...props }) => (
      <Sticky {...props}>
        {children}
      </Sticky>
    ),
    button: ({ children, ...props }) => (
      <Button {...props}>
        {children}
      </Button>
    ),
    a: ({ href, children, ...props }) => {
      if (href.startsWith('/')) {
        return (
          <Link to={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    table: ({ children, ...props }) => (
      <Table {...props} cpmpact celled selectable>
        {children}
      </Table>
    ),
    thead: ({ children, ...props }) => (
      <Table.Header {...props}>
        {children}
      </Table.Header>
    ),
    th: ({ children, ...props }) => (
      <Table.HeaderCell {...props}>
        {children}
      </Table.HeaderCell>
    ),
    td: ({ children, ...props }) => (
      <Table.Cell {...props}>
        {children}
      </Table.Cell>
    ),
  },
};


// components
const Article = styled.article`
  overflow: hidden;
  padding: 2rem 7.5rem !important;
  @media only screen and (max-width: 768px) {
    padding: 2rem .5rem !important;
  }
  
  blockquote {
    border-left: .5rem solid lightgrey;
    color: grey;
    font-weight: 600;
    padding: 1rem;
    margin: 1rem 2rem;
  }
  
  code {
    color: deeppink;
  }
  
  hr {
    background: #ccc;
    border: 0;
    height: 1px;
  }
  
  p, li {
    font-size: 1.15rem;
    line-height: 1.75rem;
    text-align: justify;
  }
`;

const PostView = ({ post = {} }) => (
  <Container>
    <Segment basic as={Article} id={post._id}>
      <Markdown options={configs}>
        {post.content}
      </Markdown>
    </Segment>
  </Container>
);


// exports
export default PostView;
