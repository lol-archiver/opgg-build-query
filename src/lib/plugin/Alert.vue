<template>
	<comp-mask v-show="showMask" />
	<comp-alert v-show="show" ref="win"
		:style="{
			top: top+'px',
			left: left+'px',
			borderColor: styleColorTop,
		}"
		:color="attrColorTop"
	>
		<p-title class="block w-full h-6 nosel"
			:style="{ cursor: moving ? 'move' : 'default' }"
			@mousemove="onMouseMove" @mousedown="onMoveStart" @mouseup="onMoveEnd" @mouseout="onMoveEnd"
		>
			<p-title-text class="inblock elli text-lg leading-6 px-1">{{title || '提示'}}</p-title-text>
		</p-title>
		<p-body class="block">
			<p-body-content class="block w-full m-4 pr-8 text-sm">{{content || ''}}</p-body-content>
			<p-body-clicks class="w-full pt-2 pl-8 flex flex-row-reverse gap-2">
				<Click v-if="button3 && button3.text" tabindex="1403" :reverse="brop(button3.reverse)"
					:text="button3.text" :color="attrColorTop"
					@click="atClick(button3.value)"
					@keydown.enter.space.prevent="atClick(button3.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
				<Click v-if="button2 && button2.text" tabindex="1402" :reverse="brop(button2.reverse)"
					:text="button2.text" :color="attrColorTop"
					@click="atClick(button2.value)"
					@keydown.enter.space.prevent="atClick(button2.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
				<Click v-if="button1 && button1.text" tabindex="1401" :reverse="brop(button1.reverse)"
					:text="button1.text" :color="attrColorTop"
					@click="atClick(button1.value)"
					@keydown.enter.space.prevent="atClick(button1.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
			</p-body-clicks>
		</p-body>
	</comp-alert>
</template>

<script>
	import { computed, createApp, nextTick, ref, watch } from 'vue';

	import Click from '../comp/Click.vue';

	import Self from './Alert.vue';



	export const title = ref(null);
	export const content = ref(null);

	export const cancel = ref(0);
	export const button1 = ref({ text: null, value: null, reverse: true });
	export const button2 = ref({ text: null, value: null, reverse: true });
	export const button3 = ref({ text: null, value: null, reverse: true });

	export const colorTop = ref(null);

	export const show = ref(false);
	export const waiter = ref(null);


	const showBox = function(content_ = '', title_ = '提示', cancel_ = 0, button1_ = {}, button2_ = {}, button3_ = {}, colorTop_) {
		title.value = String(title_);
		content.value = String(content_);

		button1.value = button1_;
		button2.value = button2_;
		button3.value = button3_;
		cancel.value = cancel_;

		colorTop.value = colorTop_;

		return new Promise(resolve => {
			waiter.value = resolve;
			show.value = true;
		});
	};

	export const $alert = function(content, title = '提示',
		button1 = { text: '确定', value: true },
		button2,
		button3,
		cancel = 1,
		colorTop
	) {
		return showBox(content, title, cancel, button1, button2, button3, colorTop);
	};

	export const $quest = function(content, title = '提示',
		button1 = { text: '是', value: true },
		button2 = { text: '否', value: false, reverse: true },
		button3,
		cancel = 2,
		colorTop
	) {
		return showBox(content, title, cancel, button1, button2, button3, colorTop);
	};

	export const $quest3 = function(content, title = '提示',
		button1 = { text: '是', value: true },
		button2 = { text: '否', value: false, },
		button3 = { text: '取消', value: 'cancel', reverse: true },
		cancel = 3,
		colorTop
	) {
		return showBox(content, title, cancel, button1, button2, button3, colorTop);
	};

	export const $okay = function(action = '操作', title = '成功', next, button1 = { text: '确定', value: true }, button2, button3, cancel = 0, colorTop = '$okay') {
		const content = `${action}成功${next ? `。${next}` : ''}`;

		return showBox(content, title, cancel, button1, button2, button3, colorTop);
	};

	export const $fail = function(action = '操作', error, title = '失败', button1 = { text: '确定', value: true }, button2, button3, cancel = 0, colorTop = '$fail') {
		const content = (`${action}失败，原因：${error?.message ?? error ?? '未知'}`);

		return showBox(content, title, cancel, button1, button2, button3, colorTop);
	};


	export const install = async app => {
		const appAlert = createApp(Self);

		const domAlert = document.createElement('div');
		domAlert.id = 'alert';

		document.body.appendChild(domAlert);
		appAlert.mount(domAlert);
	};

</script>

<script setup>




	const moving = ref(false);
	const top = ref(0);
	const left = ref(0);





	const styleColorTop = computed(() => colorTop.value?.startsWith('$') ? false : (colorTop.value ?? false));
	const attrColorTop = computed(() => colorTop.value?.startsWith('$') ? colorTop.value.replace('$', '').toLowerCase() : null);



	const showMask = ref(false);


	const win = ref(null);


	watch(show, now => {
		if(now) {
			nextTick(() => {
				top.value = (window.innerHeight - win.value.clientHeight) / 2;
				left.value = (window.innerWidth - win.value.clientWidth) / 2;

				nextTick(() => win.value.querySelector('comp-click:last-child').focus());
			});

			showMask.value = true;
		}
	});


	const brop = value => value ? '' : null;

	const atClick = (value, fromCancel = false) => {
		if(fromCancel) {
			if(!cancel.value) { return; }
			else if(cancel.value == 1) { value = button1.value; }
			else if(cancel.value == 2) { value = button2.value; }
			else if(cancel.value == 3) { value = button3.value; }
		}


		title.value = null;
		content.value = null;

		cancel.value = 0;
		button1.value = { text: null, value: null, reverse: true };
		button2.value = { text: null, value: null, reverse: true };
		button3.value = { text: null, value: null, reverse: true };

		show.value = false;
		showMask.value = false;

		if(typeof waiter.value == 'function') {
			try {
				waiter.value(value);
			}
			finally {
				waiter.value = null;
			}
		}
	};

	const onMouseMove = e => {
		if(e.buttons == 1) {
			top.value += e.movementY;
			left.value += e.movementX;
		}
	};
	const onMoveStart = () => moving.value = true;
	const onMoveEnd = () => moving.value = false;


</script>

<style lang="sass" scoped>
comp-mask
	@apply fixed top-0 bottom-0 left-0 right-0 z-30
	background: rgba(192, 192, 192, 0.4)

comp-alert
	@apply fixed p-2 overflow-hidden shadow-2xl rounded-sm z-40 border-t-8
	min-width: 160px
	min-height: 90px
	background-color: var(--colorBackground)
	border-color: var(--colorMain)

	&[color=okay]
		border-color: var(--colorOkay)
	&[color=fail]
		border-color: var(--colorFail)

	comp-click
		@apply inblock h-8 leading-8 px-4 outline-none focus:font-bold

		&[color=okay]
			background-color: var(--colorOkay)
		&[color=fail]
			background-color: var(--colorFail)

		&[reverse]
			@apply border border-gray-300
			background-color: var(--colorBackGround)
			color: var(--colorText)

p-button
	@apply w-16 h-7 ml-2 leading-7 bg-green-500 inline-block align-top rounded-sm cursor-pointer text-sm text-center overflow-hidden outline-none select-none hover:shadow-md filter hover:brightness-110 focus:brightness-125
</style>
