var Range = ace.require('ace/range').Range;

var editor = ace.edit("editor");

// theme and font size
var theme = '';
editor.setTheme(theme || 'ace/theme/tomorrow_night');

editor.setFontSize(14);

// auto complete options
editor.setOptions({
    enableSnippets: true,
    enableLiveAutocompletion: true,
    hasCssTransforms: true,
    fixedWidthGutter: false,
    useElasticTabstops: true,
    scrollPastEnd: 0.5,
    animatedScroll: true, //滚动动画
    enableAutoIndent: true,
    autoScrollEditorIntoView: true,
    behavioursEnabled: true,
    vScrollBarAlwaysVisible: true,
    dragEnabled: true,
    displayIndentGuides: true, //显示参考线
    highlightGutterLine: true, //高亮边线
    showInvisibles: false, //显示不可见字符
    enableBasicAutocompletion: true, //启用基本自动完成
});

// language mode
editor.session.setMode("ace/mode/javascript");
var autojsCompleter = new Completer(AUTOJS_INDICES);
editor.completers.push(autojsCompleter);

