var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

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

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var separators = "\n\t +-*/%><!=&|^~;,.{}()[]:";
var reserved_words =
[
"programa","funcao","inclua","biblioteca","e","ou","nao","se","senao","enquanto","faca","para","escolha","caso","contrario","pare","retorne","vazio","const"
];
var type_words =
[
"inteiro","caracter","cadeia","real","logico"
];
var separators_names =
[
"sep-ln","sep-tab","sep-space","sep-plus","sep-minus","sep-mul","sep-div","sep-rem","sep-gt","sep-lt","sep-not","sep-equals","sep-and","sep-or","sep-xor","sep-bnot",
"sep-semi","sep-colon","sep-dot","sep-bracesO","sep-bracesC","sep-parO","sep-parC","sep-squareO","sep-squareC"
];


//var separatorsIgnore = "\n\r\t ";

// SEPARATOR 
var T_SEPARATOROFF = 0;
function getSeparatorCode(c)
{
	return T_SEPARATOROFF + separators.indexOf(c);
}
var T_ln = 0;
var T_tab = 1;
var T_space = 2;

// ++ += +
var T_autoinc = 51;
var T_pre_autoinc = 57;
var T_attrib_plus = 32;
var T_unary_plus = 54;
var T_plus = 3;

// --> -- -= -
var T_arrow = 56;
var T_autodec = 52;
var T_pre_autodec = 58;
var T_attrib_minus = 33;
var T_unary_minus = 55;
var T_minus = 4;

// *= *
var T_attrib_mul = 34;
var T_mul = 5;

// /= /
var T_attrib_div = 35;
var T_div = 6;

// %= %
var T_attrib_rem = 36;
var T_rem = 7;

// >>= >> >= >
var T_attrib_shiftright = 37;
var T_shiftright = 38;
var T_ge = 39;
var T_gt = 8;

// <<= << <= <
var T_attrib_shiftleft = 40;
var T_shiftleft = 41;
var T_le = 42;
var T_lt = 9;

// != !
var T_notequals = 43;
var T_not = 10;


// == =
var T_equals = 44;
var T_attrib = 11;

// && &= &
var T_and = 45;
var T_attrib_bitand = 46;
var T_bitand = 12;

// || |= |
var T_or = 47;
var T_attrib_bitor = 48;
var T_bitor = 13;

// ^= ^
var T_attrib_xor = 49;
var T_xor = 14;

// ~= ~
var T_attrib_bitnot = 50;
var T_bitnot = 15;

var T_semi = 16;
var T_comma = 17;
var T_dot = 18;
var T_bracesO = 19;
var T_bracesC = 20;
var T_parO = 21;
var T_parC = 22;
var T_squareO = 23;
var T_squareC = 24;
var T_colon = 25;//53;



function isDualOperator(code)
{
	return (code == T_plus || code == T_minus) || (isOperator(code) && !canBePreUnary(code) && !isPostUnary(code));
}

function isOperator(code)
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
function isAttribOp(code)
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

function getOpPrecedence(code) //Larger number means higher precedence.
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

function canBePreUnary(code)
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

function isPostUnary(code)
{
	switch(code)
	{
		case T_autoinc:
		case T_autodec: return true;
		default: return false;
	}
}

function isSeparator(code)
{
	return code >= T_ln && code < T_word;
}


var T_word = 63;
//var RESERVED_WORD = 3;
var T_RESERVEDOFF = 64;
function getReservedWordCode(c)
{
	return T_RESERVEDOFF + reserved_words.indexOf(c);
}
var T_programa = 64;
var T_funcao = 65;
var T_inclua = 66;
var T_biblioteca = 67;
//var T_e = 68; deprecated
//var T_ou = 69; deprecated
//var T_nao = 70; deprecated
var T_se = 71;
var T_senao = 72;
var T_enquanto = 73;
var T_faca = 74;
var T_para = 75;
var T_escolha = 76;
var T_caso = 77;
var T_contrario = 78;
var T_pare = 79;
var T_retorne = 80;
var T_vazio = 81;
var T_const = 82;
//var TYPE_WORD = 4;
var T_TYPEOFF = 96;
function getTypeWordCode(c)
{
	return T_TYPEOFF + type_words.indexOf(c);
}

var T_inteiro = 96;
var T_caracter = 97;
var T_cadeia = 98;
var T_real = 99;
var T_logico = 100;


function isTypeWord(code)
{
	return code >= T_inteiro && code <= T_logico;
}

function getTypeWord(code)
{
	switch(code)
	{
		case T_inteiro: return "inteiro";
		case T_caracter: return "caracter";
		case T_cadeia: return "cadeia";
		case T_real: return "real";
		case T_logico: return "logico";
		case T_squareO: return "vetor";
		default: return "seila";
	}
}

var T_linecomment = 128;
var T_blockcomment = 129;
var T_inteiroLiteral = 130;
var T_realLiteral = 131;
var T_cadeiaLiteral = 132;
var T_caracterLiteral = 133;
var T_logicoLiteral = 134;
function isLiteral(code)
{
	return code >= T_inteiroLiteral && code <= T_logicoLiteral;
}

function isAnyWord(code)
{
	return code >= T_word && code <= T_falso;
}

class Tokenizer {
    constructor(input) { // esse input não pode conter \r !!!
		this.input = input;
		this.tokens = [];
    }
	
	erro(token,msg)
	{
		enviarErro(this.input,token,msg);
	}
	
	getRelevantTokens()
	{
		var ret = [];
		for(var i =0; i< this.tokens.length;i++)
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
	
	// Adding a method to the constructor
	tokenize()
	{
		var start_off = 0
		
		for(var i =0; i< this.input.length;i++)
		{
			var c = this.input.charAt(i);
			if( c == '"' || c == "'") // texto
			{
				var k = i+1;
				for(; k< this.input.length;k++)
				{
					var kc = this.input.charAt(k);
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
				var str = this.input.substring(i+1,k); // remove as aspas
				str = str.replace(/\\n/g,'\n');
				str = str.replace(/\\t/g,'\t');
				str = str.replace(/\\\\/g,'\\');
				str = str.replace(/\\"/g,'"');
				str = str.replace(/\\'/g,"'");
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
				var k = i+1;
				for(; k< this.input.length;k++)
				{
					var kc = this.input.charAt(k);
					if( kc == "\n" )
					{
						break;
					}
				}
				var str = this.input.substring(i,k);
				this.tokens.push({id:T_linecomment,index:i,txt:str});
				i = k-1; // vai fazer +1 no for
				start_off = i+1;
			}
			else if( c == '/' && this.input.charAt(i+1) == "*") // comentario de bloco
			{
				var k = i+1;
				for(; k< this.input.length;k++)
				{
					var kc = this.input.charAt(k);
					if( kc == "/" && this.input.charAt(k-1) == "*" )
					{
						break;
					}
				}
				var str = this.input.substring(i,k+1);
				this.tokens.push({id:T_blockcomment,index:i,txt:str});
				i = k; // vai fazer +1 no for
				start_off = i+1;
			}
			else if(c >= '0' && c <= '9') // número
			{
				//if( separators.indexOf(this.input.charAt(i-1)) > -1) // antes do número é um separador
				//{
				
				var k = i+1;
				for(; k< this.input.length;k++)
				{
					var kc = this.input.charAt(k);
					//if( separators.indexOf(kc) > -1 && kc != '.' &&  kc!= 'X' && kc!='x' && kc!='b' && kc!='B')
					if(!(/^[0-9A-Fa-f\.XxBb]$/.test(kc)))
					{
						break;
					}
				}
				var str = this.input.substring(i,k);
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
				var palavraIndex = i;
				var k = i+1;
				for(; k< this.input.length;k++)
				{
					var kc = this.input.charAt(k);
					if(!(/^[a-zA-Z0-9_\$]$/.test(kc)))
					{
						break;
					}
				}
				var word = this.input.substring(i,k);// isso não iria incluir um caractere a mais??
				
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
					var sepOff = 1;
					var t0 = getSeparatorCode(c);
					var t1 = this.input.length > i+1 ? getSeparatorCode(this.input.charAt(i+1)) : -1;
					var t2 = this.input.length > i+2 ? getSeparatorCode(this.input.charAt(i+2)) : -1;
					var t3 = this.input.length > i+3 ? getSeparatorCode(this.input.charAt(i+3)) : -1;
					
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
		var lnCount = 1;
		var string = "<span class='code-ln' id='ln"+lnCount+"'><span class='ln-n'>"+lnCount+"</span>";
		for(var i =0; i< this.tokens.length;i++)
		{
			var t = this.tokens[i];
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
					var num_Lines = (t.txt.match(/\r?\n/g) || '').length;
					lnCount += num_Lines;
					string += "<span class='comment-line'>"+t.txt+"</span>"; 
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
						var sep_c = separators_names[separators.indexOf(t.txt)];
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

function token_replace2(input)
{
	var start_off = 0
	var string = "";
	for(var i =0; i< input.length;i++)
	{
		var c = input.charAt(i);
		if( c == '"' || c == "'")
		{
			var k = i+1;
			for(; k< input.length;k++)
			{
				var kc = input.charAt(k);
				if(kc == "\\") k++;
				else if( kc == c || kc == "\n" )
				{
					break;
				}
			}
			var str = input.substring(i,k+1);
			var word = "<span class='string-literal'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if( c == '/' && input.charAt(i+1) == "/")
		{
			var k = i+1;
			for(; k< input.length;k++)
			{
				var kc = input.charAt(k);
				if( kc == "\n" )
				{
					break;
				}
			}
			var str = input.substring(i,k+1);
			var word = "<span class='comment-line'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if( c == '/' && input.charAt(i+1) == "*")
		{
			var k = i+1;
			for(; k< input.length;k++)
			{
				var kc = input.charAt(k);
				if( kc == "/" && input.charAt(k-1) == "*" )
				{
					break;
				}
			}
			var str = input.substring(i,k+1);
			var word = "<span class='comment-line'>"+str+"</span>"; 
			string += word;
			i = k;
			start_off = i+1;
		}
		else if(c >= '0' && c <= '9')
		{
			if( separators.indexOf(input.charAt(i-1)) > -1) // antes do nÃºmero Ã© um separador
			{
			var k = i+1;
			for(; k< input.length;k++)
			{
				var kc = input.charAt(k);
				if( separators.indexOf(kc) > -1 && kc != '.' &&  kc!= 'X' && kc!='x' && kc!='b' && kc!='B')
				{
					break;
				}
			}
			var str = input.substring(i,k);
			var word = "<span class='numeric-literal'>"+str+"</span>"; 
			string += word;
			i = k-1;
			start_off = i+1;
			}
		}
		else if( separators.indexOf(c) > -1) // c Ã© um separador
		{
			if(i - start_off > 0)
			{
				var word = input.substring(start_off,i);
				//var begin = input.substring(0,start_off-1);
				//var end = input.substring(i,input.length);
				if( !(separators.indexOf(word) > -1)) // n Ã© um separador
				{
					word = "<span class='w-"+word+"'>"+word+"</span>"; 
					var sep_c = separators_names[separators.indexOf(c)]
					var sep = "<span class='"+sep_c+"'>"+c+"</span>"; 
					string += word;
					string += sep;
					
					start_off = i+1;
				}
				else
				{
					var sep_c = separators_names[separators.indexOf(word)]
					var sep = "<span class='"+sep_c+"'>"+word+"</span>"; 
					string += sep;
					start_off = i+1;
				}
			}
			else
			{
				var sep_c = separators_names[separators.indexOf(c)]
				var sep = "<span class='"+sep_c+"'>"+c+"</span>"; 
				string += sep;
				start_off = i+1;
			}
		}
	}
	return string;
}