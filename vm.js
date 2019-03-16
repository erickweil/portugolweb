var B_TRUE = 0;
var B_FALSE = 1;

var B_PUSH = 1;
var B_POP = 2;
var B_ADD = 3;
var B_SUB = 4;
var B_MUL = 5;
var B_DIV = 6;
var B_REM = 7;

var B_GOTO = 8;
var B_IFEQ = 9;
var B_IFNE = 10;
var B_IFLT = 11;
var B_IFGE = 12;
var B_IFGT = 13;
var B_IFLE = 14;

var B_DUP = 15;
var B_INVOKE = 16;

var B_STORE = 17;
var B_LOAD = 18;

var B_RET      = 19;
var B_RETVALUE = 20;

var B_SHL = 21;
var B_SHR = 22;
var B_XOR = 23;
var B_AND = 24; //bitwise
var B_OR = 25;  //bitwise

var B_IFCMPEQ = 26;
var B_IFCMPNE = 27;
var B_IFCMPLT = 28;
var B_IFCMPLE = 29;
var B_IFCMPGT = 30;
var B_IFCMPGE = 31;
var B_NEG = 32; // arithmetic negation
var B_NOT = 33; // bitwise negation

var B_STOREGLOBAL = 34;
var B_LOADGLOBAL = 35;

var B_F2I = 36; // float to int
//var B_I2F = 37; // int to float

var B_I2S = 37; // int to str
var B_F2S = 38; // float to str
var B_B2S = 39; // bool to str
var B_C2S = 40; // char to str

var B_SWAP = 41; // swap the elemtns of the stack

// não existem opcodes pro or e and logico.
//var B_LAND = 32; // logical or
//var B_LOR = 33; // logical or

// private
var B_WRITE = 100;
var B_WAITINPUT = 101;
var B_READ_INT = 102;
var B_READ_FLOAT = 103;
var B_READ_STRING = 104;
var B_READ_CHAR = 105;
var B_READ_BOOL = 106;

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
	return 0;
case B_INVOKE : 
	return 2;
}
}

var STATE_ENDED = 0;
var STATE_WAITINGINPUT = 1;

class StackFrame{
	constructor(parentFrame, globalVars,functionIndex, nVars, args) {
		this.parentFrame = parentFrame;
		this.globalVars = globalVars;
		this.functionIndex = functionIndex;
		this.vars = new Array(nVars);
		if(args) for(var i=0;i<args.length;i++)
		{
			this.setVar(i,args[i]);
		}
		this.stack = [];
		this.index = 0;
	}
	
	push(v)
	{
		this.stack.push(v);
	}
	
	pop()
	{
		return this.stack.pop();
	}
	
	setVar(i,v)
	{
		this.vars[i] = v;
	}
	
	getVar(i)
	{
		return this.vars[i];
	}
	
	setGlobal(i,v)
	{
		this.globalVars[i] = v;
	}
	
	getGlobal(i)
	{
		return this.globalVars[i];
	}
}

class Vm {
    constructor(functions,textInput,saida_div) {
		this.functions = functions;
		this.textInput = textInput;
		
		
		this.saida = "";
		this.saida_div = saida_div;
		
		for(var i=0;i<this.functions.length;i++)
		{
			if(this.functions[i].name == "#globalInit"){
				this.frame = new StackFrame(false,new Array(100),i,100); // depois tem 	que ver para ter o numero certo de variaveis
				break;
			}
		}
		
	}
	
	toString()
	{
		var str = "";
		
		for(var i =8;i<this.functions.length;i++)
		{
			var f = this.functions[i];
			str+= i+": "+f.name+"\n";
			var lastLine = -1;
			for(var k =0;k<f.bytecode.length;k++)
			{
				var b = f.bytecode[k];
				var line =numberOfLinesUntil(this.getTokenIndex(k,i),this.textInput);
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
	
	getTokenIndex(bcIndex,funcIndex)
	{
		var func = this.functions[funcIndex];
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
	
	erro(msg)
	{	
		enviarErro(this.textInput,{index:this.getTokenIndex(this.frame.index,this.frame.functionIndex)},msg);
	}

	escreva(txt)
	{
		this.saida += txt;
		this.saida_div.value = this.saida;
	}
	
	leia()
	{
		var saidadiv = this.saida_div.value;
		var entrada = saidadiv.substring(this.saida.length,saidadiv.length);
		if(entrada.endsWith("\n"))
		{
			entrada = entrada.substring(0,entrada.length-1);
		}
		this.saida = saidadiv;
		return entrada;
	}
	
	next()
	{
		var code = this.functions[this.frame.functionIndex].bytecode[this.frame.index];
		this.frame.index += 1;
		return code;
	}
	
	next2()
	{
		var code = this.functions[this.frame.functionIndex].bytecode[this.frame.index+1];
		this.frame.index += 2;
		return code;
	}
	
	run()
	{
		while(true)
		{
			/*if(
				this.frame.funcIndex < 0
			|| !this.functions[this.frame.functionIndex] 
			|| !this.functions[this.frame.functionIndex].bytecode 
			|| this.frame.index >= this.functions[this.frame.functionIndex].bytecode.length)
			{
				if(this.frame.parentFrame)
				{
					this.frame = this.frame.parentFrame;
				}
				else
				{
					return;
				}
			}*/
			
			
			var code = this.next();
			/*while(!code)
			{
				if(this.frame.parentFrame)
				{
					this.frame = this.frame.parentFrame;
					var code = this.next();
				}
				else
				{
					return;
				}
			}*/
			if(!code) code = B_RET;
			switch(code)
			{
				case B_PUSH: this.frame.push(this.next()); break;
				case B_POP: this.frame.pop(); break;
				case B_DUP: var v = this.frame.pop(); this.frame.push(v); this.frame.push(v); break;
				case B_SWAP: 
					var va = this.frame.pop();
					var vb = this.frame.pop();
					this.frame.push(va);
					this.frame.push(vb);
				break;
				
				case B_STORE: this.frame.setVar(this.next(),this.frame.pop()); break;
				case B_LOAD: this.frame.push(this.frame.getVar(this.next())); break;
				
				case B_STOREGLOBAL: this.frame.setGlobal(this.next(),this.frame.pop()); break;
				case B_LOADGLOBAL: this.frame.push(this.frame.getGlobal(this.next())); break;
				
				case B_ADD:
				case B_SUB:
				case B_MUL:
				case B_DIV:
				case B_REM:
				case B_SHL:
				case B_SHR:
				case B_XOR:
				case B_AND:
				case B_OR:
				case B_IFCMPEQ:
				case B_IFCMPNE:
				case B_IFCMPLT:
				case B_IFCMPLE:
				case B_IFCMPGT:
				case B_IFCMPGE:
					var vb = this.frame.pop();
					var va = this.frame.pop();
					switch(code)
					{
						case B_ADD: this.frame.push(va+vb); break;
						case B_SUB: this.frame.push(va-vb); break;
						case B_MUL: this.frame.push(va*vb); break;
						case B_DIV: this.frame.push(va/vb); break;
						case B_REM: this.frame.push(va%vb); break;
						
						case B_SHL: this.frame.push(va>>vb); break;
						case B_SHR: this.frame.push(va<<vb); break;
						case B_XOR: this.frame.push(va^vb); break;
						case B_AND: this.frame.push(va&vb); break;
						case B_OR:  this.frame.push(va|vb); break;
						
						case B_IFCMPEQ: this.frame.index = (va == vb ? this.next() : this.frame.index+1); break;
						case B_IFCMPNE: this.frame.index = (va != vb ? this.next() : this.frame.index+1); break;
						case B_IFCMPLT: this.frame.index = (va < vb ? this.next() : this.frame.index+1); break;
						case B_IFCMPLE: this.frame.index = (va <= vb ? this.next() : this.frame.index+1); break;
						case B_IFCMPGT: this.frame.index = (va > vb ? this.next() : this.frame.index+1); break;
						case B_IFCMPGE: this.frame.index = (va >= vb ? this.next() : this.frame.index+1); break;
					}
				break;
				
				case B_GOTO: this.frame.index = this.next(); break;
				case B_IFEQ: this.frame.index = (this.frame.pop() == 0 ? this.next() : this.frame.index+1); break;
				case B_IFNE: this.frame.index = (this.frame.pop() != 0 ? this.next() : this.frame.index+1); break;
				case B_IFLT: this.frame.index = (this.frame.pop() < 0 ? this.next() : this.frame.index+1); break;
				case B_IFGE: this.frame.index = (this.frame.pop() >= 0 ? this.next() : this.frame.index+1); break;
				case B_IFGT: this.frame.index = (this.frame.pop() > 0 ? this.next() : this.frame.index+1); break;
				case B_IFLE: this.frame.index = (this.frame.pop() <= 0 ? this.next() : this.frame.index+1); break;
				
				
				case B_INVOKE: 
					// precisa criar um stackFrame
					var methIndex = this.next();
					var methArgsN = this.next();
					var methArgs = [];
					for(var i = 0;i<methArgsN; i++)
					{
						methArgs.push(this.frame.pop());
					}
					methArgs.reverse();
					if(
					this.frame.funcIndex < 0
					|| !this.functions[this.frame.functionIndex] 
					|| !this.functions[this.frame.functionIndex].bytecode 
					)
					{
						erro("Function not found");
					}
					else
					this.frame = new StackFrame(this.frame,this.frame.globalVars,methIndex,100,methArgs);
				break;
				
				case B_RET: // return; // sem valor
					if(this.frame.parentFrame)
					{
						this.frame = this.frame.parentFrame;
					}
					else
					{
						return STATE_ENDED;
					}
				break;
				
				case B_RETVALUE: // return <expr>; // com valor
					var v = this.frame.pop();
					if(this.frame.parentFrame)
					{
						this.frame = this.frame.parentFrame;
						this.frame.push(v);
					}
					else
					{
						console.log("retornou:"+v);
						return STATE_ENDED;
					}
				break;
				
				


				case B_NEG: this.frame.push(-this.frame.pop()); break;
				case B_NOT: this.frame.push(~this.frame.pop()); break;
				
				case B_F2I: this.frame.push(Math.trunc(this.frame.pop())); break;
				
				case B_I2S: this.frame.push(""+this.frame.pop()); break;
				case B_F2S: 
					var strFloat = ""+this.frame.pop();
					if(!strFloat.includes(".")) strFloat += ".0";
					this.frame.push(strFloat);
				break;
				case B_B2S: this.frame.push(this.frame.pop() == 0 ? "verdadeiro" : "falso"); break;
				
				case B_WRITE: 
					this.escreva(this.frame.pop());
				break;
				case B_WAITINPUT: 
					return STATE_WAITINGINPUT;
				break;
				case B_READ_INT:
					this.frame.push(parseInt(this.leia().trim()));
				break;
				case B_READ_FLOAT:
					this.frame.push(parseFloat(this.leia().trim()));
				break;
				case B_READ_STRING:
					this.frame.push(this.leia());
				break;
				case B_READ_CHAR:
					this.frame.push(this.leia()[0]);
				break;
				case B_READ_BOOL:
					this.frame.push(this.leia().trim() == "verdadeiro");
				break;
				default:
					this.erro("invalid bytecode:"+code);
				break;
			}
		}
	}
}