import React from 'react';
import { Link } from 'react-router-dom';


// components
const Designer = () => {
  const skills = [
    'Fw', 'Ai', 'In', 0,
    'Ps', 'Xd',
  ];
  const posters = [
    '14-06-01', '14-06-02', 0,
    '15-02-26', '15-03-09', '15-04-01',
  ];
  return (
    <session className="_U_full-width-bg _L_land__session _L_land__session--designer">
      <header className="my-5 _L_land__session__title col-12">
        <h3>
          02 - Leo as a
        </h3>
        <h1>
          Graphic Designer
        </h1>
        <h4>
          Details, coming from crating on each pixel.
        </h4>
        <session className="mt-5 py-4">
          <div className="d-inline-block col-xl-4 col-12 my-sm-5 my-3 _L_land__session__skills">
            {skills.map(item => {
              if (!item) return (<br key={Date.now} />);
              return (
                <span key={Date.now}>
                  {item}
                </span>
              );
            })}
          </div>
          <div className="d-inline-block col-xl-8 col-12 text-xl-right _L_land__session__images">
            {posters.map(poster => {
              if (!poster) return (<br key={Date.now} />);
              return (
                <Link to="/blog/artworks-posters" key={Date.now}>
                  <img src={`/static/media/posters/${poster}.jpg`} alt="Artworks" />
                </Link>
              );
            })}
          </div>
        </session>
      </header>
    </session>
  );
};


// exports
export default Designer;
