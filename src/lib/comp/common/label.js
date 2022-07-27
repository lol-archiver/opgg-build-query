import { computed } from 'vue';

import { parseBoolAttr } from './public';


export const props = {
	// 控件快速控制
	param: { type: String, default: null },
	// 标签
	label: { type: String, default: null },
	// 标签-宽度
	labelWidth: { type: String, default: null },
	// 标签-对齐方式
	labelAlign: { type: String, default: null },
	// 标签-分隔符
	labelSplit: { type: String, default: '：' },
	// 标签-是否禁用快速配置
	labelTextOnly: { type: Boolean, default: false },
};

export const setup = function(props, disabling_) {
	const labelTextOnly_ = computed(() => parseBoolAttr(props.labelTextOnly));

	const labelQuick = computed(() => {
		const { label } = props;
		const labelSafe = String(label);

		let result = [];

		if(label && labelSafe.trim()) {
			result = labelTextOnly_.value ? [labelSafe.trim()] : labelSafe.split('|');
		}

		return result;
	});

	const label_ = computed(() => {
		const label = labelQuick.value[0];
		const labelSplit = props.labelSplit;

		return label ? `${label}${labelSplit}` : null;
	});

	const labelWidth_ = computed(() => {
		const widthQuick = labelQuick.value[1];
		const widthLabel = props.labelWidth;

		let result = null;

		if(widthQuick && String(widthQuick).trim()) { result = widthQuick; }
		if(widthLabel && String(widthLabel).trim()) { result = widthLabel; }

		if(disabling_.value) {
			result = `calc(${result} - 1.5rem)`;
		}

		return result;
	});

	const labelAlign_ = computed(() => {
		const alignQuick = labelQuick.value[2];
		const alignLabel = props.labelAlign;

		let result = 'right';

		if(alignQuick && String(alignQuick).trim()) { result = alignQuick; }
		if(alignLabel && String(alignLabel).trim()) { result = alignLabel; }

		return result;
	});

	return { label_, labelWidth_, labelAlign_ };
};