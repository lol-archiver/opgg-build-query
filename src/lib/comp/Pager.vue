<template>
	<comp-pager>
		<!-- 左翻 -->
		<p-button :class="{ invalid: pageNow == 1 }" class="rounded-l-lg" @click.exact="atOffset(-1)">
			<Fas icon="angle-left" />
		</p-button>
		<!-- 当前页数 -->

		<input v-model="pageNow" type="text" class="inblock align-top value"	@keyup.enter="atOffset(0)" />
		<div class="inblock align-top spliter">/</div>
		<!-- 最大页数 -->
		<div class="inblock align-top page">{{pageMax}}</div>
		<!-- 右翻 -->
		<p-button :class="{ invalid: pageNow >= pageMax }" class="rounded-r-lg" @click="atOffset(1)">
			<Fas icon="angle-right" />
		</p-button>
		<div v-if="!hider_().total" class="inblock ml-2 select-none">共 {{total}} 条</div>
	</comp-pager>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';

	const props = defineProps({
		// update主值-当前页
		modelValue: { type: Number, default: 0 },
		// 单页限制
		limit: { type: Number, default: 20 },
		// 总数
		total:{ type: Number, default: 0 },
		// 隐藏选项
		hider: { type: String, default: ''}
	});

	const pageMax = computed(() => Math.ceil(props.total / props.limit) || 0);
	const pageNow = ref(props.modelValue);


	// 隐藏器
	const hider_ = () => {
		let result = {
			total: false
		};

		if(props.hider) {
			for(let hider of props.hider.split('|')) {
				result[hider] = true;
			}
		}

		return result;
	};

	const emit = defineEmits(['update:modelValue', 'update:value']);

	watch(() => props.modelValue, modelValue => {
		pageNow.value = modelValue;
	});

	watch([pageNow], ([value], [valuePrev]) => {
		if(value != valuePrev) {
			emit('update:value', value);
		}
	});

	const atOffset=(offset =>{
		const newPage = ~~pageNow.value + ~~offset;

		if(newPage >= 1 && newPage <= pageMax.value) {
			pageNow.value=newPage;
			emit('update:modelValue', newPage);
		}
	});
</script>

<style lang="sass" scoped>
comp-pager
	@apply relative

	>*
		@apply border-none text-center bg-transparent

	p-button
		@apply relative box-border cursor-pointer h-full inblock align-top border-2 border-solid border-transparent
		width: 2rem
		font-size: 1.4rem
		line-height: 1.8rem
		box-shadow: 0px -6px 10px rgb(255 255 255), 0px 4px 15px rgb(0 0 0 / 15%)

		&:not(.split):hover
			color: var(--colorMain)
			border-color: steelblue

		&.invalid
			@apply cursor-not-allowed
			color: lightgray

			&:hover
				@apply bg-transparent
				border-color: steelblue

	.value
		@apply relative box-border h-full p-0 outline-none align-baseline border-b-2 border-solid

		width: 2.4rem
		color: var(--colorText)
		border-image: linear-gradient(90deg, var(--colorMain) 64%, rgba(1,133,224,0.7) 92%) 1
		font-size: inherit
		line-height: inherit

		&:hover
			border-image: linear-gradient(270deg, var(--colorMain) 64%, rgba(1,133,224,0.7) 92%) 1
.page
	width: 2.4rem
</style>