<template>
	<comp-combo>
		<!-- 禁用 -->
		<p-disabling v-if="disabling_" :checked="brop(!disable_)" @click="disable_ = ! disable_" />

		<!-- 标签 -->
		<p-label v-if="label_" :style="styleLabel" @click="disabling_ && (disable_ = ! disable_)">{{ label_ }}</p-label>

		<!-- 输入框 -->
		<p-value ref="domValue" :hide-outline="brop(isShowDrop)" :only="brop(!disabling_ && !label_)" @click="!disable_ && !readonly_ && atClickDrop()">
			<input
				ref="domValue"
				:value="textShow"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="true"
				:disabled="disable_"
			/>
			<!-- <FA :icon="isShowDrop?'angle-up':'angle-down'" swap-opacity class="w-4 trans" /> -->
		</p-value>

		<!-- 下拉列表 -->
		<p-drop ref="domDrop" tabindex="0" :style="{ width: widthDrop, minWidth: widthDropMin }">
			<p-filter v-show="filter_">
				<p-tip>搜索</p-tip>
				<Texter v-model="textFilter" filter :focus-switch="switchFocus" />
			</p-filter>
			<p-options v-if="optionsSelected.length" selected>
				<p-tip>已选</p-tip>
				<p-option v-for="(option, oid) of optionsSelected" :key="`combo-option-${oid}`"
					:selected="brop(option.selected)"
					:title="option.data?.[props.keyValue] ?? renderShow(option.data)"
					:style="{ textAlign: align }"
					@click="atClickSelect(option)"
				>
					{{renderShow(option.data)}}
				</p-option>
			</p-options>
			<p-options>
				<p-tip>未选</p-tip>
				<p-option v-if="!options.length" :style="{ textAlign: align }" disabled>无可用选项</p-option>
				<p-option v-for="(option, oid) of optionsUnselected" :key="`combo-option-${oid}`"
					:selected="brop(option.selected)"
					:title="option.data?.[props.keyValue] ?? renderShow(option.data)"
					:style="{ textAlign: align }"
					@click="atClickSelect(option)"
				>
					{{renderShow(option.data)}}
				</p-option>
			</p-options>
		</p-drop>
	</comp-combo>
</template>

<script setup>
	import { computed, onMounted, ref, watch } from 'vue';
	import Tippy from 'tippy.js';

	import { props as propsLabel, setup as setupLabel } from './common/label.js';
	import { parseBoolAttr } from './common/public.js';

	import Texter from './Texter.vue';


	const props = defineProps({
		// update主值
		modelValue: { type: [String, Number, Boolean, Array, Object], default: '' },
		// update是否禁用
		disable: { type: Boolean, default: false },
		// update综合主值
		text: { type: String, default: '' },
		// disabling启用下的默认值
		default: { type: [String, Number, Boolean], default: '' },

		// eslint-disable-next-line vue/valid-define-props
		...propsLabel,


		// boolean是否显示禁用框
		disabling: { type: [String, Boolean], default: false },
		// boolean是否制度
		readonly: { type: [String, Boolean], default: false },


		// 留空提示
		place: { type: [Number, String], default: '' },
		// 焦点顺序
		tab: { type: [Number, String], default: 0 },
		// 文本对齐方式
		align: { type: String, default: null },

		// 下拉列表
		list: { type: Array, default: () => ([]) },
		// 筛选参数
		filter: { type: [String, Boolean, Function], default: false },
		// 多选
		multiSelect: { type: [String, Boolean], default: false },
		// 显示键值
		keyShow: { type: [String, Function, Array], default: 'text' },
		// 数据键值
		keyValue: { type: String, default: 'value' },
	});
	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);


	const multiSelect_ = computed(() => props.multiSelect === 'array' ? props.multiSelect : parseBoolAttr(props.multiSelect));
	const disabling_ = computed(() => parseBoolAttr(props.disabling));
	const readonly_ = computed(() => parseBoolAttr(props.readonly));

	const { label_, labelWidth_, labelAlign_ } = setupLabel(props, disabling_);

	const styleLabel = computed(() => ({ width: labelWidth_.value, textAlign: labelAlign_.value }));

	const value_ = ref(disabling_.value ? (props.modelValue === false ? props.default : props.modelValue) : props.modelValue);
	const disable_ = ref(disabling_.value ? (props.modelValue === false ? true : false) : props.disable);

	watch(() => props.disable, disable => {
		if(!disabling_.value) {
			disable_.value = disable;
		}
	});
	watch(() => props.modelValue, modelValue => {
		if(disabling_.value) {
			if(modelValue === false) {
				disable_.value = true;
			}
			else {
				disable_.value = false;
				value_.value = modelValue;
			}
		}
		else {
			value_.value = modelValue;
		}
	});
	watch([value_, disable_], ([value, disable], [valuePrev, disablePrev]) => {
		if(disabling_.value) {
			if(value != valuePrev) {
				emit('update:value', value);
			}
			if(disable != disablePrev) {
				emit('update:disable', disable);
			}

			emit('update:modelValue', disable === true ? false : value);
		}
		else {
			emit('update:modelValue', value);
		}
	});


	const values_ = computed(() => {
		const valueNow = value_.value;

		if(multiSelect_.value) {
			if(valueNow instanceof Array) {
				return valueNow.filter(v => v);
			}
			else if(valueNow) {
				return String(valueNow).split(',').map(v => v.trim()).filter(v => v);
			}
			else {
				return [];
			}
		}
		else {
			return [valueNow];
		}
	});



	// 计算是否被选中
	const isEqual = (valueNow, valueOption) =>
		(valueOption === null || typeof valueOption == 'undefined' || typeof valueOption == 'boolean')
			? valueNow === valueOption
			: valueNow == valueOption;

	const isSelect = option => {
		const values = values_.value;
		const target = props.keyValue == '$$' ? option : option[props.keyValue];

		return multiSelect_.value
			? !!~values.findIndex(value => isEqual(value, target))
			: isEqual(values[0], target);
	};


	// 默认过滤函数
	const textFilter = ref('');
	const filter_ = computed(() => typeof props.filter == 'function' ? props.filter : parseBoolAttr(props.filter));
	const filter = (option, index, options) => {
		const serach = textFilter.value?.trim() ?? '';

		const filterNow = filter_.value;
		if(!filterNow) { return true; }

		if(typeof filterNow == 'function') { return filterNow(serach, option.data, option, index, options); }

		return renderShow(option.data)?.includes(serach);
	};


	// 主列表, 决定本地列表或远程列表
	const listRaw = computed(() => props.list);

	// 主列表封装
	const options = computed(() => {
		return listRaw.value.map(data => ({ selected: isSelect(data), data }));
		// .sort((a, b) => ~~b.selected - ~~a.selected);
	});
	const optionsSelected = computed(() => options.value.filter(option => option.selected));
	const optionsUnselected = computed(() =>
		options.value.filter(option => !option.selected)
			.filter((option, index, options) => filter(option, index, options))
			.filter(option => !option.data?.hidden)
	);


	const renderShow = (data, type = 0) => {
		const keyShow = props.keyShow instanceof Array
			? props.keyShow[type]
			: props.keyShow;

		if(typeof keyShow == 'function') {
			return keyShow(data) ?? '';
		}

		return data?.[keyShow] ?? '';
	};
	const textShow = computed(() =>
		values_.value
			.map(v => renderShow(listRaw.value.find(data => isEqual(props.keyValue == '$$' ? data : data?.[props.keyValue], v)), 1))
			.join('、')
	);


	const domValue = ref(null);
	const domDrop = ref(null);

	const tippyDrop = ref(null);
	const widthDrop = ref('');
	const widthDropMin = ref('');

	const isShowDrop = ref(false);
	const atShowDrop = () => { isShowDrop.value = true; };
	const atHideDrop = () => { isShowDrop.value = false; };

	const switchFocus = ref(false);

	const atClickDrop = () => {
		if(tippyDrop.value.state.isShown) {
			tippyDrop.value.hide();
		}
		else {
			widthDrop.value = 'auto';
			widthDropMin.value = window.getComputedStyle(domValue.value).width;

			tippyDrop.value.show();


			switchFocus.value = !switchFocus.value;
		}
	};

	const atClickSelect = option => {
		if(multiSelect_.value) {
			option.selected = !!option.selected;

			const valueNow = props.keyValue == '$$' ? option.data : option.data?.[props.keyValue];

			const setValues = new Set(values_.value);
			if(setValues.has(valueNow)) {
				setValues.delete(valueNow);
			}
			else {
				setValues.add(valueNow);
			}

			const values = [...setValues];
			if(multiSelect_.value == 'array') {
				value_.value = values;
			}
			else {
				value_.value = values.join(',');
			}
		}
		else {
			option.selected = true;
			value_.value = props.keyValue == '$$' ? option.data : option.data?.[props.keyValue];
		}
	};

	onMounted(() => {
		tippyDrop.value = Tippy(domValue.value, {
			placement: 'bottom-start',
			content: domDrop.value,
			allowHTML: true,
			interactive: true,
			animation: '',
			duration: [0, 0],
			offset: [0, -2],
			trigger: 'manual',
			maxWidth: 'unset',
			onShow: atShowDrop,
			onHide: atHideDrop,
		});
	});
</script>

<style lang="sass" scoped>
p-disabling
	@apply inblock relative float-left top-2 w-4 h-4 mx-1 border-2 border-solid select-none cursor-pointer appearance-none filter hover:brightness-110
	border-color: var(--colorMain)

	&[checked]
		background-color: var(--colorMain)

		&::after
			content: ""
			@apply absolute border-2 border-solid border-t-0 border-r-0
			top: 2px
			left: 0px
			width: 0.75rem
			height: 0.4rem
			border-color: var(--colorTextMain)
			transform: rotate(-45deg) scale(0.77, 0.77)

p-label
	@apply inblock elli relative float-left w-auto h-full overflow-hidden cursor-pointer select-none


p-value
	@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid
	border-color: var(--colorMain)
	padding: 0 0.25rem
	z-index: 1

	&[hide-outline]
		@apply border-transparent

	&[only]
		@apply w-full

	input
		@apply relative h-full overflow-hidden
		width: calc(100% - theme("spacing.4"))

		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			color: var(--colorDisable)

	svg
		@apply relative h-full w-4 text-base text-gray-300 align-middle

	&:hover
		svg
			@apply text-gray-400 trans


p-drop
	@apply block bg-white py-0 border-2 rounded-md shadow-mdd
	border-color: var(--colorMain)

	p-filter
		@apply block h-8 leading-8 overflow-x-hidden overflow-y-scroll relative

		[filter]
			@apply block shadow-md h-full relative w-full


	p-options
		@apply block relative overflow-x-hidden overflow-y-scroll
		max-height: 24rem

		&[selected]
			@apply shadow-md
			max-height: 8rem

	p-tip
		@apply absolute right-1 top-1 text-gray-400 text-xs select-none

	p-option
		@apply trans block px-2 cursor-pointer py-1

		&:not([disabled]):hover
			background-color: var(--colorMain)
			color: var(--colorTextMain)

		&[selected]
			@apply font-bold py-2 font-bold
			color: var(--colorMain)

			&:hover
				background-color: var(--colorTextMain)
				color: var(--colorMain)

		&[disabled]
			@apply select-none cursor-auto
			color: var(--colorDisable)
</style>
