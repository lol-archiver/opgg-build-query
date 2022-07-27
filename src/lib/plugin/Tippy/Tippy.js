import './Tippy.css';

import { createApp } from 'vue';
import Tippy from 'tippy.js';

import compTippy from './Tippy.vue';


const toPlacement = function(bind) {
	let placement = 'top';

	if(!(bind.value instanceof Element) && typeof bind.value == 'object' && bind.value && bind.value.placement) {
		placement = bind.value.placement;
	}
	else if(bind.modifiers.placement) {
		placement = bind.modifiers.placement;
	}
	else if(bind.modifiers.bottom) {
		placement = 'bottom';
	}
	else if(bind.modifiers.left) {
		placement = 'left';
	}
	else if(bind.modifiers.right) {
		placement = 'right';
	}
	else if(bind.modifiers.leftStart) {
		placement = 'left-start';
	}
	else if(bind.modifiers.rightStart) {
		placement = 'right-start';
	}
	else if(bind.modifiers.leftEnd) {
		placement = 'left-end';
	}
	else if(bind.modifiers.rightEnd) {
		placement = 'right-end';
	}
	else if(bind.modifiers.topStart) {
		placement = 'top-start';
	}
	else if(bind.modifiers.topEnd) {
		placement = 'top-end';
	}
	else if(bind.modifiers.bottomStart) {
		placement = 'bottom-start';
	}
	else if(bind.modifiers.bottomEnd) {
		placement = 'bottom-end';
	}

	return placement;
};

const toContent = function(bind, isOld = false) {
	const value = !isOld ? bind.value : bind.oldValue;

	if(value instanceof Element) {
		return value;
	}
	else if(typeof value == 'object' && value) {
		return value.content || '';
	}
	else {
		return value || bind.expression || '';
	}
};

const optionDirects = [
	'showOnInit',
	'interactive',
	'theme',
	'hideOnClick',
	'delay',
	'duration',
	'trigger',
	'triggerTarget',
	'maxWidth',
	'followCursor',
	'zIndex',
	'offset',
	'distance',
];

const toOption = function(bind) {
	const option = {
		content: toContent(bind),
		theme: 'light-border',
		// a11y: false,
		placement: toPlacement(bind),
		animation: '',
		duration: [0, 0],
	};

	if(!(bind.value instanceof Element) && typeof bind.value == 'object' && bind.value && bind.value.duration) {
		option.duration = bind.value.duration;
	}
	if(bind.modifiers.interactive) {
		option.interactive = true;
	}

	for(const optionDirect of optionDirects) {
		if(bind.modifiers[optionDirect] !== undefined) {
			option[optionDirect] = bind.modifiers[optionDirect];
		}
	}

	if(bind.on) {
		for(const timing in bind.on) {
			const handle = bind.on[timing];

			if(typeof handle == 'function') {
				option[`on${timing.replace(/^./, timing[0].toUpperCase())}`] = handle;
			}
		}
	}

	return option;
};


export const install = app => {
	app.provide('$tip', function(props) {
		const elTippy = document.createElement('div');
		document.body.insertBefore(elTippy, document.body.children[0]);

		const appTippy = createApp(compTippy, props);
		appTippy.config.globalProperties.Tippy = Tippy;
		appTippy.config.globalProperties.$app = appTippy;
		appTippy.config.globalProperties.$elTippy = elTippy;
		appTippy.mount(elTippy);
	});

	const atMounted = function(el, bind) {
		if(bind.value === false) { return; }

		return Tippy(el, toOption(bind));
	};

	const atUpdate = function(el, bind) {
		if(bind.value === false) { return; }

		if(toContent(bind) != toContent(bind, true)) {
			const instance = el._tippy;

			if(instance) {
				instance.setContent(toContent(bind));
			}
			else {
				Tippy(el, toOption(bind));
			}
		}
	};

	app.directive('tip', {
		mounted: atMounted,
		updated: atUpdate,
	});
};
