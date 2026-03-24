import { STATEMENT_block, STATEMENT_caso, STATEMENT_declArr, STATEMENT_declArrValues, STATEMENT_declParVar, STATEMENT_declVar, STATEMENT_enquanto, STATEMENT_escolha, STATEMENT_expr, STATEMENT_facaEnquanto, STATEMENT_para, STATEMENT_pare, STATEMENT_ret, STATEMENT_se 
} from "./parser.js";
import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro, T_Vetor, T_Matriz, T_Vinteiro, T_Vcaracter, T_Vcadeia, T_Vreal, T_Vlogico, T_Mcaracter, T_Mcadeia, T_Mreal, T_Mlogico, convertArrayDimsType, convertArrayType, convertMatrixType, T_attrib, isOperator, getOpPrecedence, T_and, T_or, T_ge, T_gt, T_le, T_lt, T_equals, T_notequals, isAttribOp, getSeparator, T_div, T_attrib_div, T_not, T_unary_plus, T_unary_minus, T_autoinc, T_pre_autoinc, T_autodec, T_pre_autodec, T_bitnot, T_inteiroLiteral, T_realLiteral, T_cadeiaLiteral, T_caracterLiteral, stringEscapeSpecials, T_logicoLiteral, T_squareO, T_dot 
} from "./tokenizer.js";
import { checarCompatibilidadeTipo, getTipoRetorno, Scope 
} from "./vmcompiler.js";

/**
 * Gera código JavaScript puro (async) a partir da AST do Portugol.
 *
 * O código gerado é completamente independente de vm.js.
 * Todas as funções do usuário são async, permitindo usar await no leia() e em
 * chamadas de biblioteca como u.aguarde().
 *
 * O resultado de compile() é uma string JS que, quando avaliada via eval(),
 * retorna uma async function(ctx) onde ctx fornece:
 *   ctx.escreva(...args)          - escreve na saída
 *   ctx.leia(tipo)                - retorna Promise<valor> com a entrada
 *   ctx.limpa()                   - limpa a saída
 *   ctx.libraries                 - objeto com as bibliotecas instanciadas
 *   ctx.handleLibState(result)    - trata retornos assíncronos de bibliotecas
 */

function getDefaultTxtValue(code)
{
	switch(code)
	{
		case T_inteiro: return "0";
		case T_caracter: return "'\\0'";
		case T_cadeia: return '""';
		case T_real: return "0.0";
		case T_logico: return "false";
		case T_squareO: return "[]";
		default: return "undefined";
	}
}

function getTypeChar(code)
{
	switch(code)
	{
		case T_inteiro: return "i";
		case T_caracter: return "c";
		case T_cadeia: return "s";
		case T_real: return "f";
		case T_logico: return "b";
		case T_Vinteiro: return "vi";
		case T_Vcaracter: return "vc";
		case T_Vcadeia: return "vs";
		case T_Vreal: return "vf";
		case T_Vlogico: return "vb";
		case T_Minteiro: return "mi";
		case T_Mcaracter: return "mc";
		case T_Mcadeia: return "ms";
		case T_Mreal: return "mf";
		case T_Mlogico: return "mb";
		case T_Vetor: return "v";
		case T_Matriz: return "m";
		default: return "u";
	}
}

export default class JsGenerator {
	constructor(compiler,codeTree,libraries,tokens,textInput,erroCallback) {
		this.compiler = compiler;
		this.codeTree = codeTree;
		this.tokens = tokens;
		this.textInput = textInput;
		this.libraries = libraries;
		
		this.incluas = [];
		this.scope = null;
		this.functions = [];
		this.currentFunctionRetType = T_vazio;
		this.isnewLine = true;
		this.gen_output = "";
		this.tabs = "";
		this.saved_gen_output = [];
		this.enviarErro = erroCallback;
		this.lastIndex = 0;

		// Resultado da compilação: string de código JS
		this.generatedCode = "";
	}
	
	erro(msg)
	{	
		if(this.enviarErro)
			this.enviarErro(this.textInput,{index:this.lastIndex},msg,"exec");
		else
			console.log("ERRO NO JSGENERATOR:",msg);
	}
	
	save_gen()
	{
		this.saved_gen_output.push({gen_output:this.gen_output, isnewLine:this.isnewLine, tabs:this.tabs});
		this.isnewLine = true;
		this.gen_output = "";
		this.tabs = "";
	}
	
	load_gen()
	{
		let previous_gen_output = this.gen_output;
		
		if(this.saved_gen_output.length > 0)
		{
			let saved = this.saved_gen_output.pop();
			this.gen_output = saved.gen_output;
			this.isnewLine = saved.isnewLine;
			this.tabs = saved.tabs;
		}
		else
		{
			this.isnewLine = true;
			this.gen_output = "";
			this.tabs = "";
		}
		
		return previous_gen_output;
	}
	
	gen(...txt)
	{
		if(this.isnewLine)
		{
			this.gen_output += this.tabs;
			this.isnewLine = false;
		}
		else
		{
			this.gen_output += " ";
		}
		
		for(let i=0;i<txt.length;i++)
		{
			if(i != 0) this.gen_output += " ";
			this.gen_output += txt[i];
		}
	}
	
	genln(...txt)
	{
		if(this.isnewLine)
		{
			this.gen_output += this.tabs;
			this.isnewLine = false;
		}
		else
		{
			this.gen_output += " ";
		}
		
		for(let i=0;i<txt.length;i++)
		{
			if(i != 0) this.gen_output += " ";
			this.gen_output += txt[i];
		}
		
		this.gen_output += "\n";
		this.isnewLine = true;
	}
	
	increaseTabLevel()
	{
		this.tabs += "\t";
	}
	
	decreaseTabLevel()
	{
		this.tabs = this.tabs.substring(0,this.tabs.length-1);
	}
	
	getFuncOverloadsTypeString(func)
	{
		let ret = func.name;
		let parameters = func.parameters;
		for(let k=0;k<parameters.length;k++)
		{
			if(parameters[k].id == STATEMENT_declArr)
			{
				let arrayDim = parameters[k].size_expr.length;
				ret += getTypeChar(convertArrayDimsType(parameters[k].type,arrayDim));
			}
			else
			{
				ret += getTypeChar(parameters[k].type);
			}
		}
		return ret;
	}

	getJsSafe(func) {
		// Usa igualdade de referência: tanto o JsGenerator quanto o vmcompiler
		// recebem funcoes[i].parameters do mesmo objeto da AST, então podemos
		// identificar a sobrecarga exata sem ambiguidade de tipo.
		const matchFn = this.compiler.functions.find(
			(f) => f.name === func.name && f.parameters === func.parameters
		);
		if (!matchFn) {
			throw new Error("Função não encontrada: " + func.name);
		}

		return matchFn.jsSafe === true;
	}
	
	compile()
	{
		let funcoes = this.codeTree.funcoes;
		let variaveisGlobais = this.codeTree.variaveis;
		
		this.incluas = this.codeTree.incluas;
		
		this.scope = new Scope(this.scope,true,null);
		
		// Registra as funções built-in para resolução de nomes
		this.functions = [
			{name:"$undefined",parameters:[],type:T_vazio},
			{name:"escreva",parameters:[],type:T_vazio},
			{name:"limpa",parameters:[],type:T_vazio},
			{name:"leia$inteiro",parameters:[],type:T_vazio},
			{name:"leia$real",parameters:[],type:T_vazio},
			{name:"leia$cadeia",parameters:[],type:T_vazio},
			{name:"leia$caracter",parameters:[],type:T_vazio},
			{name:"leia$logico",parameters:[],type:T_vazio},
			{name:"sorteia",parameters:[
				{id: STATEMENT_declParVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"a"},
				{id: STATEMENT_declParVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"b"}
			],type:T_inteiro}
		];
		
		// Registra as funções do usuário
		for(let i=0;i<funcoes.length;i++)
		{
			let func = {name:funcoes[i].name,parameters:funcoes[i].parameters,type:funcoes[i].type,statements:funcoes[i].statements,overloaded:false,overloadedName:false};
			
			for(let k=0;k<funcoes.length;k++)
			{
				if(i != k && func.name == funcoes[k].name)
				{
					func.overloaded = true;
					func.overloadedName = this.getFuncOverloadsTypeString(func);
				}
			}
			this.functions.push(func);
		}
		
		// --- Início da geração de código ---
		this.genln("return async function($ctx) {");
		this.increaseTabLevel();
		
		// Funções helper inline
		this.genln("const escreva = $ctx.escreva;");
		this.genln("const leia = $ctx.leia;");
		this.genln("const limpa = $ctx.limpa;");
		this.genln("const sorteia = $ctx.sorteia;");
		this.genln("const $i2s = $ctx.i2s;");
		this.genln("const $f2s = $ctx.f2s;");
		this.genln("const $b2s = $ctx.b2s;");
		this.genln("const $newArray = $ctx.newArray;");
		for(let libName in this.libraries) {
			this.genln("const "+libName+" = $ctx.libraries['"+libName+"'];");
		}

		// Variáveis globais
		this.genln("// --- Variáveis Globais ---");
		this.compileStatements(variaveisGlobais);
		this.genln("");
		
		// Gerar as funções do usuário
		this.genln("// --- Funções ---");
		for(let i=0;i<this.functions.length;i++)
		{
			let func = this.functions[i];
			if(!func.statements) continue;
			
			let funcName = func.overloaded ? func.overloadedName : func.name;
			let parameters = func.parameters;
			
			this.currentFunctionRetType = func.type;
			
			if(this.getJsSafe(func)) {
				this.gen("function",funcName+"(");
			} else {
				this.gen("async function",funcName+"(");
			}
			
			this.scope = new Scope(this.scope,false,null);
			
			for(let k=0;k<parameters.length;k++)
			{
				if(k != 0) this.gen(",");
				
				if(parameters[k].id == STATEMENT_declArr)
				{
					let arrayDim = parameters[k].size_expr.length;
					this.createVar(parameters[k].name,parameters[k].type,parameters[k].isConst,true,arrayDim,parameters[k].byRef);
				}
				else
					this.createVar(parameters[k].name,parameters[k].type,parameters[k].isConst,false,undefined,parameters[k].byRef);
				
				this.gen(parameters[k].name);
			}
			
			this.genln(")");
			
			this.compileStatements(func.statements);
			
			this.genln("");
			
			this.scope = this.scope.parentScope;
		}
		
		// Chamar inicio()
		this.genln("// --- Execução ---");
		this.genln("await inicio();");
		
		this.decreaseTabLevel();
		this.genln("};");
		
		this.scope = this.scope.parentScope;
		
		this.generatedCode = this.gen_output;
	}
	
	getFuncIndex(name,funcArgs)
	{
		for(let i=0;i<this.functions.length;i++)
		{
			if(this.functions[i].name == name)
			{
				let funcPars = this.functions[i].parameters;
				
				if(funcPars.length != funcArgs.length)
					continue;
				
				let funcCompatible = true;
				for(let k=0;k<funcPars.length;k++)
				{
					let typeCheck = funcPars[k].type;
					
					if(funcPars[k].id == STATEMENT_declArr)
					{
						let dims = funcPars[k].size_expr.length;
						if(dims == 1) typeCheck = convertArrayType(typeCheck);
						if(dims == 2) typeCheck = convertMatrixType(typeCheck);
					}
					
					if(!checarCompatibilidadeTipo(typeCheck,funcArgs[k],T_attrib)) 
					{
						funcCompatible = false;
						break;
					}
				}
				
				if(!funcCompatible)
					continue;
				
				return i;
			}
		}
		this.erro("a função '"+name+"' com "+funcArgs.length+" argumentos e tipos:"+funcArgs+" não foi encontrada");
		return 0;
	}
	
	createVar(varName,type,isConst,isArray,arrayDim,byRef)
	{
		let v = this.scope.getVar(varName);
		if(v)
		{
			this.erro("a variável '"+varName+"' já foi declarada");
			return v;
		}
		else
		{
			let vType = type;
			if(isArray)
			{
				if(arrayDim == 1)
					vType = convertArrayType(type);
				else if(arrayDim == 2)
					vType = convertMatrixType(type);
				else
					this.erro("Matrizes com 3 ou mais dimensões não suportados:"+arrayDim);
			}
			
			v = {
				type:vType,
				name:varName,
				index:this.scope.globalScope ? this.scope.globalCount : this.scope.varCount,
				global:this.scope.globalScope,
				isConst:isConst,
				isArray:isArray,
				arrayType:isArray ? type : T_vazio,
				arrayDim:arrayDim,
				byRef:!!byRef
			};
			this.scope.createVar(varName,v);
			return v;
		}
	}
	
	getVar(varName)
	{
		let v = this.scope.getVar(varName);
		if(v)
		{
			return v;
		}
		else
		{
			this.erro("não encontrou a variável '"+varName+"', esqueceu de declará-la?");
			return this.createVar(varName,T_cadeia,false,false);
		}
	}
	
	compileDeclArray(values,arrayType,arrayDim)
	{
		for(let k=0;k<values.length;k++)
		{
			if(k != 0) this.gen(",");
			if(arrayDim <= 1)
			{
				this.compileExpr(values[k],arrayType);
			}
			else
			{
				this.gen("[");
				this.compileDeclArray(values[k],arrayType,arrayDim-1);
				this.gen("]");
			}
		}
	}
	
	compileForStatements(statements)
	{
		for(let i=0;i<statements.length;i++)
		{
			let stat = statements[i];
			
			switch(stat.id)
			{
				case STATEMENT_declVar:
				{
					this.createVar(stat.name,stat.type,stat.isConst,false);
					this.gen("let",stat.name);
					if(stat.expr)
					{
						this.gen("=");
						this.compileExpr(stat.expr,stat.type);
					}
				}
				break;
				case STATEMENT_expr:
					this.compileExpr(stat.expr,T_vazio);
				break;
				default:
					this.erro("Só é permitido declaração de variáveis e expressões dentro da parte de declaração do para");
				break;
			}
		}
	}
	
	compileStatements(statements)
	{
		for(let i=0;i<statements.length;i++)
		{
			let stat = statements[i];
			this.lastIndex = stat.index;
			switch(stat.id)
			{
				case STATEMENT_declArr:
				{
					let arrayDim = stat.size_expr.length;
					let v = this.createVar(stat.name,stat.type,stat.isConst,true,arrayDim);
					
					this.gen("let",stat.name,"=");
					
					let declExpr = stat.expr;
					if(!declExpr)
					{
						this.gen("$newArray([");
						for(let k=0;k<stat.size_expr.length;k++)
						{
							if(k != 0) this.gen(",");
							this.compileExpr(stat.size_expr[k],T_inteiro);
						}
						this.genln("],"+getDefaultTxtValue(stat.type)+",0);");
						// Eu sei.
						// Update 07/06/2022: Sabe oq????????/
						// Update 12/12/2022: ???????????????????????
						// Update 11/03/2023: A moral da história é: Nunca faça comentários apenas 'Eu sei'.
						// Update 21/03/2026: Se tinha um bug agora não tem mais
					}
					else
					{				
						if(stat.expr.id == STATEMENT_declArrValues)
						{
							this.gen("[");
							this.compileDeclArray(stat.expr.expr,stat.type,arrayDim);
							this.genln("];");
						}
						else if(stat.expr.id == STATEMENT_expr)
						{
							this.compileExpr(stat.expr.expr,v.type);
							this.genln(";");
						}
					}
				}
				break;
				case STATEMENT_declParVar:
				case STATEMENT_declVar:
				{
					let v = this.createVar(stat.name,stat.type,stat.isConst,false);
					
					this.gen("let",stat.name);
					
					if(stat.expr)
					{
						this.gen("=");
						this.compileExpr(stat.expr,stat.type);
						this.genln(";");
					}
					else
					{
						this.genln("= "+getDefaultTxtValue(v.type)+";");
					}
				}
				break;
				case STATEMENT_expr:
				{
					this.compileExpr(stat.expr,T_vazio);
					this.genln(";");
				}
				break;
				case STATEMENT_block:
					this.genln("{");
					
					this.scope = new Scope(this.scope,false,null);
					this.increaseTabLevel();
					this.compileStatements(stat.statements);
					this.scope = this.scope.parentScope;
					this.decreaseTabLevel();
					this.genln("}");
				break;
				case STATEMENT_se:
					this.gen("if(");
					this.compileExpr(stat.expr,T_logico);
					this.genln(")");
					this.compileStatements(stat.statements_true);
										
					if(stat.statements_false)
					{
						this.genln("else");
						this.compileStatements(stat.statements_false);
					}
				break;
				case STATEMENT_enquanto:
					this.gen("while(");
					this.compileExpr(stat.expr,T_logico);
					this.genln(")");
					this.compileStatements(stat.statements);
				break;
				case STATEMENT_facaEnquanto:
					this.genln("do");
					this.compileStatements(stat.statements);
					this.gen("while(");
					this.compileExpr(stat.expr,T_logico);
					this.genln(");");
				break;
				case STATEMENT_para:
					this.gen("for(");
					
					this.scope = new Scope(this.scope,false,null);
					
					if(stat.decl)
						this.compileForStatements(stat.decl);
					
					this.gen(";");
					
					if(stat.expr)
						this.compileExpr(stat.expr,T_logico);
					
					this.gen(";");
					
					if(stat.inc)
						this.compileExpr(stat.inc,T_vazio);
					
					this.genln(")");
					this.compileStatements(stat.statements);
					
					this.scope = this.scope.parentScope;
				break;
				case STATEMENT_pare:
					this.genln("break;");
				break;
				case STATEMENT_ret:
					if(stat.expr)
					{
						this.gen("return");
						this.compileExpr(stat.expr,this.currentFunctionRetType);
						this.genln(";");
					}
					else
					{
						this.genln("return;");
					}
				break;
				case STATEMENT_escolha:
				{
					this.gen("switch(");
					this.compileExpr(stat.expr,-1);
					this.genln(")");
					
					this.compileStatements(stat.statements);
				}
				break;
				case STATEMENT_caso:
					if(stat.contrario)
					{
						this.gen("default");
					}
					else
					{
						this.gen("case");
						this.compileExpr(stat.expr,-1);
					}
					this.genln(":");
				break;
				default:
					this.erro("Tipo de statement desconhecido:"+stat.id);
				break;
			}
		}
	}
	
	tryConvertType(tRet,tA,exprGen)
	{
		if(tRet == T_cadeia)
		{
			if(tA == T_inteiro) return "$i2s("+exprGen+")";
			else if(tA == T_real) return "$f2s("+exprGen+")";
			else if(tA == T_logico) return "$b2s("+exprGen+")";
			else return exprGen;
		}
		else if(tRet == T_inteiro)
		{
			if(tA == T_real) return "Math.trunc("+exprGen+")";
			else return exprGen;
		}
		else return exprGen;
	}
	
	/**
	 * Compila uma expressão e escreve o JS correspondente.
	 * typeExpected:
	 *   -1      = precisa retornar algum valor, qualquer tipo
	 *   T_vazio = não precisa retornar valor
	 *   T_*     = deveria retornar aquele tipo
	 */
	compileExpr(expr,typeExpected,isAssign = false)
	{
		if(!expr) return T_vazio;

		let retType = T_vazio;
		
		this.save_gen();

		if(expr.length == 2)
		{	
			let parOnExpr0 = isOperator(expr[0].op) && getOpPrecedence(expr[0].op) < getOpPrecedence(expr.op);
			let parOnExpr1 = isOperator(expr[1].op) && getOpPrecedence(expr[1].op) <= getOpPrecedence(expr.op);
			
			this.save_gen();
			
			if(parOnExpr0) this.gen("(");
			let tExprA = this.compileExpr(expr[0],-1,true);
			if(parOnExpr0) this.gen(")");
			
			let exprAGen = this.load_gen();
			
			this.save_gen();
			
			if(parOnExpr1) this.gen("(");
			let tExprB = this.compileExpr(expr[1],-1);
			if(parOnExpr1) this.gen(")");
			
			let exprBGen = this.load_gen();
			
			retType = getTipoRetorno(tExprA,tExprB);
	
			if(
				expr.op == T_and
				|| expr.op == T_or
				|| expr.op == T_ge
				|| expr.op == T_gt
				|| expr.op == T_le
				|| expr.op == T_lt
				|| expr.op == T_equals
				|| expr.op == T_notequals)
			{
				retType = T_logico;
			}
			else if(isAttribOp(expr.op))
			{
				retType = tExprA;
				exprBGen = this.tryConvertType(tExprA,tExprB,exprBGen);
			}
			else if(retType == T_cadeia)
			{
				exprAGen = this.tryConvertType(retType,tExprA,exprAGen);
				exprBGen = this.tryConvertType(retType,tExprB,exprBGen);
			}
			
			let exprGen = exprAGen;
			
			if(expr.op == T_and) exprGen += " && ";
			else if(expr.op == T_or) exprGen += " || ";
			else exprGen += " " + getSeparator(expr.op) + " ";
			
			exprGen += exprBGen;
			
			if(retType == T_inteiro && expr.op == T_div)
			{
				exprGen = this.tryConvertType(T_inteiro,T_real,exprGen);
			}
			
			if(retType == T_inteiro && expr.op == T_attrib_div)
			{
				this.gen(exprAGen," = ",this.tryConvertType(T_inteiro,T_real,exprGen));
			}
			else
			{
				this.gen(exprGen);
			}
		}
		else
		{
			switch(expr.op)
			{
				case T_not:
				{
					this.gen("!(");
					this.compileExpr(expr[0],-1);
					this.gen(")");
					retType = T_logico;
				}
				break;
				case T_unary_plus:
					retType = this.compileExpr(expr[0],-1);
				break;
				case T_unary_minus:
				{
					this.gen("(-");
					let tExpr = this.compileExpr(expr[0],-1);
					this.gen(")");
					retType = tExpr;
				}
				break;
				case T_autoinc:
				{
					let tExpr = this.compileExpr(expr[0],-1);
					this.gen("++");
					retType = tExpr;
				}
				break;
				case T_pre_autoinc:
				{
					this.gen("++");	
					let tExpr = this.compileExpr(expr[0],-1);
					retType = tExpr;
				}
				break;
				case T_autodec:
				{
					let tExpr = this.compileExpr(expr[0],-1);
					this.gen("--");
					retType = tExpr;
				}
				break;
				case T_pre_autodec:
				{
					this.gen("--");	
					let tExpr = this.compileExpr(expr[0],-1);
					retType = tExpr;
				}
				break;
				case T_bitnot:
				{
					this.gen("~(");
					let tExpr = this.compileExpr(expr[0],-1);
					this.gen(")");
					retType = tExpr;
				}
				break;
				case T_parO: // chamada de função
				{
					let args = expr.args;
					let methName = expr.name;
					let funcArgs = [];
					let funcArgsGen = [];
					
					for(let i=0;i<args.length;i++)
					{
						this.save_gen();					
						funcArgs.push(this.compileExpr(args[i],-1));
						funcArgsGen.push(this.load_gen());
					}
					
					if(methName == "escreva")
					{
						this.gen("escreva(");
						for(let i=0;i<args.length;i++)
						{
							if(i != 0) this.gen(",");
							this.gen(this.tryConvertType(T_cadeia,funcArgs[i],funcArgsGen[i]));
						}
						this.gen(")");
						retType = T_vazio;
					}
					else if(methName == "limpa")
					{
						this.gen("limpa()");
						retType = T_vazio;
					}
					else if(methName == "leia")
					{
						// O tipo é determinado pela variável onde será atribuído
						let leiaType = "cadeia";
						retType = T_cadeia;
						if(funcArgs[0] == T_inteiro) {
							leiaType = "inteiro";
							retType = T_inteiro;
						} else if(funcArgs[0] == T_real) {
							leiaType = "real";
							retType = T_real;
						} else if(funcArgs[0] == T_caracter) {
							leiaType = "caracter";
							retType = T_caracter;
						} else if(funcArgs[0] == T_logico) {
							leiaType = "logico";
							retType = T_logico;
						}
						
						this.gen(funcArgsGen[0], "=");
						this.gen("await leia(\""+leiaType+"\")");
					}
					else if(methName == "sorteia")
					{
						this.gen("sorteia(");
						for(let i=0;i<args.length;i++)
						{
							if(i != 0) this.gen(",");
							this.gen(funcArgsGen[i]);
						}
						this.gen(")");
						retType = T_inteiro;
					}
					else
					{
						// Função do usuário — sempre com await
						let funcIndex = this.getFuncIndex(methName,funcArgs);
						let func = this.functions[funcIndex];
						let funcType = func.type;
						let funcPars = func.parameters;
						let callName = func.overloaded ? func.overloadedName : func.name;
						
						// Verificar se tem parâmetros byRef
						let hasByRef = false;
						for(let i=0;i<funcPars.length;i++)
						{
							if(funcPars[i] && funcPars[i].byRef) { hasByRef = true; break; }
						}
						
						if(!hasByRef)
						{
							// Sem byRef: chamada simples
							const jsSafe = this.getJsSafe(func);
							if(jsSafe) {
								this.gen(callName+"(");
							} else {
								this.gen("(await "+callName+"(");
							}
							for(let i=0;i<args.length;i++)
							{
								if(i != 0) this.gen(",");
								let parType = (funcPars && funcPars[i]) ? funcPars[i].type : -1;
								this.gen(this.tryConvertType(parType,funcArgs[i],funcArgsGen[i]));
							}
							if(jsSafe) {
								this.gen(")");
							} else {
								this.gen("))");
							}
						}
						else
						{
							// Com byRef: gerar IIFE async para wrap/unwrap
							this.gen("(await (async()=>{");
							
							// Criar wrappers para cada argumento byRef
							let refs = [];
							for(let i=0;i<args.length;i++)
							{
								if(funcPars[i] && funcPars[i].byRef)
								{
									let argExpr = args[i];
									let argVar = (argExpr.op == T_word) ? this.scope.getVar(argExpr.name) : null;
									
									if(argVar && argVar.byRef)
									{
										// Já é um wrapper, passar direto
										refs.push({direct:true, genText:argExpr.name});
									}
									else
									{
										let refName = "$ref" + i;
										this.gen("let "+refName+"={$:"+funcArgsGen[i]+"};");
										refs.push({direct:false, refName:refName, argExpr:argExpr, argGen:funcArgsGen[i]});
									}
								}
								else
								{
									let parType = (funcPars && funcPars[i]) ? funcPars[i].type : -1;
									refs.push({direct:true, genText:this.tryConvertType(parType,funcArgs[i],funcArgsGen[i])});
								}
							}
							
							// Chamar a função
							this.gen("let $ret=await "+callName+"(");
							for(let i=0;i<args.length;i++)
							{
								if(i != 0) this.gen(",");
								if(refs[i].direct)
									this.gen(refs[i].genText);
								else
									this.gen(refs[i].refName);
							}
							this.gen(");");
							
							// Desfazer wrappers: copiar valores de volta
							for(let i=0;i<refs.length;i++)
							{
								if(!refs[i].direct && refs[i].argExpr)
								{
									this.gen(refs[i].argGen+"="+refs[i].refName+".$;");
								}
							}
							
							this.gen("return $ret;})())");
						}
						
						retType = funcType;
					}
				}
				break;
				case T_word: 
				{
					let v = this.getVar(expr.name);
					// byRef: sempre acessar via .$ (wrapper {$: value})
					this.gen(v.byRef ? expr.name+".$" : expr.name);
					retType = v.type;
				}
				break;
				case T_inteiroLiteral:
					this.gen(this.baseParseInt(expr.value));
					retType = T_inteiro;
				break;
				case T_realLiteral:
					this.gen(parseFloat(expr.value));
					retType = T_real;
				break;
				case T_cadeiaLiteral:
					this.gen("\""+stringEscapeSpecials(expr.value)+"\"");
					retType = T_cadeia;
				break;
				case T_caracterLiteral:
					this.gen("\""+stringEscapeSpecials(expr.value)+"\"");
					retType = T_caracter;
				break;
				case T_logicoLiteral:
					this.gen(expr.value == "verdadeiro" ? "true" : "false");
					retType = T_logico;
				break;
				case T_squareO:
				{
					let v = this.getVar(expr.name);
					// byRef: acessar via .$ (wrapper)
					this.gen(v.byRef ? expr.name+".$" : expr.name);
					
					for(let k=0;k<expr.expr.length;k++)
					{
						this.gen("[");
						this.compileExpr(expr.expr[k],T_inteiro);
						this.gen("]");
					}
					
					retType = v.arrayType;
				}
				break;
				case T_dot:
				{
					let biblioteca = expr.name;
					let campo = expr.expr;
					
					let declarado = false;
					for(let k=0;k<this.incluas.length;k++)
					{
						if(this.incluas[k].name == biblioteca || this.incluas[k].alias == biblioteca)
						{
							biblioteca = this.incluas[k].name;
							declarado = true;
							break;
						}
					}
					
					if(!declarado)
					{
						this.erro("a biblioteca "+biblioteca+" não foi inclusa no programa");
					}
					
					let libObj = this.libraries[biblioteca];
					
					if(!libObj)
					{
						this.erro("a biblioteca "+biblioteca+" não existe.");
						return T_vazio;
					}
					
					let member = libObj.members[campo.name];
					
					if(!member)
						this.erro("a biblioteca "+biblioteca+" não tem nenhuma variável ou função '"+campo.name+"'");
					
					if(member && member.id == T_word && campo.op == T_parO)
						this.erro("está usando a variável '"+campo.name+"' como se fosse uma função.");
						
					if(member && member.id == T_parO && campo.op == T_word)
						this.erro("está usando a fução '"+campo.name+"' como se fosse uma variável.");
					
					if(campo.op == T_word)
					{					
						this.gen(biblioteca+"."+campo.name);

						retType = member ? member.type : T_vazio;
					}
					else if(campo.op == T_parO)
					{
						let funcPars = member ? member.parameters : [];
						
						if(funcPars.length != campo.args.length)
						{
							this.erro("a função "+campo.name+" espera "+funcPars.length+" argumentos, foram passados apenas "+campo.args.length);
						}

						let funcArgs = [];
						let funcArgsGen = [];
						for(let k=0;k<campo.args.length;k++)
						{
							this.save_gen();					
							funcArgs.push(this.compileExpr(campo.args[k],-1));
							funcArgsGen.push(this.load_gen());
						}
						

						retType = member ? member.type : T_vazio;

						if(member?.jsSafe) {
							this.gen(biblioteca+"."+campo.name+"(");
						} else {
							this.gen("(await ("+biblioteca+".promisify("+biblioteca+"."+campo.name+")(");
						}
						for(let k=0;k<campo.args.length;k++)
						{
							if(k != 0) this.gen(",");
							let parType = (funcPars && funcPars[k]) ? funcPars[k].type : -1;
							this.gen(this.tryConvertType(parType,funcArgs[k],funcArgsGen[k]));
						}
						if(member?.jsSafe) {
							this.gen(")"+(retType != T_vazio ? ".value" : ""));
						} else {
							this.gen(")))");
						}
					}
				}
				break;
				default: 
					this.erro("Tipo de expressão desconhecido:"+expr.op);
				break;
			}
		}
		
		let exprGen = this.load_gen();
		this.gen(this.tryConvertType(typeExpected,retType,exprGen));
		
		return retType;
	}
	
	baseParseInt(txt)
	{
		txt = txt.toUpperCase();
		if(/^[1-9][0-9]*$/.test(txt) || txt == "0")
		{
			return parseInt(txt,10);
		}
		else if(/^0[0-9]+$/.test(txt)) // para evitar fazer o parse de octal. portugol não aceita octal
		{
			return parseInt(txt.substring(1,txt.length),10);
		}
		else if(/^0X[0-9A-F]+$/.test(txt))
		{
			return parseInt(txt.substring(2,txt.length),16);
		}
		else if(/^0B[01]+$/.test(txt))
		{
			return parseInt(txt.substring(2,txt.length),2);
		}
		else
		{
			this.erro("número inteiro escrito em formato desconhecido:'"+txt+"'");
			return parseInt(txt);
		}
	}
}
