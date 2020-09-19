const toNumber = (value) => {
    const result = Number(value);
    if (!(Number.isNaN(result) ||
        result >= Number.MAX_SAFE_INTEGER ||
        result <= Number.MIN_SAFE_INTEGER)) {
        return result;
    }
    return 0;
};
const toBoolean = (value) => {
    const truthies = ['true'];
    if (truthies.includes(toString(value).toLowerCase())) {
        return true;
    }
    return false;
};
const toString = (value) => String(value);
const typeConverter = { number: toNumber, string: toString, boolean: toBoolean };
export const cast = (key, type, defaultValue) => {
    const value = process.env[key];
    if (value === undefined)
        if (!defaultValue)
            throw new Error(`Expected ${key} but not found. Pass [Key {${key}}] into .env file or type "cross-env ${key}=value" in cli.`);
        else
            return defaultValue;
    else
        return typeConverter[type](value);
};
