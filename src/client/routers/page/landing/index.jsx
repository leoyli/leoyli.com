import React, { Fragment } from 'react';


// modules
import Intro from './sections/intro';
import Developer from './sections/developer';
import Designer from './sections/designer';
import Marketer from './sections/marketer';
import Close from './sections/close';


// data
const data = {
  developer: {
    title: {
      sup: '01 - Leo is a',
      main: 'Web Developer',
      sub: 'From the front-end to the back.',
    },
    skill: {
      icon: true,
      list: [
        'html5', 'css3-alt', 'js', 0,
        'sass', 'node', 'react', 'git', 0,
        'github', 'aws', 'wordpress', 0,
        'python', 'r-project',
      ],
    },
    content: [
      {
        to: '/blog/the-project-cms-a-mern-stack-from-a-to-z',
        title: 'The Project CMS: A MERN Stack from A-to-Z',
        featured: '/static/media/mern.png',
      },
      {
        to: '/blog/react-js-design-a-responsive-sticky-component-from-scratch',
        title: 'ReactJS: Design A Responsive Sticky Component from Scratch',
        featured: '/static/media/sticky.png',
      },
    ],
  },
  designer: {
    title: {
      sup: '02 - Leo is a',
      main: 'Graphic Designer',
      sub: 'Details, coming from crating on each pixel.',
    },
    skill: {
      icon: false,
      list: [
        'Fw', 'Ai', 'In', 0,
        'Ps', 'Xd',
      ],
    },
    content: [
      '14-06-01', '14-06-02', 0,
      '15-02-26', '15-03-09', '15-04-01',
    ],
  },
  marketer: {
    title: {
      sup: '03 - Leo is an',
      main: 'Online Marketer',
      sub: 'Insightful ideas shaped by a critical thinker!',
    },
  },
};


// view
const Landing = () => (
  <Fragment>
    <Intro />
    <Developer data={data.developer} />
    <Designer data={data.designer} />
    <Marketer data={data.marketer} />
    <Close />
  </Fragment>
);


// exports
export default Landing;
