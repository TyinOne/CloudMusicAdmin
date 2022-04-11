/* eslint-disable */

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
// 声明文件，*.vue 后缀的文件交给 vue 模块来处理