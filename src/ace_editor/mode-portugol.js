/* eslint-disable */
/**
 * Ace Editor - Modo Portugol
 * 
 * Define as highlight rules, folding e comportamento específicos para a linguagem Portugol.
 * Segue os padrões de ace-builds/src-noconflict/mode-*.js (Java, Python, C/C++).
 * 
 * Módulos definidos:
 *   - ace/mode/portugol_highlight_rules
 *   - ace/mode/portugol_matching_brace_outdent
 *   - ace/mode/folding/portugol
 *   - ace/mode/portugol
 */

const ace = window.ace;

// ============================================================================
// ace/mode/portugol_highlight_rules
// ============================================================================
ace.define("ace/mode/portugol_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var PortugolHighlightRules = function() {

        // Palavras reservadas da linguagem Portugol
        var keywords = (
            "programa|funcao|inclua|biblioteca|" +
            "se|senao|enquanto|faca|para|" +
            "escolha|caso|contrario|pare|" +
            "retorne|const"
        );

        // Operadores lógicos textuais
        var logicalOperators = "e|ou|nao";

        // Tipos de dados
        var types = "inteiro|caracter|cadeia|real|logico|vazio";

        // Constantes booleanas
        var booleans = "verdadeiro|falso";

        // Funções built-in comuns
        var builtinFunctions = (
            "escreva|leia|limpa|sorteia"
        );

        var keywordMapper = this.createKeywordMapper({
            "keyword":              keywords + "|" + logicalOperators,
            "constant.language":    types + "|" + booleans,
            "support.function":     builtinFunctions
        }, "identifier");

        // Identificador Portugol: letras (incluindo acentos), _ e dígitos
        var identifierRe = "[a-zA-Z_\\u00C0-\\u024F][a-zA-Z0-9_\\u00C0-\\u024F]*";

        this.$rules = {
            "start" : [
                // Comentário de linha
                {
                    token : "comment",
                    regex : "\\/\\/.*$"
                },
                // Comentário de bloco
                {
                    token : "comment",
                    regex : "\\/\\*",
                    next  : "comment"
                },
                // String com aspas duplas
                {
                    token : "string",
                    regex : '"(?:[^"\\\\]|\\\\.)*"'
                },
                // String/caracter com aspas simples
                {
                    token : "string",
                    regex : "'(?:[^'\\\\]|\\\\.)*'"
                },
                // Número hexadecimal
                {
                    token : "constant.numeric",
                    regex : "0[xX][0-9a-fA-F]+\\b"
                },
                // Número real (com ponto)
                {
                    token : "constant.numeric",
                    regex : /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?\b/
                },
                // Seta de alias de inclua: -->
                {
                    token : "operator",
                    regex : "-->"
                },
                // Operadores compostos de atribuição
                {
                    token : "operator",
                    regex : "\\+=|\\-=|\\*=|\\/=|%=|>>=|<<=|&=|\\|=|\\^=|~="
                },
                // Incremento/decremento
                {
                    token : "operator",
                    regex : "\\+\\+|\\-\\-"
                },
                // Operadores de comparação
                {
                    token : "operator",
                    regex : "==|!=|<=|>=|<|>"
                },
                // Operadores lógicos simbólicos
                {
                    token : "operator",
                    regex : "&&|\\|\\||!"
                },
                // Operadores bitwise
                {
                    token : "operator",
                    regex : ">>|<<|&|\\||\\^|~"
                },
                // Atribuição simples
                {
                    token : "operator",
                    regex : "="
                },
                // Operadores aritméticos
                {
                    token : "operator",
                    regex : "[+\\-*/%]"
                },
                // Pontuação: ponto-e-vírgula, vírgula, ponto, dois-pontos
                {
                    token : "punctuation.operator",
                    regex : "[;,.:?]"
                },
                // Parênteses, colchetes e chaves de abertura
                {
                    token : "lparen",
                    regex : "[\\[({]"
                },
                // Parênteses, colchetes e chaves de fechamento
                {
                    token : "rparen",
                    regex : "[\\])}]"
                },
                // Keywords, tipos e identificadores (mapeados pelo keywordMapper)
                {
                    token : keywordMapper,
                    regex : identifierRe
                },
                // Espaços
                {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment",
                    regex : "\\*\\/",
                    next  : "start"
                }, {
                    defaultToken : "comment"
                }
            ]
        };

        this.normalizeRules();
    };

    oop.inherits(PortugolHighlightRules, TextHighlightRules);

    exports.PortugolHighlightRules = PortugolHighlightRules;
});

// ============================================================================
// ace/mode/portugol_matching_brace_outdent
// ============================================================================
ace.define("ace/mode/portugol_matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
    "use strict";

    var Range = require("../range").Range;

    var MatchingBraceOutdent = function() {};

    (function() {

        this.checkOutdent = function(line, input) {
            if (!/^\s+$/.test(line))
                return false;
            return /^\s*\}/.test(input);
        };

        this.autoOutdent = function(doc, row) {
            var line = doc.getLine(row);
            var match = line.match(/^(\s*\})/);

            if (!match) return 0;

            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({row: row, column: column});

            if (!openBracePos || openBracePos.row == row) return 0;

            var indent = this.$getIndent(doc.getLine(openBracePos.row));
            doc.replace(new Range(row, 0, row, column - 1), indent);
        };

        this.$getIndent = function(line) {
            return line.match(/^\s*/)[0];
        };

    }).call(MatchingBraceOutdent.prototype);

    exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

// ============================================================================
// ace/mode/folding/portugol
// ============================================================================
ace.define("ace/mode/folding/portugol",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
    "use strict";

    var oop = require("../../lib/oop");
    var Range = require("../../range").Range;
    var BaseFoldMode = require("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function() {

        this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
        this.foldingStopMarker  = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
        this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
        this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
        this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;

        // Fold por inclua statements (similar ao fold de import do Java)
        this.incluaRegex = /^\s*inclua\s+/;

        this._getFoldWidgetBase = this.getFoldWidget;
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);

            if (this.singleLineBlockCommentRe.test(line)) {
                if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                    return "";
            }

            var fw = this._getFoldWidgetBase(session, foldStyle, row);

            if (!fw && this.startRegionRe.test(line))
                return "start";

            // Fold de inclua statements agrupados
            if (!fw && foldStyle === "markbegin" && this.incluaRegex.test(line)) {
                if (row === 0 || !this.incluaRegex.test(session.getLine(row - 1)))
                    return "start";
            }

            return fw;
        };

        this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);

            if (this.startRegionRe.test(line))
                return this.getCommentRegionBlock(session, line, row);

            // Fold range para inclua statements
            var incluaMatch = line.match(this.incluaRegex);
            if (incluaMatch && foldStyle === "markbegin") {
                var startColumn = incluaMatch[0].length;
                var maxRow = session.getLength();
                var startRow = row;
                var endRow = row;

                while (++row < maxRow) {
                    line = session.getLine(row);
                    if (/^\s*$/.test(line)) continue;
                    if (!this.incluaRegex.test(line)) break;
                    endRow = row;
                }

                if (endRow > startRow) {
                    var endColumn = session.getLine(endRow).length;
                    return new Range(startRow, startColumn, endRow, endColumn);
                }
                return null;
            }

            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);

                var range = session.getCommentFoldRange(row, i + match[0].length, 1);

                if (range && !range.isMultiLine()) {
                    if (forceMultiline) {
                        range = this.getSectionRange(session, row);
                    } else if (foldStyle != "all")
                        range = null;
                }

                return range;
            }

            if (foldStyle === "markbegin")
                return;

            match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };

        this.getSectionRange = function(session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow = session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                var indent = line.search(/\S/);
                if (indent === -1) continue;
                if (startIndent > indent) break;
                var subRange = this.getFoldWidgetRange(session, "all", row);
                if (subRange) {
                    if (subRange.start.row <= startRow) break;
                    else if (subRange.isMultiLine()) row = subRange.end.row;
                    else if (startIndent == indent) break;
                }
                endRow = row;
            }
            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
        };

        this.getCommentRegionBlock = function(session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;

            var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
            var depth = 1;
            while (++row < maxRow) {
                line = session.getLine(row);
                var m = re.exec(line);
                if (!m) continue;
                if (m[1]) depth--;
                else depth++;
                if (!depth) break;
            }

            var endRow = row;
            if (endRow > startRow) {
                return new Range(startRow, startColumn, endRow, line.length);
            }
        };

    }).call(FoldMode.prototype);
});

// ============================================================================
// ace/mode/portugol  (Modo principal)
// ============================================================================
ace.define("ace/mode/portugol",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/portugol_highlight_rules","ace/mode/portugol_matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/portugol"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var PortugolHighlightRules = require("./portugol_highlight_rules").PortugolHighlightRules;
    var MatchingBraceOutdent = require("./portugol_matching_brace_outdent").MatchingBraceOutdent;
    var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
    var PortugolFoldMode = require("./folding/portugol").FoldMode;

    var Mode = function() {
        this.HighlightRules = PortugolHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new PortugolFoldMode();
    };
    oop.inherits(Mode, TextMode);

    (function() {

        this.lineCommentStart = "//";
        this.blockComment = {start: "/*", end: "*/"};
        this.$quotes = {'"': '"', "'": "'"};

        /**
         * Auto-indentação para Portugol.
         * Aumenta indentação após { ( [
         */
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);

            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;

            if (tokens.length && tokens[tokens.length - 1].type === "comment.block") {
                return indent;
            }

            // Aumenta indent se a linha termina com { ( [
            if (/[\{\(\[]\s*$/.test(line)) {
                indent += tab;
            }

            return indent;
        };

        this.checkOutdent = function(state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };

        this.autoOutdent = function(state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };

        // Sem worker de validação (a validação é feita pelo compilador Portugol)
        this.createWorker = function(session) {
            return null;
        };

        this.$id = "ace/mode/portugol";

    }).call(Mode.prototype);

    exports.Mode = Mode;
});

// Bootstrap: registra o módulo para uso com ace.require
(function() {
    ace.require(["ace/mode/portugol"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
