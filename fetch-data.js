import { writeFileSync, readFileSync, existsSync } from 'fs';

import Axios from 'axios';
import { resolve } from 'path';
import { ensureDirSync } from 'fs-extra';



const championsID = Object.values(JSON.parse(readFileSync('./data/zh_cn.json')));
const { data: htmlMode } = await Axios.get('https://www.op.gg/modes/aram', { headers: { 'accept-language': 'zh-CN' } });
const dataMain = JSON.parse(htmlMode.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script/)[1]);
writeFileSync('./src/public/dataMain.json', JSON.stringify(dataMain.props, null, '\t'));



const champions = dataMain.props.pageProps.championRankingList.map(champion => {
	const championID = championsID.find(championID => championID.slot.toLowerCase() == champion.key.toLowerCase());
	return {
		id: championID.id,
		slot: champion.key,
		name: championID.name,
		title: champion.name,
		rateWin: champion.positionWinRate,
		ratePick: champion.positionPickRate,
		tier: champion.positionTier,
		rank: champion.positionRank,
		kda: champion.kda,
	};
});

const metaRaw = dataMain.props.pageProps.data.meta;

const meta = {
	champions,
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


writeFileSync('./src/public/@meta.json', JSON.stringify(meta, null, '\t'));


ensureDirSync(resolve('src', 'public', 'image', 'rune'));
for(const rune of metaRaw.runes) {
	const file = resolve('src', 'public', 'image', 'rune', `${rune.id}.png`);

	if(!existsSync(file)) {
		const { data: buffer } = await Axios.get(rune.image_url, { headers: { 'accept-language': 'zh-CN' }, responseType: 'arraybuffer' });

		writeFileSync(file, buffer);

		console.log('已下载', '符文图片', rune.id, rune.name);
	}
}

ensureDirSync(resolve('src', 'public', 'image', 'statMod'));
for(const statMod of metaRaw.statMods) {
	const file = resolve('src', 'public', 'image', 'statMod', `${statMod.id}.png`);

	if(!existsSync(file)) {
		const { data: buffer } = await Axios.get(statMod.image_url, { headers: { 'accept-language': 'zh-CN' }, responseType: 'arraybuffer' });

		writeFileSync(file, buffer);

		console.log('已下载', '符文属性图片', statMod.id, statMod.name);
	}
}



const idBuild = dataMain.buildId;
for(const champion of champions.slice(0, 0)) {
	const { data: build } = await Axios.get(`https://www.op.gg/_next/data/${idBuild}/modes/aram/${champion.slot}/build.json?champion=${champion.slot}`, { headers: { 'accept-language': 'zh-CN' } });

	writeFileSync(`./src/public/${champion.slot}.json`, JSON.stringify({
		pagesRune: build.pageProps.data.rune_pages
	}, null, '\t'));

	console.log(champion.name);
}
