<template>
	<component
		:is="comp"
		ref="comp"
		class="test"
		v-bind="props"
		v-on="listener"

		@hide="hide"
	/>
</template>

<script>
	export default {
		props: {
			// 依附的目标元素
			el: {
				type: Element,
				default: null
			},

			// Vue组件
			comp: {
				type: Object,
				default: null
			},
			// 传入Vue组件的参数
			props: {
				type: Object,
				default() { return {}; }
			},
			// 传入Vue组件的事件
			listener: {
				type: Object,
				default() { return {}; }
			},
			// 本体VueComp的事件
			on: {
				type: Object,
				default() { return {}; }
			},

			// 隐藏后保留Tippy实例
			keep: {
				type: Boolean,
				default: false,
			},
			// 生成后马上显示
			showNow: {
				type: Boolean,
				default: true,
			},

			// tippy的参数
			option: {
				type: Object,
				default() { return {}; }
			},
		},
		emits: ['show', 'hide'],
		data() {
			return {
				// el: null,
				// comp: {},
				// prop: {},
				// listener: {},
				// on: {},
				// keep: false,
				// showNow: true,
				// option: {},
			};
		},

		computed: {
			optionTippy() {
				return Object.assign({
					theme: 'light-border',
					// a11y: false,
					interactive: true,
					animation: '',
					duration: [0, 0],
					onHidden: this.hide,
					onShown: this.onShown,
				}, this.option);
			},
		},

		mounted() {
			this.tippy = this.Tippy(this.el, Object.assign({ content: this.$el }, this.optionTippy));

			if(this.showNow) { this.show(); }
		},
		unmounted() {
			this.$elTippy.parentNode.removeChild(this.$elTippy);
		},

		methods: {
			show() {
				if(this.tippy) {
					this.tippy.show();

					this.$emit('show', this);

					if(typeof this.on.show == 'function') {
						this.on.show(this);
					}
				}

				return this;
			},
			hide() {
				if(this.tippy) {
					if(this.keep) {
						this.tippy.hide();
					}
					else {
						this.tippy.destroy();
						this.$app.unmount();
					}

					this.$emit('hide', this);

					if(typeof this.on.hide == 'function') {
						this.on.hide(this);
					}
				}

				return this;
			},

			onShown() {
				this?.$refs?.comp?.$forceUpdate();
			}
		},
	};
</script>