import React from 'react';
import { hydrate } from 'react-dom';
import { RenderClient } from '../app/render';


// client
hydrate(<RenderClient />, document.getElementById('root'));
