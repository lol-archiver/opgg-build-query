import './index.env.js';

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

import { Moment } from '@nuogz/pangu';

import Axios from 'axios';
import { ensureDirSync } from 'fs-extra';



const championsID = Object.values(JSON.parse(readFileSync('./data/zh_cn.json')));
const { data: htmlMode } = await Axios.get('https://www.op.gg/modes/aram', { headers: { 'accept-language': 'zh-CN' } });
const dataMain = JSON.parse(htmlMode.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script/)[1]);


const metaRaw = dataMain.props.pageProps.data.meta;

const champions = dataMain.props.pageProps.championRankingList.map(champion => {
	const championID = championsID.find(championID => championID.slot.toLowerCase() == champion.key.toLowerCase());

	return {
		id: championID.id,
		slot: champion.key,
		name: championID.name,
		title: champion.name,
		rateWin: champion.positionWinRate,
		ratePick: champion.positionPickRate,
		roles: champion.roles,
		tier: champion.positionTier,
		rank: champion.positionRank,
		kda: champion.kda,
	};
});
const spells = metaRaw.spells.map(spell => {
	return {
		id: spell.id,
		key: spell.key,
		name: spell.name,
		description: spell.description,
	};
});
const items = metaRaw.items.map(item => {
	return {
		id: item.id,
		name: item.name,
		description: item.description,
	};
});



const meta = {
	champions,
	spells,
	items,
	date: Moment().add(-1, 'day').format('YYYY-MM-DD')
};

meta.seriesRune = metaRaw.runePages.reduce((seriesRune, series) => {
	seriesRune[series.id] = series;

	series.runesMain = metaRaw.runes.filter(r => r.page_id == series.id && r.slot_sequence == 0).sort((a, b) => a.rune_sequence - b.rune_sequence);
	series.runesSub1 = metaRaw.runes.filter(r => r.page_id == series.id && r.slot_sequence == 1).sort((a, b) => a.rune_sequence - b.rune_sequence);
	series.runesSub2 = metaRaw.runes.filter(r => r.page_id == series.id && r.slot_sequence == 2).sort((a, b) => a.rune_sequence - b.rune_sequence);
	series.runesSub3 = metaRaw.runes.filter(r => r.page_id == series.id && r.slot_sequence == 3).sort((a, b) => a.rune_sequence - b.rune_sequence);

	return seriesRune;
}, {});

meta.seriesStatMod = {
	statsModSub1: [5008, 5005, 5007].map(id => metaRaw.statMods.find(sm => sm.id == id)),
	statsModSub2: [5008, 5002, 5003].map(id => metaRaw.statMods.find(sm => sm.id == id)),
	statsModSub3: [5001, 5002, 5003].map(id => metaRaw.statMods.find(sm => sm.id == id)),
};


writeFileSync('./public/@meta.json', JSON.stringify(meta, null, '\t'));



const fetchDirect = async (url, file, ...datasLog) => {
	const { data: buffer } = await Axios.get(url, { headers: { 'accept-language': 'zh-CN' }, responseType: 'arraybuffer' });

	writeFileSync(file, buffer);

	console.log('已下载', ...datasLog);

};
const fetch = async (url, file, ...datasLog) => {
	if(!existsSync(file)) { return fetchDirect(url, file, ...datasLog); }


	const response = await Axios.head(url, { headers: { 'accept-language': 'zh-CN' }, responseType: 'arraybuffer' });
	const etag = JSON.parse(response.headers.etag).toLowerCase();

	const md5 = createHash('md5').update(readFileSync(file)).digest('hex').toLowerCase();

	if(md5 != etag) { return fetchDirect(url, file, ...datasLog); }
};

ensureDirSync(resolve('public', 'image', 'champion'));
for(const champion of dataMain.props.pageProps.championRankingList) {
	const file = resolve('public', 'image', 'champion', `${champion.id}.png`);

	await fetch(champion.image_url, file, '英雄图片', champion.id, champion.name);
}

ensureDirSync(resolve('public', 'image', 'rune'));
for(const rune of metaRaw.runes) {
	const file = resolve('public', 'image', 'rune', `${rune.id}.png`);

	await fetch(rune.image_url, file, '符文图片', rune.id, rune.name);
}

ensureDirSync(resolve('public', 'image', 'statMod'));
for(const statMod of metaRaw.statMods) {
	const file = resolve('public', 'image', 'statMod', `${statMod.id}.png`);

	await fetch(statMod.image_url, file, '属性符文图片', statMod.id, statMod.name);
}

ensureDirSync(resolve('public', 'image', 'spell'));
for(const spell of metaRaw.spells) {
	const file = resolve('public', 'image', 'spell', `${spell.id}.png`);

	await fetch(spell.image_url, file, '召唤师技能图片', spell.id, spell.name);
}

ensureDirSync(resolve('public', 'image', 'item'));
for(const item of metaRaw.items) {
	const file = resolve('public', 'image', 'item', `${item.id}.png`);

	await fetch(item.image_url, file, '装备图片', item.id, item.name);
}



const idBuild = dataMain.buildId;
for(const champion of champions) {
	const { data: build } = await Axios.get(`https://www.op.gg/_next/data/${idBuild}/modes/aram/${champion.slot}/build.json?champion=${champion.slot}`, { headers: { 'accept-language': 'zh-CN' } });

	writeFileSync(`./public/champion/${champion.slot}.json`, JSON.stringify({
		pagesRune: build.pageProps.data.rune_pages,
		spells: build.pageProps.data.summoner_spells,
		skills: build.pageProps.data.skill_masteries,
		itemsStart: build.pageProps.data.starter_items,
		boots: build.pageProps.data.boots,
		itemsCore: build.pageProps.data.core_items,
	}, null, '\t'));

	console.log(champion.name);
}

console.log('done');
