const randomString = function(len = 32) {
	let dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let max = dict.length;

	let result = '';

	for(let i = 0; i < len; i++) {
		result += dict.charAt(Math.floor(Math.random() * max));
	}

	return result;
};

export default randomString;
