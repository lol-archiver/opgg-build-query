<template>
	<module>
		<Combo v-model="championNow" champion-now label="英雄" align="center" :list="champions" key-value="$$" :key-show="[renderChampion, 'name']" :filter="filterChampion" @update:model-value="changeChampion" />

		<p-champion v-if="dataNow">
			<p-champion-info>
				<p-champion-name class="inblock mr-2">{{championNow.title}} {{championNow.name}}</p-champion-name>
				<img v-tip="`${championNow.id} ${championNow.slot}`" class="inblock mr-2" :src="`../public/image/champion/${championNow.id}.png`" />
			</p-champion-info>
			<p-data-box>
				<p-data-title>● 推荐符文</p-data-title>
				<template v-for="(page, pid) of dataNow.pagesRune?.slice(0, 2) ?? []">
					<template v-for="(build, bid) of page.builds?.slice(0, 1) ?? []" :key="`rune-${pid}-${bid}`">
						<p-rune-box>
							<p-box-title>○ {{(100*page.win/page.play).toFixed(2)}}% | {{(page.pick_rate*100).toFixed(2)}}%</p-box-title>
							<p-main>
								<p-sequence bedrock>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesMain" v-tip="rune.name"
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub1" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub2" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence _last>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub3" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
									/>
								</p-sequence>
							</p-main>
							<p-sub-box>
								<p-sub>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub1" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub2" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub3" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`../public/image/rune/${rune.id}.png`"
										/>
									</p-sequence>
								</p-sub>
								<p-stat>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub1" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[0] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub2" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[1] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub3" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[2] == statMod.id)" :src="`../public/image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
								</p-stat>
							</p-sub-box>
						</p-rune-box>
					</template>
				</template>
			</p-data-box>

			<p-data-box>
				<p-data-title>● 技能加点</p-data-title>
				<p-skill-box v-for="(skills, iid) of dataNow.skills.slice(0, 2)" :key="`skills-${iid}`">
					<p-skills>
						<template v-for="(skill, sid) of skills.ids" :key="`skill-${iid}-${sid}`">
							<p-skill>{{skill}}</p-skill>
							<p-split v-if="sid < skills.ids.length - 1">&gt;</p-split>
						</template>
					</p-skills>
					<p-info>
						<p-rate>{{(100 * skills.win / skills.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * skills.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-skill-box>

				<p-data-title>● 召唤师技能</p-data-title>
				<p-item-box v-for="(items, iid) of dataNow.spells.slice(0, 2)" :key="`spells-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.spells.find(s => s.id == id))" :key="`spell-${iid}-${sid}`">
							<img v-tip="item.name" :src="`../public/image/spell/${item.id}.png`" />
							<p-split v-if="sid < items.ids.length - 1">&gt;</p-split>
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>

				<p-data-title>● 出门装备</p-data-title>
				<p-item-box v-for="(items, iid) of dataNow.itemsStart.slice(0, 2)" :key="`items-start-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-start-${iid}-${sid}`">
							<img v-tip="item.name" :src="`../public/image/item/${item.id}.png`" />
							<p-split v-if="sid < items.ids.length - 1">&gt;</p-split>
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>

				<p-data-title>● 鞋子</p-data-title>
				<p-item-box v-for="(items, iid) of dataNow.boots.slice(0, 2)" :key="`items-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-boot-${iid}-${sid}`">
							<img v-tip="item.name" :src="`../public/image/item/${item.id}.png`" />
							<p-split v-if="sid < items.ids.length - 1">&gt;</p-split>
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>
			</p-data-box>

			<p-data-box _last>
				<p-data-title>● 核心装备</p-data-title>
				<p-item-box v-for="(items, iid) of dataNow.itemsCore.slice(0,9)" :key="`items-core-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-core-${iid}-${sid}`">
							<img v-tip="item.name" :src="`../public/image/item/${item.id}.png`" />
							<p-split v-if="sid < items.ids.length - 1">&gt;</p-split>
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>
			</p-data-box>
		</p-champion>
	</module>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { match } from 'pinyin-pro';

	import Combo from '../lib/comp/Combo.vue';



	const dataNow = ref(null);
	const championNow = ref(null);
	const changeChampion = async champion => dataNow.value = await (await fetch(`./champion/${champion.slot}.json`)).json();


	const meta = ref([]);
	onMounted(async () => {
		meta.value = await (await fetch('./@meta.json')).json();

		changeChampion(championNow.value = champions.value.find(champion => champion.slot == 'neeko'));
	});

	const champions = computed(() => [...(meta.value.champions ?? [])].sort((a, b) => a.rank - b.rank));


	const renderChampion = champion => champion ? `T${champion?.tier} ${champion?.title} ${champion?.name} ${champion?.rateWin.toFixed(2)}%` : '';
	const filterChampion = (textSearch, champion) =>
		champion.slot.toLowerCase().includes(textSearch.toLowerCase())
		|| match(champion.name, textSearch)
		|| match(champion.title, textSearch)
		|| `T${champion.tier}`.toLowerCase() == textSearch.toLowerCase()
		|| champion.id == textSearch;


</script>

<style lang="sass" scoped>
module
	@apply block p-2

[champion-now]
	@apply block w-72 mb-4 h-8 leading-8 text-lg

p-champion
	@apply relative left-1/2 -translate-x-1/2
	@apply block border border-gray-400 rounded-md bg-blue-100
	width: calc( 26rem * 3 + 1px * 2 )

p-champion-info
	@apply block leading-10 text-xl font-bold p-2

	img
		@apply inblock w-10 h-10


p-data-box
	@apply inblock mr-2 mb-2 p-2 h-[37rem] border-r border-gray-400

	&[_last]
		@apply border-none

p-data-title, p-box-title
	@apply block font-bold


p-rune-box
	@apply block p-2 w-96

	p-sequence
		@apply block w-40 flex justify-between mb-8

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

	img
		@apply inblock w-10 h-10 filter grayscale opacity-40

		&[select]
			@apply grayscale-0 opacity-100
		&[_sub]
			@apply w-8 h-8
		&[_stat]
			@apply w-6 h-6


p-skill-box
	@apply block p-2 w-96 flex justify-between

	p-skill
		@apply inblock mx-1 font-bold

		&:nth-child(1)
			@apply text-blue-500
		&:nth-child(3)
			@apply text-green-500
		&:nth-child(5)
			@apply text-orange-500
		&:nth-child(7)
			@apply text-purple-500

p-item-box
	@apply block p-2 w-96 flex justify-between

	img
		@apply inblock w-10 h-10 opacity-100 mx-1 mb-2 rounded-md

	p-split
		@apply inblock w-4 h-10 leading-10 text-center font-bold text-gray-400

p-info
	@apply inblock h-10 leading-10 text-right

	p-rate
		@apply inblock w-24 text-sky-600
</style>
