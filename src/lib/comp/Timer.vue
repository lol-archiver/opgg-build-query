<template>
	<comp-combo>
		<!-- 禁用 -->
		<p-disabling v-if="disabling_" class="inblock" :checked="brop(!disable_)" @click="disable_ = ! disable_" />

		<!-- 标签 -->
		<p-label v-if="label_" class="inblock elli" :style="styleLabel" @click="disabling_ && (disable_ = ! disable_)">{{ label_ }}</p-label>

		<!-- 输入框 -->
		<p-value ref="domValue" class="inblock" @click="!disable_ && !$readonly && atClickDrop()">
			<input
				ref="domValue"
				:value="textShow"
				:style="{ textAlign: align }"
				:placeholder="place"
				:tabindex="tab"
				:readonly="true"
				:disabled="disable_"
			/>
		</p-value>

		<!-- 下拉列表 -->
		<p-drop ref="domDrop" tabindex="0">
			<p-drop-values>
				<p-drop-value v-if="isShowOptionsYear"><span>{{momentValueSafe.format('YYYY')}}</span>年</p-drop-value>
				<p-drop-value v-if="isShowOptionsMonth"><span>{{momentValueSafe.format('MM')}}</span>月</p-drop-value>
				<p-drop-value v-if="isShowOptionsDate"><span>{{momentValueSafe.format('DD')}}</span>日</p-drop-value>
				<p-drop-value v-if="isShowOptionsHour"><span>{{momentValueSafe.format('HH')}}</span>时</p-drop-value>
				<p-drop-value v-if="isShowOptionsMinute"><span>{{momentValueSafe.format('mm')}}</span>分</p-drop-value>
				<p-drop-value v-if="isShowOptionsSecond"><span>{{momentValueSafe.format('SS')}}</span>秒</p-drop-value>
			</p-drop-values>
			<p-drop-options-box>
				<p-drop-options v-if="isShowOptionsYear">
					<p-drop-option v-for="option of optionsYear" :key="`Timer-year-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('year', option.data)"
					>
						{{option.data}}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsMonth">
					<p-drop-option v-for="option of optionsMonth" :key="`Timer-month-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('month', option.data - 1)"
					>
						{{option.data}}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsDate" date>
					<p-drop-option-date
						v-for="(option, oid) of optionsDay" :key="`Timer-day-${oid}`" day
						:style="{ left: `${-(oid % 7) + 3}px` }"
					>
						{{option}}
					</p-drop-option-date>
					<p-drop-option-date
						v-for="(option, oid) of optionsDate" :key="`Timer-date-${oid}`"
						:out-month="option.outMonth || undefined"
						:out-range="option.outRange || undefined"
						:selected="option.selected || undefined"
						:month-t="option.headDay || option.headWeek || undefined"
						:month-b="option.tailDay || option.tailWeek || undefined"
						:month-l="option.headDay || (!option.outMonth && option.weekDay == 6) || undefined"
						:month-r="option.tailDay || (!option.outMonth && option.weekDay == 5) || undefined"
						:style="{ top: `-${parseInt(oid / 7)}px`, left: `${-(oid % 7) + 3}px` }"
						@click="atSelect('fulldate', option)"
					>
						{{option.date}}
					</p-drop-option-date>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsHour">
					<p-drop-option v-for="option of optionsHour" :key="`Timer-hour-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('hour', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{option.data}}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsMinute">
					<p-drop-option v-for="option of optionsMinute" :key="`Timer-minute-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('minute', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{option.data}}
					</p-drop-option>
				</p-drop-options>
				<p-drop-options v-if="isShowOptionsSecond">
					<p-drop-option v-for="option of optionsSecond" :key="`Timer-second-${option.data}`"
						:selected="option.select || undefined"
						@click="atSelect('second', modeEndTime == 2 ? option.data - 1 : option.data)"
					>
						{{option.data}}
					</p-drop-option>
				</p-drop-options>
			</p-drop-options-box>
		</p-drop>
	</comp-combo>
</template>

<script setup>
	import { computed, nextTick, onMounted, ref, watch } from 'vue';
	import Tippy from 'tippy.js';

	import { props as propsLabel, setup as setupLabel } from './common/label.js';
	import { parseBoolAttr, parseSwitch } from './common/public.js';
	import Moment from '../Moment.js';

	const formatsType = {
		'00': 'YYYY', '11': 'MM', '22': 'DD', '33': 'HH', '44': 'mm', '55': 'ss',
		'01': 'YYYY-MM', '02': 'YYYY-MM-DD', '03': 'YYYY-MM-DD HH', '04': 'YYYY-MM-DD HH:mm', '05': 'YYYY-MM-DD HH:mm:ss',
		'12': 'MM-DD', '13': 'MM-DD HH', '14': 'MM-DD HH:mm', '15': 'MM-DD HH:mm:ss',
		'23': 'DD HH', '24': 'DD HH:mm', '25': 'DD HH:mm:ss',
		'34': 'HH:mm', '35': 'HH:mm:ss',
		'45': 'mm:ss',
	};

	const formatsShow = {
		'00': 'YYYY年', '11': 'MM月', '22': 'DD日', '33': 'HH时', '44': 'mm分', '55': 'ss秒',
		'01': 'YYYY年MM月', '02': 'YYYY-MM-DD', '03': 'YYYY-MM-DD HH时', '04': 'YYYY-MM-DD HH时mm分', '05': 'YYYY-MM-DD HH:mm:ss',
		'12': 'MM月DD日', '13': 'MM月DD日 HH时', '14': 'MM月DD日 HH:mm', '15': 'MM月DD日 HH:mm:ss',
		'23': 'DD日HH时', '24': 'DD日HH时mm分', '25': 'DD日HH:mm:ss',
		'34': 'HH时mm分', '35': 'HH:mm:ss',
		'45': 'mm分ss秒',
	};

	const typeList = ['Y', 'M', 'D', 'H', 'm', 's'];


	const props = defineProps({
		// update主值
		modelValue: { type: [String, Number, Boolean], default: '' },
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

		// 可选起始时间(时间输入控件特有)
		begin: { type: [Number, String], default: '' },
		// 可选结束时间(时间输入控件特有)
		end: { type: [Number, String], default: '' },
		// 显示格式
		formater: { type: [Function, String], default: null },
		// 结束时间模式 true, 结束模式, 即24:60:60; false, 23:59:59; show, 显示24:60:60, 传23:59:59
		endTimeMode: { type: [Boolean, String], default: false }
	});


	const disabling_ = computed(() => parseBoolAttr(props.disabling));
	const value_ = ref(disabling_.value ? (props.modelValue === false ? props.default : props.modelValue) : props.modelValue);
	const disable_ = ref(disabling_.value ? (props.modelValue === false ? true : false) : props.disable);

	const emit = defineEmits(['update:modelValue', 'update:disable', 'update:value']);
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

	// 处理标签
	const { label_, labelWidth_, labelAlign_ } = setupLabel(props, disabling_);
	const styleLabel = computed(() => ({ width: labelWidth_.value, textAlign: labelAlign_.value }));

	// 响应参数
	const $readonly = computed(() => parseBoolAttr(props.readonly));
	const $formater = ref(props.formater);
	const $param = ref(props.param);
	const $begin = ref(props.begin);
	const $end = ref(props.end);
	const $endTimeMode = ref(props.endTimeMode);
	// const $formater = computed(() => props.formater);
	// const $param = computed(() => props.param);
	// const $begin = computed(() => props.begin);
	// const $end = computed(() => props.end);
	// const $endTimeMode = computed(() => props.endTimeMode);

	// 时间格式范围
	// `YMDHms`对应`年月日时分秒`
	// `时间区间`由最大的时间单位和最小的时间单位组成, 无关顺序, `MHm`等价于`HmM`
	// 可以为`分`和`秒`设置时间间隔, `m15Y`表示区间年到分, `分`间隔为15, 即显示0/15/30/45
	const timeRange_ = computed(() => {
		let result = {
			start: 5,
			end: 0
		};

		(($param.value || '').split('|')[0].match(/[YMDHms]\d*/g) || ['Y', 's']).forEach(raw => {
			let [type, interval] = raw.match(/^[YMDHms]|\d+$/g);

			type = typeList.indexOf(type);

			if(type == -1) { return; }

			if(type < result.start) { result.start = type; }
			if(type > result.end) { result.end = type; }

			result[type] = interval || 1;
		});

		return result;
	});
	// 是否显示下拉选择
	const ranger = (num, ranger) => num >= ranger.start && num <= ranger.end;
	const isShowOptionsYear = computed(() => ranger(0, timeRange_.value));
	const isShowOptionsMonth = computed(() => ranger(1, timeRange_.value));
	const isShowOptionsDate = computed(() => ranger(2, timeRange_.value));
	const isShowOptionsHour = computed(() => ranger(3, timeRange_.value));
	const isShowOptionsMinute = computed(() => ranger(4, timeRange_.value));
	const isShowOptionsSecond = computed(() => ranger(5, timeRange_.value));
	/** 对应模式下的日期格式 */
	const format = computed(() => formatsType[`${timeRange_.value.start}${timeRange_.value.end}`]);
	/** 对应模式下的展示格式 */
	const sormat = computed(() => formatsShow[`${timeRange_.value.start}${timeRange_.value.end}`]);

	// 最早的可选时间
	const timeBegin_ = computed(() => {
		const time = Moment($begin.value, format.value);
		return time.isValid() ? time : null;
	});
	// 最晚的可选时间
	const timeEnd_ = computed(() => {
		const time = Moment($end.value, format.value);
		return time.isValid() ? time : null;
	});

	/** 当前时间的Moment封装 */
	const momentValue = computed(() => Moment(value_.value));
	const momentValueSafe = computed(() => momentValue.value.isValid() ? momentValue.value : Moment().startOf('day'));
	/** 当前时间的显示值 */
	const textShow = computed(() => {
		if(momentValue.value.isValid()) {
			if(typeof $formater.value == 'string') {
				return momentValue.value.format($formater.value);
			}
			else if(typeof $formater.value == 'function') {
				return $formater(momentValue.value);
			}
			else {
				return momentValue.value.format(sormat.value);
			}
		}
		else {
			return value_.value;
		}
	});


	// 下拉选项
	const optionsYear = computed(() => {
		const options = [];

		const yearNow = Moment().year();
		let year = yearNow + 4;
		while(year >= yearNow - 7) {
			options.push({
				select: momentValueSafe.value.year() == year,
				data: year--
			});
		}

		return options;
	});
	const optionsMonth = computed(() => {
		const options = [];

		let month = 1;
		while(month <= 12) {
			options.push({
				select: momentValueSafe.value.month() + 1 == month,
				data: month++
			});
		}

		return options;
	});
	const optionsDay = ref(['日', '一', '二', '三', '四', '五', '六']);
	const optionsDate = computed(() => {
		const value = momentValueSafe.value;
		const begin = timeBegin_.value;
		const end = timeEnd_.value;

		const headDay = value.clone().startOf('month');
		const tailDay = value.clone().endOf('month');

		let cursor = value.clone().startOf('month').add(1, 'hours');

		const options = [];
		while(cursor.isBetween(headDay, tailDay)) {
			options.push({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: false,
				selected: value.isSame(cursor, 'date'),
				weekDay: cursor.weekday(),
				headDay: cursor.date() == headDay.date(),
				tailDay: cursor.date() == tailDay.date(),
				headWeek: cursor.diff(headDay, 'days') < 7,
				tailWeek: cursor.diff(tailDay, 'days') > -7,
			});

			cursor.add(1, 'days');
		}

		let preFill = headDay.weekday() == 6 ? 14 : headDay.weekday() + 15;
		cursor = headDay.clone();

		while(preFill-- > 0) {
			cursor = cursor.subtract(1, 'day');

			options.unshift({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				weekDay: cursor.weekday(),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: true,
				selected: value.isSame(cursor, 'date'),
			});
		}

		cursor = tailDay.clone();

		while(options.length < 63) {
			cursor = cursor.add(1, 'day');

			options.push({
				year: cursor.year(),
				month: cursor.month() + 1,
				date: cursor.date(),
				full: cursor.format('YYYY-MM-DD'),
				weekDay: cursor.weekday(),
				outRange: !!(begin && cursor.isBefore(begin)) || !!(end && cursor.isAfter(end)),
				outMonth: true,
				selected: value.isSame(cursor, 'date'),
			});
		}
		// 响应参数

		return options;
	});

	const modeEndTime = computed(() => $endTimeMode.value == 'show' ? 2 : ~~parseSwitch($endTimeMode.value));
	const optionsHour = computed(() => {
		const options = [];

		let hour = 0;
		while(hour <= 23) {
			options.push({
				select: momentValueSafe.value.hour() == hour,
				data: modeEndTime.value ? hour + 1 : hour
			});

			hour += 1;
		}

		return options;
	});
	const optionsMinute = computed(() => {
		const options = [];

		const interval = timeRange_.value ? timeRange_.value[4] || 1 : 1;
		let minute = 0;
		while(minute <= 59) {
			options.push({
				select: momentValueSafe.value.minute() == minute,
				data: modeEndTime.value ? minute + 1 : minute
			});

			minute += ~~interval;
		}

		return options;
	});
	const optionsSecond = computed(() => {
		const options = [];

		const interval = timeRange_.value ? timeRange_.value[5] || 1 : 1;
		let second = 0;
		while(second <= 59) {
			options.push({
				select: momentValueSafe.value.second() == second,
				data: modeEndTime.value ? second + 1 : second
			});

			second += ~~interval;
		}

		return options;
	});


	const domValue = ref(null);
	const domDrop = ref(null);

	const tippyDrop = ref(null);
	const widthDrop = ref('');

	const atShowDrop = () => nextTick(async () => {
		document.querySelectorAll('p-drop-option[selected]').forEach(dom => dom.scrollIntoView({ block: 'center' }));
	});
	const atHideDrop = () => { };

	const atClickDrop = () => {
		if(tippyDrop.value.state.isShown) {
			tippyDrop.value.hide();
		}
		else {
			widthDrop.value = window.getComputedStyle(domValue.value).width;

			tippyDrop.value.show();
		}
	};
	const atSelect = (type, data) => {
		if(type == 'fulldate' && !data.outRange) {
			momentValueSafe.value.year(data.year);
			momentValueSafe.value.month(data.month - 1);
			momentValueSafe.value.date(data.date);
		}
		else {
			momentValueSafe.value[type](data);
		}

		value_.value = momentValueSafe.value.format(format.value);
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
			onHide: atHideDrop,
			onShow: atShowDrop,
		});
	});

</script>

<style lang="sass" scoped>
p-disabling
	@apply relative float-left top-2 w-4 h-4 mx-1 border-2 border-solid select-none cursor-pointer appearance-none filter hover:brightness-110
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
	@apply block relative float-left w-auto h-full overflow-hidden cursor-pointer select-none


p-value
	@apply block relative w-auto h-full overflow-hidden border-b-2 border-solid
	border-color: var(--colorMain)
	padding: 0 0.25rem
	z-index: 1

p-value
	input
		@apply relative w-full h-full overflow-hidden

		outline: none
		background: transparent
		font-size: inherit

		&:disabled
			color: var(--colorDisable)


p-drop
	@apply block bg-white py-2 border-2 rounded-b-sm shadow-2xl overflow-hidden
	border-color: var(--colorMain)
	p-drop-values
		@apply block px-2
		p-drop-value
			@apply text-xs leading-8
			color: var(--colorText)
			span
				@apply px-1 text-base leading-8
				color: var(--colorMain)
	p-drop-options-box
		@apply px-1

		p-drop-options
			@apply inline-block align-top h-78 overflow-x-hidden overflow-y-auto border-r border-transparent
			&:not(:last-child)
				@apply border-gray-300
			&[date]
				@apply overflow-y-hidden px-1
				width: calc(theme("spacing.42") + theme("spacing.2") + 1px)
				line-height: 0

			p-drop-option
				@apply block px-2 mx-1 text-sm leading-6 text-center cursor-pointer border border-transparent
				&:hover
					border-color: var(--colorMain)
				min-width: 4rem

			p-drop-option-date
				@apply relative inblock w-6 h-8 leading-8 text-sm text-center cursor-pointer border border-transparent z-10

				&:not([day]):not([out-month]):not([out-range]):hover
					@apply z-20
					border-color: var(--colorMain)
				&[day]
					@apply text-sm leading-8 select-none cursor-default
				&[out-month]
					color: var(--colorDisable)
				&[out-range]
					@apply text-[snow] cursor-default
				&[month-t]
					border-top-color: var(--colorMain)
				&[month-b]
					border-bottom-color: var(--colorMain)
				&[month-l]
					border-left-color: var(--colorMain)
				&[month-r]
					border-right-color: var(--colorMain)
				&[month-t][month-l]
					@apply rounded-tl
				&[month-t][month-r]
					@apply rounded-tr
				&[month-b][month-l]
					@apply rounded-bl
				&[month-b][month-r]
					@apply rounded-br
			[selected]
				@apply font-bold text-[snow] cursor-default
				background-color: var(--colorMain)
</style>
