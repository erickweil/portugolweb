ace.define("ace/theme/portugol_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-portugoldark";
    exports.cssText = ".ace-portugoldark .ace_gutter {\
    background: #1e1e1e;\
    color: #858585;\
    border-right: 1px solid #333333\
    }\
    .ace-portugoldark .ace_print-margin {\
    width: 1px;\
    background: #333333\
    }\
    .ace-portugoldark {\
    background-color: #1e1e1e;\
    color: #d4d4d4\
    }\
    .ace-portugoldark .ace_cursor {\
    color: #aeafad\
    }\
    .ace-portugoldark .ace_marker-layer .ace_selection {\
    background: #264f78\
    }\
    .ace-portugoldark.ace_multiselect .ace_selection.ace_start {\
    box-shadow: 0 0 3px 0px #1e1e1e;\
    }\
    .ace-portugoldark .ace_marker-layer .ace_step {\
    background: rgb(102, 82, 0)\
    }\
    .ace-portugoldark .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid #888888\
    }\
    .ace-portugoldark .ace_marker-layer .ace_active-line {\
    background: rgba(255, 255, 255, 0.04)\
    }\
    .ace-portugoldark .ace_gutter-active-line {\
    background-color: rgba(255, 255, 255, 0.04)\
    }\
    .ace-portugoldark .ace_marker-layer .ace_selected-word {\
    border: 1px solid #264f78\
    }\
    .ace-portugoldark .ace_invisible {\
    color: #4b4b4b\
    }\
    .ace-portugoldark .ace_keyword,\
    .ace-portugoldark .ace_meta {\
    color: #569cd6;\
    font-weight: normal;\
    }\
    .ace-portugoldark .ace_operator {\
    color: #d4d4d4;\
    }\
    .ace-portugoldark .ace_constant.ace_numeric,\
    .ace-portugoldark .ace_constant.ace_character,\
    .ace-portugoldark .ace_constant.ace_character.ace_escape,\
    .ace-portugoldark .ace_constant.ace_other,\
    .ace-portugoldark .ace_heading,\
    .ace-portugoldark .ace_markup.ace_heading,\
    .ace-portugoldark .ace_support.ace_constant {\
    color: #b5cea8;\
    font-weight: normal;\
    }\
    .ace-portugoldark .ace_constant{\
    color: #4fc1ff;\
    font-weight: normal;\
    }\
    .ace-portugoldark .ace_invalid.ace_illegal {\
    color: #f44747;\
    background-color: rgba(255, 0, 0, 0.15)\
    }\
    .ace-portugoldark .ace_invalid.ace_deprecated {\
    text-decoration: underline;\
    font-style: italic;\
    color: #d19a66\
    }\
    .ace-portugoldark .ace_support {\
    color: #9cdcfe\
    }\
    .ace-portugoldark .ace_fold {\
    background-color: #569cd6;\
    border-color: #d4d4d4\
    }\
    .ace-portugoldark .ace_support.ace_function {\
    color: #dcdcaa\
    }\
    .ace-portugoldark .ace_list,\
    .ace-portugoldark .ace_markup.ace_list,\
    .ace-portugoldark .ace_storage {\
    color: #c586c0\
    }\
    .ace-portugoldark .ace_entity.ace_name.ace_function,\
    .ace-portugoldark .ace_meta.ace_tag,\
    .ace-portugoldark .ace_variable {\
    color: #dcdcaa\
    }\
    .ace-portugoldark .ace_string {\
    color: #ce9178\
    }\
    .ace-portugoldark .ace_string.ace_regexp {\
    color: #d16969\
    }\
    .ace-portugoldark .ace_comment {\
    font-style: italic;\
    color: #6a9955\
    }\
    .ace-portugoldark .ace_variable {\
    color: #9cdcfe\
    }\
    .ace-portugoldark .ace_xml-pe {\
    color: #808080\
    }\
    .ace-portugoldark .ace_lparen{\
    color: #ffd700;\
    }\
    .ace-portugoldark .ace_indent-guide {\
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMQERFpYLC1tf0PAAgOAnPnhxyiAAAAAElFTkSuQmCC) right repeat-y\
    }\
    .ace_erroportugol-marker {\
       position: absolute;\
       background-color: rgba(255, 0, 0, 0.2);\
       z-index: 0;\
    }\
    .ace_realceportugol-marker {\
       position: absolute;\
       background-color: rgba(255, 255, 0, 0.15);\
       z-index: 0;\
    }\
    ";
    
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
    });                (function() {
                        ace.require(["ace/theme/portugol_dark"], function(m) {
                            if (typeof module == "object" && typeof exports == "object" && module) {
                                module.exports = m;
                            }
                        });
                    })();
    
