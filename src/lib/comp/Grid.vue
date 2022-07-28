<template>
	<comp-grid :no-border="brop(!isShowBorder)">
		<!-- 表头 -->
		<p-head v-if="isShowHead">
			<table ref="domHead" head :style="{ left: leftHead }">
				<tr v-for="row of heads" row>
					<th v-for="head of row" cell
						:_lastInRow="brop(head.isLast)"
						:rowspan="head.row" :colspan="head.col"

						:title="head.text"

						:style="styleCell(head, 'head')"
						:no-padding="brop(!(head.padding ?? isShowPadding))"
						:no-border="brop(!isShowBorder)"
					>
						{{head.text}}
					</th>
				</tr>
			</table>
		</p-head>

		<!-- 表身 -->
		<p-body v-if="isShowBody"
			:style="{ height: heightBody }"
			@scroll="onScrollBody"
		>
			<table body>
				<tr v-for="(data, did) of datas" row
					:selected="brop(isShowSelect && selected == data)"
					:hover="brop(isShowSelect)"
					@dblclick="onDblclick(data)"
				>
					<td v-for="head of headsRaw" cell
						:_lastInRow="brop(did == datas.length - 1)"

						:title="data[head.index]"

						:style="styleCell(head, 'body')"
						:no-padding="brop(!(head.padding ?? isShowPadding))"
						:no-border="brop(!isShowBorder)"
						:even="brop(isShowOdd && !(did%2))"
						:odd="brop(isShowOdd && did%2)"

						@click="isShowSelect && atSelectData(data)"
					>
						{{data[head.index]}}
					</td>
				</tr>
			</table>
		</p-body>
	</comp-grid>
</template>

<script setup>
	import { computed, ref, watch } from 'vue';
	import { parseBoolAttr, toCSSLength } from './common/public.js';


	const props = defineProps({
		// 更新主值
		modelValue: { type: [Object], default: () => ({}) },

		// 表头
		heads: { type: Array, default: () => [] },
		// 数据
		datas: { type: Array, default: () => [] },

		// 开关
		// 显示表头
		showHead: { type: [Boolean, String], default: true },
		// 显示数据
		showBody: { type: [Boolean, String], default: true },
		// 显示表格两侧的留空
		showPadding: { type: [Boolean, String], default: true },
		// 显示表格线
		showBorder: { type: [Boolean, String], default: true },
		// 显示斑马纹
		showOdd: { type: [Boolean, String], default: true },
		// 显示当前选择
		showSelect: { type: [Boolean, String], default: false },

		// 行高
		rowHeight: { type: [Number, String], default: '3rem|2rem' },


		// 双击函数
		onDblclick: { type: Function, default: () => (function() { }) },
		// 多选
		multiSelect: { type: [Boolean, String], default: false },
		// 是否自动高度
		autoHeight: { type: [Boolean, String], default: false },


	});
	const emit = defineEmits(['update:modelValue']);


	// 开关
	const isShowHead = computed(() => parseBoolAttr(props.showHead));
	const isShowBody = computed(() => parseBoolAttr(props.showBody));
	const isShowPadding = computed(() => parseBoolAttr(props.showPadding));
	const isShowOdd = computed(() => parseBoolAttr(props.showOdd));
	const isShowBorder = computed(() => parseBoolAttr(props.showBorder));
	const isShowSelect = computed(() => parseBoolAttr(props.showSelect));


	// 表头
	const headsRaw = computed(() => props.heads);
	const heads = computed(() => {
		let stackMax = 1;
		const headsStack = [[]];
		const rowLast = [];


		headsRaw.value.forEach(col => {
			if(col.hide) { return; }

			const heads = col.text.split('|').reverse();


			if(heads.length > stackMax) {
				const diff = heads.length - stackMax;

				stackMax = heads.length;

				headsStack.push(...JSON.parse(`[${'[],'.repeat(diff - 1)}[]]`));

				for(const rl of rowLast) { rl.row++; }
			}


			heads.forEach((text, tid) => {
				const line = headsStack[tid];
				const lastCell = line[line.length - 1];

				if(lastCell?.text != text) {
					const isLast = heads.length - 1 == tid;

					const cell = {
						...col,

						text,

						col: 1,
						row: 1 + (isLast ? stackMax - heads.length : 0),

						align: (isLast ? col.align : 'center'),
					};
					cell.isLast = isLast;

					line.push(cell);

					if(tid == heads.length - 1) {
						rowLast.push(cell);
					}
				}
				else {
					lastCell.col++;
				}
			});
		});

		return headsStack;
	});


	// 行高 格式：行高|(表头行高)
	const heightRowRaw = computed(() => props.rowHeight);
	const heightRow = computed(() => {
		const raw = heightRowRaw.value;

		if(typeof raw == 'number') {
			const height = toCSSLength(raw);

			return { head: height, body: height };
		}

		const [heightBodyRaw, heightHeadRaw] = String(raw).trim().split('|');

		return {
			head: toCSSLength(heightHeadRaw ?? heightBodyRaw),
			body: toCSSLength(heightBodyRaw),
		};
	});


	// 单元格样式
	const styleCell = (head, type) => ({
		width: toCSSLength(head.width ?? 60),
		minWidth: toCSSLength(head.width ?? 60),
		maxWidth: toCSSLength(head.width ?? 60),
		textAlign: head.align,
		height: heightRow.value[type],
		lineHeight: heightRow.value[type],
	});


	// 表头高度
	const heightHead = ref();
	const domHead = ref(null);
	watch(isShowBorder, () => setTimeout(() => heightHead.value = domHead.value && getComputedStyle(domHead.value).height), { immediate: true });
	const heightBody = computed(() =>
		`calc(100% - ${heightHead.value ?? `(${heightRow.value.head} + 2px) * ${heads.value.length})`}`
	);


	// 滚动同步
	const leftHead = ref(0);
	const onScrollBody = event => {
		// 先计算比较，结果不相同再赋值。可有效减少渲染次数和卡顿
		const leftNew = toCSSLength(-event?.target?.scrollLeft) ?? '0';

		if(leftNew != leftHead.value) { leftHead.value = leftNew; }
	};


	// 数据
	const datas = computed(() => props.datas);
	const selected = ref(null);
	const atSelectData = data => emit('update:modelValue', selected.value = data);
</script>

<style lang="sass" scoped>
comp-grid
	@apply block overflow-hidden border rounded-sm shadow-mdd border-gray-300

	&[no-border]
			@apply border-0

	table
		@apply relative table-fixed bg-transparent text-sm min-w-full
		border-spacing: 0

		&[head]
			@apply text-gray-400

			[cell][_lastInRow]
				@apply text-gray-500

		&[body]
			[row]
				[cell]
					&[even]
						@apply bg-white
					&[odd]
						@apply bg-gray-100

				&[hover]:hover
					[cell]
						@apply bg-blue-100 cursor-pointer

				&[selected]
					[cell]
						cursor: default !important
						background-color: theme("colors.green.100") !important


		[row]
			@apply relative

			&:first-child [cell]
				@apply border-t-0

			[cell]
				@apply relative overflow-hidden whitespace-nowrap overflow-ellipsis px-2 border border-gray-300

				&:first-child
					@apply border-l-0

				&:last-child
					@apply border-r
					border-right-color: theme("colors.gray.300")
					border-right-style: dashed

				&[_lastInRow]
					@apply border-b
					border-bottom-color: theme("colors.gray.300")
					border-bottom-style: dashed

				&[no-padding]
					padding: 1px

				&[no-border]
					@apply border-0


	p-head
		@apply relative block w-full z-10 overflow-x-hidden overflow-y-scroll
		background-color: #dbf0ff

	p-body
		@apply relative block w-full z-20 overflow-scroll

		&::-webkit-scrollbar-track
			@apply bg-gray-100
</style>
