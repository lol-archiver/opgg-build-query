import { createApp } from 'vue';

import App from './index.vue';

import { install as installBus } from './lib/plugin/Bus.js';
import { install as installBrop } from './lib/plugin/Brop.js';
import { install as installAlert } from './lib/plugin/Alert.vue';
import { install as installCSSVar } from './lib/plugin/CSSVar.js';
import { install as installAegis } from './lib/plugin/Aegis.js';
import { install as installFontawesome } from './lib/plugin/Fontawesome.js';
import { install as installRightMenu } from './lib/plugin/RightMenu.js';
import { install as installTippy } from './lib/plugin/Tippy/Tippy.js';
// import { install as installWocker } from './lib/plugin/Wocker/Wocker.js';



const app = createApp(App);
app.provide('app', app);


window.addEventListener('load', async () => {
	await installBus(app);
	await installBrop(app);
	await installAlert(app);
	await installAegis(app);
	await installCSSVar(app);
	await installFontawesome(app);
	await installRightMenu(app);
	await installTippy(app);
	// await installWocker(app);


	app.mount('#app');
});
