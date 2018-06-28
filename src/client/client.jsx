import React from 'react';
import { hydrate } from 'react-dom';
import { RenderClient } from '../app/render';


// styles
import style from './styles/index.scss';


// client
hydrate(<RenderClient />, document.getElementById('root'));
