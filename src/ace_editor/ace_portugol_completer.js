import { getAllVariableParserDecl } from "../compiler/parser.js";
import { getTypeWord, reserved_words, type_words, T_parO, T_word } from "../compiler/tokenizer.js";

/**
 * Scores para priorizar sugestões no autocomplete.
 * Quanto maior o score, mais alto na lista.
 */
const SCORE = {
	LIBRARY_MEMBER: 100000, // Membros de bibliotecas (após ".")
	LOCAL_VARIABLE:   1200, // Variáveis locais
	GLOBAL_VARIABLE:  1100, // Variáveis globais
	USER_FUNCTION:    1000, // Funções definidas no programa
	BUILTIN_FUNCTION:  900, // Funções built-in
	LIBRARY_NAME:      800, // Nome de biblioteca
	INCLUA_TEMPLATE:   700, // Template "inclua biblioteca X --> x"
	TYPE_WORD:         500, // Tipos (inteiro, cadeia, real...)
	KEYWORD:           400, // Palavras reservadas (se, enquanto, para...)
	SNIPPET:           300, // Snippets de estrutura
};

/**
 * Snippets de estruturas comuns da linguagem Portugol.
 */
const PORTUGOL_SNIPPETS = [
	{
		caption: "programa",
		snippet: 'programa\n{\n\tfuncao inicio()\n\t{\n\t\t$0\n\t}\n}',
		meta: "Estrutura",
		docHTML: "<b>programa</b><hr>Estrutura principal de um programa Portugol.",
		score: SCORE.SNIPPET
	},
	{
		caption: "funcao (...)",
		snippet: 'funcao ${1:nome}(${2})\n{\n\t$0\n}',
		meta: "Estrutura",
		docHTML: "<b>funcao</b><hr>Declara uma nova função.",
		score: SCORE.SNIPPET
	},
	{
		caption: "se (...)",
		snippet: 'se(${1:condicao})\n{\n\t$0\n}',
		meta: "Estrutura",
		docHTML: "<b>se</b><hr>Estrutura condicional se.",
		score: SCORE.SNIPPET
	},
	{
		caption: "se senao (...)",
		snippet: 'se(${1:condicao})\n{\n\t$2\n}\nsenao\n{\n\t$0\n}',
		meta: "Estrutura",
		docHTML: "<b>se/senao</b><hr>Estrutura condicional se/senao.",
		score: SCORE.SNIPPET
	},
	{
		caption: "enquanto (...)",
		snippet: 'enquanto(${1:condicao})\n{\n\t$0\n}',
		meta: "Estrutura",
		docHTML: "<b>enquanto</b><hr>Laço de repetição enquanto.",
		score: SCORE.SNIPPET
	},
	{
		caption: "faca enquanto (...)",
		snippet: 'faca\n{\n\t$0\n}\nenquanto(${1:condicao})',
		meta: "Estrutura",
		docHTML: "<b>faca/enquanto</b><hr>Laço de repetição faça enquanto.",
		score: SCORE.SNIPPET
	},
	{
		caption: "para (...)",
		snippet: 'para(inteiro ${1:i} = ${2:0}; $1 < ${3:10}; $1++)\n{\n\t$0\n}',
		meta: "Estrutura",
		docHTML: "<b>para</b><hr>Laço de repetição para.",
		score: SCORE.SNIPPET
	},
	{
		caption: "escolha (...)",
		snippet: 'escolha(${1:variavel})\n{\n\tcaso ${2:valor}:\n\t\t$0\n\t\tpare\n\tcaso contrario:\n\t\t\n\t\tpare\n}',
		meta: "Estrutura",
		docHTML: "<b>escolha</b><hr>Estrutura de seleção múltipla escolha/caso.",
		score: SCORE.SNIPPET
	},
	{
		caption: "leia (...)",
		snippet: 'leia(${1})',
		meta: "Função",
		docHTML: "<b>leia(variavel)</b><hr>Lê um valor da entrada do usuário.",
		score: SCORE.BUILTIN_FUNCTION
	},
];

/**
 * Completer Portugol para o Ace Editor.
 * 
 * Implementa a interface de completer do Ace (getCompletions, getDocTooltip).
 * Integra-se com o compilador Portugol para oferecer sugestões contextuais.
 */
export default class PortugolCompleter {

	constructor(libraries) {
		// Palavras base da linguagem
		this._keywords = reserved_words.map(w => ({
			caption: w,
			value: w,
			meta: "Palavra-chave",
			docHTML: "<b>" + w + "</b><hr>Palavra reservada da linguagem.",
			score: SCORE.KEYWORD
		}));

		this._types = type_words.map(w => ({
			caption: w,
			value: w,
			meta: "Tipo",
			docHTML: "<b>" + w + "</b><hr>Tipo de dado.",
			score: SCORE.TYPE_WORD
		}));

		// Regex para identificar tokens do Portugol no autocomplete
		this.identifierRegexps = [/[a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*/];

		// Estado do compilador
		this.tokenizer = null;
		this.incluas = null;
		this.functions = null;
		this.variaveisGlobais = null;
		this.todasVariaveis = null;

		// Bibliotecas disponíveis
		this.libraryNames = Object.keys(libraries);
		this.libraries = libraries;

		// Cache de sugestões de bibliotecas (pré-computado)
		this._libraryIncluaSuggestions = this.libraryNames.map(name => ({
			caption: "inclua biblioteca " + name + " --> " + name.toLowerCase().charAt(0),
			value: "inclua biblioteca " + name + " --> " + name.toLowerCase().charAt(0),
			meta: "Biblioteca",
			docHTML: "<b>inclua biblioteca " + name + "</b><hr>Inclui a biblioteca " + name + " no programa.",
			score: SCORE.INCLUA_TEMPLATE
		}));

		this._libraryNameSuggestions = this.libraryNames.map(name => ({
			caption: name,
			value: name,
			meta: "Biblioteca",
			docHTML: "<b>" + name + "</b><hr>Biblioteca disponível.",
			score: SCORE.LIBRARY_NAME
		}));
	}

	/**
	 * Atualiza o estado do compilador para fornecer sugestões mais precisas.
	 * Chamado após cada compilação bem-sucedida.
	 */
	setCompiler(compilado) {
		if (compilado.tokenizer) {
			this.tokenizer = compilado.tokenizer;
		}
		if (compilado.compiler) {
			this.incluas = compilado.compiler.incluas;
			this.functions = compilado.compiler.functions;
		}
		if (compilado.tree) {
			this.variaveisGlobais = compilado.tree.variaveis;
			this.todasVariaveis = [];
			getAllVariableParserDecl(compilado.tree.funcoes, this.todasVariaveis);
		}
	}

	/**
	 * Gera a documentação HTML para uma função ou membro de biblioteca.
	 */
	_buildDocHTML(name, member, id) {
		return [
			"<b>", this._buildSignature(name, member, true, id), "</b>",
			"<hr>",
			member.comment || ""
		].join("");
	}

	/**
	 * Constrói a assinatura de uma função/variável como texto.
	 * @param {string} name - Nome da função/variável
	 * @param {object} member - Objeto com informações (type, parameters, etc.)
	 * @param {boolean} withTypes - Se deve incluir os tipos na assinatura
	 * @param {number} id - Tipo do token (T_word para variáveis, T_parO para funções)
	 * @returns {string} Assinatura formatada
	 */
	_buildSignature(name, member, withTypes, id) {
		if (id === T_word) {
			return withTypes ? name + " : " + getTypeWord(member.type) : name;
		}

		if (id === T_parO) {
			let sig = name + "(";

			if (member.parameters) {
				for (let i = 0; i < member.parameters.length; i++) {
					if (i > 0) sig += ", ";
					const p = member.parameters[i];
					if (typeof p === 'object') {
						if (withTypes) {
							sig += getTypeWord(p.type) + " ";
						}
						sig += p.name;
					}
				}
			}

			sig += ")";
			if (withTypes) {
				sig += " : " + getTypeWord(member.type);
			}
			return sig;
		}

		return name;
	}

	/**
	 * Constrói um snippet com placeholders para parâmetros de função.
	 */
	_buildSnippet(name, member) {
		let snip = name + "(";
		if (member.parameters && member.parameters.length > 0) {
			for (let i = 0; i < member.parameters.length; i++) {
				if (i > 0) snip += ", ";
				const p = member.parameters[i];
				if (typeof p === 'object') {
					snip += "${" + (i + 1) + ":" + p.name + "}";
				}
			}
		} else {
			snip += "$0";
		}
		snip += ")";
		return snip;
	}

	/**
	 * Detecta se o cursor está após um "." e retorna o prefixo antes do ponto.
	 * @returns {{ isDot: boolean, objectName: string }}
	 */
	_detectDotContext(entireLine, pos) {
		const offPonto = entireLine.lastIndexOf(".");
		if (offPonto === -1 || offPonto + 1 !== pos.column) {
			return { isDot: false, objectName: "" };
		}
		// Extrai a palavra antes do ponto
		const beforeDot = entireLine.substring(0, offPonto).trimEnd();
		const match = beforeDot.match(/([a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*)$/);
		return {
			isDot: true,
			objectName: match ? match[1] : ""
		};
	}

	/**
	 * Retorna membros de uma biblioteca pelo nome ou alias.
	 */
	_getLibraryMembers(objectName) {
		// Verifica se é nome direto da biblioteca
		if (this.libraries[objectName]) {
			return { lib: this.libraries[objectName], libName: objectName };
		}

		// Verifica se é alias de inclua
		if (this.incluas) {
			for (const inclua of this.incluas) {
				if (inclua.alias === objectName) {
					return { lib: this.libraries[inclua.name], libName: inclua.name };
				}
			}
		}

		return null;
	}

	/**
	 * Interface do Ace Editor: retorna as sugestões de autocomplete.
	 */
	getCompletions(editor, session, pos, prefix, callback) {
		const entireLine = session.getLine(pos.row);
		const dotCtx = this._detectDotContext(entireLine, pos);

		// Se estamos após ".", mostrar apenas membros da biblioteca
		if (dotCtx.isDot && dotCtx.objectName) {
			const libResult = this._getLibraryMembers(dotCtx.objectName);
			if (libResult && libResult.lib) {
				const memberSuggestions = Object.keys(libResult.lib.members).map(entry => {
					const member = libResult.lib.members[entry];
					return {
						caption: this._buildSignature(entry, member, true, member.id),
						snippet: member.id === T_parO ? this._buildSnippet(entry, member) : undefined,
						value: member.id !== T_parO ? entry : undefined,
						meta: libResult.libName,
						docHTML: this._buildDocHTML(entry, member, member.id),
						score: SCORE.LIBRARY_MEMBER
					};
				});
				callback(null, memberSuggestions);
				return;
			}
		}

		// Sugestões gerais
		const sugestoes = [];

		// 1. Snippets de estrutura
		for (const snip of PORTUGOL_SNIPPETS) {
			sugestoes.push(snip);
		}

		// 2. Palavras-chave e tipos
		for (const kw of this._keywords) {
			sugestoes.push(kw);
		}
		for (const tp of this._types) {
			sugestoes.push(tp);
		}

		// 3. Templates de inclua biblioteca
		for (const inc of this._libraryIncluaSuggestions) {
			sugestoes.push(inc);
		}

		// 4. Nomes de bibliotecas
		for (const lib of this._libraryNameSuggestions) {
			sugestoes.push(lib);
		}

		// 5. Funções definidas no programa
		if (this.functions) {
			for (const entry of this.functions) {
				// Pula funções internas (leia$inteiro, etc.)
				if (entry.name.includes("$") || entry.name.includes("#")) continue;

				sugestoes.push({
					caption: this._buildSignature(entry.name, entry, true, T_parO),
					snippet: this._buildSnippet(entry.name, entry),
					meta: "Função",
					docHTML: this._buildDocHTML(entry.name, entry, T_parO),
					score: SCORE.USER_FUNCTION
				});
			}
		}

		// 6. Variáveis globais
		if (this.variaveisGlobais) {
			for (const entry of this.variaveisGlobais) {
				sugestoes.push({
					caption: this._buildSignature(entry.name, entry, true, T_word),
					value: entry.name,
					meta: "Global",
					docHTML: "<b>" + this._buildSignature(entry.name, entry, true, T_word) + "</b><hr>Variável global.",
					score: SCORE.GLOBAL_VARIABLE
				});
			}
		}

		// 7. Variáveis locais (todas as funções)
		if (this.todasVariaveis) {
			for (const entry of this.todasVariaveis) {
				sugestoes.push({
					caption: this._buildSignature(entry.name, entry, true, T_word),
					value: entry.name,
					meta: "Local",
					docHTML: "<b>" + this._buildSignature(entry.name, entry, true, T_word) + "</b><hr>Variável local.",
					score: SCORE.LOCAL_VARIABLE
				});
			}
		}

		// 8. Alias de incluas
		if (this.incluas) {
			for (const inclua of this.incluas) {
				sugestoes.push({
					caption: inclua.alias + " (" + inclua.name + ")",
					value: inclua.alias,
					meta: "Biblioteca",
					docHTML: "<b>" + inclua.alias + "</b><hr>Atalho para biblioteca " + inclua.name + ".<br>Digite <code>" + inclua.alias + ".</code> para ver membros.",
					score: SCORE.LIBRARY_NAME
				});
			}
		}

		// Filtra por prefixo (case-insensitive)
		// Assim não sugere errado um monte de coisa nada a ver
		const lowerPrefix = prefix.toLowerCase();
		const filtered = prefix === ""
			? sugestoes
			: sugestoes.filter(s => {
				const val = (s.value || s.caption || "");
				return typeof val === "string" && val.toLowerCase().includes(lowerPrefix);
			});

		callback(null, sugestoes);
	}

	/**
	 * Interface do Ace Editor: retorna tooltip HTML para um item do autocomplete.
	 */
	getDocTooltip(item) {
		if (!item.docHTML) {
			item.docHTML = [
				"<b>", item.caption, "</b>",
				"<hr>",
				item.tooltip || ""
			].join("");
		}
	}
}
