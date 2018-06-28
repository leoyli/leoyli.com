import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt, faEraser, faSearch, faSignInAlt, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';


// configs
config.autoAddCss = false;
library.add(faPencilAlt, faEraser, faSearch, faSignInAlt, faAngleDoubleRight, faGithub, faLinkedin, faFacebookSquare);


// exports
const fontawesome = { library, config };
export default fontawesome;
