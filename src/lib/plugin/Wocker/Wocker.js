import Wock from './Wock.js';



/** @type {Wock} */
export let $wock;
export const install = app => {
	const wock = $wock = new Wock(
		new URL('wock', location.origin).toString().replace(/^http/, 'ws'),
		(console || {}).log,
		(console || {}).error,
	);

	wock.ping = true;
	wock.reopen = true;
	wock.open('初始化');

	app.config.globalProperties.$wock = wock;
	app.provide('$wock', wock);
};
