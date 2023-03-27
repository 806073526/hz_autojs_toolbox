var Range = ace.require('ace/range').Range;

var editor = ace.edit("editor");

// theme and font size
var theme = '';
editor.setTheme(theme || 'ace/theme/tomorrow_night');

editor.setFontSize(12);

// auto complete options
editor.setOptions({
    enableSnippets: true,
    enableLiveAutocompletion: true,
    hasCssTransforms: true,
    fixedWidthGutter: false,
    scrollPastEnd: 0.5,
});

// language mode
editor.session.setMode("ace/mode/javascript");
var autojsCompleter = new Completer(AUTOJS_INDICES);
editor.completers.push(autojsCompleter);