<template>
	<module>
		<Combo v-model="idChampionNow" class="block w-1/2" :list="champions" key-value="id" :key-show="[renderChampion, 'name']" :filter="filterChampion" @update:model-value="changeChampion" />
		<!-- <p-champ v-for="champion of championsFilter" :key="`rl-${champion.id}`">
			{{champion.title}}
			{{champion.name}}
			{{champion.tier}}
			{{champion.rateWin.toFixed(2)}}%
		</p-champ> -->

		<p-data-title>● 推荐符文</p-data-title>
		<p-data-box>
			<template v-for="(page, pid) of championNow.pagesRune?.slice(0, 2) ?? []">
				<template v-for="(build, bid) of page.builds?.slice(0, 1) ?? []" :key="`rune-set-${pid}-${bid}`">
					<p-rune-box>
						<p-title>○ 胜率：{{(100*page.win/page.play).toFixed(2)}}% 使用率：{{(page.pick_rate*100).toFixed(2)}}%</p-title>
						<p-main>
							<p-sequence bedrock>
								<template v-for="rune of meta.seriesRune[build.primary_page_id].runesMain">
									<img v-tip="rune.name" rune :select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
								</template>
							</p-sequence>
							<p-sequence>
								<template v-for="rune of meta.seriesRune[build.primary_page_id].runesSub1">
									<img v-tip="rune.name" rune _sub :select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
								</template>
							</p-sequence>
							<p-sequence>
								<template v-for="rune of meta.seriesRune[build.primary_page_id].runesSub2">
									<img v-tip="rune.name" rune _sub :select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
								</template>
							</p-sequence>
							<p-sequence _last>
								<template v-for="rune of meta.seriesRune[build.primary_page_id].runesSub3">
									<img v-tip="rune.name" rune _sub :select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
								</template>
							</p-sequence>
						</p-main>
						<p-sub-box>
							<p-sub>
								<p-sequence>
									<template v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub1">
										<img v-tip="rune.name" rune _sub :select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
									</template>
								</p-sequence>
								<p-sequence>
									<template v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub2">
										<img v-tip="rune.name" rune _sub :select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
									</template>
								</p-sequence>
								<p-sequence>
									<template v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub3">
										<img v-tip="rune.name" rune _sub :select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`" />
									</template>
								</p-sequence>
							</p-sub>
							<p-stat>
								<p-sequence>
									<template v-for="statMod of meta.seriesStatMod.statsModSub1">
										<img v-tip="statMod.name" rune _stat :select="brop(build.stat_mod_ids[0] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`" />
									</template>
								</p-sequence>
								<p-sequence>
									<template v-for="statMod of meta.seriesStatMod.statsModSub2">
										<img v-tip="statMod.name" rune _stat :select="brop(build.stat_mod_ids[1] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`" />
									</template>
								</p-sequence>
								<p-sequence>
									<template v-for="statMod of meta.seriesStatMod.statsModSub3">
										<img v-tip="statMod.name" rune _stat :select="brop(build.stat_mod_ids[2] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`" />
									</template>
								</p-sequence>
							</p-stat>
						</p-sub-box>
					</p-rune-box>
				</template>
			</template>
		</p-data-box>
	</module>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { match } from 'pinyin-pro';

	import Combo from '../lib/comp/Combo.vue';


	const meta = ref([]);
	onMounted(async () => meta.value = await (await fetch('./@meta.json')).json());

	const champions = computed(() => [...(meta.value.champions ?? [])].sort((a, b) => a.rank - b.rank));


	const renderChampion = champion => {
		return champion ? `T${champion?.tier} ${champion?.title} ${champion?.name} ${champion?.rateWin.toFixed(2)}%` : '';
	};
	const filterChampion = (textSearch, champion) => {
		return champion.slot.toLowerCase().includes(textSearch.toLowerCase())
			|| match(champion.name, textSearch)
			|| match(champion.title, textSearch)
			|| `T${champion.tier}`.toLowerCase() == textSearch.toLowerCase()
			|| champion.id == textSearch;
	};

	const idChampionNow = ref('');
	const championNow = ref({});
	const changeChampion = async id => {
		const champion = champions.value.find(champion => champion.id == id);

		championNow.value = await (await fetch(`./${champion.slot}.json`)).json();
	};

	onMounted(async () => championNow.value = await (await fetch('./morgana.json')).json());
</script>

<style lang="sass" scoped>
module
	@apply block p-2

p-data-title
	@apply block font-bold

p-data-box
	@apply block mx-4


p-rune-box
	@apply block p-2


	p-title
		@apply block


	p-sequence
		@apply block w-48 flex justify-between mb-8

		&[bedrock]
			@apply mb-3 border-b-2 border-dashed pb-3

		&[_last]
			@apply mb-0


	p-main
		@apply inblock p-2 border-r-2

	p-sub-box
		@apply inblock

		p-sub
			@apply block p-2 border-b-2

		p-stat
			@apply block p-2

		p-sequence
			@apply mb-2




	img[rune]
		@apply inblock w-10 h-10 filter grayscale opacity-40

		&[select]
			@apply grayscale-0 opacity-100
		&[_sub]
			@apply w-8 h-8
		&[_stat]
			@apply w-6 h-6
</style>
