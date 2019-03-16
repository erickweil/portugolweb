ace.define("ace/theme/portugol_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-portugoldark";
exports.cssText = ".ace-portugoldark .ace_gutter {\
background: #1E2324;\
color: #516268\
}\
.ace-portugoldark .ace_print-margin {\
width: 1px;\
background: #232323\
}\
.ace-portugoldark {\
background-color: #263238;\
color: #FBFBFB\
}\
.ace-portugoldark .ace_cursor {\
color: #C1CBC2\
}\
.ace-portugoldark .ace_marker-layer .ace_selection {\
background: rgba(221, 240, 255, 0.20)\
}\
.ace-portugoldark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #141414;\
}\
.ace-portugoldark .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-portugoldark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(255, 255, 255, 0.25)\
}\
.ace-portugoldark .ace_marker-layer .ace_active-line {\
background: rgba(255, 255, 255, 0.031)\
}\
.ace-portugoldark .ace_gutter-active-line {\
background-color: rgba(255, 255, 255, 0.031)\
}\
.ace-portugoldark .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(221, 240, 255, 0.20)\
}\
.ace-portugoldark .ace_invisible {\
color: rgba(255, 255, 255, 0.25)\
}\
.ace-portugoldark .ace_keyword,\
.ace-portugoldark .ace_meta {\
color: #F03D37;\
font-weight: 800;\
}\
.ace-portugoldark .ace_operator {\
color: #E7C67A;\
}\
.ace-portugoldark .ace_constant.ace_numeric,\
.ace-portugoldark .ace_constant.ace_character,\
.ace-portugoldark .ace_constant.ace_character.ace_escape,\
.ace-portugoldark .ace_constant.ace_other,\
.ace-portugoldark .ace_heading,\
.ace-portugoldark .ace_markup.ace_heading,\
.ace-portugoldark .ace_support.ace_constant {\
color: #00F0C0;\
font-weight: 400;\
}\
.ace-portugoldark .ace_constant{\
color: #45BEFF;\
font-weight: 800;\
}\
.ace-portugoldark .ace_invalid.ace_illegal {\
color: #F8F8F8;\
background-color: rgba(86, 45, 86, 0.75)\
}\
.ace-portugoldark .ace_invalid.ace_deprecated {\
text-decoration: underline;\
font-style: italic;\
color: #D2A8A1\
}\
.ace-portugoldark .ace_support {\
color: #9B859D\
}\
.ace-portugoldark .ace_fold {\
background-color: #AC885B;\
border-color: #F8F8F8\
}\
.ace-portugoldark .ace_support.ace_function {\
color: #DAD085\
}\
.ace-portugoldark .ace_list,\
.ace-portugoldark .ace_markup.ace_list,\
.ace-portugoldark .ace_storage {\
color: #F9EE98\
}\
.ace-portugoldark .ace_entity.ace_name.ace_function,\
.ace-portugoldark .ace_meta.ace_tag,\
.ace-portugoldark .ace_variable {\
color: #AC885B\
}\
.ace-portugoldark .ace_string {\
color: #FFC200\
}\
.ace-portugoldark .ace_string.ace_regexp {\
color: #E9C062\
}\
.ace-portugoldark .ace_comment {\
font-style: italic;\
color: #66747B\
}\
.ace-portugoldark .ace_variable {\
color: #7587A6\
}\
.ace-portugoldark .ace_xml-pe {\
color: #494949\
}\
.ace-portugoldark .ace_lparen{\
color: #24708F;\
}\
.ace-portugoldark .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMQERFpYLC1tf0PAAgOAnPnhxyiAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/portugol_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();