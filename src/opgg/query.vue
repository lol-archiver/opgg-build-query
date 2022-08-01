<template>
	<module>
		<Combo v-model="championNow" champion-now label="英雄" align="center" :list="champions" key-value="$$" :key-show="[renderChampion, 'name']"
			:filter="filterChampion" :open-switch="openSwitch" @update:model-value="changeChampion"
		/>

		<p-champion v-if="dataNow">
			<p-champion-info>
				<img v-tip="`${championNow.id} ${championNow.slot}`" :src="`./image/champion/${championNow.id}.png`" />
				<p-champion-name>{{championNow.title}} {{championNow.name}}</p-champion-name>
				<p-data-date>{{meta.date}} <a :href="`https://www.op.gg/modes/aram/${championNow.slot}/build`" target="_blank">OP.GG</a></p-data-date>
			</p-champion-info>
			<p-data-box>
				<p-box-title>● 推荐符文</p-box-title>
				<template v-for="(page, pid) of dataNow.pagesRune?.slice(0, 2) ?? []">
					<template v-for="(build, bid) of page.builds?.slice(0, 1) ?? []" :key="`rune-${pid}-${bid}`">
						<p-rune-box>
							<p-rates>
								<p-rate>{{(100*page.win/page.play).toFixed(2)}}% 胜</p-rate>
								<p-rate>{{(page.pick_rate*100).toFixed(2)}}% 用</p-rate>
							</p-rates>
							<p-main>
								<p-sequence bedrock>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesMain" v-tip="rune.name"
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub1" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub2" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
									/>
								</p-sequence>
								<p-sequence _last>
									<img v-for="rune of meta.seriesRune[build.primary_page_id].runesSub3" v-tip="rune.name" _sub
										:select="brop(build.primary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
									/>
								</p-sequence>
							</p-main>
							<p-sub-box>
								<p-sub>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub1" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub2" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="rune of meta.seriesRune[build.secondary_page_id].runesSub3" v-tip="rune.name" rune _sub
											:select="brop(build.secondary_rune_ids.includes(rune.id))" :src="`./image/rune/${rune.id}.png`"
										/>
									</p-sequence>
								</p-sub>
								<p-stat>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub1" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[0] == statMod.id)" :src="`./image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub2" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[1] == statMod.id)" :src="`./image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
									<p-sequence>
										<img v-for="statMod of meta.seriesStatMod.statsModSub3" v-tip="statMod.name" rune _stat
											:select="brop(build.stat_mod_ids[2] == statMod.id)" :src="`./image/statMod/${statMod.id}.png`"
										/>
									</p-sequence>
								</p-stat>
							</p-sub-box>
						</p-rune-box>
					</template>
				</template>
			</p-data-box>

			<p-data-box>
				<p-box-title>● 召唤师技能</p-box-title>
				<p-item-box v-for="(items, iid) of dataNow.spells.slice(0, 2)" :key="`spells-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.spells.find(s => s.id == id))" :key="`spell-${iid}-${sid}`">
							<img v-tip="item.name" :src="`./image/spell/${item.id}.png`" />
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>

				<p-box-title>● 技能加点</p-box-title>
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

				<p-box-title>● 出门装备</p-box-title>
				<p-item-box v-for="(items, iid) of dataNow.itemsStart.slice(0, 2)" :key="`items-start-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-start-${iid}-${sid}`">
							<img v-tip="item.name" :src="`./image/item/${item.id}.png`" />
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>

				<p-box-title>● 鞋子</p-box-title>
				<p-item-box v-for="(items, iid) of dataNow.boots.slice(0, 2)" :key="`items-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-boot-${iid}-${sid}`">
							<img v-tip="item.name" :src="`./image/item/${item.id}.png`" />
						</template>
					</p-items>
					<p-info>
						<p-rate>{{(100 * items.win / items.play).toFixed(2)}}% 胜</p-rate>
						<p-rate>{{(100 * items.pick_rate).toFixed(2)}}% 用</p-rate>
					</p-info>
				</p-item-box>
			</p-data-box>

			<p-data-box _last>
				<p-box-title>● 核心装备</p-box-title>
				<p-item-box v-for="(items, iid) of dataNow.itemsCore.slice(0,9)" :key="`items-core-${iid}`">
					<p-items>
						<template v-for="(item, sid) of items.ids.map(id=> meta.items.find(s => s.id == id))" :key="`item-core-${iid}-${sid}`">
							<img v-tip="item.name" :src="`./image/item/${item.id}.png`" />
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
	const changeChampion = async champion => {

		const a = (await import(`../../data/champion/${champion.slot}.json`)).default;

		dataNow.value = a;
	};


	const meta = ref([]);
	onMounted(async () => {
		meta.value = (await import('../../data/@meta.json')).default;

		changeChampion(championNow.value = champions.value.find(champion => champion.slot == 'morgana'));
	});

	const champions = computed(() => [...(meta.value.champions ?? [])].sort((a, b) => a.rank - b.rank));


	const renderChampion = champion => champion ? `T${champion?.tier} ${champion?.title} ${champion?.name} ${champion?.rateWin.toFixed(2)}%` : '';
	const filterChampion = (textSearch, champion) =>
		champion.slot.toLowerCase().includes(textSearch.toLowerCase())
		|| match(champion.name, textSearch)
		|| match(champion.title, textSearch)
		|| `T${champion.tier}`.toLowerCase() == textSearch.toLowerCase()
		|| champion.id == textSearch;


	const openSwitch = ref(false);
	onMounted(() => {
		window.addEventListener('keydown', event => {
			if(event.key == 'f' && event.ctrlKey) {
				openSwitch.value = !openSwitch.value;

				event.preventDefault();
			}
		});
	});
</script>

<style lang="sass" scoped>
module
	@apply block p-4
	width: 100vw
	height: 100vh

[champion-now]
	@apply relative block w-96 mb-16 h-8 leading-8 text-lg

p-champion
	@apply relative m-auto
	@apply block border border-gray-400 rounded-md bg-blue-100
	width: calc( theme("spacing.115") * 3 + 1px * 2 )


p-champion-info
	@apply block h-14 leading-10 p-2

	img
		@apply inblock w-10 h-10 mr-2 rounded-md

	p-champion-name
		@apply inblock h-10 leading-10 text-2xl font-bold

	p-data-date
		@apply inblock mr-2 h-10 leading-10 float-right

		a
			@apply underline underline-offset-4

			&:hover
				@apply text-emerald-600


p-data-box
	@apply inblock mr-2 mb-2 p-2 h-[37rem] border-r border-gray-400

	&[_last]
		@apply border-none

p-box-title
	@apply block font-bold


p-rune-box
	@apply block p-2 w-96

	p-sequence
		@apply block w-40 flex justify-between mb-8

		&[bedrock]
			@apply mb-3 pb-3 border-b border-dashed border-gray-400

		&[_last]
			@apply mb-0


	p-main
		@apply inblock p-2 border-r border-gray-400

	p-sub-box
		@apply inblock

		p-sub
			@apply block p-2 border-b border-gray-400

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
	@apply block p-2 w-115 flex justify-between

	p-skill
		@apply inblock mx-1 font-bold h-10 leading-10

		&:nth-child(1)
			@apply text-blue-500
		&:nth-child(3)
			@apply text-green-500
		&:nth-child(5)
			@apply text-orange-500
		&:nth-child(7)
			@apply text-purple-500

p-item-box
	@apply block p-2 w-115 flex justify-between

	img
		@apply inblock w-10 h-10 opacity-100 mx-1 mb-2 rounded-md

p-split
	@apply inblock w-4 h-10 leading-10 text-center font-bold text-gray-400

p-info
	@apply inblock h-10 leading-10 text-right

p-rate
	@apply inblock w-24 text-sky-600
</style>
