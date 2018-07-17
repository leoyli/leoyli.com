import React from 'react';
import { hydrate } from 'react-dom';
import { RenderClient } from '../markups';


// client
hydrate(<RenderClient />, document.getElementById('root'));
