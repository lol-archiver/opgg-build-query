<template>
	<comp-grid>
		<p-head-wrapper>
			<table header>
				<tr>
					<th v-for="meta of metas">{{meta.title}}</th>
				</tr>
			</table>
		</p-head-wrapper>
		<p-body-wrapper>
			<table>
				<tr v-for="data of props.datas">
					<td v-for="meta of metas" :title="data[meta.key]">{{data[meta.key]}}</td>
				</tr>
			</table>
		</p-body-wrapper>
	</comp-grid>
</template>

<script setup>
	import { computed, nextTick, onMounted, ref, watch } from 'vue';

	import { copyJSON } from '../../../lib/global/tool.js';



	const props = defineProps({
		// 列表数据
		metas: { type: Array, default: () => [] },
		// 数据
		datas: { type: Array, default: () => [] },
	});

	const metas = computed(() => copyJSON(props.metas));
</script>

<style lang="sass" scoped>
comp-grid
	@apply block overflow-hidden p-2
	height: 100vh

	>p-head-wrapper
		@apply block overflow-y-scroll
	>p-body-wrapper
		@apply block overflow-x-hidden overflow-y-scroll
		height: calc(100% - (theme("spacing.6")))

	table
		@apply w-full table-fixed border border-gray-200

		table[header]
			@apply w-full
			background-color: var(--colorMainLight)
			color: var(--colorTextMain)

		th, td
			@apply text-sm text-center h-5 px-1 border border-gray-400 whitespace-nowrap overflow-ellipsis overflow-hidden
</style>
