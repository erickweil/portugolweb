import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../compiler/tokenizer.js";

export default class Matematica {

	constructor() {
		this.PI = 3.141592653589793;
		
		this.members = {
		"PI":{id:T_word,type:T_real},
		"potencia":{id:T_parO,parameters:[{name:"base",type:T_real},{name:"expoente",type:T_real}],type:T_real,jsSafe:true},
		"arredondar":{id:T_parO,parameters:[{name:"numero",type:T_real},{name:"casas",type:T_real}],type:T_real,jsSafe:true},
		"cosseno":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_real,jsSafe:true},
		"logaritmo":{id:T_parO,parameters:[{name:"numero",type:T_real},{name:"base",type:T_real}],type:T_real,jsSafe:true},
		"maior_numero":{id:T_parO,parameters:[{name:"a",type:T_real},{name:"b",type:T_real}],type:T_real,jsSafe:true},
		"menor_numero":{id:T_parO,parameters:[{name:"a",type:T_real},{name:"b",type:T_real}],type:T_real,jsSafe:true},
		"raiz":{id:T_parO,parameters:[{name:"numero",type:T_real},{name:"potencia",type:T_real}],type:T_real,jsSafe:true},
		"seno":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_real,jsSafe:true},
		"tangente":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_real,jsSafe:true},
		"valor_absoluto":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_real,jsSafe:true}
		};
	}
	
	resetar()
	{
	}
	
	arredondar(numero,casas)
	{
		return {value:(+numero.toFixed(casas))};
	}
	
	potencia(base,expoente)
	{
		return {value:Math.pow(base, expoente)};
	}
	
	cosseno(n)
	{
		return {value:Math.cos(n)};
	}
	
	logaritmo(numero,base)
	{
		return {value:Math.log(numero) / Math.log(base)};
	}
	
	maior_numero(a,b)
	{
		return {value:a > b ? a : b};
	}
	
	menor_numero(a,b)
	{
		return {value:a < b ? a : b};
	}
	
	raiz(x,n)
	{
		try {
			var negate = n % 2 == 1 && x < 0;
			if(negate)
				x = -x;
			var possible = Math.pow(x, 1 / n);
			n = Math.pow(possible, n);
			if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
				return {value:negate ? -possible : possible};
		}
		catch(e)
		{
			console.log(e)
		}
	}
	
	seno(n)
	{
		return {value:Math.sin(n)};
	}
	
	tangente(n)
	{
		return {value:Math.tan(n)};
	}
	
	valor_absoluto(n)
	{
		return {value:Math.abs(n)};
	}
}
