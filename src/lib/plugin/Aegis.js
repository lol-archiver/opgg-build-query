import Axios from 'axios';
import { $alert } from './Alert.vue';



export let prefixDefault = './api';


export const parseURLAction = (action, prefix = prefixDefault) => {
	return `${prefix}${prefix.endsWith('/') ? '' : '/'}${action}`;
};


const parseResult = async (result) => {
	if(result.success) {
		if(result.message && $alert) { await $alert(result.message); }

		return result.data;
	}
	else {
		throw result.message || '请求不成功';
	}
};


export const $get = async (action, params, configRaw_ = {}) => {
	const config = Object.assign({ params }, configRaw_);

	const urlAction = parseURLAction(action, config.prefix);
	delete config.prefix;

	const typeReturn = config.return ?? 'data';
	delete config.return;


	const response = await Axios.get(urlAction, config);


	if(typeReturn == 'response') { return response; }
	if(typeReturn == 'raw') { return response.data; }
	else { return parseResult(response.data); }
};

export const $post = async (action, params, configRaw = {}, alertUnSuccess = false) => {
	const urlAction = parseURLAction(action, configRaw.prefix);

	const config = Object.assign({}, configRaw);

	if(params instanceof FormData) {
		if(typeof config.headers == 'object' && config.headers) {
			config.headers['Content-Type'] = 'multipart/form-data';
		}
		else {
			config.headers = { 'Content-Type': 'multipart/form-data' };
		}
	}

	const response = await Axios.post(urlAction, params, config);

	return parseResult(response.data);
};

export const $jump = async (action, params, configRaw = {}) => {
	const urlAction = parseURLAction(action, configRaw.prefix);
	let query = '';

	for(let key in params) {
		if(params[key]) {
			if(typeof params[key] == 'object') {
				query += `&${key}=${JSON.stringify(params[key])}`;
			}
			else {
				query += `&${key}=${params[key]}`;
			}
		}
	}
	query = query.replace(/^&/, '');

	window.location.href = `${urlAction}?${query}`;
};


export const install = app => { };
