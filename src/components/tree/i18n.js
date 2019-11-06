const i18n = {
  'en-US': {
    'el.select.loading': 'loading',
    'el.select.noMatch': 'No match',
    'el.select.noData': 'No data',
    'el.tree.moveUp': 'Move Up',
    'el.tree.moveDown': 'Move Down',
  },
  'zh-CN': {
    'el.select.loading': '加载中',
    'el.select.noMatch': '无匹配数据',
    'el.select.noData': '无数据',
    'el.tree.moveUp': '上移',
    'el.tree.moveDown': '下移',
  },
};
export default function t(key, lang = 'zh-CN') {
  try {
    const rlang = Object.keys(i18n).find(it => it.toLowerCase() == lang.toLowerCase() || it.toLowerCase().includes(lang.toLowerCase()));
    return i18n[rlang][key];
  } catch (error) {
    return i18n.en[key];
  }
}
