import { numberOfLinesUntil } from "../extras/extras.js";

export const B_TRUE = 0;
export const B_FALSE = 1;

export const B_PUSH = 1;
export const B_POP = 2;

export const B_ADD = 3;
export const B_SUB = 4;
export const B_MUL = 5;
export const B_DIV = 6;
export const B_REM = 7;

export const B_iDIV = 8;  // integer div
export const B_iREM = 9; // integer modulo

export const B_GOTO = 13;
export const B_IFEQ = 14;
export const B_IFNE = 15;
export const B_IFLT = 16;
export const B_IFGE = 17;
export const B_IFGT = 18;
export const B_IFLE = 19;

export const B_DUP = 20;
export const B_INVOKE = 21;

export const B_STORE = 22; // inteiro
export const B_LOAD = 23;

export const B_RET      = 24;
export const B_RETVALUE = 25;

export const B_SHL = 26;
export const B_SHR = 27;
export const B_XOR = 28;
export const B_AND = 29; //bitwise
export const B_OR = 30;  //bitwise

export const B_IFCMPEQ = 31;
export const B_IFCMPNE = 32;
export const B_IFCMPLT = 33;
export const B_IFCMPLE = 34;
export const B_IFCMPGT = 35;
export const B_IFCMPGE = 36;
export const B_NEG = 37; // arithmetic negation
export const B_NOT = 38; // bitwise negation
export const B_NO = 39;  // logic negation

export const B_STOREGLOBAL = 40;
export const B_LOADGLOBAL = 41;

export const B_F2I = 42; // float to int
//let B_I2F = 37; // int to float

export const B_I2S = 43; // int to str
export const B_F2S = 44; // float to str
export const B_B2S = 45; // bool to str
export const B_C2S = 46; // char to str

export const B_SWAP = 47; // swap the elemtns of the stack


export const B_NEWARRAY = 48;
export const B_ASTORE = 49;
export const B_ALOAD = 50;
export const B_NEWARRAYGLOBAL = 51;
export const B_ASTOREGLOBAL = 52;
export const B_ALOADGLOBAL = 53;

export const B_LIBLOAD = 54; // library load
export const B_LIBINVOKE = 55; // library invoke
// não existem opcodes pro or e and logico.
//let B_LAND = 32; // logical or
//let B_LOR = 33; // logical or

// private
export const B_WRITE = 100;
export const B_WAITINPUT = 101;
export const B_READ_INT = 102;
export const B_READ_FLOAT = 103;
export const B_READ_STRING = 104;
export const B_READ_CHAR = 105;
export const B_READ_BOOL = 106;
export const B_CLEAR = 107;

export function bytecodeName(c)
{
switch(c)
{
case B_PUSH : return "push";
case B_POP : return "pop";
case B_ADD : return "add";
case B_SUB : return "sub";
case B_MUL : return "mul";
case B_DIV : return "div";
case B_REM : return "rem";
case B_iDIV : return "idiv";
case B_iREM : return "irem";
case B_GOTO : return "goto";
case B_IFEQ : return "ifeq";
case B_IFNE : return "ifne";
case B_IFLT : return "iflt";
case B_IFGE : return "ifge";
case B_IFGT : return "ifgt";
case B_IFLE : return "ifle";
case B_DUP : return "dup";
case B_INVOKE : return "invoke";
case B_STORE : return "store";
case B_LOAD : return "load";
case B_STOREGLOBAL : return "storeglobal";
case B_LOADGLOBAL : return "loadglobal";
case B_RET      : return "ret";
case B_RETVALUE : return "retvalue";
case B_SHL : return "shl";
case B_SHR : return "shr";
case B_XOR : return "xor";
case B_AND : return "and";
case B_OR : return "or";
case B_IFCMPEQ : return "ifcmpeq";
case B_IFCMPNE : return "ifcmpne";
case B_IFCMPLT : return "ifcmplt";
case B_IFCMPLE : return "ifcmple";
case B_IFCMPGT : return "ifcmpgt";
case B_IFCMPGE : return "ifcmpge";
case B_NEG : return "neg";
case B_NOT : return "not";
case B_WRITE : return "write";
case B_WAITINPUT : return "waitinput";
case B_READ_INT : return "read_int";
case B_READ_FLOAT : return "read_float";
case B_READ_STRING : return "read_string";
case B_READ_CHAR : return "read_char";
case B_READ_BOOL : return "read_bool";
case B_F2I : return "f2i";
case B_I2S : return "i2s";
case B_F2S : return "f2s";
case B_B2S : return "b2s";
case B_C2S : return "c2s";
case B_SWAP : return "swap";
case B_NO: return "no";
case B_CLEAR: return "clear";
case B_NEWARRAY: return "newarray";
case B_ASTORE: return "astore";
case B_ALOAD: return "aload";
case B_NEWARRAYGLOBAL: return "newarrayglobal";
case B_ASTOREGLOBAL: return "astoreglobal";
case B_ALOADGLOBAL: return "aloadglobal";
case B_LIBLOAD: return "libload";
case B_LIBINVOKE: return "libinvoke";
}
}

export function bytecodeArgs(c)
{
switch(c)
{
case B_IFEQ :
case B_IFNE :
case B_IFLT :
case B_IFGE :
case B_IFGT :
case B_IFLE :
case B_GOTO :
case B_STORE :
case B_LOAD :
case B_STOREGLOBAL :
case B_LOADGLOBAL :
case B_PUSH : 
case B_IFCMPEQ :
case B_IFCMPNE :
case B_IFCMPLT :
case B_IFCMPLE :
case B_IFCMPGT :
case B_IFCMPGE :
	return 1;
case B_POP :
case B_ADD :
case B_SUB :
case B_MUL :
case B_DIV :
case B_REM :
case B_iDIV :
case B_iREM :
case B_DUP :
case B_RET      : 
case B_RETVALUE :
case B_SHL :
case B_SHR :
case B_XOR : 
case B_AND :
case B_OR :
case B_NEG :
case B_NOT :
case B_NO:
case B_WRITE : 
case B_WAITINPUT : 
case B_READ_INT :
case B_READ_FLOAT :
case B_READ_STRING : 
case B_READ_CHAR : 
case B_READ_BOOL : 
case B_F2I :
case B_I2S :
case B_F2S :
case B_B2S :
case B_C2S :
case B_SWAP : 
case B_CLEAR:
	return 0;
case B_INVOKE :
case B_ASTORE:
case B_ALOAD:
case B_ASTOREGLOBAL:
case B_ALOADGLOBAL:
case B_LIBLOAD:
	return 2;
case B_NEWARRAY:
case B_NEWARRAYGLOBAL:
case B_LIBINVOKE:
	return 3;
}
}


export const STATE_ENDED = 0;
export const STATE_WAITINGINPUT = 1;
export const STATE_BREATHING = 2;
export const STATE_PENDINGSTOP = 3;
export const STATE_RUNNING = 4;
export const STATE_DELAY = 5;
export const STATE_DELAY_REPEAT = 6;
export const STATE_STEP = 7;
export const STATE_ASYNC_RETURN = 8;

// deveria fazer a execução da vm não ser global?

let VM_delay = false;
export function VM_setDelay(delay) {
	VM_delay = delay;
}
export function VM_getDelay(delay) {
	return VM_delay;
}

let VM_execJS = false;
export function VM_getExecJS() {
	return VM_execJS;
}
// frame locals
let VM_code = false;
let VM_i = 0;
let VM_stack = false; // o valor atual é o VM_si-1
let VM_si = 0; // stack i
let VM_vars = false;
let VM_funcIndex = 0;

// frame globals
let VM_frame = false;
let VM_globals = false;
let VM_functions = false;
let VM_jsfunctions = false;
let VM_libraries = false;
let VM_saida = false;
let VM_saidaDiv = false;
let VM_textInput = false;
let VM_codeCount = 0;
let VM_codeMax = 500000; // se for um valor baixo dá flickering no canvas, valor alto trava tudo. (Resolvido, alterado esse máximo só quando usar a biblioteca Gráficos)
export function VM_setCodeMax(codeMax) {
	VM_codeMax = codeMax;
}
export function VM_getCodeMax() {
	return	VM_codeMax;
}

let VM_escrevaCount = 0;
let VM_escrevaMax = 1000;
let enviarErro = false;



export function recursiveDeclareArray(sizes,defaultValue,i)
{
	if(i >= sizes.length)
	{
		console.log("não deveria chamar o recursiveDeclareArray DENOVO!");
		return false; // no more dimensions
	}
	
	let arr = new Array(sizes[i]);
	
	if(i+1 < sizes.length)
	{
		for(let k=0;k<arr.length;k++)
		{
			arr[k] = this.recursiveDeclareArray(sizes,defaultValue,i+1);
		}
	}
	else
	{
		for(let k=0;k<arr.length;k++)
		{
			arr[k] = defaultValue;
		}
	}
	
	return arr;
}

export function escreva(...txt)
{
	if(VM_escrevaCount > VM_escrevaMax)
	{
		VM_escrevaCount = 0;
		VM_saida = "<MAIS DE "+VM_escrevaMax+" ESCREVAS, REINICIANDO LOG...>\n";
	}
	for(let i=0;i<txt.length;i++)
		VM_saida += txt[i];
	
	VM_saidaDiv.value = VM_saida;
	VM_saidaDiv.scrollTop = VM_saidaDiv.scrollHeight;
	VM_escrevaCount++;
}

export function limpa()
{
	VM_saida = "";
	VM_saidaDiv.value = VM_saida;
	VM_saidaDiv.scrollTop = VM_saidaDiv.scrollHeight;
	VM_escrevaCount = 0;
}

export function leia()
{
	let saidadiv = VM_saidaDiv.value;
	let entrada = saidadiv.substring(VM_saida.length,saidadiv.length);
	if(entrada.endsWith("\n"))
	{
		entrada = entrada.substring(0,entrada.length-1);
	}
	VM_saida = saidadiv;
	return entrada;
}

export function sorteia(a,b)
{
	return VM_libraries["Util"].sorteia(a,b).value;
}

export function VM_async_return(retValue)
{
	if(typeof retValue !== "undefined")
	{	
		if(typeof retValue == "boolean")
		{
			retValue = retValue ? B_TRUE : B_FALSE;
		}
	}
	else
	{
		retValue = null;
	}
	
	VM_stack[VM_si++] = retValue;
}

export function VM_i2s(value)
{
	return value.toLocaleString('fullwide', { useGrouping: false });
}

export function VM_f2s(value)
{
	let strFloat = ""+value;
	if(!strFloat.includes(".")) strFloat += ".0";
	return strFloat;
}

export function VM_b2s(value)
{
	return (value == 0 ? "verdadeiro" : "falso");
}

export function VM_realbool2s(value)
{
	return (value ? "verdadeiro" : "falso");
}

export function getFirstFunctionWithIndexes()
{	
	let func = VM_functions[VM_funcIndex];
	if(func && func.bytecodeIndexes) return {funcIndex:VM_funcIndex,i:VM_i};
	
	for(let vI = VM_frame.length -1; vI >= 0; vI--)
	{
		let funcIndex = VM_frame[vI].funcIndex;
		
		func = VM_functions[funcIndex];
		if(!func || !func.bytecodeIndexes)
			continue;
		
		return {funcIndex:funcIndex,i: VM_frame[vI].i};
	}

	return false;
}

export function getTokenIndex(bcIndex,funcIndex)
{
	let func = VM_functions[funcIndex];
	if(!func || !func.bytecodeIndexes) return 0;
	
	let indexKeys = Object.keys(func.bytecodeIndexes);
	if(!indexKeys) return 0;
	let tokenIndex = 0;
	for(let i =0;i<indexKeys.length;i++)
	{
		if(indexKeys[i] <= bcIndex)
		{
			tokenIndex = func.bytecodeIndexes[indexKeys[i]];
		}
	}
	return tokenIndex;
}

export function getCurrentTokenIndex() {
	return getTokenIndex(VM_i,VM_funcIndex);
}

export function VMerro(msg)
{
	let fi = getFirstFunctionWithIndexes();
	let i = 0;

	if(fi)
		i = getTokenIndex(fi.i,fi.funcIndex);
	// TODO
	if(enviarErro)
	enviarErro(VM_textInput,{index:i},msg,"exec");
	else
	console.log("ERRO NA VM:",msg);
}

export function VMsetup(functions,jsfunctions,libraries,globalCount,textInput,saida_div,erroCallback) 
{
	VM_functions = functions;
	VM_jsfunctions = jsfunctions;
	VM_textInput = textInput;
	VM_libraries = libraries;
	
	VM_saida = "";
	VM_saidaDiv = saida_div;
	
	VM_escrevaCount = 0;
	// para resetar a div e talz
	limpa();
	
	VM_frame = [];
	VM_globals = new Array(globalCount);

	// para mandar erro no console bonito
	enviarErro = erroCallback;
	
	for(let i=0;i<VM_functions.length;i++)
	{
		if(VM_functions[i].name == "#globalInit"){
			//this.frame = new StackFrame(false,new Array(100),i,100); // depois tem 	que ver para ter o numero certo de variaveis
			VM_funcIndex = i;
			VM_code = VM_functions[VM_funcIndex].bytecode;
			VM_i = 0;
			VM_stack = new Array(100);
			VM_si = 0;
			VM_vars = new Array(VM_functions[VM_funcIndex].varCount);
			break;
		}
	}
	
}

// testando performance
export function VMrun(execMax)
{
	try {
	VM_codeCount = 0;
	while(true) // eslint-disable-line
	{
		VM_codeCount++; // para parar o programa e atualizar a saida em loops muito demorados
		if(VM_codeCount > execMax) return STATE_BREATHING;
		//let code = this.next();
		
		
		let lastVM_i = VM_i;
		let lastVM_si = VM_si;
		
		let code = VM_code[VM_i++];
		
		
		switch(code)
		{
			case B_PUSH: VM_stack[VM_si++] = VM_code[VM_i++]; break;
			case B_POP: VM_si--; break;
			case B_DUP: VM_stack[VM_si] = VM_stack[VM_si-1]; VM_si++; break; // o valor atual é colocado na frente.
			case B_SWAP: 
			{
				let v = VM_stack[VM_si-1];
				VM_stack[VM_si-1] = VM_stack[VM_si-2];
				VM_stack[VM_si-2] = v;
			}
			break;
			case B_STORE: VM_vars[VM_code[VM_i++]] = VM_stack[--VM_si]; break;
			case B_LOAD: VM_stack[VM_si++] = VM_vars[VM_code[VM_i++]]; break;
			
			case B_STOREGLOBAL: VM_globals[VM_code[VM_i++]] = VM_stack[--VM_si]; break;
			case B_LOADGLOBAL: VM_stack[VM_si++] = VM_globals[VM_code[VM_i++]]; break;
			
			case B_LIBLOAD: 
			{
				let lib = VM_code[VM_i++];
				let field = VM_code[VM_i++];
				VM_stack[VM_si++] = VM_libraries[lib][field];
			}
			break;

			case B_ADD: VM_stack[VM_si-2] = VM_stack[VM_si-2]+VM_stack[VM_si-1]; VM_si--; break;
			case B_SUB: VM_stack[VM_si-2] = VM_stack[VM_si-2]-VM_stack[VM_si-1]; VM_si--; break;
			case B_MUL: VM_stack[VM_si-2] = VM_stack[VM_si-2]*VM_stack[VM_si-1]; VM_si--; break;
			case B_DIV: VM_stack[VM_si-2] = VM_stack[VM_si-2]/VM_stack[VM_si-1]; VM_si--; break;
			case B_REM: VM_stack[VM_si-2] = VM_stack[VM_si-2]%VM_stack[VM_si-1]; VM_si--; break;
			
			case B_iDIV: VM_stack[VM_si-2] = Math.trunc(VM_stack[VM_si-2]/VM_stack[VM_si-1]); VM_si--; break;
			case B_iREM: VM_stack[VM_si-2] = Math.trunc(VM_stack[VM_si-2]%VM_stack[VM_si-1]); VM_si--; break;
			
			case B_SHL: VM_stack[VM_si-2] = VM_stack[VM_si-2]<<VM_stack[VM_si-1]; VM_si--; break;
			case B_SHR: VM_stack[VM_si-2] = VM_stack[VM_si-2]>>VM_stack[VM_si-1]; VM_si--; break;
			case B_XOR: VM_stack[VM_si-2] = VM_stack[VM_si-2]^VM_stack[VM_si-1]; VM_si--; break;
			case B_AND: VM_stack[VM_si-2] = VM_stack[VM_si-2]&VM_stack[VM_si-1]; VM_si--; break;
			case B_OR:  VM_stack[VM_si-2] = VM_stack[VM_si-2]|VM_stack[VM_si-1]; VM_si--; break;
			
			case B_IFCMPEQ: VM_i = (VM_stack[VM_si-2] == VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;
			case B_IFCMPNE: VM_i = (VM_stack[VM_si-2] != VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;
			case B_IFCMPLT: VM_i = (VM_stack[VM_si-2] < VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;
			case B_IFCMPLE: VM_i = (VM_stack[VM_si-2] <= VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;
			case B_IFCMPGT: VM_i = (VM_stack[VM_si-2] > VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;
			case B_IFCMPGE: VM_i = (VM_stack[VM_si-2] >= VM_stack[VM_si-1] ? VM_code[VM_i++] : VM_i+1); VM_si -= 2; break;

			case B_GOTO: VM_i = VM_code[VM_i++]; break;
			case B_IFEQ: VM_i = (VM_stack[--VM_si] == 0 ? VM_code[VM_i++] : VM_i+1); break;
			case B_IFNE: VM_i = (VM_stack[--VM_si] != 0 ? VM_code[VM_i++] : VM_i+1); break;
			case B_IFLT: VM_i = (VM_stack[--VM_si] < 0 ? VM_code[VM_i++] : VM_i+1); break;
			case B_IFGE: VM_i = (VM_stack[--VM_si] >= 0 ? VM_code[VM_i++] : VM_i+1); break;
			case B_IFGT: VM_i = (VM_stack[--VM_si] > 0 ? VM_code[VM_i++] : VM_i+1); break;
			case B_IFLE: VM_i = (VM_stack[--VM_si] <= 0 ? VM_code[VM_i++] : VM_i+1); break;
			
			case B_LIBINVOKE:
			{
				let lib = VM_code[VM_i++];
				let meth = VM_code[VM_i++];
				let methArgsN = VM_code[VM_i++];
				let methArgs = [];
				for(let i = 0;i<methArgsN; i++)
				{
					methArgs.push(VM_stack[--VM_si]);
				}
				methArgs.reverse();
				
				let ret = VM_libraries[lib][meth].apply(VM_libraries[lib], methArgs);
				
				
				if(ret)
				{
					let retValue = ret.value;
					
					if(typeof retValue !== "undefined")
					{	
						if(typeof retValue == "boolean")
						{
							retValue = retValue ? B_TRUE : B_FALSE;
						}
						VM_stack[VM_si++] = retValue;
					}
					
					if(typeof ret.state !== "undefined" && ret.state != STATE_RUNNING)
					{
						if(ret.state == STATE_DELAY_REPEAT) // não pode retornar esse estado e um valor ao mesmo tempo, daria comportamento inconsistente
						{
							VM_i = lastVM_i;
							VM_si = lastVM_si;
						}
						
						return ret.state;
					}
				}
			}
			break;
			case B_INVOKE:
			{
				let methIndex = VM_code[VM_i++];
				let methArgsN = VM_code[VM_i++];
				let methArgs = [];
				for(let i = 0;i<methArgsN; i++)
				{
					methArgs.push(VM_stack[--VM_si]);
				}
				methArgs.reverse();
				
				if(
					methIndex < 0
					|| !VM_functions[methIndex]
					|| !VM_functions[methIndex].bytecode
					)
				{
					VMerro("Function '"+methIndex+"' not found");
				}
				else if(!VM_execJS || !VM_functions[methIndex].jsSafe)
				{
					// precisa criar um stackFrame
					
					//this.frame = new StackFrame(this.frame,this.frame.globalVars,methIndex,100,methArgs);
					VM_frame.push(
					{
						i : VM_i,
						stack : VM_stack,
						si : VM_si,
						vars : VM_vars,
						funcIndex : VM_funcIndex
					}
					); // snapshot now
					
					VM_funcIndex = methIndex;
					VM_code = VM_functions[VM_funcIndex].bytecode;
					VM_i = 0;
					VM_stack = new Array(100);
					VM_si = 0;
					VM_vars = new Array(VM_functions[VM_funcIndex].varCount);
					if(methArgs) for(let i=0;i<methArgs.length;i++)
					{
						VM_vars[i] = methArgs[i];
					}
				}
				else
				{
					let jsfuncName = VM_jsfunctions[methIndex].jsName;
					if(!jsfuncName)
					{
						VMerro("Function '"+methIndex+"' has no name");
					}
					
					
					let jsfunc = window[jsfuncName];
					
					if(!jsfunc)
					{
						VMerro("Function '"+jsfuncName+"' not found");
					}
					else
					{
						//console.log("chamou "+jsfuncName);
						let ret = jsfunc.apply(null,methArgs);
						if(typeof ret !== "undefined")
						{
							if(typeof ret == "boolean")
							{
								ret = ret ? B_TRUE : B_FALSE;
							}
							VM_stack[VM_si++] = ret;
						}
					}
				}
			}
			break;
			
			case B_RET: // return; // sem valor
			{
				if(VM_frame.length > 0)
				{
					let vI = VM_frame.length -1;
					VM_funcIndex = VM_frame[vI].funcIndex;
					VM_code = VM_functions[VM_funcIndex].bytecode;
					VM_i = VM_frame[vI].i;
					VM_stack = VM_frame[vI].stack;
					VM_si = VM_frame[vI].si;
					VM_vars = VM_frame[vI].vars;
					
					VM_frame.pop();
				}
				else
				{
					return STATE_ENDED;
				}
			}
			break;
			
			case B_RETVALUE: // return <expr>; // com valor
			{
				let v = VM_stack[--VM_si];
				if(VM_frame.length > 0)
				{
					let vI = VM_frame.length -1;
					//VM_funcIndex = VM_frame[vI].funcIndex;
					//VM_code = VM_functions[VM_funcIndex].bytecode;
					//VM_i = VM_frame[vI].i;
					//VM_stack = VM_frame[vI].stack;
					//VM_si = VM_frame[vI].si;
					//VM_vars = VM_frame[vI].vars;
					
					//VM_frame.pop();
					//push on the parent stack
					VM_frame[vI].stack[VM_frame[vI].si++] = v;
				}
				else
				{
					console.log("Não pode retornar valor:"+v);
					return STATE_ENDED;
				}
			}
			break;
			
			


			case B_NEG: VM_stack[VM_si-1] = -VM_stack[VM_si-1]; break;
			case B_NOT: VM_stack[VM_si-1] = ~VM_stack[VM_si-1]; break;
			case B_NO:  VM_stack[VM_si-1] = (VM_stack[VM_si-1] == 0 ? 1 : 0); break;
			
			case B_F2I: VM_stack[VM_si-1] = Math.trunc(VM_stack[VM_si-1]); break;
			
			case B_I2S: VM_stack[VM_si-1] = VM_stack[VM_si-1].toLocaleString('fullwide', { useGrouping: false }); break;
			case B_F2S: 
			{
				let strFloat = ""+VM_stack[VM_si-1];
				if(!strFloat.includes(".")) strFloat += ".0";
				VM_stack[VM_si-1] = strFloat;
			}
			break;
			case B_B2S: VM_stack[VM_si-1] = (VM_stack[VM_si-1] == 0 ? "verdadeiro" : "falso"); break;
			
			case B_NEWARRAYGLOBAL:
			case B_NEWARRAY:
			{
				let arrayVar = VM_code[VM_i++];
				let ndims = VM_code[VM_i++];
				let defaultValue = VM_code[VM_i++];
				let sizes = [];
				for(let k=0;k<ndims;k++)
				{
					let size = VM_stack[--VM_si];
					if(size>=0)
						sizes.push(size);
					else
					{
						VMerro("Tentou criar vetor com tamanho inválido '"+size+"'");
						return STATE_ENDED;
					}
				}
				sizes.reverse();
				
				if(code == B_NEWARRAYGLOBAL)
				VM_globals[arrayVar] = this.recursiveDeclareArray(sizes,defaultValue,0);
				else
				VM_vars[arrayVar] = this.recursiveDeclareArray(sizes,defaultValue,0);
			}
			break;
			case B_ASTOREGLOBAL: 
			case B_ASTORE:  
			{
				let arrayVar = VM_code[VM_i++];
				let ndims = VM_code[VM_i++];
				
				let indexes = [];
				for(let k=0;k<ndims;k++)
				{
					indexes.push(VM_stack[--VM_si]);
				}
				indexes.reverse();
				
				let tempArr = code == B_ASTOREGLOBAL ? VM_globals[arrayVar] :VM_vars[arrayVar];
				for(let k=0;k<ndims-1;k++)
				{
					if(indexes[k]>=0 && indexes[k] < tempArr.length)
						tempArr = tempArr[indexes[k]];
					else
					{
						VMerro("a matriz tem tamanho '"+tempArr.length+"' na dimensão '"+k+"' mas tentou acessar a posição '"+indexes[k]+"'");
						return STATE_ENDED;
					}
				}
				
				if(indexes[ndims-1]>=0 && indexes[ndims-1] < tempArr.length)
					tempArr[indexes[ndims-1]] = VM_stack[--VM_si];
				else
				{
					VMerro("O vetor vai de 0 à "+(tempArr.length-1)+" mas tentou acessar a posição '"+indexes[ndims-1]+"'");
					return STATE_ENDED;
				}
			}
			break;
			case B_ALOADGLOBAL:
			case B_ALOAD:
			{
				let arrayVar = VM_code[VM_i++];
				let ndims = VM_code[VM_i++];
				
				let indexes = [];
				for(let k=0;k<ndims;k++)
				{
					indexes.push(VM_stack[--VM_si]);
				}
				indexes.reverse();
				
				let tempArr = code == B_ALOADGLOBAL ? VM_globals[arrayVar] :VM_vars[arrayVar];
				for(let k=0;k<ndims-1;k++)
				{
					if(indexes[k]>=0 && indexes[k] < tempArr.length)
						tempArr = tempArr[indexes[k]];
					else
					{
						VMerro("a matriz tem tamanho '"+tempArr.length+"' na dimensão '"+k+"' mas tentou acessar a posição '"+indexes[k]+"'");
						return STATE_ENDED;
					}
				}
				
				if(indexes[ndims-1]>=0 && indexes[ndims-1] < tempArr.length)
					VM_stack[VM_si++] = tempArr[indexes[ndims-1]];
				else
				{
					VMerro("O vetor vai de 0 à "+(tempArr.length-1)+" mas tentou acessar a posição '"+indexes[ndims-1]+"'");
					return STATE_ENDED;
				}
			}
			break;
			
			case B_WRITE: 
				escreva(VM_stack[--VM_si]);
				return STATE_BREATHING; // para n travar tudo com muitos escrevas.
			case B_CLEAR:
				limpa();
				return STATE_BREATHING; // para n travar tudo com muitos escrevas.
			case B_WAITINPUT: 
				return STATE_WAITINGINPUT;
			case B_READ_INT:
			{
				let intRead = leia();
				if(!intRead || 0 === intRead.length)
				{
					VMerro("Deveria inserir um número inteiro, mas inseriu nada");
					return STATE_ENDED;
				}
				
				if(!/^[\+\-]?\d+$/.test(intRead)) // eslint-disable-line
				{
					VMerro("Deveria inserir um número inteiro, mas inseriu outro tipo");
					return STATE_ENDED;
				}
				
				VM_stack[VM_si++] = parseInt(intRead);
			}
			break;
			case B_READ_FLOAT:
			{
				let floatRead = leia();
				if(!floatRead || 0 === floatRead.length)
				{
					VMerro("Deveria inserir um número, mas inseriu nada");
					return STATE_ENDED;
				}
								
				let floatConverted = parseFloat(floatRead);
				if(isNaN(floatConverted) || !isFinite(floatConverted))
				{
					VMerro("Deveria inserir um número, mas inseriu outro tipo");
					return STATE_ENDED;
				}
				
				VM_stack[VM_si++] = floatConverted;
			}
			break;
			case B_READ_STRING:
				VM_stack[VM_si++] = leia();
			break;
			case B_READ_CHAR:
			{
				let charRead = leia();
				if(!charRead || 0 === charRead.length)
				{
					VMerro("Deveria inserir um caractere, mas inseriu nada");
					return STATE_ENDED;
				}
				
				VM_stack[VM_si++] = charRead[0];
			}
			break;
			case B_READ_BOOL:
			{
				let boolRead = leia();
				if(boolRead == "verdadeiro")
				VM_stack[VM_si++] = B_TRUE;
				else if(boolRead == "falso")
				VM_stack[VM_si++] = B_FALSE;
				else
				{
					VMerro("Deveria inserir verdadeiro ou falso, mas inseriu outro valor");
					return STATE_ENDED;
				}
			}
			break;
			default:
				VMerro("invalid bytecode:"+code);
				return STATE_ENDED;
		}
	}
	}
	catch(err) {
		console.log(err.stack);
		VMerro(err);
		return STATE_ENDED;
	}
}

export function VMtoString()
{
	let str = "";
	
	for(let i =9;i<VM_functions.length;i++)
	{
		let f = VM_functions[i];
		str+= i+": "+f.name+"\n";
		let lastLine = -1;
		for(let k =0;k<f.bytecode.length;k++)
		{
			let b = f.bytecode[k];
			let line =numberOfLinesUntil(getTokenIndex(k,i),VM_textInput);
			if(line == lastLine)
				str += "  \t"+k+":\t";
			else
				str += line+"\t"+k+":\t";
			str += bytecodeName(b);
			for(let o = 0;o<bytecodeArgs(b);o++)
			{
				k++;
				str += "\t"+f.bytecode[k];
			}
			str += "\n";
			lastLine = line;
		}
	}
	return str;
}
