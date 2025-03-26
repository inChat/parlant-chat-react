export function groupBy(array, keyFn) {
    return array.reduce((result, item) => {
        let key = keyFn(item);
        if (!key)
            key = key === null || key === void 0 ? void 0 : key.toString();
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
}
