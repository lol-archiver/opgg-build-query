import { reactive } from 'vue';
import randomString from './random.js';


export class Tab {
	constructor(id, title, typeTab, icon, typeList, module, isHidden, params) {
		this.id = id;
		this.title = title;
		this.typeTab = typeTab;
		this.icon = icon;
		this.typeList = typeList;
		this.module = module;
		this.info = {};
		this.isHidden = isHidden ?? false;
		this.params = params ?? {};
	}
}

export default class TabAdmin {
	map = {};
	key = '';

	params = [];

	histories = [];

	/** @type {Tab} */
	get now() { return this.map[this.key]; }
	get list() { return Object.values(this.map); }


	constructor(modulePre) {
		this.modulePre = modulePre;

		return reactive(this);
	}


	addIcon(title, icon, type_, module, delay = false, ...params) {
		const id = randomString();

		const [type, ...extras] = type_.split('|');

		const tab =
			(extras.includes('once') ? Object.values(this.map).find(t => t.typeList == type) : undefined) ||
			(this.map[id] = new Tab(id, title, 'icon', icon, type, module, extras.includes('hidden')));


		if(tab && !delay) { this.change(tab, ...params); }

		if(delay) { tab.paramsDelay = params; }

		return tab;
	}

	del(tab) {
		const now = this.now;

		const map = this.map;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.map[tab.id];


		if(now === tab) {
			this.histories.pop();
			const tabLast = this.histories.pop();

			if(tabLast) {
				this.change(tabLast);
			}
			else {
				this.change(map[ids[index + 1] ?? ids[index - 1]]);
			}
		}

		this.histories = this.histories
			.filter(his => his !== tab)
			.filter((his, index, arr) => his !== arr[index - 1]);
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key == tab.id) { return; }

		this.key = tab.id;
		this.modulePre = tab.module;

		tab.params = tab.paramsDelay ?? params;
		delete tab.paramsDelay;


		if(this.histories[this.histories.length - 1] !== tab) { this.histories.push(tab); }

		this.emitChanged();
	}

	emitChanged() {
		(this.changers[this.now.typeList] ?? [])
			.forEach(changer => {
				try {
					changer(this.now);
				}
				catch(error) { void 0; }
			});
	}

	changers = {};
	addChanger(type, func) { (this.changers[type] ?? (this.changers[type] = [])).push(func); }
}
