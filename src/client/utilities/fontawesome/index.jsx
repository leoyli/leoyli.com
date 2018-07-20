import { library, config } from '@fortawesome/fontawesome-svg-core';


// solid icons
// import { faPencilAlt, faSignInAlt, faEraser, faSearch } from '@fortawesome/free-solid-svg-icons/';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';


// brand icons
// import { faFacebookSquare, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faGit } from '@fortawesome/free-brands-svg-icons/faGit';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons/faHtml5';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons/faCss3Alt';
import { faJs } from '@fortawesome/free-brands-svg-icons/faJs';
import { faReact } from '@fortawesome/free-brands-svg-icons/faReact';
import { faWordpress } from '@fortawesome/free-brands-svg-icons/faWordpress';
import { faAws } from '@fortawesome/free-brands-svg-icons/faAws';
import { faRProject } from '@fortawesome/free-brands-svg-icons/faRProject';
import { faPython } from '@fortawesome/free-brands-svg-icons/faPython';
import { faNode } from '@fortawesome/free-brands-svg-icons/faNode';
import { faSass } from '@fortawesome/free-brands-svg-icons/faSass';


// configs
config.autoAddCss = false;
library.add(
  faPencilAlt, faSignInAlt, faEraser, faSearch,
  faFacebookSquare, faLinkedin, faGithub, faGit, faHtml5, faCss3Alt,
  faJs, faReact, faWordpress, faAws, faRProject, faPython, faNode, faSass,

);


// exports
const fontawesome = { library, config };
export default library;
