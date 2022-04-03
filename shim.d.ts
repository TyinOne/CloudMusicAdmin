/* eslint-disable */
import {AxiosRequestConfig} from "axios";
import type { DefineComponent } from 'vue';
declare module '*.vue' {
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module 'axios' {
	export interface AxiosInstance {

		<T = any>(config: AxiosRequestConfig): Promise<T>;

		request<T = any>(config: AxiosRequestConfig): Promise<T>;

		get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

		delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

		head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

		post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

		put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

		patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	}
}
// 声明文件，*.vue 后缀的文件交给 vue 模块来处理