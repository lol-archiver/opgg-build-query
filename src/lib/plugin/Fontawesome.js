// import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fab } from '@fortawesome/free-brands-svg-icons';


import {
	// faMap
} from '@fortawesome/free-solid-svg-icons';




export const install = app => {
	// library.add(fas);
	// library.add(far);
	// library.add(fab);


	// library.add(faMap);


	app.component('Fas', FontAwesomeIcon);
};
