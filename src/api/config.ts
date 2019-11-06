// 修改这边的配置，修改默认行为
const defaultConfig:any = {
    isLoading: false,
    error: 'error',
};

export const getConfig = (data: any) => {
    const allConfig = Object.create(data);
    Object.keys(defaultConfig).forEach((name) => {
        if (typeof allConfig[name] === 'undefined') {
            allConfig[name] = defaultConfig[name];
        }
    });
    return allConfig;
};
