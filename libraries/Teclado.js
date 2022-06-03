class Teclado {
	constructor(canvas) {
		
		this.canvas = canvas;
		this.libGraficos = false;
		// para exibir nos botões
		this.teclaCharMap = {
			10:"\u21A9", // ENTER
			8:"\u2190", // BACKSPACE
			9:"\u21B9",
			3:"Cancelar",
			12:"Limpar",
			16:"\u21E7",
			17:"Ctrl",
			19:"Pause",
			20:"\u21EA",
			27:"Esc",
			32:"\u2423",
			33:"\u219F",
			34:"\u21A1",
			35:"\u21E5",
			36:"\u21E4",
			37:"\u2190",
			38:"\u2191",
			39:"\u2192",
			40:"\u2193",
			127:"Del",
			144:"Num",
			145:"ScLock",
			154:"PrtSc",
			155:"Insert",
			156:"Ajuda",
			524:"Win",
			525:"Menu",
			0:"Alguma",
			
		44:",",
		45:"-",
		45:"_",
		46:".",
		47:"/",
		48:"0",
		49:"1",
		50:"2",
		51:"3",
		52:"4",
		53:"5",
		54:"6",
		55:"7",
		56:"8",
		57:"9",

		59:";",
		61:"=",
		65:"A",
		66:"B",
		67:"C",
		68:"D",
		69:"E",
		70:"F",
		71:"G",
		72:"H",
		73:"I",
		74:"J",
		75:"K",
		76:"L",
		77:"M",
		78:"N",
		79:"O",
		80:"P",
		81:"Q",
		82:"R",
		83:"S",
		84:"T",
		85:"U",
		86:"V",
		87:"W",
		88:"X",
		89:"Y",
		90:"Z",
		91:"[",
	   92:"\\",
		93:"]",
		
		96:"0",
		97:"1",
		98:"2",
		99:"3",
		100:"4",
		101:"5",
		102:"6",
		103:"7",
		104:"8",
		105:"9",
		106:"*",
		107:"+",
		108:",",
		109:"-",
		110:".",
		111:"%",
	
			112  :"F1" ,
			113  :"F2" ,
			114  :"F3" ,
			115  :"F4" ,
			116  :"F5" ,
			117  :"F6" ,
			118  :"F7" ,
			119  :"F8" ,
			120  :"F9" ,
			121  :"F10",
			122  :"F11",
			123  :"F12",
			61440:"F13",
			61441:"F14",
			61442:"F15",
			61443:"F16",
			61444:"F17",
			61445:"F18",
			61446:"F19",
			61447:"F20",
			61448:"F21",
			61449:"F22",
			61450:"F23",
			61451:"F24",
			222:"'"
			
		};
		
		this.teclaCodepointMap = {
			
			"ENTER":10,
			"BACK_SPACE":8,
			"TAB":9,
			"CANCEL":3,
			"CLEAR":12,
			"SHIFT":16,
			"CONTROL":17,
			"ALT":18,
			"PAUSE":19,
			"CAPSLOCK":20,
			"ESCAPE":27,
			" ":32,
			"PAGEUP":33,
			"PAGEDOWN":34,
			"END":35,
			"HOME":36,
			"ARROWLEFT":37,
			"ARROWUP":38,
			"ARROWRIGHT":39,
			"ARROWDOWN":40,
			",":44,
			"-":45,
			"_":45,
			".":46,
			"/":47,
			"0":48,
			"1":49,
			"2":50,
			"3":51,
			"4":52,
			"5":53,
			"6":54,
			"7":55,
			"8":56,
			"9":57,
			
			")":48,
			"!":49,
			"@":50,
			"#":51,
			"$":52,
			"%":53,
			"¨":54,
			"&":55,
			"*":56,
			"(":57,
			
			";":59,
			"=":61,
			"A":65,
			"B":66,
			"C":67,
			"D":68,
			"E":69,
			"F":70,
			"G":71,
			"H":72,
			"I":73,
			"J":74,
			"K":75,
			"L":76,
			"M":77,
			"N":78,
			"O":79,
			"P":80,
			"Q":81,
			"R":82,
			"S":83,
			"T":84,
			"U":85,
			"V":86,
			"W":87,
			"X":88,
			"Y":89,
			"Z":90,
			"[":91,
			"\\":92,
			"]":93,
			//"0":96,
			//"1":97,
			//"2":98,
			//"3":99,
			//"4":100,
			//"5":101,
			//"6":102,
			//"7":103,
			//"8":104,
			//"9":105,
			//"*":106,
			"+":107,
			//",":108,
			//"-":109,
			//".":110,
			"%":111,
			"DELETE":127,
			"NUMLOCK":144,
			"SCROLLOCK":145,
			"F1":112,
			"F2":113,
			"F3":114,
			"F4":115,
			"F5":116,
			"F6":117,
			"F7":118,
			"F8":119,
			"F9":120,
			"F10":121,
			"F11":122,
			"F12":123,
			"F13":61440,
			"F14":61441,
			"F15":61442,
			"F16":61443,
			"F17":61444,
			"F18":61445,
			"F19":61446,
			"F20":61447,
			"F21":61448,
			"F22":61449,
			"F23":61450,
			"F24":61451,
			"PRINTSCREEN":154,
			"INSERT":155,
			"HELP":156,
			"META":524,
			"CONTEXTMENU":525,
			"'":222,
			"\"":222
		};
		
		this.TECLA_ENTER                 = 10;
		this.TECLA_BACKSPACE             = 8;
		this.TECLA_TAB                   = 9;
		this.TECLA_CANCELAR              = 3;
		this.TECLA_LIMPAR                = 12;
		this.TECLA_SHIFT                 = 16;
		this.TECLA_CONTROL               = 17;
		this.TECLA_ALT                   = 18;
		this.TECLA_PAUSE                 = 19;
		this.TECLA_CAPS_LOCK             = 20;
		this.TECLA_ESC                   = 27;
		this.TECLA_ESPACO                = 32;
		this.TECLA_PAGE_UP               = 33;
		this.TECLA_PAGE_DOWN             = 34;
		this.TECLA_END                   = 35;
		this.TECLA_HOME                  = 36;
		this.TECLA_SETA_ESQUERDA         = 37;
		this.TECLA_SETA_ACIMA            = 38;
		this.TECLA_SETA_DIREITA          = 39;
		this.TECLA_SETA_ABAIXO           = 40;
		this.TECLA_VIRGULA               = 44;
		this.TECLA_MENOS                 = 45;
		this.TECLA_PONTO_FINAL           = 46;
		this.TECLA_BARRA                 = 47;
		this.TECLA_0                     = 48;
		this.TECLA_1                     = 49;
		this.TECLA_2                     = 50;
		this.TECLA_3                     = 51;
		this.TECLA_4                     = 52;
		this.TECLA_5                     = 53;
		this.TECLA_6                     = 54;
		this.TECLA_7                     = 55;
		this.TECLA_8                     = 56;
		this.TECLA_9                     = 57;
		this.TECLA_PONTO_VIRGULA         = 59;
		this.TECLA_IGUAL                 = 61;
		this.TECLA_A                     = 65;
		this.TECLA_B                     = 66;
		this.TECLA_C                     = 67;
		this.TECLA_D                     = 68;
		this.TECLA_E                     = 69;
		this.TECLA_F                     = 70;
		this.TECLA_G                     = 71;
		this.TECLA_H                     = 72;
		this.TECLA_I                     = 73;
		this.TECLA_J                     = 74;
		this.TECLA_K                     = 75;
		this.TECLA_L                     = 76;
		this.TECLA_M                     = 77;
		this.TECLA_N                     = 78;
		this.TECLA_O                     = 79;
		this.TECLA_P                     = 80;
		this.TECLA_Q                     = 81;
		this.TECLA_R                     = 82;
		this.TECLA_S                     = 83;
		this.TECLA_T                     = 84;
		this.TECLA_U                     = 85;
		this.TECLA_V                     = 86;
		this.TECLA_W                     = 87;
		this.TECLA_X                     = 88;
		this.TECLA_Y                     = 89;
		this.TECLA_Z                     = 90;
		this.TECLA_ABRE_COLCHETES        = 91;
		this.TECLA_BARRA_INVERTIDA       = 92;
		this.TECLA_FECHA_COLCHETES       = 93;
		this.TECLA_0_NUM                 = 96;
		this.TECLA_1_NUM                 = 97;
		this.TECLA_2_NUM                 = 98;
		this.TECLA_3_NUM                 = 99;
		this.TECLA_4_NUM                 = 100;
		this.TECLA_5_NUM                 = 101;
		this.TECLA_6_NUM                 = 102;
		this.TECLA_7_NUM                 = 103;
		this.TECLA_8_NUM                 = 104;
		this.TECLA_9_NUM                 = 105;
		this.TECLA_MULTIPLICACAO         = 106;
		this.TECLA_ADICAO                = 107;
		this.TECLA_NUM_SEPARADOR_DECIMAL = 108;
		this.TECLA_SUBTRACAO             = 109;
		this.TECLA_DECIMAL               = 110;
		this.TECLA_DIVISAO               = 111;
		this.TECLA_DELETAR               = 127;
		this.TECLA_NUM_LOCK              = 144;
		this.TECLA_SCROLL_LOCK           = 145;
		this.TECLA_F1                    = 112;
		this.TECLA_F2                    = 113;
		this.TECLA_F3                    = 114;
		this.TECLA_F4                    = 115;
		this.TECLA_F5                    = 116;
		this.TECLA_F6                    = 117;
		this.TECLA_F7                    = 118;
		this.TECLA_F8                    = 119;
		this.TECLA_F9                    = 120;
		this.TECLA_F10                   = 121;
		this.TECLA_F11                   = 122;
		this.TECLA_F12                   = 123;
		this.TECLA_F13                   = 61440;
		this.TECLA_F14                   = 61441;
		this.TECLA_F15                   = 61442;
		this.TECLA_F16                   = 61443;
		this.TECLA_F17                   = 61444;
		this.TECLA_F18                   = 61445;
		this.TECLA_F19                   = 61446;
		this.TECLA_F20                   = 61447;
		this.TECLA_F21                   = 61448;
		this.TECLA_F22                   = 61449;
		this.TECLA_F23                   = 61450;
		this.TECLA_F24                   = 61451;
		this.TECLA_PRINTSCREEN           = 154;
		this.TECLA_INSERT                = 155;
		this.TECLA_AJUDA                 = 156;
		this.TECLA_WINDOWS                 = 524;
		this.TECLA_MENU_CONTEXTO         = 525;
		// ALTGRAPH?
		// META?
		// DEAD?
		// ¹²³£¢¬§ªº°?
		//!@#$%¨&*()`{^}<>:??
		
		this.members = {
			
		"TECLA_ENTER":{id:T_word,type:T_inteiro},
		"TECLA_BACKSPACE":{id:T_word,type:T_inteiro},
		"TECLA_TAB":{id:T_word,type:T_inteiro},
		"TECLA_CANCELAR":{id:T_word,type:T_inteiro},
		"TECLA_LIMPAR":{id:T_word,type:T_inteiro},
		"TECLA_SHIFT":{id:T_word,type:T_inteiro},
		"TECLA_CONTROL":{id:T_word,type:T_inteiro},
		"TECLA_ALT":{id:T_word,type:T_inteiro},
		"TECLA_PAUSE":{id:T_word,type:T_inteiro},
		"TECLA_CAPS_LOCK":{id:T_word,type:T_inteiro},
		"TECLA_ESC":{id:T_word,type:T_inteiro},
		"TECLA_ESPACO":{id:T_word,type:T_inteiro},
		"TECLA_PAGE_UP":{id:T_word,type:T_inteiro},
		"TECLA_PAGE_DOWN":{id:T_word,type:T_inteiro},
		"TECLA_END":{id:T_word,type:T_inteiro},
		"TECLA_HOME":{id:T_word,type:T_inteiro},
		"TECLA_SETA_ESQUERDA":{id:T_word,type:T_inteiro},
		"TECLA_SETA_ACIMA":{id:T_word,type:T_inteiro},
		"TECLA_SETA_DIREITA":{id:T_word,type:T_inteiro},
		"TECLA_SETA_ABAIXO":{id:T_word,type:T_inteiro},
		"TECLA_VIRGULA":{id:T_word,type:T_inteiro},
		"TECLA_MENOS":{id:T_word,type:T_inteiro},
		"TECLA_PONTO_FINAL":{id:T_word,type:T_inteiro},
		"TECLA_BARRA":{id:T_word,type:T_inteiro},
		"TECLA_0":{id:T_word,type:T_inteiro},
		"TECLA_1":{id:T_word,type:T_inteiro},
		"TECLA_2":{id:T_word,type:T_inteiro},
		"TECLA_3":{id:T_word,type:T_inteiro},
		"TECLA_4":{id:T_word,type:T_inteiro},
		"TECLA_5":{id:T_word,type:T_inteiro},
		"TECLA_6":{id:T_word,type:T_inteiro},
		"TECLA_7":{id:T_word,type:T_inteiro},
		"TECLA_8":{id:T_word,type:T_inteiro},
		"TECLA_9":{id:T_word,type:T_inteiro},
		"TECLA_PONTO_VIRGULA":{id:T_word,type:T_inteiro},
		"TECLA_IGUAL":{id:T_word,type:T_inteiro},
		"TECLA_A":{id:T_word,type:T_inteiro},
		"TECLA_B":{id:T_word,type:T_inteiro},
		"TECLA_C":{id:T_word,type:T_inteiro},
		"TECLA_D":{id:T_word,type:T_inteiro},
		"TECLA_E":{id:T_word,type:T_inteiro},
		"TECLA_F":{id:T_word,type:T_inteiro},
		"TECLA_G":{id:T_word,type:T_inteiro},
		"TECLA_H":{id:T_word,type:T_inteiro},
		"TECLA_I":{id:T_word,type:T_inteiro},
		"TECLA_J":{id:T_word,type:T_inteiro},
		"TECLA_K":{id:T_word,type:T_inteiro},
		"TECLA_L":{id:T_word,type:T_inteiro},
		"TECLA_M":{id:T_word,type:T_inteiro},
		"TECLA_N":{id:T_word,type:T_inteiro},
		"TECLA_O":{id:T_word,type:T_inteiro},
		"TECLA_P":{id:T_word,type:T_inteiro},
		"TECLA_Q":{id:T_word,type:T_inteiro},
		"TECLA_R":{id:T_word,type:T_inteiro},
		"TECLA_S":{id:T_word,type:T_inteiro},
		"TECLA_T":{id:T_word,type:T_inteiro},
		"TECLA_U":{id:T_word,type:T_inteiro},
		"TECLA_V":{id:T_word,type:T_inteiro},
		"TECLA_W":{id:T_word,type:T_inteiro},
		"TECLA_X":{id:T_word,type:T_inteiro},
		"TECLA_Y":{id:T_word,type:T_inteiro},
		"TECLA_Z":{id:T_word,type:T_inteiro},
		"TECLA_ABRE_COLCHETES":{id:T_word,type:T_inteiro},
		"TECLA_BARRA_INVERTIDA":{id:T_word,type:T_inteiro},
		"TECLA_FECHA_COLCHETES":{id:T_word,type:T_inteiro},
		"TECLA_0_NUM":{id:T_word,type:T_inteiro},
		"TECLA_1_NUM":{id:T_word,type:T_inteiro},
		"TECLA_2_NUM":{id:T_word,type:T_inteiro},
		"TECLA_3_NUM":{id:T_word,type:T_inteiro},
		"TECLA_4_NUM":{id:T_word,type:T_inteiro},
		"TECLA_5_NUM":{id:T_word,type:T_inteiro},
		"TECLA_6_NUM":{id:T_word,type:T_inteiro},
		"TECLA_7_NUM":{id:T_word,type:T_inteiro},
		"TECLA_8_NUM":{id:T_word,type:T_inteiro},
		"TECLA_9_NUM":{id:T_word,type:T_inteiro},
		"TECLA_MULTIPLICACAO":{id:T_word,type:T_inteiro},
		"TECLA_ADICAO":{id:T_word,type:T_inteiro},
		"TECLA_NUM_SEPARADOR_DECIMAL":{id:T_word,type:T_inteiro},
		"TECLA_SUBTRACAO":{id:T_word,type:T_inteiro},
		"TECLA_DECIMAL":{id:T_word,type:T_inteiro},
		"TECLA_DIVISAO":{id:T_word,type:T_inteiro},
		"TECLA_DELETAR":{id:T_word,type:T_inteiro},
		"TECLA_NUM_LOCK":{id:T_word,type:T_inteiro},
		"TECLA_SCROLL_LOCK":{id:T_word,type:T_inteiro},
		"TECLA_F1":{id:T_word,type:T_inteiro},
		"TECLA_F2":{id:T_word,type:T_inteiro},
		"TECLA_F3":{id:T_word,type:T_inteiro},
		"TECLA_F4":{id:T_word,type:T_inteiro},
		"TECLA_F5":{id:T_word,type:T_inteiro},
		"TECLA_F6":{id:T_word,type:T_inteiro},
		"TECLA_F7":{id:T_word,type:T_inteiro},
		"TECLA_F8":{id:T_word,type:T_inteiro},
		"TECLA_F9":{id:T_word,type:T_inteiro},
		"TECLA_F10":{id:T_word,type:T_inteiro},
		"TECLA_F11":{id:T_word,type:T_inteiro},
		"TECLA_F12":{id:T_word,type:T_inteiro},
		"TECLA_F13":{id:T_word,type:T_inteiro},
		"TECLA_F14":{id:T_word,type:T_inteiro},
		"TECLA_F15":{id:T_word,type:T_inteiro},
		"TECLA_F16":{id:T_word,type:T_inteiro},
		"TECLA_F17":{id:T_word,type:T_inteiro},
		"TECLA_F18":{id:T_word,type:T_inteiro},
		"TECLA_F19":{id:T_word,type:T_inteiro},
		"TECLA_F20":{id:T_word,type:T_inteiro},
		"TECLA_F21":{id:T_word,type:T_inteiro},
		"TECLA_F22":{id:T_word,type:T_inteiro},
		"TECLA_F23":{id:T_word,type:T_inteiro},
		"TECLA_F24":{id:T_word,type:T_inteiro},
		"TECLA_PRINTSCREEN":{id:T_word,type:T_inteiro},
		"TECLA_INSERT":{id:T_word,type:T_inteiro},
		"TECLA_AJUDA":{id:T_word,type:T_inteiro},
		"TECLA_WINDOWS":{id:T_word,type:T_inteiro},
		"TECLA_MENU_CONTEXTO":{id:T_word,type:T_inteiro},
		"alguma_tecla_pressionada":{id:T_parO,parameters:[],type:T_logico,jsSafe:true},
		"caracter_tecla":{id:T_parO,parameters:[{name:"tecla",type:T_inteiro}],type:T_caracter,jsSafe:true},
		"ler_tecla":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:false},
		"tecla_pressionada":{id:T_parO,parameters:[{name:"tecla",type:T_inteiro}],type:T_logico,jsSafe:true},
		};
		var that = this;
		this.canvas.addEventListener("keydown",function(evt) {that.tecladoDown(evt,-1);});
		this.canvas.addEventListener("keyup",function(evt) {that.tecladoUp(evt,-1);});
		
		this.resetar();
	}
	
	resetar()
	{
		// Mapa de teclas pressionadas no momento
		this.keyMap = {};
		// Mapa de teclas que foram checadas pelo tecla_pressionada
		// Para exibir os botões no Mobile
		this.checkMap = {};
		this.pressionadas = 0;
		this.ultimaPressionada = -1;
		this.aguardandoLer = false;
		this.ultimaSolta = -1;
	}
	
	tecladoDown(evt,codekey)
	{
		evt.preventDefault();
		var key = codekey;
		if(key == -1)
		{
			key = this.teclaCodepointMap[evt.key.toUpperCase()];
			if(typeof key === 'undefined') key = -1;
		}
		this.ultimaPressionada = key;
		console.log(evt.key+" --> "+key);
		if(this.keyMap[key] !== true)
		{
			this.pressionadas++;
		}
		this.keyMap[key] = true;
	}
	
	tecladoUp(evt,codekey)
	{
		evt.preventDefault();
		var key = codekey;
		if(key == -1)
		{
			key = this.teclaCodepointMap[evt.key.toUpperCase()];
			if(typeof key === 'undefined') key = -1;
		}
		this.ultimaSolta = key;
		if(this.keyMap[key] === true)
		{
			this.pressionadas--;
		}
		this.keyMap[key] = false;
	}

	alguma_tecla_pressionada()
	{
		this.checkMap[0] = true;
		return {value:this.pressionadas > 0};
	}
	
	caracter_tecla(codekey)
	{
		// não é o ideal mas irá funcionar de forma igual ao Portugol Studio
		return {value:""+String.fromCharCode(codekey)};
	}
	
	ler_tecla()
	{
		for(var i =49;i<58;i++)
		{
			this.checkMap[i] = true;
		}
		for(var i =65;i<91;i++)
		{
			this.checkMap[i] = true;
		}
		
		if(this.libGraficos != false)
		this.libGraficos.updateTecladoGraficos();
		
		if(this.aguardandoLer == false)
		{
			this.aguardandoLer = true;
			
			this.ultimaSolta = -1;
			
			VM_delay = 1;
			return {state:STATE_DELAY_REPEAT};
		}
		else
		{
			if(this.ultimaSolta == -1)
			{
				VM_delay = 1;
				return {state:STATE_DELAY_REPEAT};
			}
			else
			{
				this.aguardandoLer = false;
				return {value:this.ultimaSolta};
			}
		}
	}
	
	tecla_pressionada(key)
	{
		// marca que foi checada essa tecla
		this.checkMap[key] = true;
		return {value:this.keyMap[key] === true};
	}
}
