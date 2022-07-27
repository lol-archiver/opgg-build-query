let borderList = ['none', 'trans', 'bLine', 'square', 'round'];

export const proper = {
	// 绑定数据
	value: {
		type: [String, Number, Boolean, Array, Object, Date, Function],
		default: ''
	},
	// 控件宽度
	width: {
		type: [Number, String],
		default: null
	},

	// 标签
	label: {
		type: String,
		default: null
	},
	// 标签宽度
	labelWidth: {
		type: [Number, String],
		default: null
	},
	// 标签对齐方式
	labelAlign: {
		type: String,
		default: 'right'
	},

	// 文本对齐方式
	textAlign: {
		type: String,
		default: 'left'
	},

	// 空数据提示
	place: {
		type: [Number, String],
		default: ''
	},
	// 只读
	readonly: {
		type: Boolean,
		default: false
	},
	// 边框风格
	border: {
		type: String,
		default: 'bLine'
	},
	// 焦点顺序
	tab: {
		type: [Number, String],
		default: 0
	},

	// 控件模式
	param: {
		type: String,
		default: null
	},

	// 输入后触发器
	afterInput: {
		type: Function,
		default: null
	},
	// 校验结果
	right: {
		type: Boolean,
		default: true
	},
	// 元素隐藏
	hider: {
		type: String,
		default: null
	},
};

export const computer = {
	compWidth_() {
		return U.toCssLen(this.width);
	},

	label_() {
		return this.label ? `${this.label}：` : '';
	},
	labelWidth_() {
		return U.toCssLen(this.labelWidth);
	},
	labelAlign_() {
		return this.labelAlign;
	},

	textAlign_() {
		return this.textAlign;
	},

	readonly_() {
		return Boolean(this.readonly);
	},
	border_() {
		return `inputerBorder-${borderList.indexOf(this.border) + 1 ? this.border : 'none'}`;
	},
	hider_() {
		return String(this.hider).trim().split('|').reduce((acc, cur) => {
			acc[cur] = true;

			return acc;
		}, {});
	},

	valueWidth_() {
		return !this.hider_.oper && !this.readonly_ ? 'calc(100% - 20px)' : '100%';
	},
};

export const methoder = {

};