const PKG = require('./package.json');

const parseKey = (raw, target) => {
	const key = raw.split(/(?=[A-Z])/).join('-').toLowerCase();

	if(key != raw) {
		target[key] = target[raw]; delete target[raw];
	}
};
const parseKeys = rc => {
	Object.keys(rc.rules).forEach(key => parseKey(key, rc.rules));

	return rc;
};



let rcBrowser;
if((PKG.dependencies ?? {})['eslint-plugin-vue'] || (PKG.devDependencies ?? {})['eslint-plugin-vue']) {
	rcBrowser = parseKeys({
		files: ['src/**/*.{js,vue}'],
		excludedFiles: ['src/**/*.{api,lib,map}.js', 'src/**/*.lib/**/*.js'],
		env: { es2022: true, node: false, browser: true },
		extends: ['plugin:vue/vue3-recommended'],
		parserOptions: { ecmaVersion: 2022 },
		rules: {
			indent: [0],
			noConsole: [2],

			'vue/html-indent': [2, 'tab'],
			'vue/script-indent': [2, 'tab', { baseIndent: 1 }],
			'vue/max-attributes-per-line': [0],
			'vue/mustache-interpolation-spacing': [0],
			'vue/singleline-html-element-content-newline': [0],
			'vue/no-v-html': [0],
			'vue/require-v-for-key': [0],
			'vue/html-self-closing': [1, { html: { void: 'always' }, }],
			'vue/first-attribute-linebreak': [0],
			'vue/multi-word-component-names': [0],
		},
		globals: {
			defineProps: 'readonly',
			defineEmits: 'readonly',
			defineExpose: 'readonly',
			withDefaults: 'readonly',
		},
	});
}

const rcNode = parseKeys({
	root: true,
	ignorePatterns: ['dist'],
	env: { es2022: true, node: true },
	extends: ['eslint:recommended'],
	parserOptions: { sourceType: 'module' },
	rules: {
		indent: [2, 'tab', { ignoreComments: true, SwitchCase: 1 }],
		linebreakStyle: [2],
		quotes: [2, 'single', { allowTemplateLiterals: true }],
		semi: [2],
		noUnusedVars: [2, { vars: 'all', args: 'none' }],
		noVar: [2],
		noConsole: [0],
		requireAtomicUpdates: [1],
	},
	overrides: [rcBrowser].filter(rc => rc)
});



module.exports = rcNode;
