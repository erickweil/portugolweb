import { numberOfLinesUntil } from "../extras/extras.js";

export const decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  let element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

export function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function removeEscaping(tok,str,escaping)
{
	// this.erro(this.tokens[this.tokens.length-1],"o tipo caracter deve conter apenas uma letra ou número. mude para cadeia");
	let ret = "";
	for(let i=0;i<str.length;i++)
	{
		let c0 = str[i];
		
		if(c0 == "\\" && i < str.length-1)
		{
			let c1 = str[i+1];
			if(c1 == "\\") c0 = "\\";
			else if(c1 == "t") c0 = "\t";
			else if(c1 == "n") c0 = "\n";
			else if(c1 == escaping) c0 = escaping;
			else 
			{
				tok.erro(tok.tokens[tok.tokens.length-1],"Após inserir a barra invertida \\ você deve ter um desses: \\ (barra invertida), n (nova linha), t (tabulação), "+escaping+" (aspas)");
			}
			
			i++;
		}
		
		ret = ret+c0;
	}
	
	return ret;
}


export const separators = "\n\t +-*/%><!=&|^~;,.{}()[]:";
export const reserved_words =
[
"programa","funcao","inclua","biblioteca","e","ou","nao","se","senao","enquanto","faca","para","escolha","caso","contrario","pare","retorne","vazio","const"
];
export const type_words =
[
"inteiro","caracter","cadeia","real","logico"
];
export const separators_names =
[
"sep-ln","sep-tab","sep-space","sep-plus","sep-minus","sep-mul","sep-div","sep-rem","sep-gt","sep-lt","sep-not","sep-equals","sep-and","sep-or","sep-xor","sep-bnot",
"sep-semi","sep-colon","sep-dot","sep-bracesO","sep-bracesC","sep-parO","sep-parC","sep-squareO","sep-squareC"
];

export const separator_tokens =
[

// 0-25
"\n","\t"," ","+","-","*","/","%",">","<","!","=","&","|","^","~",";",",",".","{","}","(",")","[","]",":",
// 26-31
"","","","","","",
// 32-63
"+=","-=","*=","/=","%=",">>=",">>",">=","<<=","<<","<=","!=","==","e","&=","ou","|=","^=","~=","++","--","","+","-","-->","++","--","","","","",""
];


//var separatorsIgnore = "\n\r\t ";

// SEPARATOR 
const T_SEPARATOROFF = 0;
export function getSeparator(c)
{
	return separator_tokens[c-T_SEPARATOROFF];
}

export function getSeparatorCode(c)
{
	return T_SEPARATOROFF + separators.indexOf(c);
}
export const T_ln = 0;
export const T_tab = 1;
export const T_space = 2;

// ++ += +
export const T_autoinc = 51;
export const T_pre_autoinc = 57;
export const T_attrib_plus = 32;
export const T_unary_plus = 54;
export const T_plus = 3;

// --> -- -= -
export const T_arrow = 56;
export const T_autodec = 52;
export const T_pre_autodec = 58;
export const T_attrib_minus = 33;
export const T_unary_minus = 55;
export const T_minus = 4;

// *= *
export const T_attrib_mul = 34;
export const T_mul = 5;

// /= /
export const T_attrib_div = 35;
export const T_div = 6;

// %= %
export const T_attrib_rem = 36;
export const T_rem = 7;

// >>= >> >= >
export const T_attrib_shiftright = 37;
export const T_shiftright = 38;
export const T_ge = 39;
export const T_gt = 8;

// <<= << <= <
export const T_attrib_shiftleft = 40;
export const T_shiftleft = 41;
export const T_le = 42;
export const T_lt = 9;

// != !
export const T_notequals = 43;
export const T_not = 10;


// == =
export const T_equals = 44;
export const T_attrib = 11;

// && &= &
export const T_and = 45;
export const T_attrib_bitand = 46;
export const T_bitand = 12;

// || |= |
export const T_or = 47;
export const T_attrib_bitor = 48;
export const T_bitor = 13;

// ^= ^
export const T_attrib_xor = 49;
export const T_xor = 14;

// ~= ~
export const T_attrib_bitnot = 50;
export const T_bitnot = 15;

export const T_semi = 16;
export const T_comma = 17;
export const T_dot = 18;
export const T_bracesO = 19;
export const T_bracesC = 20;
export const T_parO = 21;
export const T_parC = 22;
export const T_squareO = 23;
export const T_squareC = 24;
export const T_colon = 25;//53;



export function isDualOperator(code)
{
	return (code == T_plus || code == T_minus) || (isOperator(code) && !canBePreUnary(code) && !isPostUnary(code));
}

export function isOperator(code)
{
	switch(code)
	{
		case T_autoinc:
		case T_attrib_plus:
		case T_unary_plus:
		case T_plus:
		case T_autodec:
		case T_attrib_minus:
		case T_unary_minus:
		case T_minus:
		case T_attrib_mul:
		case T_mul:
		case T_attrib_div:
		case T_div:
		case T_attrib_rem:
		case T_rem:
		case T_attrib_shiftright:
		case T_shiftright:
		case T_ge:
		case T_gt:
		case T_attrib_shiftleft:
		case T_shiftleft:
		case T_le:
		case T_lt:
		case T_notequals:
		case T_not:
		case T_equals:
		case T_attrib:
		case T_and:
		case T_attrib_bitand:
		case T_bitand:
		case T_or:
		case T_attrib_bitor:
		case T_bitor:
		case T_attrib_xor:
		case T_xor:
		case T_attrib_bitnot:
		case T_bitnot:
		return true;
		default: return false;
	}
}
export function isAttribOp(code)
{
	switch(code)
	{
		case T_attrib:
		case T_attrib_plus:
		case T_attrib_minus:
		case T_attrib_mul:
		case T_attrib_div:
		case T_attrib_rem:
		case T_attrib_shiftright:
		case T_attrib_shiftleft:
		case T_attrib_bitand:
		case T_attrib_bitor:
		case T_attrib_xor:
		case T_attrib_bitnot:
			return true;
		default: return false;
	}
}

export function getOpPrecedence(code) //Larger number means higher precedence.
{
	switch(code)
	{
		case T_autoinc: 
		case T_autodec:
			return 14;
		
		case T_pre_autoinc: 
		case T_pre_autodec:
		case T_unary_plus:
		case T_unary_minus:
		case T_not:
		case T_bitnot:
			return 13;
		
		case T_mul:
		case T_div:
		case T_rem:
			return 12;
			
		case T_plus:
		case T_minus:
			return 11;
			
		case T_shiftright:
		case T_shiftleft:
			return 10;
		
		case T_gt:		
		case T_ge:
		case T_lt:
		case T_le:
			return 9;
			
		case T_notequals:
		case T_equals:
			return 8;
		
		case T_bitand:
			return 7;
		case T_xor:
			return 6;
		case T_bitor:
			return 5;
		
		case T_and:
			return 4;
		case T_or:
			return 3;
		
		case T_attrib_plus:
		case T_attrib_minus:
		case T_attrib_mul:
		case T_attrib_div:
		case T_attrib_rem:
		case T_attrib_shiftright:
		case T_attrib_shiftleft:
		case T_attrib:
		case T_attrib_bitand:
		case T_attrib_bitor:
		case T_attrib_xor:
		case T_attrib_bitnot:
			return 1;
		default:
			return 15;
	}
}

export function canBePreUnary(code)
{
	switch(code)
	{
		case T_autoinc:
		case T_autodec:
		case T_pre_autoinc:
		case T_pre_autodec:
		case T_unary_plus:
		case T_unary_minus:
		case T_plus:
		case T_minus:
		case T_not:
		case T_bitnot:return true;
		default: return false;
	}
}

export function isPostUnary(code)
{
	switch(code)
	{
		case T_autoinc:
		case T_autodec: return true;
		default: return false;
	}
}

export function isSeparator(code)
{
	return code >= T_ln && code < T_word;
}


export const T_word = 63;
//var RESERVED_WORD = 3;
const T_RESERVEDOFF = 64;
export function getReservedWordCode(c)
{
	return T_RESERVEDOFF + reserved_words.indexOf(c);
}
export const T_programa = 64;
export const T_funcao = 65;
export const T_inclua = 66;
export const T_biblioteca = 67;
//var T_e = 68; deprecated
//var T_ou = 69; deprecated
//var T_nao = 70; deprecated
export const T_se = 71;
export const T_senao = 72;
export const T_enquanto = 73;
export const T_faca = 74;
export const T_para = 75;
export const T_escolha = 76;
export const T_caso = 77;
export const T_contrario = 78;
export const T_pare = 79;
export const T_retorne = 80;
export const T_vazio = 81;
export const T_const = 82;
//var TYPE_WORD = 4;
const T_TYPEOFF = 96;
export function getTypeWordCode(c)
{
	return T_TYPEOFF + type_words.indexOf(c);
}

export const T_inteiro = 96;
export const T_caracter = 97;
export const T_cadeia = 98;
export const T_real = 99;
export const T_logico = 100;

// VETOR
export const T_Vinteiro = 101;
export const T_Vcaracter = 102;
export const T_Vcadeia = 103;
export const T_Vreal = 104;
export const T_Vlogico = 105;

// MATRIZ
export const T_Minteiro = 106;
export const T_Mcaracter = 107;
export const T_Mcadeia = 108;
export const T_Mreal = 109;
export const T_Mlogico = 110;

export const T_Vetor = 111; // qualquer vetor
export const T_Matriz = 112; // qualquer matriz

export function convertArrayType(c)
{
	return c + 5;
}

export function convertMatrixType(c)
{
	return c + 10;
}

export function convertArrayDimsType(c,dims)
{
	if(dims == 1)
	return c + 5;
	else
	return c + 10;
}

export function isTypeWord(code)
{
	return code >= T_inteiro && code <= T_logico;
}

export function getTypeWord(code)
{
	switch(code)
	{
		case T_inteiro: return "inteiro";
		case T_caracter: return "caracter";
		case T_cadeia: return "cadeia";
		case T_real: return "real";
		case T_logico: return "logico";
		case T_vazio: return "vazio";
		case T_Vetor: return "vetor";
		case T_Matriz: return "matriz";
		
		
		case T_Vinteiro: return "inteiro[]";
		case T_Vcaracter: return "caracter[]";
		case T_Vcadeia: return "cadeia[]";
		case T_Vreal: return "real[]";
		case T_Vlogico: return "logico[]";
		
		
		case T_Minteiro: return "inteiro[][]";
		case T_Mcaracter: return "caracter[][]";
		case T_Mcadeia: return "cadeia[][]";
		case T_Mreal: return "real[][]";
		case T_Mlogico: return "logico[][]";
		default: return code;
	}
}

export const T_linecomment = 128;
export const T_blockcomment = 129;
export const T_inteiroLiteral = 130;
export const T_realLiteral = 131;
export const T_cadeiaLiteral = 132;
export const T_caracterLiteral = 133;
export const T_logicoLiteral = 134;
export function isLiteral(code)
{
	return code >= T_inteiroLiteral && code <= T_logicoLiteral;
}

// Quem usa isso?
export function isAnyWord(code)
{
	return code >= T_word && code <= T_logico;
}

export function stringEscapeSpecials(str)
{
	str = str.replace(/\\/g,"\\"+"\\");
	str = str.replace(/\n/g,"\\"+"n");
	str = str.replace(/\t/g,"\\"+"t");
	str = str.replace(/\"/g,"\\"+"\"");
	str = str.replace(/\'/g,"\\"+"'");
	
	return str;
}

export class Tokenizer {
    constructor(input,erroCallback) {
		// Remove os \r\n e substitui por \n
		input = input.replace(/\r\n/g,"\n");

		this.input = input;
		this.enviarErro = erroCallback;
		this.tokens = [];
    }
	
	erro(token,msg)
	{
		if(this.enviarErro)
		this.enviarErro(this.input,token,msg,"sintatico");
		else
		console.log("ERRO NO TOKENIZER:",msg);
	}
	
	getRelevantTokens()
	{
		let ret = [];
		for(let i =0; i< this.tokens.length;i++)
		{
			switch(this.tokens[i].id)
			{
				case T_ln:
				case T_space:
				case T_tab:
				case T_linecomment:
				case T_blockcomment:
				break;
				default:
					ret.push(this.tokens[i]);
				break;
			}
		}
		return ret;
	}
	
	getTokenIndexAt(index)
	{
		let last = 0;
		for(let i =0; i< this.tokens.length;i++)
		{
			if(this.tokens[i].index > index)
			{
				return last;
			}
			
			last = i;
		}
		return last;
	}
	
	getTokenIndexAtRowCol(row,col)
	{
		let last = 0;
		let firstIndex = -1;
		for(let i =0; i< this.tokens.length;i++)
		{
			let tokenindex = this.tokens[i].index;
			let tokenrow = numberOfLinesUntil(tokenindex,this.input);
			
			if(tokenrow == row && firstIndex == -1)
			{
				firstIndex = tokenindex;
			}
			
			if(firstIndex != -1)
			{
				if(tokenindex - firstIndex > col)
				{
					return last;
				}
				
				last = i;
			}
		}
		return last;
	}
	
	
	// Adding a method to the constructor
	tokenize()
	{
		let start_off = 0;
		
		for(let i =0; i< this.input.length;i++)
		{
			let c = this.input.charAt(i);
			if( c == '"' || c == "'") // texto
			{
				let k = i+1;
				for(; k< this.input.length;k++)
				{
					let kc = this.input.charAt(k);
					if(kc == "\\") k++;
					else if( kc == c || kc == "\n" )
					{
						if(kc == "\n")
						{
							this.erro(this.tokens[this.tokens.length-1],"não fechou as aspas");
						}
						break;
					}
				}
				let str = this.input.substring(i+1,k); // remove as aspas
				
				//str = str.replace(/\\n/g,'\n');
				//str = str.replace(/\\t/g,'\t');
				//str = str.replace(/\\\\/g,'\\');
				//str = str.replace(/\\"/g,'"');
				//str = str.replace(/\\'/g,"'");
				
				str = removeEscaping(this,str,c);
				
				if(c == '"')
				{
					this.tokens.push({id:T_cadeiaLiteral,index:i,txt:str});
				}
				else if(c == "'")
				{
					if(str.length != 1)
					{
						this.erro(this.tokens[this.tokens.length-1],"o tipo caracter deve conter apenas uma letra ou número. mude para cadeia");
						if(str.length > 1) str = str.charAt(0);
					}
					this.tokens.push({id:T_caracterLiteral,index:i,txt:str});
				}
				i = k; // vai fazer +1 no for
				start_off = i+1;
			}
			else if( c == '/' && this.input.charAt(i+1) == "/") // comentario de uma linha
			{
				let k = i+1;
				for(; k< this.input.length;k++)
				{
					let kc = this.input.charAt(k);
					if( kc == "\n" )
					{
						break;
					}
				}
				let str = this.input.substring(i,k);
				this.tokens.push({id:T_linecomment,index:i,txt:str});
				i = k-1; // vai fazer +1 no for
				start_off = i+1;
			}
			else if( c == '/' && this.input.charAt(i+1) == "*") // comentario de bloco
			{
				let k = i+1;
				for(; k< this.input.length;k++)
				{
					let kc = this.input.charAt(k);
					if( kc == "/" && this.input.charAt(k-1) == "*" )
					{
						break;
					}
				}
				let str = this.input.substring(i,k+1);
				this.tokens.push({id:T_blockcomment,index:i,txt:str});
				i = k; // vai fazer +1 no for
				start_off = i+1;
			}
			else if(c >= '0' && c <= '9') // número
			{
				//if( separators.indexOf(this.input.charAt(i-1)) > -1) // antes do número é um separador
				//{
				
				let k = i+1;
				for(; k< this.input.length;k++)
				{
					let kc = this.input.charAt(k);
					//if( separators.indexOf(kc) > -1 && kc != '.' &&  kc!= 'X' && kc!='x' && kc!='b' && kc!='B')
					if(!(/^[0-9A-Fa-f\.XxBb]$/.test(kc)))
					{
						break;
					}
				}
				let str = this.input.substring(i,k);
				if(!str.includes("."))
					this.tokens.push({id:T_inteiroLiteral,index:i,txt:str});
				else
					this.tokens.push({id:T_realLiteral,index:i,txt:str});
				i = k-1; // vai fazer +1 no for
				start_off = i+1;
				
				//}
				// nao tinha que ter um else aqui?
			}
			else if(/^[a-zA-Z_\$]$/.test(c)) // palavra
			{
				let palavraIndex = i;
				let k = i+1;
				for(; k< this.input.length;k++)
				{
					let kc = this.input.charAt(k);
					if(!(/^[a-zA-Z0-9_\$]$/.test(kc)))
					{
						break;
					}
				}
				let word = this.input.substring(i,k);// isso não iria incluir um caractere a mais??
				
				i = k-1; // vai fazer +1 no for
				start_off = i+1;
				
				//word = "<span class='w-"+word+"'>"+word+"</span>"; 
				//var sep_c = separators_names[separators.indexOf(c)]
				//var sep = "<span class='"+sep_c+"'>"+c+"</span>"; 
				//string += word;
				//string += sep;
				
				// palavra
				if( reserved_words.indexOf(word) > -1) // palavra reservada
				{
					if(word == "nao")
					{
						this.tokens.push({id:T_not,index:palavraIndex,txt:word});
					}
					else if(word == "ou")
					{
						this.tokens.push({id:T_or,index:palavraIndex,txt:word});
					}
					else if(word == "e")
					{
						this.tokens.push({id:T_and,index:palavraIndex,txt:word});
					}
					else
					{
						this.tokens.push({id:getReservedWordCode(word),index:palavraIndex,txt:word});
					}
				}
				else if( type_words.indexOf(word) > -1) // tipo
				{
					this.tokens.push({id:getTypeWordCode(word),index:palavraIndex,txt:word});
				}
				else if(word == "verdadeiro" || word == "falso")
				{
					this.tokens.push({id:T_logicoLiteral,index:palavraIndex,txt:word});
				}
				else
				{
					this.tokens.push({id:T_word,index:palavraIndex,txt:word});
				}
				

			}
			else if( separators.indexOf(c) > -1) // c é um separador
			{
				
				//if( separatorsIgnore.indexOf(c) == -1) // c é um separador que deve ser ignorado
				//{
					let sepOff = 1;
					let t0 = getSeparatorCode(c);
					let t1 = this.input.length > i+1 ? getSeparatorCode(this.input.charAt(i+1)) : -1;
					let t2 = this.input.length > i+2 ? getSeparatorCode(this.input.charAt(i+2)) : -1;
					let t3 = this.input.length > i+3 ? getSeparatorCode(this.input.charAt(i+3)) : -1;
					
					if(t0 == T_plus && t1 == T_plus)
						{t0 = T_autoinc; sepOff = 2;}
					else if(t0 == T_plus && t1 == T_attrib)
						{t0 = T_attrib_plus; sepOff = 2;}
						
					// --> -- -= -
					if(t0 == T_minus && t1 == T_minus && t2 == T_gt)
						{t0 = T_arrow; sepOff = 3;}
					else if(t0 == T_minus && t1 == T_minus)
						{t0 = T_autodec; sepOff = 2;}
					else if(t0 == T_minus && t1 == T_attrib)
						{t0 = T_attrib_minus; sepOff = 2;}	
						
					if(t0 == T_mul && t1 == T_attrib)
						{t0 = T_attrib_mul; sepOff = 2;}
					if(t0 == T_div && t1 == T_attrib)
						{t0 = T_attrib_div; sepOff = 2;}
					if(t0 == T_rem && t1 == T_attrib)
						{t0 = T_attrib_rem; sepOff = 2;}
						
					// >>= >> >= >
					if(t0 == T_gt && t1 == T_gt && t2 == T_attrib)
						{t0 = T_attrib_shiftright; sepOff = 3;}
					else if(t0 == T_gt && t1 == T_gt)
						{t0 = T_shiftright; sepOff = 2;}
					else if(t0 == T_gt && t1 == T_attrib)
						{t0 = T_ge; sepOff = 2;}
					
					// <<= << <= <
					if(t0 == T_lt && t1 == T_lt && t2 == T_attrib)
						{t0 = T_attrib_shiftleft; sepOff = 3;}
					else if(t0 == T_lt && t1 == T_lt)
						{t0 = T_shiftleft; sepOff = 2;}
					else if(t0 == T_lt && t1 == T_attrib)
						{t0 = T_le; sepOff = 2;}
						
					if(t0 == T_not && t1 == T_attrib)
						{t0 = T_notequals; sepOff = 2;}
					
					if(t0 == T_attrib && t1 == T_attrib)
						{t0 = T_equals; sepOff = 2;}
					
					// && &= &
					if(t0 == T_bitand && t1 == T_bitand)
						{t0 = T_and; sepOff = 2;}
					if(t0 == T_bitand && t1 == T_attrib)
						{t0 = T_attrib_bitand; sepOff = 2;}
						
					// || |= |
					if(t0 == T_bitor && t1 == T_bitor)
						{t0 = T_or; sepOff = 2;}
					if(t0 == T_bitor && t1 == T_attrib)
						{t0 = T_attrib_bitor; sepOff = 2;}
					
					if(t0 == T_xor && t1 == T_attrib)
						{t0 = T_attrib_xor; sepOff = 2;}
						
					if(t0 == T_bitnot && t1 == T_attrib)
						{t0 = T_attrib_bitnot; sepOff = 2;}
					
					this.tokens.push({id:t0,index:i,txt:this.input.substring(i,i+sepOff)});
					start_off = i+sepOff;
					i += sepOff -1; // vai fazer +1 no for
				//}
				//else
				//{
				//	start_off = i+1;
				//}
				
			}
			else
			{
				this.erro(this.tokens[this.tokens.length-1],"Remova o caracter '"+c+"', isso não deveria estar aqui");
			}
		}
		return this.tokens;
	}
	
	formatHTML()
	{
		let lnCount = 1;
		let string = "<span class='code-ln' id='ln"+lnCount+"'><span class='ln-n'>"+lnCount+"</span>";
		for(let i =0; i< this.tokens.length;i++)
		{
			let t = this.tokens[i];
			switch(t.id)
			{
				case T_ln:
					lnCount++;
					string += "\n</span><span class='code-ln' id='ln"+lnCount+"'><span class='ln-n'>"+lnCount+"</span>";
				break;
				case T_cadeiaLiteral:
					string += "<span class='string-literal'>\""+t.txt+"\"</span>"; 
				break;
				case T_caracterLiteral:
					string += "<span class='string-literal'>'"+t.txt+"'</span>"; 
				break;
				case T_tab:
				case T_space:
					string += t.txt;
				break;
				case T_linecomment:
					string += "<span class='comment-line'>"+t.txt+"</span>"; 
				break;
				case T_blockcomment:
				{
					let num_Lines = (t.txt.match(/\r?\n/g) || '').length;
					lnCount += num_Lines;
					string += "<span class='comment-line'>"+t.txt+"</span>"; 
				}
				break;
				case T_inteiroLiteral:
				case T_realLiteral:
					string += "<span class='numeric-literal'>"+t.txt+"</span>"; 
				break;
				default:
					if(isAnyWord(t.id))
					{
						string += "<span class='w-"+t.txt+"'>"+t.txt+"</span>"; 
					}
					else if(isSeparator(t.id))
					{
						let sep_c = separators_names[separators.indexOf(t.txt)];
						string += "<span class='"+sep_c+"'>"+t.txt+"</span>"; 
					}
					else
					{
						string += t.txt; 
					}
				break;
			}
		}
		return string;
	}
}

// deprecated
function token_replace2(input)
{
	let start_off = 0;
	let string = "";
	for(let i =0; i< input.length;i++)
	{
		let c = input.charAt(i);
		if( c == '"' || c == "'")
		{
			let k = i+1;
			for(; k< input.length;k++)
			{
				let kc = input.charAt(k);
				if(kc == "\\") k++;
				else if( kc == c || kc == "\n" )
				{
					break;
				}
			}
			let str = input.substring(i,k+1);
			let word = "<span class='string-literal'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if( c == '/' && input.charAt(i+1) == "/")
		{
			let k = i+1;
			for(; k< input.length;k++)
			{
				let kc = input.charAt(k);
				if( kc == "\n" )
				{
					break;
				}
			}
			let str = input.substring(i,k+1);
			let word = "<span class='comment-line'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if( c == '/' && input.charAt(i+1) == "*")
		{
			let k = i+1;
			for(; k< input.length;k++)
			{
				let kc = input.charAt(k);
				if( kc == "/" && input.charAt(k-1) == "*" )
				{
					break;
				}
			}
			let str = input.substring(i,k+1);
			let word = "<span class='comment-line'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if(c >= '0' && c <= '9')
		{
			if( separators.indexOf(input.charAt(i-1)) > -1) // antes do nÃºmero Ã© um separador
			{
			let k = i+1;
			for(; k< input.length;k++)
			{
				let kc = input.charAt(k);
				if( separators.indexOf(kc) > -1 && kc != '.' &&  kc!= 'X' && kc!='x' && kc!='b' && kc!='B')
				{
					break;
				}
			}
			let str = input.substring(i,k);
			let word = "<span class='numeric-literal'>"+str+"</span>"; 
			string += word;
			i = k-1;
			start_off = i+1;
			}
		}
		else if( separators.indexOf(c) > -1) // c Ã© um separador
		{
			if(i - start_off > 0)
			{
				let word = input.substring(start_off,i);
				//var begin = input.substring(0,start_off-1);
				//var end = input.substring(i,input.length);
				if( !(separators.indexOf(word) > -1)) // n Ã© um separador
				{
					word = "<span class='w-"+word+"'>"+word+"</span>"; 
					let sep_c = separators_names[separators.indexOf(c)];
					let sep = "<span class='"+sep_c+"'>"+c+"</span>"; 
					string += word;
					string += sep;
					
					start_off = i+1;
				}
				else
				{
					let sep_c = separators_names[separators.indexOf(word)];
					let sep = "<span class='"+sep_c+"'>"+word+"</span>"; 
					string += sep;
					start_off = i+1;
				}
			}
			else
			{
				let sep_c = separators_names[separators.indexOf(c)];
				let sep = "<span class='"+sep_c+"'>"+c+"</span>"; 
				string += sep;
				start_off = i+1;
			}
		}
	}
	return string;
}