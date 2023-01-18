import './index.env.js';

import { createHash } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { Agent } from 'https';
import { resolve } from 'path';

import { C, G, Moment } from '@nuogz/pangu';

import Axios from 'axios';
import AxiosRetry from 'axios-retry';

import { ensureDirSync } from 'fs-extra';
import HttpsProxyAgent from 'https-proxy-agent';



AxiosRetry(Axios, { retries: 3 });


const championsID = Object.values(JSON.parse(readFileSync('./data/zh_cn.json')));


const proxy = C.proxy?.$ ? new HttpsProxyAgent(C.proxy?.$) : new Agent({ rejectUnauthorized: false });
const configRequest = { headers: { 'accept-language': 'zh-CN' }, httpsAgent: proxy };


const fetchDirect = async (url, file, ...datasLog) => {
	const { data: buffer } = await Axios.get(url, { ...configRequest, responseType: 'arraybuffer' });

	writeFileSync(file, buffer);

	console.log('已下载', ...datasLog);

};
const fetchFile = async (url, file, ...datasLog) => {
	if(!existsSync(file)) { return fetchDirect(url, file, ...datasLog); }


	const response = await Axios.head(url, { ...configRequest, responseType: 'arraybuffer' });
	const etag = JSON.parse(response.headers.etag).toLowerCase();

	const md5 = createHash('md5').update(readFileSync(file)).digest('hex').toLowerCase();

	if(md5 != etag) { return fetchDirect(url, file, ...datasLog); }
};


const parseMeta = (championsRaw, metaRaw) => {
	const champions = championsRaw.map(champion => {
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
		date: Moment().add(-1, 'day').format('YYYY-MM-DD'),
		champions,
		spells,
		items,
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

	return meta;
};

const fetchChampions = async (idBuild, meta) => {
	const { champions } = meta;

	for(const champion of champions) {
		const { data: build } = await Axios.get(`https://www.op.gg/_next/data/${idBuild}/modes/aram/${champion.slot}/build.json?champion=${champion.slot}`, configRequest);

		writeFileSync(`./data/champion/${champion.slot}.json`, JSON.stringify({
			pagesRune: build.pageProps.data.rune_pages,
			spells: build.pageProps.data.summoner_spells,
			skills: build.pageProps.data.skill_masteries,
			itemsStart: build.pageProps.data.starter_items,
			boots: build.pageProps.data.boots,
			itemsCore: build.pageProps.data.core_items,
		}, null, '\t'));

		console.log(champion.name);
	}
};


const ensureChampion = async champions => {
	console.log('ensure champion');
	ensureDirSync(resolve('public', 'image', 'champion'));

	for(const champion of champions) {
		const file = resolve('public', 'image', 'champion', `${champion.id}.png`);

		await fetchFile(champion.image_url, file, '英雄图片', champion.id, champion.name);
	}
};
const ensureRune = async runes => {
	console.log('同步 符文图片');
	ensureDirSync(resolve('public', 'image', 'rune'));

	for(const rune of runes) {
		const file = resolve('public', 'image', 'rune', `${rune.id}.png`);

		await fetchFile(rune.image_url, file, '符文图片', rune.id, rune.name);
	}
};
const ensureStatMod = async statMods => {
	console.log('同步 属性符文图片');
	ensureDirSync(resolve('public', 'image', 'statMod'));

	for(const statMod of statMods) {
		const file = resolve('public', 'image', 'statMod', `${statMod.id}.png`);

		await fetchFile(statMod.image_url, file, '属性符文图片', statMod.id, statMod.name);
	}
};
const ensureSpell = async spells => {
	console.log('同步 召唤师技能图片');
	ensureDirSync(resolve('public', 'image', 'spell'));

	for(const spell of spells) {
		const file = resolve('public', 'image', 'spell', `${spell.id}.png`);

		await fetchFile(spell.image_url, file, '召唤师技能图片', spell.id, spell.name);
	}
};
const ensureItem = async items => {
	console.log('同步 装备图片');
	ensureDirSync(resolve('public', 'image', 'item'));

	for(const item of items) {
		G.infoU('更新~[道具]', `更新 ~{${item.name}(${item.id})}`, '○');

		const file = resolve('public', 'image', 'item', `${item.id}.png`);

		await fetchFile(item.image_url, file, '装备图片', item.id, item.name);

		G.info('更新~[道具]', `更新 ~{${item.name}(${item.id})}`, '✔');
	}
};



try {
	const { data: htmlMode } = await Axios.get('https://www.op.gg/modes/aram', configRequest);
	const dataNext = JSON.parse(htmlMode.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script/)[1]);

	const propsPage = dataNext.props.pageProps;
	const metaRaw = propsPage.data.meta;

	const meta = await parseMeta(propsPage.championRankingList, metaRaw);
	writeFileSync('./data/@meta.json', JSON.stringify(meta, null, '\t'));


	await fetchChampions(dataNext.buildId, meta);
	await ensureChampion(propsPage.championRankingList);
	await ensureRune(metaRaw.runes);
	await ensureStatMod(metaRaw.statMods);
	await ensureSpell(metaRaw.spells);
	await ensureItem(metaRaw.items);
}
catch(error) {
	G.error('主线', '更新', error);
}


console.log('done');
