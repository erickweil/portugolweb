// Entenda que sempre que for gerar o js da árvore, assume que está sem erros nenhum,
// Pois o vmcompiler já verificou todos os erros possíveis.
function getTypeChar(code)
{
	switch(code)
	{
		case T_inteiro: return "i";
		case T_caracter: return "c";
		case T_cadeia: return "s";
		case T_real: return "f";
		case T_logico: return "b";
		case T_squareO: return "a";
	}
}

class JsGenerator {
    constructor(codeTree,libraries,tokens,textInput,saida_div) {
		this.codeTree = codeTree;
		this.tokens = tokens;
		this.textInput = textInput;
		this.libraries = libraries;
		
		this.saida = "";
		this.saida_div = saida_div;
		
		this.incluas = [];
		this.scope = false;
		this.functions = [];
		this.currentFunctionRetType = T_vazio;
		this.globalPrefix = "JS_";
		this.isnewLine = true;
		this.gen_output = "";
		this.tabs = "";
		this.saved_gen_output = [];
	}
	
	erro(msg)
	{	
		enviarErro(this.textInput,{index:this.lastIndex},msg,"exec");
	}
	
	save_gen()
	{
		this.saved_gen_output.push({"gen_output":this.gen_output,"isnewLine":this.isnewLine,"tabs":this.tabs});
		
		this.isnewLine = true;
		this.gen_output = "";
		this.tabs = "";
	}
	
	load_gen()
	{
		var previous_gen_output = this.gen_output;
		
		if( this.saved_gen_output.length > 0)
		{
			var saved = this.saved_gen_output.pop();
			this.gen_output = saved["gen_output"];
			this.isnewLine = saved["isnewLine"];
			this.tabs = saved["tabs"];
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
		
		for(var i=0;i<txt.length;i++)
		{
			if(i != 0)
			{
				this.gen_output += " ";
			}
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
		
		for(var i=0;i<txt.length;i++)
		{
			if(i != 0)
			{
				this.gen_output += " ";
			}
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
		var ret = func.name;
		var parameters = func.parameters;
		for(var k=0;k<parameters.length;k++)
		{
				if(parameters[k].id == STATEMENT_declArr)
				{
					var arrayDim = parameters[k].size_expr.length;
				
					ret += getTypeChar(T_squareO);
					ret += getTypeChar(parameters[k].type);
					ret += ""+arrayDim;
				}
				else
				{
					ret += getTypeChar(parameters[k].type);
				}
		}
		return ret;
	}
	
	compile()
	{
		var funcoes = this.codeTree.funcoes;
		var variaveisGlobais = this.codeTree.variaveis;
				
		this.incluas = this.codeTree.incluas;
		
		this.scope = new Scope(this.scope,true,false); // cria um scopo para as variaveis globais
		
		
		this.functions = [
		{
			name:"$undefined",parameters:[],type:T_vazio // para ignorar chamadas a funcoes que nao existem
		},
		{
			name:"escreva",jsName:"escreva",
			parameters:[],
			type:T_vazio
		},
		{
			name:"limpa",jsName:"limpa",
			parameters:[],
			type:T_vazio
		},
		{
			name:"leia$inteiro",parameters:[],type:T_vazio
		},
		{
			name:"leia$real",parameters:[],type:T_vazio
		},
		{
			name:"leia$cadeia",parameters:[],type:T_vazio
		},
		{
			name:"leia$caracter",parameters:[],type:T_vazio
		},
		{
			name:"leia$logico",parameters:[],type:T_vazio
		}
		,
		{
			name:"sorteia",jsName:"sorteia",parameters:[
			{id: STATEMENT_declVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"a"},
			{id: STATEMENT_declVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"a"}
			],type:T_inteiro
		}
		];
		
		
		// Gerar as variáveis globais?
		var funcInit = {name:"#globalInit",overloaded:true,overloadedName:"globalInit" };
		
		this.currentFunctionRetType = T_vazio;
		this.genln("function","()");
		this.genln("{");
		this.increaseTabLevel();
		this.compileStatements(variaveisGlobais);
		this.decreaseTabLevel();
		this.genln("}");
		var jsGlobais = this.load_gen();
		funcInit.jsName = this.globalPrefix+funcInit.overloadedName;
		console.log(funcInit.jsName+" = "+jsGlobais);
		window[funcInit.jsName] = new Function("return " + jsGlobais)();
		
		this.functions.push(funcInit);
		
		for(var i=0;i<funcoes.length;i++)
		{
			var func = {name:funcoes[i].name,parameters:funcoes[i].parameters,type:funcoes[i].type,statements:funcoes[i].statements, overloaded:false, overloadedName:false };
				
			for(var k=0;k<funcoes.length;k++)
			{
				if(i != k && func.name == funcoes[k].name)
				{
					func.overloaded = true;
					func.overloadedName = this.getFuncOverloadsTypeString(func);
				}
			}
			this.functions.push(func);
		}
		// Gerar as funções
		for(var i=0;i<this.functions.length;i++)
		{
			var func = this.functions[i];
			
			if(!func.statements) continue;
			
			var funcName = func.name;
			var parameters = func.parameters;
			
			if(func.overloaded)
			{
				funcName = func.overloadedName;
			}
			
			this.currentFunctionRetType = func.type;
			
			this.gen("function","(");
			
			this.scope = new Scope(this.scope,false,false); // cria um scopo para rodar a funcao, se, enquanto e qualquer coisa...	
			
			for(var k=0;k<parameters.length;k++)
			{
				if(k != 0)
				{
					this.gen(",")
				}
				
				if(parameters[k].id == STATEMENT_declArr)
				{
					var arrayDim = parameters[k].size_expr.length;
					this.createVar(parameters[k].name,parameters[k].type,parameters[k].isConst,true,arrayDim);
				}
				else
					this.createVar(parameters[k].name,parameters[k].type,parameters[k].isConst,false);
				
				this.gen(parameters[k].name);
			}
			
			this.genln(")");
			
			
			this.compileStatements(func.statements);

			this.scope = this.scope.parentScope;

			this.genln();
			
			var jsFunc = this.load_gen();
			
			// var func = new Function("return " + "function (a, b) { return a + b; }")();
			func.jsName = this.globalPrefix+funcName;
			console.log(func.jsName+" = "+jsFunc);
			window[func.jsName] = new Function("return " + jsFunc)();
		}
		
		
		this.scope = this.scope.parentScope; // volta.
	}
	
	getFuncIndex(name,funcArgs)
	{
		for(var i=0;i<this.functions.length;i++)
		{
			if(this.functions[i].name == name)
			{
				var funcPars = this.functions[i].parameters;
				
				if(funcPars.length != funcArgs.length)
					continue; // deve ter o mesmo número de argumentos
				
				for(var k=0;k<funcPars.length;k++)
				{
					if(!checarCompatibilidadeTipo(funcPars[k].type,funcArgs[k].type,T_attrib)) 
						continue; // deve ter os mesmos tipos, ou compatíveis
				}
				return i;
			}
		}
		this.erro("a função '"+name+"' com "+funcArgs.length+" argumentos e tipos:"+funcArgs+" não foi encontrada");
		return 0;
	}
	
	createVar(varName,type,isConst,isArray,arrayDim)
	{
		var v = this.scope.getVar(varName);
		if(v)
		{
			this.erro("a variável '"+varName+"' já foi declarada");
			return v;
		}
		else
		{
			v = {
				type:isArray ? T_squareO : type,
				name:varName,
				index:this.scope.globalScope ? this.scope.globalCount : this.scope.varCount,
				global:this.scope.globalScope,
				isConst:isConst,
				isArray:isArray,
				arrayType:isArray ? type : T_vazio,
				arrayDim:arrayDim
			};
			this.scope.createVar(varName,v);
			return v;
		}
	}
	
	getVar(varName)
	{
		//var v = this.vars[varName];
		var v = this.scope.getVar(varName);
		if(v)
		{
			return v;
		}
		else
		{
			this.erro("não encontrou a variável '"+varName+"', esqueceu de declará-la?");
			var v = this.createVar(varName,T_cadeia,false,false);
			return v;
		}
	}
	
	compileDeclArray(values,arrayType,arrayDim)
	{
		for(var k =0;k<values.length;k++)
		{
			if(k != 0)
			this.gen(",");
			if(arrayDim <= 1)
			{
				this.compileExpr(values[k],arrayType);
			}
			else
			{
				this.compileDeclArray(values[k],arrayType,arrayDim-1);
			}
			
		}
	}
	
	compileForStatements(statements)
	{
		for(var i=0;i<statements.length;i++)
		{
			var stat = statements[i];
			
			switch(stat.id)
			{
				case STATEMENT_declVar:
					var v = this.createVar(stat.name,stat.type,stat.isConst,false);
					this.gen("var",stat.name);
					if(stat.expr)
					{
						this.gen("=");
						this.compileExpr(stat.expr,stat.type);
					}
				break;
				case STATEMENT_expr:
					this.compileExpr(stat.expr,T_vazio);
				break;
			}
		}
	}
	
	compileStatements(statements)
	{
		for(var i=0;i<statements.length;i++)
		{
			var stat = statements[i];
			this.lastIndex = stat.index;
			switch(stat.id)
			{
				case STATEMENT_declArr:
				
					var v = this.createVar(stat.name,stat.type,stat.isConst,true,arrayDim);
			
					if(v.global)
						this.gen("VM_globals["+v.index+"] =");
					else
						this.gen("var",stat.name,"=");
					var arrayDim = stat.size_expr.length;
					var declExpr = stat.expr;
					if(!declExpr)
					{
						this.gen("recursiveDeclareArray([");
						for(var k=0;k<stat.size_expr.length;k++)
						{
							if(k != 0)
							this.gen(",");
							this.compileExpr(stat.size_expr[k],T_inteiro);
						}
						this.genln("],"+getDefaultValue(stat.type,v.global)+",0);");
						
						// Eu sei.
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
							this.compileExpr(stat.expr.expr,T_squareO);
							this.genln(";");
						}
						
					}
				break;
				case STATEMENT_declVar:
					var v = this.createVar(stat.name,stat.type,stat.isConst,false);
					
					if(v.global)
						this.gen("VM_globals["+v.index+"]");
					else
						this.gen("var",stat.name);
					
					if(stat.expr)
					{
						this.gen("=");
						
						this.compileExpr(stat.expr,stat.type,false,v.global);

						this.genln(";");
					}
					else
					{
						this.genln("= false;");
					}
				break;
				case STATEMENT_expr:
					this.compileExpr(stat.expr,T_vazio);
					this.genln(";");
				break;
				case STATEMENT_block:
					this.genln("{");
					
					this.scope = new Scope(this.scope,false,false);
					
					this.increaseTabLevel();
					
					this.scope = this.scope.parentScope;
					
					this.compileStatements(stat.statements);
					
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
					
					this.scope = new Scope(this.scope,false,false);
					
					if(stat.decl)
					{
						this.compileForStatements(stat.decl); // declaracao
					}
					
					this.gen(";");
					
					if(stat.expr)
					this.compileExpr(stat.expr,T_logico); // condicao
					
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
					this.gen("return");
					this.compileExpr(stat.expr,this.currentFunctionRetType);
					this.genln(";");
				break;
				case STATEMENT_escolha:
					this.gen("switch(");
					this.compileExpr(stat.expr,-1);
					this.genln(")");
					this.compileStatements(stat.statements);
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
			}
		}
	}
	
	
	tryConvertType(tRet,tA,exprGen)
	{
		if(tRet == T_cadeia)
		{
			if(tA == T_inteiro) return "VM_i2s("+exprGen+")";
			else if(tA == T_real) return "VM_f2s("+exprGen+")";
			else if(tA == T_logico) return "VM_realbool2s("+exprGen+")";
			else return exprGen;
		}
		else if(tRet == T_inteiro)
		{
			if(tA == T_real)
			{
				return "Math.trunc("+exprGen+")";
			}
			else return exprGen;
		}
		else return exprGen;
	}
	
	// retorna o tipo da expressao
	// typeExpected
	// se for -1 é porque tem que retornar algum valor, não importa qualquer
	// se for algum tipo, é porque deveria retornar aquele tipo
	// e for T_vazio é porque não era para retornar nada, irá informar que não retornou nada pelo return T_vazio correspondente
	compileExpr(expr,typeExpected,isAssign = false,globalConvert = false)
	{
		if(!expr) return T_vazio;

		var retType = T_vazio;
		
		this.save_gen();

		if(expr.length == 2)
		{	
			var parOnExpr0 = isOperator(expr[0].op) && getOpPrecedence(expr[0].op) < getOpPrecedence(expr.op);
			var parOnExpr1 = isOperator(expr[1].op) && getOpPrecedence(expr[1].op) <= getOpPrecedence(expr.op);
			
			this.save_gen();
			
			if(parOnExpr0) this.gen("(");
			var tExprA = this.compileExpr(expr[0],-1,true);
			if(parOnExpr0) this.gen(")");
			
			var exprAGen = this.load_gen();
			
			this.save_gen();
			
			if(parOnExpr1) this.gen("(");
			var tExprB = this.compileExpr(expr[1],-1);
			if(parOnExpr1) this.gen(")");
			
			var exprBGen = this.load_gen();
			
			retType = getTipoRetorno(tExprA,tExprB); // quando é divisão retorna real ou inteiro?
	
			
			if(isAttribOp(expr.op))
			{
				var v = this.getVar(expr[0].name);
				retType = tExprA;
				
				if(tExprA == T_logico && v.global)
				{
					exprBGen = "("+exprBGen+"? 0 : 1)";
				}
				else
				exprBGen = this.tryConvertType(tExprA,tExprB,exprBGen);
			}
			else if(retType == T_cadeia)
			{
				exprAGen = this.tryConvertType(retType,tExprA,exprAGen);
				exprBGen = this.tryConvertType(retType,tExprB,exprBGen);
			}
			
			var exprGen = exprAGen;
			
			if( expr.op == T_and ) exprGen +=" && ";
			else if( expr.op == T_or ) exprGen +=" || ";
			else exprGen +=" "+getSeparator(expr.op)+" ";
			
			exprGen +=exprBGen;
			
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
				
					this.gen("!(");
					var tExpr = this.compileExpr(expr[0],-1);
					this.gen(")");
					
					retType = tExpr;
					break;
					
				case T_unary_plus:
					retType = this.compileExpr(expr[0],-1);
					break;
				case T_unary_minus:
					this.gen("(-");
					var tExpr = this.compileExpr(expr[0],-1);
					this.gen(")");
					retType =  tExpr;
					break;
				case T_autoinc:
				
					var tExpr = this.compileExpr(expr[0],-1);
					this.gen("++");
					
					retType =  tExpr;
					break;
				case T_pre_autoinc:

					this.gen("++");	
					var tExpr = this.compileExpr(expr[0],-1);
					
					retType =  tExpr;
					break;
				case T_autodec:
								
					var tExpr = this.compileExpr(expr[0],-1);
					this.gen("--");
					
					retType =  tExpr;
					break;
				case T_pre_autodec:
					
					this.gen("--");	
					var tExpr = this.compileExpr(expr[0],-1);
					
					retType =  tExpr;
					break;
				case T_bitnot:
					this.gen("~(");
					var tExpr = this.compileExpr(expr[0],-1);
					this.gen(")");
					retType =  tExpr;
					break;
				//case T_not:tis.compileExpr(expr[0],bc,variableMap);break;
				case T_parO: // methCall
				{
					var args = expr.args;
					var methName= expr.name;
					var funcArgs = [];
					var funcArgsGen = [];
					
					for(var i =0;i<args.length;i++)
					{
						this.save_gen();					
						funcArgs.push(this.compileExpr(args[i],-1));
						funcArgsGen.push(this.load_gen());
					}
					
					var funcType = T_vazio;
					var funcPars = [];
					if(methName == "escreva")
					{
						for(var i =0;i<args.length;i++)
						{
							funcPars.push(T_cadeia);
						}
					}
					else if(methName == "sorteia")
					{
						funcPars = [T_inteiro,T_inteiro];
					}
					else if(methName == "leia")
					{
						funcPars = [-1];
					}
					else
					{
						var funcIndex = this.getFuncIndex(methName,funcArgs);
						var func = this.functions[funcIndex];
						funcType = func.type;
						if(func.overloaded)
						{
							methName = func.overloadedName;
						}
						else
						{
							methName = func.name;
						}
						
						methName = this.globalPrefix+methName;
					}
					
					
					this.gen(methName+"(");									
					
					for(var i =0;i<args.length;i++)
					{
						if(i != 0) this.gen(",");
						
						this.gen(this.tryConvertType(funcPars[i],funcArgs[i],funcArgsGen[i]));
					}
					
					this.gen(")");
					
					
					retType =  funcType;
				}
				break;
				case T_word: 
					var v = this.getVar(expr.name);
					
					if(v.global)
					{
						if(!isAssign && v.type == T_logico)
							this.gen("(VM_globals["+v.index+"] == 0)");
						else
							this.gen("VM_globals["+v.index+"]");
					}
					else
					{
						this.gen(expr.name);
					}
					
					retType =  v.type;
					break;
				case T_inteiroLiteral:this.gen(this.baseParseInt(expr.value));retType =  T_inteiro;break;
				case T_realLiteral:this.gen(parseFloat(expr.value));retType =  T_real;break;
				case T_cadeiaLiteral:this.gen("\""+stringEscapeSpecials(expr.value)+"\"");retType =  T_cadeia;break;
				case T_caracterLiteral:this.gen("\""+stringEscapeSpecials(expr.value)+"\"");retType =  T_caracter;break;
				
				// x == 0: true
				// x != 0: false
				case T_logicoLiteral: this.gen(expr.value == "verdadeiro" ? "true" : "false" );retType =  T_logico;break; 
				case T_squareO:
				{
					var v = this.getVar(expr.name);
					//var tExpri = this.compileExpr(expr.expr[0],bc,T_inteiro);
					if(v.global)
					{
						if(!isAssign && v.arrayType == T_logico)
							this.gen("(VM_globals["+v.index+"]");
						else
							this.gen("VM_globals["+v.index+"]");
					}
					else
					{
						this.gen(expr.name);
					}
					
					for(var k = 0;k<expr.expr.length;k++)
					{
						this.gen("[");
						var tExpri = this.compileExpr(expr.expr[k],T_inteiro); // espera retorno inteiro do index do array
						this.gen("]");
					}
					
					if(v.global && !isAssign && v.arrayType == T_logico)
							this.gen(" == 0)");
					
					retType =  v.arrayType;
				}
				break;
				case T_dot:
				{
					var biblioteca = expr.name;
					var campo = expr.expr;
					
					var declarado = false;
					for(var k=0;k<this.incluas.length;k++)
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
					
					var libObj = this.libraries[biblioteca];
					
					if(!libObj)
					{
						this.erro("a biblioteca "+biblioteca+" não existe.");
						return T_vazio;
					}
					
					if(!libObj.members[campo.name])
						this.erro("a biblioteca "+biblioteca+" não tem nenhuma variável ou função '"+campo.name+"'");
					
					if(libObj.members[campo.name].id == T_word && campo.op == T_parO)
						this.erro("está usando a variável '"+campo.name+"' como se fosse uma função.");
						
					if(libObj.members[campo.name].id == T_parO && campo.op == T_word)
						this.erro("está usando a fução '"+campo.name+"' como se fosse uma variável.");
					
					if(campo.op == T_word)
					{					
						this.gen("VM_libraries[\""+biblioteca+"\"]."+campo.name+"");
					}
					else if(campo.op == T_parO)
					{
						this.gen("VM_libraries[\""+biblioteca+"\"]."+campo.name+"(");
						
						var funcPars = libObj.members[campo.name].parameters;
						
						if(funcPars.length != campo.args.length)
						{
							this.erro("a função "+campo.name+" espera "+funcPars.length+" argumentos, foram passados apenas "+campo.args.length);
						}
						
						for(var k =0;k<campo.args.length;k++)
						{
							if(k!=0)
								this.gen(",");
							if(funcPars[k].type == T_logico)
							this.gen("(");
							this.compileExpr(campo.args[k],funcPars[k].type);
							if(funcPars[k].type == T_logico)
							this.gen("? 0 : 1)");
						}
						
						this.gen(")");
						
						if(libObj.members[campo.name].type != T_vazio)
						{
							this.gen(".value");
						}
					}
										
					retType =  libObj.members[campo.name].type;
				}
				break;
			}
		}
		
		var exprGen = this.load_gen();

		if(typeExpected == T_logico && globalConvert)
		{
			this.gen("("+exprGen+"? 0 : 1)");
		}
		else
			this.gen(this.tryConvertType(typeExpected,retType,exprGen));
		
		
		
		if( typeExpected == -1)
		return retType;
		else
		return typeExpected;
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