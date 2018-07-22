import React  from 'react';
import { Link } from 'react-router-dom';


// components
const Close = () => (
  <session className="d-block text-center my-5 py-5">
    <span className="h1 mt-5 pt-5" role="img" aria-label="Footer">
      🤔 🙌 🎉
    </span>
    <h4 className="my-4">
      Look for an ideal partner?!
      <br />
      Let&apos;s grow together and make a better tomorrow!
    </h4>
    <Link
      to="/blog/about"
      className="btn btn-lg btn-warning font-weight-bold d-md-inline-block d-block m-2"
    >
      Learn More!
    </Link>
    <Link
      to="/blog/cv"
      className="btn btn-lg btn-primary font-weight-bold d-md-inline-block d-block m-2"
    >
      My Résumé!
    </Link>
  </session>
);


// exports
export default Close;
