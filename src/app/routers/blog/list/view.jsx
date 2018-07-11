import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';


// components
const PostTile = ({ post: { _id, author, featured, canonical, category, state, time, title } }) => {
  const style = featured ? { backgroundImage: `url('${featured}')` } : {};
  return (
    <article id={_id} key={_id} className="col-xl-4 col-md-6 col-12 p-3 _-body__card">
      <Link to={`/blog/${canonical}`}>
        <header className="row _-body__card__header" style={style}>
          <div className="m-2 pl-1">
            <span className="badge badge-pill badge-warning mr-2 text-capitalize">
              {category}
            </span>
          </div>
        </header>
      </Link>
      <section className="_-body__card__section mt-2">
        <time dateTime={time._created} className="badge badge-secondary mr-2">
          {moment(time._created).format('MMM-DD')}
        </time>
        <Link className="_-body__card__title" to={`/blog/${canonical}`}>
          {title}
        </Link>
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
