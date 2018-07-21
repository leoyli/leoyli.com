import React  from 'react';
import { Link } from 'react-router-dom';


// components
const Intro = () => (
  <session className="_U_full-width-bg _L_land__session _L_land__session--intro">
    <header className="align-self-center col-lg-7 col-12">
      <h1>
        Leo Y. Li
      </h1>
      <h2 className="mb-4">
        A self-motivated web developer solves problems with elegant code!
      </h2>
      <Link
        to="/blog/cv"
        className="btn btn-lg btn-light font-weight-bold m-2 d-block d-md-inline-block d-lg-none"
      >
        View my résumé!
      </Link>
      <Link
        to="/blog/about"
        className="btn btn-lg btn-warning font-weight-bold d-md-inline-block d-block m-2"
      >
        More about me!
      </Link>
    </header>
    <aside className="align-self-center text-center col-lg-5 d-lg-inline-block d-none mt-3">
      <Link to="/blog/cv">
        <h3 className="pb-3 text-right">
          Have a look on my résumé!
        </h3>
        <img src="/static/media/cv.png" className="img-fluid pl-5" alt="CV" />
      </Link>
    </aside>
  </session>
);


// exports
export default Intro;
