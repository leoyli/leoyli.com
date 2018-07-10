import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';


// components
const PostTile = ({ post: { _id, author, featured, canonical, category, state, time, title } }) => {
  const style = featured ? { backgroundImage: `url('${featured}')` } : {};
  return (
    <article id={_id} key={_id} className="col-xl-4 col-md-6 col-12 p-3 _-body__card">
      <header className="row _-body__card__header" style={style}>
        <div className="m-2 pl-1">
          <span className="badge badge-pill badge-warning mr-2 text-capitalize">
            {category}
          </span>
        </div>
        <h2 className="col-12 align-self-end _-body__card__title">
          <Link to={`/blog/${canonical}`}>
            {title}
          </Link>
        </h2>
      </header>
      <section className="_-body__card__section mt-1">
        <time dateTime={time._created} className="badge badge-primary mr-2">
          {moment(time._created).format('MMM-DD')}
        </time>
        <span>
          {author.nickname}
        </span>
      </section>
    </article>
  );
};

const ListView = ({ list = [] }) => (
  <div className="container-md row justify-content-left">
    {list.length && list.map(post => (<PostTile key={post._id} post={post} />))}
  </div>
);


// exports
export default ListView;
