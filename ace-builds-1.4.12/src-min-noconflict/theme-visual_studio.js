ace.define("ace/theme/visual_studio",[],function(e,t,n){t.isDark=!1,t.cssClass="ace-visual-studio",t.cssText=".ace-visual-studio .ace_gutter {background: #FFFFFF;color: rgb(128,128,128)}.ace-visual-studio .ace_print-margin {width: 1px;background: #e8e8e8}.ace-visual-studio {background-color: #FFFFFF;color: #000000}.ace-visual-studio .ace_cursor {color: #000000}.ace-visual-studio .ace_marker-layer .ace_selection {background: #9DA7C3}.ace-visual-studio.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px #FFFFFF;border-radius: 2px}.ace-visual-studio .ace_marker-layer .ace_step {background: rgb(198, 219, 174)}.ace-visual-studio .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid #BFBFBF}.ace-visual-studio .ace_marker-layer .ace_active-line {background: rgba(0, 0, 0, 0.071)}.ace-visual-studio .ace_gutter-active-line {background-color: rgba(0, 0, 0, 0.071)}.ace-visual-studio .ace_marker-layer .ace_selected-word {border: 1px solid #9DA7C3}.ace-visual-studio .ace_fold {background-color: #000000;border-color: #000000}.ace-visual-studio .ace_keyword {color: #0000FF}.ace-visual-studio .ace_constant {color: #000000}.ace-visual-studio .ace_constant.ace_language {color: #000000}.ace-visual-studio .ace_constant.ace_numeric {color: #A31515}.ace-visual-studio .ace_constant.ace_character.ace_escape {color: #26B31A}.ace-visual-studio .ace_support.ace_function {color: #000000}.ace-visual-studio .ace_support.ace_constant {color: #000000}.ace-visual-studio .ace_support.ace_class {color: #000000}.ace-visual-studio .ace_support.ace_type {color: #000000}.ace-visual-studio .ace_storage.ace_type {color: #0000FF}.ace-visual-studio .ace_invalid {background-color: #E1A09F}.ace-visual-studio .ace_string {color: #A31515}.ace-visual-studio .ace_comment {color: #008000}.ace-visual-studio .ace_variable {color: #000000}.ace-visual-studio .ace_meta.ace_tag {color: #0000FF}.ace-visual-studio .ace_entity.ace_other.ace_attribute-name {color: #FF0000}.ace-visual-studio .ace_entity.ace_name.ace_function {color: #000000}.ace-visual-studio .ace_entity.ace_name.ace_tag {color: #A31515}.ace-visual-studio .ace_markup.ace_heading {color: #0C07FF}.ace-visual-studio .ace_markup.ace_list {color: #B90690}";var r=e("../lib/dom");r.importCssString(t.cssText,t.cssClass)});                (function() {
                    ace.require(["ace/theme/visual_studio"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            