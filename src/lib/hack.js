/**
 * 通过JSON化函数深度拷贝数据
 * @param {any} object 可JSON化的数据
 */
export const copyJSON = object => JSON.parse(JSON.stringify(object));
