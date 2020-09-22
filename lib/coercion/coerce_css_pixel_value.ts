import { CdkAny } from '../types';
export const coerceCssPixelValue = (value: CdkAny) => {
    if (typeof value === 'number') {
        return `${value}px`;
    } else {
        return `${value}`;
    }
}

export const coerceCssPixelToNumber = (value: CdkAny) => {
    if (typeof value === 'string' && value.indexOf('px') !== -1) {
        return parseInt(value.substr(0, value.length - 2), 10);
    }
    throw new Error("err");
}

