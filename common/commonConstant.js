// 公共设置key
let commonSettingKey = [
    { key: 'debugModel', type: "开关" },
    { key: 'debugSleep', type: "输入框" },
    { key: 'webSocketLog', type: "开关" },
    { key: '自动运行', type: "开关" },
    /* { key: '文字识别插件', type: "单选框" }, */
    { key: 'standardWidth', type: "输入框" },
    { key: 'standardHeight', type: "输入框" },
    { key: 'standardConvert', type: "开关" },
    { key: '服务端IP', type: "输入框" },
    { key: '访问密码', type: "输入框" },
    { key: 'x偏移系数', type: "输入框" },
    { key: 'y偏移系数', type: "输入框" }
]

/* let 文字识别插件列表 = [ { id: 1, name: '浩然' },{ id: 2, name: 'tomato' }, { id: 3, name: '谷歌' }] */

let constant = {
    'commonSettingKey': commonSettingKey
    /* ,
    '文字识别插件列表': 文字识别插件列表 */
}
module.exports = constant