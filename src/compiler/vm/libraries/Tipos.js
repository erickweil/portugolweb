import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../tokenizer.js";

export default class Tipos {
	constructor() {
		this.members = {
		"cadeia_e_caracter":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_logico,jsSafe:true},
		"cadeia_e_inteiro":{id:T_parO,parameters:[{name:"cad",type:T_cadeia},{name:"base",type:T_inteiro}],type:T_logico,jsSafe:true},
		"cadeia_e_logico":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_logico,jsSafe:true},
		"cadeia_e_real":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_logico,jsSafe:true},
		"cadeia_para_caracter":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_caracter,jsSafe:true},
		"cadeia_para_inteiro":{id:T_parO,parameters:[{name:"cad",type:T_cadeia},{name:"base",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"cadeia_para_logico":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_logico,jsSafe:true},
		"cadeia_para_real":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_real,jsSafe:true},
		
		"caracter_e_inteiro":{id:T_parO,parameters:[{name:"letra",type:T_caracter}],type:T_logico,jsSafe:true},
		"caracter_e_logico":{id:T_parO,parameters:[{name:"letra",type:T_caracter}],type:T_logico,jsSafe:true},
		"caracter_para_cadeia":{id:T_parO,parameters:[{name:"letra",type:T_caracter}],type:T_cadeia,jsSafe:true},
		"caracter_para_inteiro":{id:T_parO,parameters:[{name:"letra",type:T_caracter}],type:T_inteiro,jsSafe:true},
		"caracter_para_logico":{id:T_parO,parameters:[{name:"letra",type:T_caracter}],type:T_logico,jsSafe:true},
		
		"inteiro_e_caracter":{id:T_parO,parameters:[{name:"numero",type:T_inteiro}],type:T_logico,jsSafe:true},
		"inteiro_para_cadeia":{id:T_parO,parameters:[{name:"numero",type:T_inteiro},{name:"base",type:T_inteiro}],type:T_cadeia,jsSafe:true},
		"inteiro_para_caracter":{id:T_parO,parameters:[{name:"numero",type:T_inteiro}],type:T_caracter,jsSafe:true},
		"inteiro_para_logico":{id:T_parO,parameters:[{name:"numero",type:T_inteiro}],type:T_logico,jsSafe:true},
		"inteiro_para_real":{id:T_parO,parameters:[{name:"numero",type:T_inteiro}],type:T_real,jsSafe:true},
		
		"logico_para_cadeia":{id:T_parO,parameters:[{name:"teste",type:T_logico}],type:T_cadeia,jsSafe:true},
		"logico_para_caracter":{id:T_parO,parameters:[{name:"teste",type:T_logico}],type:T_caracter,jsSafe:true},
		"logico_para_inteiro":{id:T_parO,parameters:[{name:"teste",type:T_logico}],type:T_inteiro,jsSafe:true},
		
		"real_para_cadeia":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_cadeia,jsSafe:true},
		"real_para_inteiro":{id:T_parO,parameters:[{name:"numero",type:T_real}],type:T_inteiro,jsSafe:true}
		};
		
	}
	
	resetar()
	{
	}
	
	cadeia_e_caracter(cad)
	{
		return {value:cad.length == 1};
	}
	
	cadeia_e_inteiro(cad,base)
	{
		cad = cad.toLowerCase();
		if(base == 2)
		return {value:/^[+-]?(0b)?[0-1]+$/.test(cad)};
		else if(base == 10)
		return {value:/^[+-]?[0-9]+$/.test(cad)};
		else if(base == 16)
		return {value:/^[+-]?(0x)?[0-9a-f]+$/.test(cad)};
		else throw "A base deve ser 2,10 ou 16";
	}
	
	cadeia_e_logico(cad)
	{
		return {value:(cad == "verdadeiro" || cad == "falso")};
	}
	
	cadeia_e_real(cad)
	{
		return {value:/^[+-]?[0-9]+\.[0-9]+$/.test(cad)};
	}
	
	cadeia_para_caracter(cad)
	{
		if(this.cadeia_e_caracter(cad).value) return {value:cad.charAt(0)};
		else throw "o valor '"+cad+"' não pode ser convertido para caracter";
	}
	
	cadeia_para_inteiro(cad,base)
	{
		if(this.cadeia_e_inteiro(cad,base).value) return {value:parseInt(cad,base)};
		else throw "o valor '"+cad+"' não pode ser convertido para inteiro";
	}
	
	cadeia_para_logico(cad)
	{
		if(cad == "verdadeiro") return {value:true};
		else if(cad == "falso") return {value:false};
		else throw "o valor '"+cad+"' não pode ser convertido para logico";
	}
	
	cadeia_para_real(cad)
	{
		if(this.cadeia_e_real(cad).value) return {value:parseFloat(cad)};
		else throw "o valor '"+cad+"' não pode ser convertido para real";
	}
	
	caracter_e_inteiro(cad)
	{
		cad = cad.toLowerCase();
		return {value:/^[0-9]+$/.test(cad)};
	}
	
	caracter_e_logico(cad)
	{
		cad = cad.toLowerCase();
		return {value:cad == "s" || cad == "n"};
	}
	
	caracter_para_cadeia(cad)
	{
		return {value:cad};
	}
	
	caracter_para_inteiro(cad)
	{
		if(this.caracter_e_inteiro(cad).value)
		return {value:cad.charCodeAt(0)-48};
		else throw "o valor '"+cad+"' não pode ser convertido para inteiro";
	}
	
	caracter_para_logico(cad)
	{
		cad = cad.toLowerCase();
		if(cad == "s") return {value:true};
		else if(cad == "n") return {value:false};
		else throw "o valor '"+cad+"' não pode ser convertido para logico";
	}
	
	inteiro_e_caracter(i)
	{
		return {value: i >= 0 && i <= 9};
	}
	
	inteiro_para_cadeia(i,base)
	{
		return {value: i.toString(base)};
	}
	
	inteiro_para_caracter(i)
	{
		if(this.inteiro_e_caracter(i).value) return {value:(""+i).charAt(0)};
		else throw "o valor '"+i+"' não pode ser convertido para caracter";
	}
	
	inteiro_para_logico(i)
	{
		return {value: i >= 1};
	}
	
	inteiro_para_real(i)
	{
		return {value: i};
	}
	
	logico_para_cadeia(log)
	{
		return {value:log == 0 ? "verdadeiro" : "falso"};
	}
	
	logico_para_caracter(log)
	{
		return {value:log == 0 ? "s" : "n"};
	}
	
	logico_para_inteiro(log)
	{
		return {value:log == 0 ? 1 : 0};
	}
	
	real_para_cadeia(rea)
	{
		return {value:""+rea};
	}
	
	real_para_inteiro(rea)
	{
		return {value:Math.floor( rea )};
	}
}
