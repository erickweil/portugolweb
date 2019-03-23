const B_TRUE = 0;
const B_FALSE = 1;

const B_PUSH = 1;
const B_POP = 2;

const B_ADD = 3;
const B_SUB = 4;
const B_MUL = 5;
const B_DIV = 6;
const B_REM = 7;

const B_iDIV = 8;  // integer div
const B_iREM = 9; // integer modulo

const B_GOTO = 13;
const B_IFEQ = 14;
const B_IFNE = 15;
const B_IFLT = 16;
const B_IFGE = 17;
const B_IFGT = 18;
const B_IFLE = 19;

const B_DUP = 20;
const B_INVOKE = 21;

const B_STORE = 22; // inteiro
const B_LOAD = 23;

const B_RET      = 24;
const B_RETVALUE = 25;

const B_SHL = 26;
const B_SHR = 27;
const B_XOR = 28;
const B_AND = 29; //bitwise
const B_OR = 30;  //bitwise

const B_IFCMPEQ = 31;
const B_IFCMPNE = 32;
const B_IFCMPLT = 33;
const B_IFCMPLE = 34;
const B_IFCMPGT = 35;
const B_IFCMPGE = 36;
const B_NEG = 37; // arithmetic negation
const B_NOT = 38; // bitwise negation
const B_NO = 39;  // logic negation

const B_STOREGLOBAL = 40;
const B_LOADGLOBAL = 41;

const B_F2I = 42; // float to int
//var B_I2F = 37; // int to float

const B_I2S = 43; // int to str
const B_F2S = 44; // float to str
const B_B2S = 45; // bool to str
const B_C2S = 46; // char to str

const B_SWAP = 47; // swap the elemtns of the stack

// não existem opcodes pro or e and logico.
//var B_LAND = 32; // logical or
//var B_LOR = 33; // logical or

// private
const B_WRITE = 100;
const B_WAITINPUT = 101;
const B_READ_INT = 102;
const B_READ_FLOAT = 103;
const B_READ_STRING = 104;
const B_READ_CHAR = 105;
const B_READ_BOOL = 106;
const B_CLEAR = 107;

function bytecodeName(c)
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
}
}

function bytecodeArgs(c)
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
	return 2;
}
}


var STATE_ENDED = 0;
var STATE_WAITINGINPUT = 1;
var STATE_BREATHING = 2;
var STATE_PENDINGSTOP = 3;
var STATE_RUNNING = 4;

// frame locals
var VM_code = false;
var VM_i = 0;
var VM_stack = false; // o valor atual é o VM_si-1
var VM_si = 0; // stack i
var VM_vars = false;
var VM_funcIndex = 0;

// frame globals
var VM_frame = false;
var VM_globals = false;
var VM_functions = false;
var VM_saida = false;
var VM_saidaDiv = false;
var VM_textInput = false;
var VM_codeCount = 0;
var VM_codeMax = 100000;
var VM_escrevaCount = 0;
var VM_escrevaMax = 1000;

function escreva(txt)
{
	if(VM_escrevaCount > VM_escrevaMax)
	{
		VM_escrevaCount = 0;
		VM_saida = "<MAIS DE "+VM_escrevaMax+" ESCREVAS, REINICIANDO LOG...>\n";
	}
	VM_saida += txt;
	VM_saidaDiv.value = VM_saida;
	VM_saidaDiv.scrollTop = VM_saidaDiv.scrollHeight;
	VM_escrevaCount++;
}

function limpa()
{
	VM_saida = "";
	VM_saidaDiv.value = VM_saida;
	VM_saidaDiv.scrollTop = VM_saidaDiv.scrollHeight;
	VM_escrevaCount = 0;
}

function leia()
{
	var saidadiv = VM_saidaDiv.value;
	var entrada = saidadiv.substring(VM_saida.length,saidadiv.length);
	if(entrada.endsWith("\n"))
	{
		entrada = entrada.substring(0,entrada.length-1);
	}
	VM_saida = saidadiv;
	return entrada;
}

function getTokenIndex(bcIndex,funcIndex)
{
	var func = VM_functions[funcIndex];
	var indexKeys = Object.keys(func.bytecodeIndexes);
	if(!indexKeys) return 0;
	var tokenIndex = 0;
	for(var i =0;i<indexKeys.length;i++)
	{
		if(indexKeys[i] <= bcIndex)
		{
			tokenIndex = func.bytecodeIndexes[indexKeys[i]];
		}
	}
	return tokenIndex
}

function erro(msg)
{	
	enviarErro(VM_textInput,{index:0},msg);
}

function VMsetup(functions,globalCount,textInput,saida_div) 
{
	VM_functions = functions;
	VM_textInput = textInput;
	
	
	VM_saida = "";
	VM_saidaDiv = saida_div;
	
	VM_escrevaCount = 0;
	
	VM_frame = [];
	VM_globals = new Array(globalCount);
	
	for(var i=0;i<VM_functions.length;i++)
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
function VMrun()
{
	VM_codeCount = 0;
	while(true)
	{
		VM_codeCount++; // para parar o programa e atualizar a saida em loops muito demorados
		if(VM_codeCount > VM_codeMax) return STATE_BREATHING;
		//var code = this.next();
		var code = VM_code[VM_i++];
		
		
		switch(code)
		{
			case B_PUSH: VM_stack[VM_si++] = VM_code[VM_i++]; break;
			case B_POP: VM_si--; break;
			case B_DUP: VM_stack[VM_si] = VM_stack[VM_si-1]; VM_si++; break; // o valor atual é colocado na frente.
			case B_SWAP: 
				var v = VM_stack[VM_si-1];
				VM_stack[VM_si-1] = VM_stack[VM_si-2];
				VM_stack[VM_si-2] = v;
			break;
			case B_STORE: VM_vars[VM_code[VM_i++]] = VM_stack[--VM_si]; break;
			case B_LOAD: VM_stack[VM_si++] = VM_vars[VM_code[VM_i++]]; break;
			
			case B_STOREGLOBAL: VM_globals[VM_code[VM_i++]] = VM_stack[--VM_si]; break;
			case B_LOADGLOBAL: VM_stack[VM_si++] = VM_globals[VM_code[VM_i++]]; break;
			

			case B_ADD: VM_stack[VM_si-2] = VM_stack[VM_si-2]+VM_stack[VM_si-1]; VM_si--; break;
			case B_SUB: VM_stack[VM_si-2] = VM_stack[VM_si-2]-VM_stack[VM_si-1]; VM_si--; break;
			case B_MUL: VM_stack[VM_si-2] = VM_stack[VM_si-2]*VM_stack[VM_si-1]; VM_si--; break;
			case B_DIV: VM_stack[VM_si-2] = VM_stack[VM_si-2]/VM_stack[VM_si-1]; VM_si--; break;
			case B_REM: VM_stack[VM_si-2] = VM_stack[VM_si-2]%VM_stack[VM_si-1]; VM_si--; break;
			
			case B_iDIV: VM_stack[VM_si-2] = Math.trunc(VM_stack[VM_si-2]/VM_stack[VM_si-1]); VM_si--; break;
			case B_iREM: VM_stack[VM_si-2] = Math.trunc(VM_stack[VM_si-2]%VM_stack[VM_si-1]); VM_si--; break;
			
			case B_SHL: VM_stack[VM_si-2] = VM_stack[VM_si-2]>>VM_stack[VM_si-1]; VM_si--; break;
			case B_SHR: VM_stack[VM_si-2] = VM_stack[VM_si-2]<<VM_stack[VM_si-1]; VM_si--; break;
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
			
			
			case B_INVOKE: 
				// precisa criar um stackFrame
				var methIndex = VM_code[VM_i++];
				var methArgsN = VM_code[VM_i++];
				var methArgs = [];
				for(var i = 0;i<methArgsN; i++)
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
					erro("Function not found");
				}
				else
				{
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
					if(methArgs) for(var i=0;i<methArgs.length;i++)
					{
						VM_vars[i] = methArgs[i];
					}
					
				}
			break;
			
			case B_RET: // return; // sem valor
				
				if(VM_frame.length > 0)
				{
					var vI = VM_frame.length -1;
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
			break;
			
			case B_RETVALUE: // return <expr>; // com valor
				var v = VM_stack[--VM_si];
				if(VM_frame.length > 0)
				{
					var vI = VM_frame.length -1;
					VM_funcIndex = VM_frame[vI].funcIndex;
					VM_code = VM_functions[VM_funcIndex].bytecode;
					VM_i = VM_frame[vI].i;
					VM_stack = VM_frame[vI].stack;
					VM_si = VM_frame[vI].si;
					VM_vars = VM_frame[vI].vars;
					
					VM_frame.pop();
					//push 
					VM_stack[VM_si++] = v;
				}
				else
				{
					console.log("retornou:"+v);
					return STATE_ENDED;
				}
			break;
			
			


			case B_NEG: VM_stack[VM_si-1] = -VM_stack[VM_si-1]; break;
			case B_NOT: VM_stack[VM_si-1] = ~VM_stack[VM_si-1]; break;
			case B_NO:  VM_stack[VM_si-1] = (VM_stack[VM_si-1] == 0 ? 1 : 0); break;
			
			case B_F2I: VM_stack[VM_si-1] = Math.trunc(VM_stack[VM_si-1]); break;
			
			case B_I2S: VM_stack[VM_si-1] = VM_stack[VM_si-1].toLocaleString('fullwide', { useGrouping: false }); break;
			case B_F2S: 
				var strFloat = ""+VM_stack[VM_si-1];
				if(!strFloat.includes(".")) strFloat += ".0";
				VM_stack[VM_si-1] = strFloat;
			break;
			case B_B2S: VM_stack[VM_si-1] = (VM_stack[VM_si-1] == 0 ? "verdadeiro" : "falso"); break;
			
			case B_WRITE: 
				escreva(VM_stack[--VM_si]);
				return STATE_BREATHING; // para n travar tudo com muitos escrevas.
			case B_CLEAR:
				limpa();
				return STATE_BREATHING; // para n travar tudo com muitos escrevas.
			case B_WAITINPUT: 
				return STATE_WAITINGINPUT;
			case B_READ_INT:
				VM_stack[VM_si++] = parseInt(leia().trim());
			break;
			case B_READ_FLOAT:
				VM_stack[VM_si++] = parseFloat(leia().trim());
			break;
			case B_READ_STRING:
				VM_stack[VM_si++] = leia();
			break;
			case B_READ_CHAR:
				VM_stack[VM_si++] = leia()[0];
			break;
			case B_READ_BOOL:
				VM_stack[VM_si++] = leia().trim() == "verdadeiro";
			break;
			default:
				erro("invalid bytecode:"+code);
				return STATE_ENDED;
			break;
		}
	}
	
}

function VMtoString()
{
	var str = "";
	
	for(var i =8;i<VM_functions.length;i++)
	{
		var f = VM_functions[i];
		str+= i+": "+f.name+"\n";
		var lastLine = -1;
		for(var k =0;k<f.bytecode.length;k++)
		{
			var b = f.bytecode[k];
			var line =numberOfLinesUntil(getTokenIndex(k,i),VM_textInput);
			if(line == lastLine)
				str += "  \t"+k+":\t";
			else
				str += line+"\t"+k+":\t";
			str += bytecodeName(b);
			for(var o = 0;o<bytecodeArgs(b);o++)
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
