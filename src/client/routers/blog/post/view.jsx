import React from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';


// modules
import Sticky from '../../../utilities/sticky';


// markdown
const configs = {
  overrides: {
    Sticky: ({ children, ...props }) => (
      <Sticky {...props}>
        {children}
      </Sticky>
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
    table: {
      props: {
        className: 'table table-sm table-hover table-responsive',
      },
    },
    thead: {
      props: {
        className: 'table-light',
      },
    },
    th: {
      props: {
        className: 'px-3',
      },
    },
    td: {
      props: {
        className: 'px-3',
      },
    },
  },
};


// components
const PostView = ({ post = {} }) => (
  <div className="d-flex">
    <div className="col-md-10 m-auto">
      <article id={post._id} className="_-body__post">
        <Markdown options={configs}>
          {post.content}
        </Markdown>
      </article>
    </div>
  </div>
);


// exports
export default PostView;
