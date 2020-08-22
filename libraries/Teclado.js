class Teclado {
	constructor(canvas) {
		
		this.canvas = canvas;
		
		this.TECLA_ENTER = "ENTER";
		this.TECLA_BACKSPACE = "BACK_SPACE";
		this.TECLA_TAB = "TAB";
		this.TECLA_CANCELAR = "CANCEL";
		this.TECLA_LIMPAR = "CLEAR";
		this.TECLA_SHIFT = "SHIFT";
		this.TECLA_CONTROL = "CONTROL";
		this.TECLA_ALT = "ALT";
		this.TECLA_PAUSE = "PAUSE";
		this.TECLA_CAPS_LOCK	= "CAPS_LOCK";
		this.TECLA_ESC = "ESCAPE";
		this.TECLA_ESPACO = " ";
		this.TECLA_PAGE_UP = "PAGEUP";
		this.TECLA_PAGE_DOWN	= "PAGEDOWN";
		this.TECLA_END = "END";
		this.TECLA_HOME = "HOME";
		this.TECLA_SETA_ESQUERDA = "ARROWLEFT";
		this.TECLA_SETA_ACIMA = "ARROWUP";
		this.TECLA_SETA_DIREITA = "ARROWRIGHT";
		this.TECLA_SETA_ABAIXO = "ARROWDOWN";
		this.TECLA_VIRGULA = ",";
		this.TECLA_MENOS = "-";
		this.TECLA_PONTO_FINAL = ".";
		this.TECLA_BARRA = "/";
		this.TECLA_0 = "0";
		this.TECLA_1 = "1";
		this.TECLA_2  = "2";
		this.TECLA_3 = "3";
		this.TECLA_4 = "4";
		this.TECLA_5 = "5";
		this.TECLA_6 = "6";
		this.TECLA_7 = "7";
		this.TECLA_8 = "8";
		this.TECLA_9 = "9";
		this.TECLA_PONTO_VIRGULA = ";";
		this.TECLA_IGUAL = "=";
		this.TECLA_A = "A";
		this.TECLA_B = "B";
		this.TECLA_C = "C";
		this.TECLA_D = "D";
		this.TECLA_E = "E";
		this.TECLA_F = "F";
		this.TECLA_G = "G";
		this.TECLA_H = "H";
		this.TECLA_I = "I";
		this.TECLA_J = "J";
		this.TECLA_K = "K";
		this.TECLA_L = "L";
		this.TECLA_M = "M";
		this.TECLA_N = "N";
		this.TECLA_O = "O";
		this.TECLA_P = "P";
		this.TECLA_Q = "Q";
		this.TECLA_R = "R";
		this.TECLA_S = "S";
		this.TECLA_T = "T";
		this.TECLA_U = "U";
		this.TECLA_V = "V";
		this.TECLA_W = "W";
		this.TECLA_X = "X";
		this.TECLA_Y = "Y";
		this.TECLA_Z = "Z";
		this.TECLA_ABRE_COLCHETES = "[";
		this.TECLA_BARRA_INVERTIDA = "\\";
		this.TECLA_FECHA_COLCHETES = "]";
		this.TECLA_0_NUM = "0";// nada de especial
		this.TECLA_1_NUM = "1";
		this.TECLA_2_NUM = "2";
		this.TECLA_3_NUM = "3";
		this.TECLA_4_NUM = "4";
		this.TECLA_5_NUM = "5";
		this.TECLA_6_NUM = "6";
		this.TECLA_7_NUM = "7";
		this.TECLA_8_NUM = "8";
		this.TECLA_9_NUM = "9";
		this.TECLA_MULTIPLICACAO = "*";
		this.TECLA_ADICAO = "+";
		this.TECLA_NUM_SEPARADOR_DECIMAL = ",";
		this.TECLA_SUBTRACAO	= "-";
		this.TECLA_DECIMAL = ".";
		this.TECLA_DIVISAO = "%";
		this.TECLA_DELETAR = "DELETE";
		this.TECLA_NUM_LOCK = "NUMLOCK";
		this.TECLA_SCROLL_LOCK = "SCROLLLOCK";
		this.TECLA_F1 = "F1";
		this.TECLA_F2 = "F2";
		this.TECLA_F3 = "F3";
		this.TECLA_F4 = "F4";
		this.TECLA_F5 = "F5";
		this.TECLA_F6 = "F6";
		this.TECLA_F7 = "F7";
		this.TECLA_F8 = "F8";
		this.TECLA_F9 = "F9";
		this.TECLA_F10 = "F10";
		this.TECLA_F11 = "F11";
		this.TECLA_F12 = "F12";
		this.TECLA_F13 = "F13";
		this.TECLA_F14 = "F14";
		this.TECLA_F15 = "F15";
		this.TECLA_F16 = "F16";
		this.TECLA_F17 = "F17";
		this.TECLA_F18 = "F18";
		this.TECLA_F19 = "F19";
		this.TECLA_F20 = "F20";
		this.TECLA_F21 = "F21";
		this.TECLA_F22 = "F22";
		this.TECLA_F23 = "F23";
		this.TECLA_F24 = "F24";
		this.TECLA_PRINTSCREEN = "PRINTSCREEN";
		this.TECLA_INSERT = "INSERT";
		this.TECLA_AJUDA = "HELP";
		
		
		this.members = {
			
		"TECLA_ENTER":{id:T_word,type:T_cadeia},
		"TECLA_BACKSPACE":{id:T_word,type:T_cadeia},
		"TECLA_TAB":{id:T_word,type:T_cadeia},
		"TECLA_CANCELAR":{id:T_word,type:T_cadeia},
		"TECLA_LIMPAR":{id:T_word,type:T_cadeia},
		"TECLA_SHIFT":{id:T_word,type:T_cadeia},
		"TECLA_CONTROL":{id:T_word,type:T_cadeia},
		"TECLA_ALT":{id:T_word,type:T_cadeia},
		"TECLA_PAUSE":{id:T_word,type:T_cadeia},
		"TECLA_CAPS_LOCK":{id:T_word,type:T_cadeia},
		"TECLA_ESC":{id:T_word,type:T_cadeia},
		"TECLA_ESPACO":{id:T_word,type:T_cadeia},
		"TECLA_PAGE_UP":{id:T_word,type:T_cadeia},
		"TECLA_PAGE_DOWN":{id:T_word,type:T_cadeia},
		"TECLA_END":{id:T_word,type:T_cadeia},
		"TECLA_HOME":{id:T_word,type:T_cadeia},
		"TECLA_SETA_ESQUERDA":{id:T_word,type:T_cadeia},
		"TECLA_SETA_ACIMA":{id:T_word,type:T_cadeia},
		"TECLA_SETA_DIREITA":{id:T_word,type:T_cadeia},
		"TECLA_SETA_ABAIXO":{id:T_word,type:T_cadeia},
		"TECLA_VIRGULA":{id:T_word,type:T_cadeia},
		"TECLA_MENOS":{id:T_word,type:T_cadeia},
		"TECLA_PONTO_FINAL":{id:T_word,type:T_cadeia},
		"TECLA_BARRA":{id:T_word,type:T_cadeia},
		"TECLA_0":{id:T_word,type:T_cadeia},
		"TECLA_1":{id:T_word,type:T_cadeia},
		"TECLA_2 ":{id:T_word,type:T_cadeia},
		"TECLA_3":{id:T_word,type:T_cadeia},
		"TECLA_4":{id:T_word,type:T_cadeia},
		"TECLA_5":{id:T_word,type:T_cadeia},
		"TECLA_6":{id:T_word,type:T_cadeia},
		"TECLA_7":{id:T_word,type:T_cadeia},
		"TECLA_8":{id:T_word,type:T_cadeia},
		"TECLA_9":{id:T_word,type:T_cadeia},
		"TECLA_PONTO_VIRGULA":{id:T_word,type:T_cadeia},
		"TECLA_IGUAL":{id:T_word,type:T_cadeia},
		"TECLA_A":{id:T_word,type:T_cadeia},
		"TECLA_B":{id:T_word,type:T_cadeia},
		"TECLA_C":{id:T_word,type:T_cadeia},
		"TECLA_D":{id:T_word,type:T_cadeia},
		"TECLA_E":{id:T_word,type:T_cadeia},
		"TECLA_F":{id:T_word,type:T_cadeia},
		"TECLA_G":{id:T_word,type:T_cadeia},
		"TECLA_H":{id:T_word,type:T_cadeia},
		"TECLA_I":{id:T_word,type:T_cadeia},
		"TECLA_J":{id:T_word,type:T_cadeia},
		"TECLA_K":{id:T_word,type:T_cadeia},
		"TECLA_L":{id:T_word,type:T_cadeia},
		"TECLA_M":{id:T_word,type:T_cadeia},
		"TECLA_N":{id:T_word,type:T_cadeia},
		"TECLA_O":{id:T_word,type:T_cadeia},
		"TECLA_P":{id:T_word,type:T_cadeia},
		"TECLA_Q":{id:T_word,type:T_cadeia},
		"TECLA_R":{id:T_word,type:T_cadeia},
		"TECLA_S":{id:T_word,type:T_cadeia},
		"TECLA_T":{id:T_word,type:T_cadeia},
		"TECLA_U":{id:T_word,type:T_cadeia},
		"TECLA_V":{id:T_word,type:T_cadeia},
		"TECLA_W":{id:T_word,type:T_cadeia},
		"TECLA_X":{id:T_word,type:T_cadeia},
		"TECLA_Y":{id:T_word,type:T_cadeia},
		"TECLA_Z":{id:T_word,type:T_cadeia},
		"TECLA_ABRE_COLCHETES":{id:T_word,type:T_cadeia},
		"TECLA_BARRA_INVERTIDA":{id:T_word,type:T_cadeia},
		"TECLA_FECHA_COLCHETES":{id:T_word,type:T_cadeia},
		"TECLA_0_NUM":{id:T_word,type:T_cadeia},
		"TECLA_1_NUM":{id:T_word,type:T_cadeia},
		"TECLA_2_NUM":{id:T_word,type:T_cadeia},
		"TECLA_3_NUM":{id:T_word,type:T_cadeia},
		"TECLA_4_NUM":{id:T_word,type:T_cadeia},
		"TECLA_5_NUM":{id:T_word,type:T_cadeia},
		"TECLA_6_NUM":{id:T_word,type:T_cadeia},
		"TECLA_7_NUM":{id:T_word,type:T_cadeia},
		"TECLA_8_NUM":{id:T_word,type:T_cadeia},
		"TECLA_9_NUM":{id:T_word,type:T_cadeia},
		"TECLA_MULTIPLICACAO":{id:T_word,type:T_cadeia},
		"TECLA_ADICAO":{id:T_word,type:T_cadeia},
		"TECLA_NUM_SEPARADOR_DECIMAL":{id:T_word,type:T_cadeia},
		"TECLA_SUBTRACAO":{id:T_word,type:T_cadeia},
		"TECLA_DECIMAL":{id:T_word,type:T_cadeia},
		"TECLA_DIVISAO":{id:T_word,type:T_cadeia},
		"TECLA_DELETAR":{id:T_word,type:T_cadeia},
		"TECLA_NUM_LOCK":{id:T_word,type:T_cadeia},
		"TECLA_SCROLL_LOCK":{id:T_word,type:T_cadeia},
		"TECLA_F1":{id:T_word,type:T_cadeia},
		"TECLA_F2":{id:T_word,type:T_cadeia},
		"TECLA_F3":{id:T_word,type:T_cadeia},
		"TECLA_F4":{id:T_word,type:T_cadeia},
		"TECLA_F5":{id:T_word,type:T_cadeia},
		"TECLA_F6":{id:T_word,type:T_cadeia},
		"TECLA_F7":{id:T_word,type:T_cadeia},
		"TECLA_F8":{id:T_word,type:T_cadeia},
		"TECLA_F9":{id:T_word,type:T_cadeia},
		"TECLA_F10":{id:T_word,type:T_cadeia},
		"TECLA_F11":{id:T_word,type:T_cadeia},
		"TECLA_F12":{id:T_word,type:T_cadeia},
		"TECLA_F13":{id:T_word,type:T_cadeia},
		"TECLA_F14":{id:T_word,type:T_cadeia},
		"TECLA_F15":{id:T_word,type:T_cadeia},
		"TECLA_F16":{id:T_word,type:T_cadeia},
		"TECLA_F17":{id:T_word,type:T_cadeia},
		"TECLA_F18":{id:T_word,type:T_cadeia},
		"TECLA_F19":{id:T_word,type:T_cadeia},
		"TECLA_F20":{id:T_word,type:T_cadeia},
		"TECLA_F21":{id:T_word,type:T_cadeia},
		"TECLA_F22":{id:T_word,type:T_cadeia},
		"TECLA_F23":{id:T_word,type:T_cadeia},
		"TECLA_F24":{id:T_word,type:T_cadeia},
		"TECLA_PRINTSCREEN":{id:T_word,type:T_cadeia},
		"TECLA_INSERT":{id:T_word,type:T_cadeia},
		"TECLA_AJUDA":{id:T_word,type:T_cadeia},
		"alguma_tecla_pressionada":{id:T_parO,parameters:[],type:T_logico,jsSafe:true},
		"caracter_tecla":{id:T_parO,parameters:[T_cadeia],type:T_caracter,jsSafe:true},
		"ler_tecla":{id:T_parO,parameters:[],type:T_cadeia,jsSafe:false},
		"tecla_pressionada":{id:T_parO,parameters:[T_cadeia],type:T_logico,jsSafe:true},
		};
		var that = this;
		this.canvas.addEventListener("keydown",function(evt) {that.tecladoDown(evt);});
		this.canvas.addEventListener("keyup",function(evt) {that.tecladoUp(evt);});
		
		this.resetar();
	}
	
	resetar()
	{
		this.keyMap = {};
		this.pressionadas = 0;
		this.ultimaPressionada = "A";
	}
	
	tecladoDown(evt)
	{
		evt.preventDefault();
		var key = evt.key.toUpperCase();
		this.ultimaPressionada = key;
		console.log(key);
		if(!this.keyMap[key])
		{
			this.pressionadas++;
		}
		this.keyMap[key] = true;
	}
	
	tecladoUp(evt)
	{
		evt.preventDefault();
		var key = evt.key.toUpperCase();
		if(this.keyMap[key])
		{
			this.pressionadas--;
		}
		this.keyMap[key] = false;
	}

	alguma_tecla_pressionada()
	{
		return {value:this.pressionadas > 0};
	}
	
	caracter_tecla(key)
	{
		return {value:key};
	}
	
	ler_tecla()
	{
		if(this.alguma_tecla_pressionada())
		{
			return {value:this.ultimaPressionada};
		}
		else
		{
			VM_delay = 1;
			return {state:STATE_DELAY_REPEAT};
		}
	}
	
	tecla_pressionada(key)
	{
		return {value:this.keyMap[key]};
	}
}
