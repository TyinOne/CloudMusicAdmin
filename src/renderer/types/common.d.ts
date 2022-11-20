interface MemoryInfo {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}

// 声明文件，定义全局变量。其它 app.config.globalProperties.xxx，使用 getCurrentInstance() 来获取
interface Window {
    performance: {
        memory: MemoryInfo
    }
    __lib: string;
    __static: string;
    nextLoading: boolean;
    $router: any
}
