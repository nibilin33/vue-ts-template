/**
 *
 *
 * @export
 * @param {*} derivedCtor
 * @param {any[]} baseCtors
 * @description: extends multiple class,usage: applyMixins(Axios, [Tip, CustomLoading])
 */
export default function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
