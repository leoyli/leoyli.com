const React = require('react');


// components
const Post = ({ post: { _id, title, author, category, time } }) => (
  <article className="col-9" id={_id}>
    <h2>{title}</h2>
    <header className="row">
      <div className="col-md-9">{author.nickname} | {category}</div>
      <time className="col-md-3 text-lg-right" dateTime={time._created}>{time._created}</time>
    </header>
  </article>
);


const PostList = ({ list = [] }) => (
  <div className="container">
    {list.length > 0 && list.map(post => <Post key={post._id} post={post} />)}
  </div>
);


// exports
export default PostList;
