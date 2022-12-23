import { B_ADD, B_ALOAD, B_ALOADGLOBAL, B_AND, B_ASTORE, B_ASTOREGLOBAL, B_B2S, B_CLEAR, B_DIV, B_DUP, B_F2I, B_F2S, B_FALSE, B_GOTO, B_I2S, B_iDIV, B_IFCMPEQ, B_IFCMPGE, B_IFCMPGT, B_IFCMPLE, B_IFCMPLT, B_IFCMPNE, B_IFEQ, B_IFNE, B_INVOKE, B_LIBINVOKE, B_LIBLOAD, B_LOAD, B_LOADGLOBAL, B_MUL, B_NEG, B_NEWARRAY, B_NEWARRAYGLOBAL, B_NO, B_NOT, B_OR, B_POP, B_PUSH, B_READ_BOOL, B_READ_CHAR, B_READ_FLOAT, B_READ_INT, B_READ_STRING, B_REM, B_RET, B_RETVALUE, B_SHL, B_SHR, B_STORE, B_STOREGLOBAL, B_SUB, B_SWAP, B_TRUE, B_WAITINPUT, B_WRITE, B_XOR 
} from "./vm/vm.js";
import { STATEMENT_block, STATEMENT_caso, STATEMENT_declArr, STATEMENT_declArrValues, STATEMENT_declVar, STATEMENT_enquanto, STATEMENT_escolha, STATEMENT_expr, STATEMENT_facaEnquanto, STATEMENT_para, STATEMENT_pare, STATEMENT_ret, STATEMENT_se 
} from "./parser.js";
import { convertArrayType, convertMatrixType, getSeparator, getTypeWord, isAttribOp, T_and, T_attrib, T_attrib_bitand, T_attrib_bitnot, T_attrib_bitor, T_attrib_div, T_attrib_minus, T_attrib_mul, T_attrib_plus, T_attrib_rem, T_attrib_shiftleft, T_attrib_shiftright, T_attrib_xor, T_autodec, T_autoinc, T_bitand, T_bitnot, T_bitor, T_cadeia, T_cadeiaLiteral, T_caracter, T_caracterLiteral, T_div, T_dot, T_equals, T_ge, T_gt, T_inteiro, T_inteiroLiteral, T_le, T_logico, T_logicoLiteral, T_lt, T_Matriz, T_Minteiro, T_minus, T_Mlogico, T_mul, T_not, T_notequals, T_or, T_parO, T_plus, T_pre_autodec, T_pre_autoinc, T_real, T_realLiteral, T_rem, T_shiftleft, T_shiftright, T_squareO, T_unary_minus, T_unary_plus, T_vazio, T_Vetor, T_Vinteiro, T_Vlogico, T_word, T_xor 
} from "./tokenizer.js";

export function getDefaultValue(code,global)
{
	switch(code)
	{
		case T_inteiro: return 0;
		case T_caracter: return '\0';
		case T_cadeia: return "";
		case T_real: return 0.0;
		case T_logico: return (global ? 1 : false);
		case T_squareO: return [];
	}
}

// debug
//function checarCompatibilidadeTipo(tA,tB,op)
//{
//	let ret = _checarCompatibilidadeTipo(tA,tB,op);
//
//	console.log(getTypeWord(tA)+" "+getSeparator(op)+" "+getTypeWord(tB)+" --> "+ret);
//	return ret;
//}

export function checarCompatibilidadeTipo(tA,tB,op)
{
	// T_Vetor é o coringa para vetores
	if(tA == T_Vetor)
	{
		if(tB >= T_Vinteiro && tB <= T_Vlogico)
		{
			tA = tB;
		}
	}
	
	// T_Matriz é o coringa para matrizes
	if(tA == T_Matriz)
	{
		if(tB >= T_Minteiro && tB <= T_Mlogico)
		{
			tA = tB;
		}
	}
	
	// vazio é o coringa para aceitar qualquer um
	if(tA == T_vazio)
	{
		tA = tB;
	}
	
	// se é vetor ou matriz só é compatível se utilizar o = e o tipo for igual
	if(tA >= T_Vinteiro && tA <= T_Mlogico)
	{
		if(op != T_attrib)
		{
			return false;
		}
		
		return tA == tB;
	}
	
	
	switch(op)
	{
		case T_attrib:
		case T_attrib_plus:
		case T_plus:
		case T_attrib_minus:
		case T_minus:
		case T_attrib_mul:
		case T_mul:
		case T_attrib_div:
		case T_div:
		case T_attrib_rem:
		case T_rem:
		case T_attrib_shiftright:
		case T_shiftright:
		case T_attrib_shiftleft:
		case T_shiftleft:
		case T_attrib_bitand:
		case T_bitand:
		case T_attrib_bitor:
		case T_bitor:
		case T_attrib_xor:
		case T_xor:
			switch(tA)
			{				
				//case T_squareO: return op == T_attrib && tB == T_squareO;
				case T_inteiro: return (tB == T_inteiro || tB == T_real || ((op == T_plus || op == T_attrib_plus) && tB == T_cadeia));
				case T_real: return (tB == T_inteiro || tB == T_real || ((op == T_plus || op == T_attrib_plus) && tB == T_cadeia));
				case T_cadeia: return (op == T_attrib || op == T_plus || op == T_attrib_plus);
				case T_caracter: return (op == T_attrib || op == T_plus || op == T_attrib_plus) && (tB == T_cadeia || tB == T_caracter);
				case T_logico: 
				return (
				((op == T_plus || op == T_attrib_plus) && tB == T_cadeia) ||
				op == T_attrib || 
				op == T_bitor || op == T_bitand || op == T_xor || 
				op == T_attrib_bitand || op == T_attrib_bitor || op == T_attrib_xor);
			}
		break;
		case T_attrib_bitnot:
		case T_bitnot:
			return true;
		case T_unary_minus:
		case T_unary_plus:
		case T_autoinc:
		case T_autodec:
		case T_pre_autoinc:
		case T_pre_autodec:
			return (tA == T_inteiro || tA == T_real);
		case T_and:
		case T_or:
			return tA == T_logico && tB == T_logico;
		case T_not: return tA == T_logico;
		case T_le:
		case T_lt:
		case T_ge:
		case T_gt:
			return ( tA == tB && (tA != T_logico) && (tB != T_logico)) || 
			((tA == T_inteiro || tA == T_real) && (tB == T_inteiro || tB == T_real));
		case T_notequals:
		case T_equals:
			return tA == tB;
		case T_squareO: // operador de indexagem ?
			return tB == T_inteiro;
	}
}

export function getTipoRetorno(tA,tB)
{
	if(tA == tB) return tA;
	if(tA == T_cadeia || tB == T_cadeia) return T_cadeia;
	if(tA == T_caracter || tB == T_caracter) return T_cadeia;
	if(tA == T_logico || tB == T_logico) return T_logico;
	if(tA == T_real || tB == T_real) return T_real;
	return tA;
}

export function funcArgsToStr(types)
{
	let str = getTypeWord(types[0]);
	for(let i=1;i<types.length;i++)
	{
		str += ", ";
		str += getTypeWord(types[i]);
	}
	
	return str;
}

export class FunctionScopeRef {
	constructor() {
		this.maxVarCount = 0;
		this.jsSafe = true;
		this.funCalls = [];
	}
	
	addFuncCall(func)
	{
		this.funCalls.push(func);
		if(!func.jsSafe)
		{
			console.log("Marcou como unsafe porque chamou a função "+func.name);
			this.jsSafe = false;
		}
	}
}

export class LoopScope {
	constructor(parentScope,endJumps) {
		this.parentScope = parentScope;
		this.endJumps = endJumps;
	}
	
	addJump(index)
	{
		this.endJumps.push(index);
	}
}

export class SwitchScope {
	constructor(parentScope,endJumps,casoJumps) {
		this.parentScope = parentScope;
		this.endJumps = endJumps;
		this.casoJumps = casoJumps;
		this.casoJumpsIndex = 0;
		this.contrario = false;
	}
	
	addJump(index)
	{
		this.endJumps.push(index);
	}
	
	getNextCasoJump()
	{
		let ret = this.casoJumps[this.casoJumpsIndex];
		this.casoJumpsIndex++;
		return ret;
	}
	
	getContrarioJump()
	{
		this.contrario = true;
		return this.casoJumps[this.casoJumps.length-1];
	}
}

export class Scope {
	constructor(parentScope,globalScope,funcScopeRef) {
		this.parentScope = parentScope;
		this.funcScopeRef = funcScopeRef;
		this.vars = {};
		if(globalScope)
			this.globalScope = globalScope;
		else
			this.globalScope = false;
		if(parentScope)
		{
			this.varCount = parentScope.varCount;
			this.globalCount = parentScope.globalCount;
		}
		else
		{
			this.varCount = 0;
			this.globalCount = 0;
		}
	}
	
	createVar(varName,v)
	{
		this.vars[varName] = v;
		if(this.globalScope)
		this.globalCount++;
		else
		this.varCount++;
		if(this.funcScopeRef && this.varCount > this.funcScopeRef.maxVarCount)
			this.funcScopeRef.maxVarCount = this.varCount;
	}
	
	getVar(varName)
	{
		let v = this.vars[varName];
		if(!v && this.parentScope)
		{
			v = this.parentScope.getVar(varName);
		}
		
		return v;
	}
	
}
// http://blog.jamesdbloom.com/JavaCodeToByteCode_PartOne.html
export class Compiler {
    constructor(codeTree,libraries,tokens,textInput,saida_div,erroCallback) {
		this.codeTree = codeTree;
		this.tokens = tokens;
		this.textInput = textInput;
		this.libraries = libraries;
		
		this.saida = "";
		this.saida_div = saida_div;
		
		this.functions = [];
		this.incluas = [];
		this.scope = false;
		this.loopScope = false;
		this.enviarErro = erroCallback;
	}
	
	erro(msg)
	{	
		if(this.enviarErro)
		this.enviarErro(this.textInput,{index:this.lastIndex},msg,"contexto");
		else
		console.log("ERRO NO COMPILADOR:",msg);
	}
	
	getFuncIndex(name,funcArgs)
	{
		for(let i=0;i<this.functions.length;i++)
		{
			if(this.functions[i].name == name)
			{
				let funcPars = this.functions[i].parameters;
				
				if(funcPars.length != funcArgs.length)
					continue; // deve ter o mesmo número de argumentos
				
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
						funcCompatible = false; // deve ter os mesmos tipos, ou compatíveis
						break;
					}
				}
				
				if(!funcCompatible)
					continue;
				
				return i;
			}
		}
		this.erro("a função '"+name+"' com "+funcArgs.length+" argumentos e tipos:"+funcArgsToStr(funcArgs)+" não foi encontrada");
		return 0;
	}
	
	checkFuncJsSafety(func,depth,prev_funcs)
	{
		if(!func.jsSafe)
			return false;
		
		if(func.name.startsWith("_unsafe_"))
			return false;

		if(depth > 10)
		{
			//console.log("Marcou como unsafe porque o depth chegou em "+depth);
			func.jsSafe = false;
			return false;	
		}
		
		if(func.parameters)
		for(let i=0;i<func.parameters.length;i++)
		{
			if(func.parameters[i].byRef)
			{
				//console.log("Marcou como unsafe porque tem parametro por referencia "+depth);
				func.jsSafe = false;
				return false;
			}
		}
		
		if(!func.funCalls || func.funCalls.length == 0) return true;
	
		for(let i=0;i<func.funCalls.length;i++)
		{
			// dont look again on same func to avoid recursion
			//if(prev_funcs.indexOf(func.funCalls[i]) == -1)
			//{
				let next_funcs = Array.from(prev_funcs);
				next_funcs.push(func.funCalls[i]);
				if(!this.checkFuncJsSafety(func.funCalls[i],depth+1,next_funcs))
				{
					//console.log("Marcou como unsafe porque chama a funcao "+func.funCalls[i].name);
					func.jsSafe = false;
					return false;
				}
			
			//}
		}
		
		return true;
	}
	
	compile()
	{
		let funcoes = this.codeTree.funcoes;
		let variaveisGlobais = this.codeTree.variaveis;
		
		this.incluas = this.codeTree.incluas;

		this.functions = [
		{
			name:"$undefined",bytecode:[B_PUSH,"<Função desconhecida>",B_WRITE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false // para ignorar chamadas a funcoes que nao existem
		},
		{
			name:"escreva",
			comment:"Escreve na saída de dados.<br>Pule linha com \"\\n\" ",
			bytecode:[
			B_LOAD,0,
			B_WRITE,
			B_RET
			],
			varCount:1,
			parameters:[],
			type:T_vazio,jsSafe:true
		},
		{
			name:"limpa",
			bytecode:[
			B_CLEAR,B_RET
			],
			varCount:0,
			parameters:[],
			type:T_vazio,jsSafe:true
		},
		{
			name:"leia$inteiro",bytecode:[B_WAITINPUT,B_READ_INT,B_RETVALUE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false
		},
		{
			name:"leia$real",bytecode:[B_WAITINPUT,B_READ_FLOAT,B_RETVALUE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false
		},
		{
			name:"leia$cadeia",bytecode:[B_WAITINPUT,B_READ_STRING,B_RETVALUE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false
		},
		{
			name:"leia$caracter",bytecode:[B_WAITINPUT,B_READ_CHAR,B_RETVALUE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false
		},
		{
			name:"leia$logico",bytecode:[B_WAITINPUT,B_READ_BOOL,B_RETVALUE,B_RET],varCount:0,parameters:[],type:T_vazio,jsSafe:false
		}
		
		//0:	load	0
		//2:	load	1
		//4:	libinvoke	Util	sorteia	2
		//8:	pop
		//9:	ret
		,
		{
			name:"sorteia",
			comment:"Sorteia um número dentro do intervalo <br/><br/>Exemplo: sorteia(0,10) sorteia números entre 1 e 10",
			bytecode:[
			B_LOAD,0,
			B_LOAD,1,
			B_LIBINVOKE,"Util","sorteia",2,
			B_RETVALUE,
			B_RET
			],varCount:2,parameters:[
			{id: STATEMENT_declVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"de"},
			{id: STATEMENT_declVar, index: 0, type: T_inteiro, isConst: false, byRef: false, expr:false, name:"ate"}
			],type:T_inteiro,jsSafe:true
		}
		];
		
		
		this.scope = new Scope(this.scope,true,false); // cria um scopo para as variaveis globais
		
		let funcInit = {name:"#globalInit",bytecode:[],bytecodeIndexes:{},varCount:0,jsSafe:false };
		this.funcScopeRef = new FunctionScopeRef();
		this.compileStatements(variaveisGlobais,funcInit);
		this.functions.push(funcInit);
		
		
		let FuncOff = this.functions.length;
		
		for(let i=0;i<funcoes.length;i++)
		{
			this.functions.push({name:funcoes[i].name,parameters:funcoes[i].parameters,type:funcoes[i].type,bytecode:[],bytecodeIndexes:{},comment:funcoes[i].comment,varCount:0,jsSafe:true });
		}
		for(let i=0;i<funcoes.length;i++)
		{
			this.funcScopeRef = new FunctionScopeRef();
			this.scope = new Scope(this.scope,false,this.funcScopeRef); // cria um scopo para rodar a funcao, se, enquanto e qualquer coisa...	
				this.compileStatements(funcoes[i].parameters,this.functions[FuncOff+i]); // declara os parametros da funcao, n vai gerar bytecode nenhum, ou vai?
				this.compileStatements(funcoes[i].statements,this.functions[FuncOff+i]);
			
				//this.functions[FuncOff+i].bytecode.push(B_RET); // nao pode esquecer
				this.compileFunctionRet(this.functions[FuncOff+i],false);
			this.scope = this.scope.parentScope;
			this.functions[FuncOff+i].varCount = this.funcScopeRef.maxVarCount;
			this.functions[FuncOff+i].jsSafe = this.funcScopeRef.jsSafe;
			this.functions[FuncOff+i].funCalls = this.funcScopeRef.funCalls;
			
			
		}
		for(let i=0;i<this.functions.length;i++)
		{
			let func = this.functions[i];
			func.jsSafe = this.checkFuncJsSafety(func,0,[func]);
			
			//if(func.jsSafe !== true)
			//console.log(func.name+" is jsSafe:"+func.jsSafe);
		}
		
		
		funcInit.bytecode.push(B_INVOKE);
		let funcIndex = this.getFuncIndex("inicio",[]);
		funcInit.bytecode.push(funcIndex);
		funcInit.bytecode.push(0); // nenhum argumento
		//funcInit.bytecode.push(B_RET); // nao pode esquecer
		this.compileFunctionRet(funcInit,false);
		
		this.globalCount = this.scope.varCount;
		
		this.scope = this.scope.parentScope; // volta.
		
		//console.log(this.functions);
		//if(!funcaoInicio) this.erro(this.tokens[0],"não encontrou a função início");
	}
	
	replaceAllBy(bc,indexes,value)
	{
		for(let i=0;i<indexes.length;i++)
		{
			bc[indexes[i]] = value;
		}
	}
	
	createVar(varName,comment,type,isConst,isArray,arrayDim)
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
					this.erro("Matrizes com 3 ou mais dimensões não suportados");
			}
			
			v = {
				type:vType,
				name:varName,
				comment:comment,
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
		//let v = this.vars[varName];
		let v = this.scope.getVar(varName);
		if(v)
		{
			return v;
		}
		else
		{
			this.erro("não encontrou a variável '"+varName+"', esqueceu de declará-la?");
			return this.createVar(varName,false,T_cadeia,false,false);
		}
	}
	
	compileDeclArray(values,bc,v,arrayDim,indexes)
	{
		for(let k =0;k<values.length;k++)
		{
			if(arrayDim <= 1)
			{
				let tExpr = this.compileExpr(values[k],bc,v.arrayType);
				this.tryConvertType(v.arrayType,tExpr,bc);
				
				if(!checarCompatibilidadeTipo(v.arrayType,tExpr,T_attrib))
				{
					this.erro("não pode colocar "+getTypeWord(tExpr)+" em uma variável do tipo "+getTypeWord(v.arrayType));
				}
				
				for(let j=0;j<indexes.length;j++)
				{
					bc.push(B_PUSH);
					bc.push(indexes[j]);
				}
				
				bc.push(B_PUSH);
				bc.push(k);
				
				bc.push(v.global ? B_ASTOREGLOBAL : B_ASTORE);
				bc.push(v.index);
				bc.push(v.arrayDim);
			}
			else
			{
				indexes.push(k);
				this.compileDeclArray(values[k],bc,v,arrayDim-1,indexes);
				indexes.pop();
			}
		}
	}
	
	compileFunctionRet(func,expr)
	{
		let bc = func.bytecode;
				
		if(expr)
		{
			let tipoRet = this.compileExpr(expr,bc,-1);
			if(tipoRet == T_vazio)
			{
				this.erro("não usar esta expressão para retornar, pois ela não produz valor nenhum, arrume esta expressão.");
			}
			
			if(tipoRet != func.type)
			{
				this.erro("não pode retornar "+getTypeWord(tipoRet)+" nesta função, ela é do tipo "+getTypeWord(func.type));
			}
		}
		
		if(func.parameters)
		{
			for(let i=0;i<func.parameters.length;i++)
			{
				// precisa empurrar os valores das variáveis de referência na stack
				if(func.parameters[i].byRef && func.parameters[i].id == STATEMENT_declVar)
				{
					let v = this.getVar(func.parameters[i].name);
					
					bc.push(B_LOAD);
					bc.push(v.index);
					
					bc.push(B_RETVALUE);
				}
			}
		}
		
		if(expr)
		{
			bc.push(B_RETVALUE);
			bc.push(B_RET);
		}
		else
		{
			bc.push(B_RET);
		}
	}
	
	shallowExtract(statements,statID)
	{
		let statsExtracred = [];
		for(let i =0;i<statements.length;i++)
		{
			if(statements[i].id == STATEMENT_block)
			{
				statsExtracred = statsExtracred.concat(this.shallowExtract(statements[i].statements,statID));
			}
			else if(statements[i].id == statID)
			{
				statsExtracred.push(statements[i]);
			}
		}
		
		return statsExtracred;
	}
	
	compileStatements(statements,func)
	{
		//,this.functions[FuncOff+i].bytecode,this.functions[FuncOff+i].variableMap);
		let bc = func.bytecode;
		//let variableMap = func.variableMap;
		let bcIndex = func.bytecodeIndexes;
		for(let i=0;i<statements.length;i++)
		{
			let stat = statements[i];
			this.lastIndex = stat.index;
			
			bcIndex[bc.length] = this.lastIndex;
			switch(stat.id)
			{
				case STATEMENT_declArr:
				{
					let arrayDim = stat.size_expr.length;
					let v = this.createVar(stat.name,stat.comment,stat.type,stat.isConst,true,arrayDim);
					
					let declared = 0;
					for(let k =0;k<arrayDim;k++)
					{
						if(stat.size_expr[k])
						{
							let tExpr = this.compileExpr(stat.size_expr[k],bc,T_inteiro); // tipo inteiro para indexar array
							this.tryConvertType(T_inteiro,tExpr,bc);
							
							declared++;
						}
					}
					
					if( declared != 0)
					{
						if(declared != arrayDim) this.erro("não especificou um dos tamanhos da matriz.");
						
						bc.push(v.global ? B_NEWARRAYGLOBAL : B_NEWARRAY);
						bc.push(v.index);
						bc.push(declared);
						bc.push(getDefaultValue(v.arrayType,v.global));
					}
					else if(stat.expr && stat.expr.id == STATEMENT_declArrValues && declared == 0)
					{
						let valuesLeng = stat.expr.expr;
						for(let k =0;k<arrayDim;k++)
						{
							if(k > 0) valuesLeng = valuesLeng[0];
							bc.push(B_PUSH);
							bc.push(valuesLeng.length);
						}
						
						bc.push(v.global ? B_NEWARRAYGLOBAL : B_NEWARRAY);
						bc.push(v.index);
						bc.push(arrayDim);
						bc.push(getDefaultValue(v.arrayType,v.global));
					}
					
					if(stat.expr)
					{
						if(stat.expr.id == STATEMENT_declArrValues)
						{
							this.compileDeclArray(stat.expr.expr,bc,v,arrayDim,[]);
						}
						else if(stat.expr.id == STATEMENT_expr)
						{
							let tExpr = this.compileExpr(stat.expr.expr,bc,v.type);
														
							if(!checarCompatibilidadeTipo(v.type,tExpr,T_attrib))
							{
								this.erro("não pode colocar "+getTypeWord(tExpr)+" em uma variável do tipo "+getTypeWord(v.type));
							}
							
							bc.push(v.global ? B_STOREGLOBAL : B_STORE);
							bc.push(v.index);
						}
					}
				}
				break;
				case STATEMENT_declVar:
				{
					let v = this.createVar(stat.name,stat.comment,stat.type,stat.isConst,false);
					if(stat.expr)
					{
						let tExpr = this.compileExpr(stat.expr,bc,stat.type);
						this.tryConvertType(v.type,tExpr,bc);
						
						if(!checarCompatibilidadeTipo(v.type,tExpr,T_attrib))
						{
							this.erro("não pode colocar "+getTypeWord(tExpr)+" em uma variável do tipo "+getTypeWord(v.type));
						}
						
						bc.push(v.global ? B_STOREGLOBAL : B_STORE);
						bc.push(v.index);
					}
				}
				break;
				case STATEMENT_expr:
				{
					if(!isAttribOp(stat.expr.op) 
					&& stat.expr.op != T_autoinc
					&& stat.expr.op != T_autodec
					&& stat.expr.op != T_pre_autoinc
					&& stat.expr.op != T_pre_autodec
					&& stat.expr.op != T_parO
					&& stat.expr.op != T_dot)
					{
						this.erro("Esta expressão não pode ficar sozinha, talvez tenha esquecido um operador matemático");
					}
					let tipoRet = this.compileExpr(stat.expr,bc,T_vazio);
					if(tipoRet != T_vazio) bc.push(B_POP); // para não encher a stack com coisa inútil
				}
				break;
				case STATEMENT_block:
					this.scope = new Scope(this.scope,false,this.funcScopeRef); // cria um scopo para rodar a funcao, se, enquanto e qualquer coisa...
						this.compileStatements(stat.statements,func);
					this.scope = this.scope.parentScope;
				break;
				case STATEMENT_se:
				{
					//let trueJumps = [];
					let falseJumps = [];
					this.compileLogicalExpr(stat.expr,bc,false,falseJumps);
					
					//bc.push(B_IFEQ);
					//let jumpTrueIndex = bc.length;
					//bc.push(0);
					//this.replaceAllBy(bc,trueJumps,bc.length); // determina o inicio do bloco true
					this.compileStatements(stat.statements_true,func);
					
					
					if(stat.statements_false)
					{
						bc.push(B_GOTO);
						let jumpFalseIndex = bc.length;
						bc.push(0);
						//bc[jumpTrueIndex] = bc.length; // ajusta o index de onde acaba o True Block
						this.replaceAllBy(bc,falseJumps,bc.length); // determina o inicio do bloco false
						
						this.compileStatements(stat.statements_false,func);
						
						bc[jumpFalseIndex] = bc.length;  // ajuda o index de onde acaba o False Block
					}
					else
					{
						//bc[jumpTrueIndex] = bc.length; // ajusta o index de onde acaba o True Block
						this.replaceAllBy(bc,falseJumps,bc.length); // determina o inicio do bloco false
					}
				}
				break;
				case STATEMENT_enquanto:
				{	
					let falseJumps = [];
					
					let loopStart = bc.length; // inicio dos statements
					
					this.compileLogicalExpr(stat.expr,bc,false,falseJumps);
					
					this.loopScope = new LoopScope(this.loopScope,falseJumps);
					
						this.compileStatements(stat.statements,func);
						
					this.loopScope = this.loopScope.parentScope;
					
					bc.push(B_GOTO);
					bc.push(loopStart); // para voltar
					
					this.replaceAllBy(bc,falseJumps,bc.length); // determina onde ir para sair do loop
				}
				break;
				case STATEMENT_facaEnquanto:
				{
					let trueJumps = [];
					let falseJumps = [];
					
					let loopStart = bc.length; // inicio dos statements
					
					this.loopScope = new LoopScope(this.loopScope,falseJumps);
					
						this.compileStatements(stat.statements,func);
					
					this.loopScope = this.loopScope.parentScope;
					
					this.compileLogicalExpr(stat.expr,bc,trueJumps,false);
					
					this.replaceAllBy(bc,trueJumps,loopStart); // determina onde ir para sair do loop da condicao
					
					this.replaceAllBy(bc,falseJumps,bc.length); // determina onde ir para sair do loop se tiver algum pare
				}
				break;
				case STATEMENT_para:
				{
					let falseJumps = [];
					
					this.scope = new Scope(this.scope,false,this.funcScopeRef); // escopo para as variáveis decl
					
					if(stat.decl)
					{
						this.compileStatements(stat.decl,func); // declaracao
					}
					
					let loopStart = bc.length; // inicio dos statements
					
					if(stat.expr)
					this.compileLogicalExpr(stat.expr,bc,false,falseJumps); // condicao
					
					this.loopScope = new LoopScope(this.loopScope,falseJumps);
					
						this.compileStatements(stat.statements,func);
					
					this.loopScope = this.loopScope.parentScope;
					
					if(stat.inc)
					{
						let tipoRet = this.compileExpr(stat.inc,bc,T_vazio);
						if(tipoRet != T_vazio) bc.push(B_POP); // para não encher a stack com coisa inútil
					}
					
					bc.push(B_GOTO);
					bc.push(loopStart); // para voltar
					
					this.replaceAllBy(bc,falseJumps,bc.length); // determina onde ir para sair do loop
					
					this.scope = this.scope.parentScope; // fim do escopo
				}
				break;
				case STATEMENT_pare:
				{
					if(this.loopScope)
					{
						bc.push(B_GOTO);
						bc.push(0); // para pular o loop
						this.loopScope.addJump(bc.length-1);
					}
					else
					{
						this.erro("o 'pare' não faz sentido aqui, nenhum laço de repetição para parar.");
					}
				}
				break;
				case STATEMENT_ret:
					this.compileFunctionRet(func,stat.expr);
				break;
				case STATEMENT_escolha:
				{
					//console.log("escolha não funciona ainda");	

					let tipoRet = this.compileExpr(stat.expr,bc,-1);
					if(tipoRet == T_vazio)
					{
						this.erro("A expressão do escolha deveria retornar um valor...");
					}
					
					let falseJumps = [];
					
					let casosExpressions = this.shallowExtract(stat.statements,STATEMENT_caso);
					
					if(casosExpressions.length == 0)
					{
						this.erro("escolha-caso sem casos? não faz sentido algum.");
					}
					
					let casoJumps = [];
					for(let k=0;k<casosExpressions.length;k++)
					{
						if(casosExpressions[k].contrario)
						{
							// nada para fazer aqui...
						}
						else
						{
							if(k < casosExpressions.length-1)
							bc.push(B_DUP);// duplica o valor da expressão na stack
							
							// deveria checar o tipo?
							let casoTipoRet = this.compileExpr(casosExpressions[k].expr,bc,tipoRet);
							if(casoTipoRet != tipoRet)
							{
								this.erro("O caso deveria ter o mesmo tipo que o valor do escolha");
							}
							
							bc.push(B_IFCMPEQ); // compara se é igual
							bc.push(0);
							casoJumps.push(bc.length-1);
						}
					}
					
					// caso contrário
					bc.push(B_GOTO);
					bc.push(0);
					casoJumps.push(bc.length-1);
					
								
					this.loopScope = new SwitchScope(this.loopScope,falseJumps,casoJumps);
					
						this.compileStatements(stat.statements,func);
					
					if(!this.loopScope.contrario)
					{ // se não tem o caso contrário
						let jumpIndex = this.loopScope.getContrarioJump();
						bc[jumpIndex] = bc.length;
					}
					
					this.loopScope = this.loopScope.parentScope;
										
					this.replaceAllBy(bc,falseJumps,bc.length); // determina onde ir para sair do escolha, nos pare's
				}
				break;
				case STATEMENT_caso:
					//console.log("caso não funciona ainda");
					
					if(this.loopScope && this.loopScope instanceof SwitchScope)
					{
						let jumpIndex = false;
						if(stat.contrario)
						{
							jumpIndex = this.loopScope.getContrarioJump();
						}
						else
						{
							jumpIndex = this.loopScope.getNextCasoJump();
						}
						//console.log("replaced "+jumpIndex+" --> "+bc.length);
						bc[jumpIndex] = bc.length;
					}
					else
					{
						this.erro("o 'caso' não faz sentido aqui, deve ser colocado em uma estrutura escolha.");
					}
				break;
			}
		}
	}
	

	
	tryConvertType(tRet,tA,bc)
	{
		if(tRet == T_cadeia)
		{
			if(tA == T_inteiro)bc.push(B_I2S);
			else if(tA == T_real)bc.push(B_F2S);
			else if(tA == T_logico)bc.push(B_B2S);
		}
		else if(tRet == T_inteiro)
		{
			if(tA == T_real)bc.push(B_F2I);
		}
	}
	

	
	compileLogicalExpr(expr,bc,trueJumps,falseJumps)
	{
		if(
		expr.op != T_and
		&& expr.op != T_or
		&& expr.op != T_ge
		&& expr.op != T_gt
		&& expr.op != T_le
		&& expr.op != T_lt
		&& expr.op != T_equals
		&& expr.op != T_notequals
		&& expr.op != T_not)
		{
			let tExprA = this.compileExpr(expr,bc,T_logico);
			if(tExprA != T_logico && (trueJumps !== false || falseJumps !== false))
			{
				this.erro("esta deveria ser uma expressão lógica. lembre-se que '=' é diferente de '==' ");
			}
			
			if(trueJumps === false && falseJumps === false)
			{
				// nada, ja ta com o logico na stack
			}
			else if(falseJumps === false)
			{
				bc.push(B_IFEQ); // se é verdadeiro, pq true == 0
				bc.push(0); // se verdadeiro
				
				trueJumps.push(bc.length-1);
			}
			else if(trueJumps === false)
			{
				bc.push(B_IFNE); // se é falso, pq false != 0
				bc.push(0); // se falso
				falseJumps.push(bc.length-1);
			}
			else
			{
				bc.push(B_IFEQ); // se é verdadeiro, pq true == 0
				bc.push(0); // se verdadeiro
				bc.push(B_GOTO);
				bc.push(0); // se falso
				
				trueJumps.push(bc.length-3);
				falseJumps.push(bc.length-1);
			}
			
			return T_logico;
		}

		
		let tExprA = T_vazio;
		let tExprB = T_vazio;
		
		if(expr.op == T_not)
		{
			tExprA = this.compileLogicalExpr(expr[0],bc,falseJumps,trueJumps);
			
			if(trueJumps === false && falseJumps === false) // vai pular se for falso, continuar se for verdadeiro
			{
				bc.push(B_NO); // inverte se for pra retorna bool
			}
			return T_logico;
		}
		
		if(expr.op == T_and || expr.op == T_or) // AND E OR SHORT CIRCUITING
		{
			if(expr.op == T_and) // AND
			{
				let myFalseJumps = [];
				if(falseJumps !== false) myFalseJumps = falseJumps;
				// tem que avaliar todos e averiguar se todos são verdadeiro. mas se for falso já pula!
				tExprA = this.compileLogicalExpr(expr[0],bc,false,myFalseJumps);
					
				
				tExprB = this.compileLogicalExpr(expr[1],bc,trueJumps,myFalseJumps);
				
				if(trueJumps === false && falseJumps === false) // vai pular se for falso, continuar se for verdadeiro
				{
					let endIndex = bc.length +6;
					let falseIndex = bc.length +4;
					
					this.replaceAllBy(bc,myFalseJumps,falseIndex); // determina para que pulem para ca
					
					bc.push(B_PUSH);
					bc.push(B_TRUE); // 0
					bc.push(B_GOTO);
					bc.push(endIndex);
					bc.push(B_PUSH); // jumpFalse
					bc.push(B_FALSE); //1
				}
				else if(falseJumps === false)
				{
					this.replaceAllBy(bc,myFalseJumps,bc.length); // determina para que pulem para ca
				}
			}
			if(expr.op == T_or) // OR
			{
				let myTrueJumps = [];
				if(trueJumps !== false) myTrueJumps = trueJumps;
				// tem que avaliar todos e averiguar se tem pelo menos um verdadeiro. mas se for verdadeiro já pula!
				tExprA = this.compileLogicalExpr(expr[0],bc,myTrueJumps,false); // se for falso continua. se for verdadeiro pula pro final
				
				tExprB = this.compileLogicalExpr(expr[1],bc,myTrueJumps,falseJumps); // mas aqui pode pular dai
								
				if(trueJumps === false && falseJumps === false) // vai pular se for verdadeiro, continuar se for falso
				{
					let endIndex = bc.length +6;
					let trueIndex = bc.length +4;
					
					this.replaceAllBy(bc,myTrueJumps,trueIndex); // determina para que pulem para ca
					
					bc.push(B_PUSH);
					bc.push(B_FALSE); // 1
					bc.push(B_GOTO);
					bc.push(endIndex);
					bc.push(B_PUSH); // jumpFalse
					bc.push(B_TRUE); // 0
				}
				else if(trueJumps === false)
				{
					this.replaceAllBy(bc,myTrueJumps,bc.length); // determina para que pulem para ca
				}
			}
			if(tExprA == T_vazio || tExprB == T_vazio)
			{
				this.erro("um dos elementos da expressão não retorna nenhum valor.");
			}
			else
			{
				if(!checarCompatibilidadeTipo(tExprA,tExprB,expr.op))
				{
					this.erro("não pode aplicar a operação "+getSeparator(expr.op)+" com os tipos "+getTypeWord(tExprA)+" e "+getTypeWord(tExprB));
				}
			}
		}
		else
		{
			tExprA = this.compileExpr(expr[0],bc,-1);
			if(tExprA == T_vazio)
			{
				bc.push(B_PUSH);bc.push(0);
			}
			tExprB = this.compileExpr(expr[1],bc,-1);
			if(tExprB == T_vazio)
			{
				bc.push(B_PUSH);bc.push(0);
			}
			if(tExprA == T_vazio || tExprB == T_vazio)
			{
				this.erro("um dos elementos da expressão não retorna nenhum valor.");
			}
			else
			{
				if(!checarCompatibilidadeTipo(tExprA,tExprB,expr.op))
				{
					this.erro("não pode aplicar a operação "+getSeparator(expr.op)+" com os tipos "+getTypeWord(tExprA)+" e "+getTypeWord(tExprB));
				}
			}
			
			switch(expr.op)
			{
				case T_ge:bc.push(B_IFCMPLT);break;
				case T_gt:bc.push(B_IFCMPLE);break;
				case T_le:bc.push(B_IFCMPGT);break;
				case T_lt:bc.push(B_IFCMPGE);break;
				case T_notequals:bc.push(B_IFCMPEQ);break;
				case T_equals:bc.push(B_IFCMPNE);break;
				default:
					this.erro("ERRO CRÍTICO: operador incorreto:"+expr.op);
				break;
			}
			
			if(trueJumps === false && falseJumps === false)
			{
				let endIndex = bc.length +7;
				let falseIndex = bc.length +5;
				
				bc.push(falseIndex); // o jump do op
				bc.push(B_PUSH);
				bc.push(B_TRUE); // 0
				bc.push(B_GOTO);
				bc.push(endIndex);
				bc.push(B_PUSH); // jumpFalse
				bc.push(B_FALSE); // 1
								// jumpEnd
			}
			else
			{
				if(falseJumps === false)
				{
					bc.push(bc.length+3); // se falso
					bc.push(B_GOTO);
					bc.push(0); // se verdadeiro
					
					trueJumps.push(bc.length-1);
				}
				else if(trueJumps === false)
				{
					bc.push(0); // se falso
					falseJumps.push(bc.length-1);
				}
				else
				{
					bc.push(0); // se falso
					bc.push(B_GOTO);
					bc.push(0); // se verdadeiro
					
					trueJumps.push(bc.length-1);
					falseJumps.push(bc.length-3);
				}
			}
		}
		return T_logico;
	}
	
	compileMemberAttrib(member,v,bc)
	{
		if(v.isArray && member && member.expr) // se está indexando
		{
			for(let k = 0;k<member.expr.length;k++)
			{
				let tExpri = this.compileExpr(member.expr[k],bc,T_inteiro); // espera retorno inteiro do index do array
				if(tExpri == T_vazio)
				{
					this.erro("a expressão que indica a posição do vetor não retorna valor nenhum");
					bc.push(B_PUSH);bc.push(0);
				}
				else if(tExpri != T_inteiro) this.erro("para acessar um vetor ou matriz, deve informar um valor numérico do tipo inteiro.");
			}
			
			bc.push(v.global ? B_ASTOREGLOBAL : B_ASTORE);
			bc.push(v.index);
			bc.push(member.expr.length);
			
			if(member.expr.length != v.arrayDim) this.erro("seu vetor é de "+v.arrayDim+" dimensões, porém indexou "+member.expr.length+" dimensões.");
		}
		else
		{
			//if(v.isArray)
			//	this.erro("você deve indicar a posição do vetor que deseja acessar, não pode usar um vetor assim");
			// bom agora pode usar o vetor assim...
			bc.push(v.global ? B_STOREGLOBAL : B_STORE);
			bc.push(v.index);
		}
		
		
		if(v.isConst)
		{
			this.erro("não pode alterar o valor da constante '"+v.name+"'");
		}
	}
	
	// retorna o tipo da expressao
	// typeExpected
	// se for -1 é porque tem que retornar algum valor, não importa qualquer
	// se for algum tipo, é porque deveria retornar aquele tipo
	// e for T_vazio é porque não era para retornar nada, irá informar que não retornou nada pelo return T_vazio correspondente
	compileExpr(expr,bc,typeExpected)
	{
		if(!expr) return T_vazio;
		
		if(
			expr.op == T_and
		|| expr.op == T_or
		|| expr.op == T_ge
		|| expr.op == T_gt
		|| expr.op == T_le
		|| expr.op == T_lt
		|| expr.op == T_equals
		|| expr.op == T_notequals
		|| expr.op == T_not) return this.compileLogicalExpr(expr,bc,false,false);
		
		if(expr.length == 2)
		{
			let tExprA = T_vazio;
			let tExprB = T_vazio;
			if(expr.op == T_attrib)
			{
				let v = this.getVar(expr[0].name);
				if(v.isArray && expr[0].expr)
				{
					tExprA = v.arrayType;
				}
				else
				tExprA = v.type;
				tExprB = this.compileExpr(expr[1],bc,tExprA);
				
				this.tryConvertType(tExprA,tExprB,bc);
				if(typeExpected != T_vazio)
					bc.push(B_DUP); // o valor fica na stack. mds isso vai da o maior problema
				
				this.compileMemberAttrib(expr[0],v,bc);
				
				if(!checarCompatibilidadeTipo(tExprA,tExprB,expr.op))
				{
					this.erro("não pode colocar "+getTypeWord(tExprB)+" em uma variável do tipo "+getTypeWord(tExprA));
				}
				
				if(typeExpected != T_vazio) // deu DUP
					return tExprA;
				else return T_vazio; // não deu DUP
			}
			else 
			{
				let tExpr = -1;
				if(isAttribOp(expr.op))
				{
					tExpr = expr[0].type;
				}
				tExprA = this.compileExpr(expr[0],bc,-1);
				if(tExprA == T_vazio)
				{
					bc.push(B_PUSH);bc.push(0);
				}
				tExprB = this.compileExpr(expr[1],bc,tExpr);
				if(tExprB == T_vazio)
				{
					bc.push(B_PUSH);bc.push(0);
				}
				
				if(tExprA == T_vazio || tExprB == T_vazio)
				{
					this.erro("um dos elementos da expressão não retorna nenhum valor.");
				}
				else
				{
					if(!checarCompatibilidadeTipo(tExprA,tExprB,expr.op))
					{
						this.erro("não pode aplicar a operação "+getSeparator(expr.op)+" com os tipos "+getTypeWord(tExprA)+" e "+getTypeWord(tExprB));
					}
				}
				
				let tRet = getTipoRetorno(tExprA,tExprB); // quando é divisão retorna real ou inteiro?
				
				if(tRet != tExprA && (tRet == T_inteiro || tRet == T_cadeia))
				{
					// gambiarra
					bc.push(B_SWAP);
					this.tryConvertType(tRet,tExprA,bc);
					bc.push(B_SWAP);
				}
				
				if(tRet != tExprB)
				{
					this.tryConvertType(tRet,tExprB,bc);
				}
				
				if(tRet == T_inteiro && (expr.op == T_div || expr.op == T_attrib_div))
				{
					bc.push(B_iDIV);
				}
				else switch(expr.op)
				{
					case T_attrib_plus:
					case T_plus:bc.push(B_ADD);break;
					
					case T_attrib_minus:
					case T_minus:bc.push(B_SUB);break;
					
					case T_attrib_mul:
					case T_mul:bc.push(B_MUL);break;
					
					case T_attrib_div:
					case T_div:bc.push(B_DIV);break;
					
					case T_attrib_rem:
					case T_rem:bc.push(B_REM);break;
					
					case T_attrib_shiftright:
					case T_shiftright:bc.push(B_SHR);break;
					
					case T_attrib_shiftleft:
					case T_shiftleft:bc.push(B_SHL);break;

					case T_attrib_bitand:
					case T_bitand:
						if(tExprA == T_logico) // logico é invertido
							bc.push(B_OR);
						else
							bc.push(B_AND);
						break;
						
					case T_attrib_bitor:
					case T_bitor:
						if(tExprA == T_logico) // logico é invertido
							bc.push(B_AND);
						else
							bc.push(B_OR);
						break;
						
					case T_attrib_xor:
					case T_xor:bc.push(B_XOR);break;
					
					default:
						this.erro("o operador "+getSeparator(expr.op)+" não pode ter dois operandos.");
						bc.push(B_ADD);
					break;
				}
				
				if(isAttribOp(expr.op))
				{
					let v = this.getVar(expr[0].name);
					if(typeExpected != T_vazio)
						bc.push(B_DUP); // o valor fica na stack. mds isso vai da o maior problema
					
					// cadeia a = "teste "
					// a += verdadeiro
					// escreva(a)
					// ___________
					// teste verdadeiro
					//this.tryConvertType(tExprA,tExprB,bc);
					
					this.compileMemberAttrib(expr[0],v,bc);
					
					if(typeExpected != T_vazio) // deu DUP
						return tExprA;
					else return T_vazio; // não deu DUP
				}
				return tRet;
			}
			
		}
		else
		{
			switch(expr.op)
			{
				case T_unary_plus:return this.compileExpr(expr[0],bc,-1);
				case T_unary_minus:
				{
					let tExpr = this.compileExpr(expr[0],bc,-1);bc.push(B_NEG);
					return tExpr;
				}
				case T_autoinc:
				case T_pre_autoinc:
				{
					let v = this.getVar(expr[0].name);
					let tExpr = this.compileExpr(expr[0],bc,-1);
					
					if(expr.op == T_autoinc && typeExpected != T_vazio)
						bc.push(B_DUP); // o valor ANTERIOR fica na stack.
					
					bc.push(B_PUSH);
					bc.push(1);
					bc.push(B_ADD);
					
					if(expr.op == T_pre_autoinc && typeExpected != T_vazio)
						bc.push(B_DUP); // o valor fica na stack. mds isso vai da o maior problema
						
					this.compileMemberAttrib(expr[0],v,bc);
					
					if(typeExpected != T_vazio) // deu DUP
						return tExpr;
					else return T_vazio; // não deu DUP
				}
				case T_autodec:
				case T_pre_autodec:
				{
					let v = this.getVar(expr[0].name);
					let tExpr = this.compileExpr(expr[0],bc,-1);
					
					if(expr.op == T_autodec && typeExpected != T_vazio)
						bc.push(B_DUP);  // o valor ANTERIOR fica na stack.
					
					bc.push(B_PUSH);
					bc.push(1);
					bc.push(B_SUB);
					
					if(expr.op == T_pre_autodec && typeExpected != T_vazio)
						bc.push(B_DUP); // o valor fica na stack. mds isso vai da o maior problema
					
					this.compileMemberAttrib(expr[0],v,bc);
					
					if(typeExpected != T_vazio) // deu DUP
						return tExpr;
					else return T_vazio; // não deu DUP
				}
				case T_bitnot:
				{
					let tExpr = this.compileExpr(expr[0],bc,-1);bc.push(B_NOT);
					return tExpr;
				}
				//case T_not:tis.compileExpr(expr[0],bc,variableMap);break;
				case T_parO: // methCall
				{
					let args = expr.args;
					if(expr.name == "escreva")
					{
						for(let i =0;i<args.length;i++)
						{
							let tExpr = this.compileExpr(args[i],bc,-1);
							this.tryConvertType(T_cadeia,tExpr,bc);
							bc.push(B_INVOKE);
							let funcIndex = this.getFuncIndex(expr.name,[]);
							bc.push(funcIndex);
							bc.push(1);
						}
						return T_vazio;
					}
					else if(expr.name == "leia")
					{
						console.log("Marcou como unsafe porque chamou a função leia");
						this.funcScopeRef.jsSafe = false;
						let methName= expr.name;
						if(args.length == 1)
						{
							let v = this.getVar(args[0].name);
							if(v.isArray)
								methName += "$"+getTypeWord(v.arrayType);
							else
								methName += "$"+getTypeWord(v.type);

							this.compileExpr(args[0],bc,-1);
							bc.push(B_INVOKE);
							let funcIndex = this.getFuncIndex(methName,[]);
							bc.push(funcIndex);
							bc.push(args.length);
							
							this.compileMemberAttrib(args[0],v,bc);
						}
						else
						{
							this.erro("o leia deve receber uma variável como argumento");
						}
						return T_vazio;
					}
					else
					{
						let methName= expr.name;
						let funcArgs = [];
											
						for(let i =0;i<args.length;i++)
						{
							funcArgs.push(this.compileExpr(args[i],bc,-1));
							/*if(func.parameters[i].byRef)
							{
								let refFake_v = this.createVar(methName+"$"+i+"$"+bc.length,func.parameters[i].type,false,true,1);
								refVars[i] = {fakeV:refFake_v,realV:args[i]};
								// criando array de 1 dimensão
								bc.push(B_NEWARRAY);
								bc.push(refFake_v.index);
								bc.push(1); // tamanho
								bc.push(getDefaultValue(refFake_v.arrayType));
								
								// guardando valor da stack no index 0 do array
								bc.push(0);
								bc.push(B_ASTORE);
								bc.push(refFake_v.index);
								bc.push(1);
							}*/
						}
						bc.push(B_INVOKE);
						
						let funcIndex = this.getFuncIndex(methName,funcArgs);
						let func = this.functions[funcIndex];
						
						this.funcScopeRef.addFuncCall(func);
						
						bc.push(funcIndex);
						bc.push(args.length);
						
						
						// a stack estará com as variáveis por referência, caso houver
						// em ordem reversa!
						if(funcIndex != 0)
						for(let i =args.length-1;i>=0;i--)
						{
							if(func.parameters[i].byRef && func.parameters[i].id != STATEMENT_declArr)
							{							
								// guardando valor da stack na variável
								let refV = this.getVar(args[i].name);
								this.compileMemberAttrib(args[i],refV,bc);
							}
						}
						
						
						return func.type;
					}
				}
				case T_word:
				{
					let v = this.getVar(expr.name);
					
					// chamadas de funções usam o vetor como uma variável...
					//if(v.isArray) 
					//this.erro("tentou usar o vetor como se fosse uma variável. você deve indicar a posição do vetor que quer acessar");
					
					bc.push(v.global ? B_LOADGLOBAL : B_LOAD);
					bc.push(v.index);
					return v.type;
				}
				case T_inteiroLiteral:bc.push(B_PUSH);bc.push(this.baseParseInt(expr.value));return T_inteiro;
				case T_realLiteral:bc.push(B_PUSH);bc.push(parseFloat(expr.value));return T_real;
				case T_cadeiaLiteral:bc.push(B_PUSH);bc.push(expr.value);return T_cadeia;
				case T_caracterLiteral:bc.push(B_PUSH);bc.push(expr.value);return T_caracter;
				
				// x == 0: true
				// x != 0: false
				case T_logicoLiteral: bc.push(B_PUSH);bc.push(expr.value == "verdadeiro" ? B_TRUE : B_FALSE);return T_logico; 
				// vetor[ expr ]
				case T_squareO:
				{
					//let tExpri = this.compileExpr(expr.expr[0],bc,T_inteiro);
					for(let k = 0;k<expr.expr.length;k++)
					{
						let tExpri = this.compileExpr(expr.expr[k],bc,T_inteiro); // espera retorno inteiro do index do array
						if(tExpri == T_vazio)
						{
							this.erro("a expressão que indica a posição do vetor não retorna valor nenhum");
							bc.push(B_PUSH);bc.push(0);
						}
						else if(tExpri != T_inteiro) this.erro("para acessar um vetor ou matriz, deve informar um valor numérico do tipo inteiro.");
					}
					
					let v = this.getVar(expr.name);
					
					bc.push(v.global ? B_ALOADGLOBAL : B_ALOAD);
					bc.push(v.index);
					bc.push(expr.expr.length);
					
					if(expr.expr.length != v.arrayDim) this.erro("sua matriz é de "+v.arrayDim+" dimensões, porém indexou "+expr.expr.length+" dimensões.");
					
					return v.arrayType;
				}
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
					
					if(!libObj.members[campo.name])
						this.erro("a biblioteca "+biblioteca+" não tem nenhuma variável ou função '"+campo.name+"'");
					
					if(libObj.members[campo.name].id == T_word && campo.op == T_parO)
						this.erro("está usando a variável '"+campo.name+"' como se fosse uma função.");
						
					if(libObj.members[campo.name].id == T_parO && campo.op == T_word)
						this.erro("está usando a fução '"+campo.name+"' como se fosse uma variável.");
					
					if(campo.op == T_word)
					{
						bc.push(B_LIBLOAD);
						bc.push(biblioteca);
						bc.push(campo.name);
					}
					else if(campo.op == T_parO)
					{
						let funcPars = libObj.members[campo.name].parameters;
						
						if(funcPars.length != campo.args.length)
						{
							this.erro("a função "+campo.name+" espera "+funcPars.length+" argumentos, foram passados apenas "+campo.args.length);
						}
						
						for(let k =0;k<campo.args.length;k++)
						{
							let tExpr = this.compileExpr(campo.args[k],bc,funcPars[k].type);
							
							if(!checarCompatibilidadeTipo(funcPars[k].type,tExpr,T_attrib))
							this.erro("a função "+campo.name+" esperava o tipo "+getTypeWord(funcPars[k].type)+" no parâmetro "+funcPars[k].name+" porém foi fornecido o tipo "+getTypeWord(tExpr));
						}
						
						if(!libObj.members[campo.name].jsSafe)
						{
							console.log("Marcou como unsafe porque chamou a função da biblioteca "+campo.name);
							this.funcScopeRef.jsSafe = false;
						}
						
						bc.push(B_LIBINVOKE);
						bc.push(biblioteca);
						bc.push(campo.name);
						bc.push(campo.args.length);
					}
					
				return libObj.members[campo.name].type;
				}
			}
		}
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
