import React from 'react';
import Markdown from 'markdown-to-jsx';


// view
const Post = ({ post = {} }) => (
  <div className="d-flex">
    <div className="col-md-10 m-auto">
      <article id={post._id}><Markdown>{post.content}</Markdown></article>
    </div>
  </div>
);


// exports
export default Post;
