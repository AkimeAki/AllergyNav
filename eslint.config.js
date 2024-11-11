const globals = require("globals");
const pluginJs = require("@eslint/js");
const configPrettier = require("eslint-config-prettier");
const tseslint = require("typescript-eslint");
const pluginReact = require("eslint-plugin-react");
const pluginNext = require("@next/eslint-plugin-next");
const pluginHooks = require("eslint-plugin-react-hooks");

module.exports = [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: ["src/env.d.ts", "dist/**/*", ".next/**/*", "eslint.config.js", "next.config.js"]
	},
	{
		files: ["**/*.tsx"],
		...pluginReact.configs.flat.recommended,
		plugins: {
			"react-hooks": pluginHooks,
			"@next/next": pluginNext
		},
		rules: {
			...pluginHooks.configs.recommended.rules,
			...pluginNext.configs.recommended.rules,
			"react/display-name": "off",
			"react/react-in-jsx-scope": "off",
			"react-hooks/exhaustive-deps": "off"
		}
	},
	{
		files: ["**/*.tsx", "**/*.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off"
		}
	},
	configPrettier
];
