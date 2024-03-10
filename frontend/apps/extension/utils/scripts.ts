export const METABLOCK_RE = /((?:^|\n)\s*\/\/\x20==UserScript==)([\s\S]*?\n)\s*\/\/\x20==\/UserScript==|$/;
export const __CODE = /*@__PURE__*/ Symbol('code'); // not enumerable and stripped when serializing

const arrayType = {
    default: () => [],
    transform: (res, val) => {
        res.push(val);
        return res;
    }
};
const booleanType = {
    default: () => false,
    transform: () => true
};
const defaultType = {
    default: () => null,
    transform: (res, val) => (res == null ? val : res)
};
const metaTypes = {
    include: arrayType,
    exclude: arrayType,
    match: arrayType,
    excludeMatch: arrayType,
    require: arrayType,
    resource: {
        default: () => ({}),
        transform: (res, val) => {
            const pair = val.match(/^(\w\S*)\s+(.*)/);
            if (pair) res[pair[1]] = pair[2];
            return res;
        }
    },
    grant: arrayType
};
const metaOptionalTypes = {
    antifeature: arrayType,
    compatible: arrayType,
    connect: arrayType,
    noframes: booleanType,
    unwrap: booleanType
};

export function parseMeta(code, includeMatchedString) {
    // initialize meta
    // const meta = metaTypes::mapEntry(value => value.default());
    const meta = Object.keys(metaTypes).reduce((pre, cur) => {
        pre[cur] = metaTypes[cur].default();
        return pre;
    }, {} as any);
    const match = code.match(METABLOCK_RE);
    const metaBody = match[2];
    if (!metaBody) return false; // TODO: `return;` + null check in all callers?
    metaBody.replace(/(?:^|\n)\s*\/\/\x20(@\S+)(.*)/g, (_match, rawKey, rawValue) => {
        const [keyName, locale] = rawKey.slice(1).split(':');
        const camelKey = keyName.replace(/[-_](\w)/g, (m, g) => g.toUpperCase());
        const key = locale ? `${camelKey}:${locale.toLowerCase()}` : camelKey;
        const val = rawValue.trim();
        const metaType = metaTypes[key] || metaOptionalTypes[key] || defaultType;
        let oldValue = meta[key];
        if (typeof oldValue === 'undefined') oldValue = metaType.default();
        meta[key] = metaType.transform(oldValue, val);
    });
    meta.resources = meta.resource;
    delete meta.resource;
    if (includeMatchedString) meta[__CODE] = match[0];
    return meta;
}
