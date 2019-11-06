export function flattenTree(root, key) {
  const flatten = [Object.assign({}, root)];
  delete flatten[0][key];
  if (root[key] && root[key].length > 0) {
    return flatten.concat(root[key]
      .map(child => flattenTree(child, key))
      .reduce((a, b) => a.concat(b), []));
  }
  return flatten;
}
export function uniqBy(array, identity) {
  const pMap = new Map();
  for (let i = 0; i < array.length; i++) {
    pMap.set(array[i][identity], array[i]);
  }
  return Array.from(pMap.values());
}
