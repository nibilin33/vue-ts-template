export const { getOwnPropertyNames } = Object;
export const { keys } = Object;
export const { defineProperties } = Object;
export const { defineProperty } = Object;
export const { freeze } = Object;
export const { getOwnPropertyDescriptor } = Object;
export const { getOwnPropertySymbols } = Object;
export const { getPrototypeOf } = Object;
export const { create } = Object;
export const { isFrozen } = Object;
export const { is } = Object;

export function readonlyDescriptor() {
    return { enumerable: true, configurable: false, writable: false };
}
