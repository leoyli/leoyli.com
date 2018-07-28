import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// modules
import style from './style.scss';


// data
const skills = [
  'html5', 'css3-alt', 'js', 0,
  'sass', 'node', 'react', 'git', 0,
  'github', 'aws', 'wordpress', 0,
  'python', 'r-project',
];

const articles = [
  {
    to: '/blog/the-project-cms-a-mern-stack-from-a-to-z',
    title: 'The Project CMS: A MERN Stack from A-to-Z',
    featured: '/static/media/mern.png',
  },
  {
    to: '/blog/the-project-cms-the-architecture-and-backend-services',
    title: 'The Project CMS: The Architecture and Backend Services',
    featured: '/static/media/architecture_f.png',
  },
  {
    to: '/blog/react-js-design-a-responsive-sticky-component-from-scratch',
    title: 'ReactJS: Design A Responsive Sticky Component from Scratch',
    featured: '/static/media/sticky.png',
  },
];


// components
const Icon = ({ icon, onClick }) => {
  if (icon === 0) return (<br />);
  return (
    <span onClick={onClick(icon)}>
      <FontAwesomeIcon icon={['fab', icon]} />
    </span>
  );
};

const Article = ({ to, title, featured }) => (
  <div className="_L_land__session__details d-inline-block col-12 col-lg-6 col-xl-4 p-3">
    <Link to={to}>
      <img src={featured} width="100%" alt="p" />
      <span className="d-inline-block font-weight-bold p-2">
        {title}
      </span>
    </Link>
  </div>
);

class Developer extends Component {
  _handledSelect = (icon) => (e) => {
    this.setState(() => ({ item: icon }));
  };

  render = () => {
    return (
      <session className="_U_full-width-bg _L_land__session _L_land__session--developer">
        <article className="col-12 my-5">
          <header className="_L_land__session__title col-12">
            <h3>
              01 - Leo as a
            </h3>
            <h1>
              Web Developer
            </h1>
            <h4>
              From the front-end to the back-end.
            </h4>
          </header>
          <session className="mt-5 py-4">
            <div className="d-inline-block col-xl-4 col-12 my-sm-5 my-3 _L_land__session__skills">
              {skills.map(icon => (<Icon icon={icon} key={Date.now} onClick={this._handledSelect} />))}
            </div>
            <Article {...articles[0]} />
            <Article {...articles[2]} />
          </session>
        </article>
      </session>
    );
  }
}


// exports
export default Developer;
