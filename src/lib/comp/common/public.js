// 非标准HTML布尔属性: undefined|null|"false"|false为false, 其他任意值为true
export const parseBoolAttr = function(value) {
	return (
		value === undefined ||
		value === null ||
		value === false ||
		(typeof value == 'string' && value.toLowerCase() == 'false')
	)
		? false
		: true;
};


export const parseSwitch = function(value, name) {
	if(
		value === '' ||
		value === 'true' ||
		value === true ||
		(name && value === name)
	) {
		return true;
	}

	return false;
};


export const toCssLen=((value) =>{
	let rawTrim = String(value).trim();

	if(/^[1-9]\d*(\.\d+)?$/.test(rawTrim)) {
		return `${rawTrim}px`;
	}
	else if(rawTrim) {
		return rawTrim;
	}
	else {
		return rawTrim;
	}
});