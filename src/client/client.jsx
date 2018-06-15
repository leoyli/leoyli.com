import { hydrate } from 'react-dom';
import { renderClient } from '../app/render';


// styles
import style from './styles/index.scss';


// client
hydrate(renderClient(), document.getElementById('root'));
