import { library, config } from '@fortawesome/fontawesome-svg-core';


// solid icons
// import { faAngleDoubleRight, faPencilAlt, faSignInAlt, faEraser, faSearch } from '@fortawesome/free-solid-svg-icons/';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';


// brand icons
// import { faFacebookSquare, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';


// configs
config.autoAddCss = false;
library.add(faPencilAlt, faEraser, faSearch, faSignInAlt, faAngleDoubleRight, faGithub, faLinkedin, faFacebookSquare);


// exports
const fontawesome = { library, config };
export default library;
