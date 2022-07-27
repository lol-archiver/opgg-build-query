const HTML = document.documentElement;

export const CV = Object.freeze({
	set(key, value, scope = HTML) { scope.style.setProperty(`--${key}`, value); },
	get(key, scope = HTML) { return scope.style.getPropertyValue(`--${key}`); },
	del(key, scope = HTML) { return scope.style.removeProperty(`--${key}`); },
	setAll(values, scope = HTML) { for(const key in values) { CV.set(key, values[key], scope); } },
});


export const install = app => { };
