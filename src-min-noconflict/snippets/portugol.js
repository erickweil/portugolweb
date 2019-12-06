ace.define("ace/snippets/portugol",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = 
"# Function\n\
snippet fun\n\
	funcao ${1?:nome}(${2:parametros}) {\n\
		${3:// corpo...}\n\
	}\n\
# se\n\
snippet se\n\
	se (${1:verdadeiro}) {\n\
		${0}\n\
	}\n\
# se ... senao\n\
snippet sen\n\
	se (${1:verdadeiro}) {\n\
		${2}\n\
	} senao {\n\
		${0}\n\
	}\n\
# escolha\n\
snippet escolha\n\
	escolha (${1:expressao}) {\n\
		caso '${3:caso}':\n\
			${4:// código}\n\
			pare\n\
		${5}\n\
		caso contrario:\n\
			${2:// código}\n\
	}\n\
# caso\n\
snippet caso\n\
	caso '${1:caso}':\n\
		${2:// código}\n\
		pare\n\
	${3}\n\
\n\
# enquanto (...) {...}\n\
snippet enq\n\
	enquanto (${1:/* condicao */}) {\n\
		${0:/* código */}\n\
	}\n\
# face...encquanto\n\
snippet faca\n\
	faca {\n\
		${2:/* code */}\n\
	} enquanto (${1:/* condicao */});\n\
# Object Method\n\
snippet :f\n\
regex /([,{[])|^\\s*/:f/\n\
	${1:method_name}: function(${2:attribute}) {\n\
		${0}\n\
	}${3:,}\n\
# setTimeout function\n\
snippet escr\n\
regex /\\b/es|escreva|escr?e?v?a?l?/\n\
	escreva(\"${3:$TM_SELECTED_TEXT}\")\n\
# retorne\n\
snippet ret\n\
	retorne ${1:result}\n\
# docstring\n\
snippet /**\n\
	/**\n\
	 * ${1:description}\n\
	 *\n\
	 */\n\
snippet @par\n\
regex /^\\s*\\*\\s*/@(para?m?)?/\n\
	@param {${1:type}} ${2:name} ${3:description}\n\
snippet @ret\n\
	@return {${1:type}} ${2:description}\n\
snippet para\n\
	para (inteiro ${1:i} = 0; $1 < 10 ; $1++) {\n\
		escreva(\"i:\"+$1)\n\
	}\n\
\n\
";
exports.scope = "portugol";

});                (function() {
                    ace.require(["ace/snippets/portugol"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();