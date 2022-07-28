const plugin = require('tailwindcss/plugin');

const spacing = 0.25;
const unit = 'rem';
const space = time => `${time * spacing}${unit}`;


module.exports = {
	content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			spacing: {
				42: space(42),
				78: space(78),
				120: space(120),
			},
			boxShadow: {
				mdd: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
			},
		},
		trans: {
			DEFAULT: '0.2s',
			'04': '0.4s',
			'07': '0.7s',
			2: '2s',
		},
	},
	plugins: [
		plugin(({ addUtilities, matchUtilities, theme }) => {
			addUtilities({
				// inblock=inline-block + 顶部对齐
				'.inblock': {
					display: 'inline-block',
					verticalAlign: 'top'
				},
				// 文本溢出省略号
				'.elli': {
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis'
				},
			});

			// 动画延迟
			matchUtilities(
				{
					trans: duration => ({
						transitionProperty: 'all',
						transitionDuration: duration,
						transform: 'translateZ(0)',
					}),
				},
				{ values: theme('trans') }
			);
		}),
	],
};
