/** brop: boolean property的缩写。用于将数据转换为HTML标签属性的开关 */
export const brop = value => value ? '' : null;


export const install = app => {
	app.mixin({ data() { return { brop }; } });
};
