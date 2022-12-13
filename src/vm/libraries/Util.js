import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro, T_Vetor, T_Matriz } from "../../compiler/tokenizer.js";
import { STATE_DELAY, VM_setDelay } from "../vm.js";

export default class Util {
	constructor() {
		this.members = {
		"aguarde":{id:T_parO,parameters:[{name:"intervalo",type:T_inteiro}],type:T_vazio,jsSafe:false},
		
		"numero_elementos":{id:T_parO,parameters:[{name:"vetor",type:T_Vetor}],type:T_inteiro,jsSafe:true},
		//"numero_elementos":{id:T_parO,parameters:[{name:"vetor",type:T_Vcaracter}],type:T_inteiro,jsSafe:true},
		//"numero_elementos":{id:T_parO,parameters:[{name:"vetor",type:T_Vcadeia}],type:T_inteiro,jsSafe:true},
		//"numero_elementos":{id:T_parO,parameters:[{name:"vetor",type:T_Vreal}],type:T_inteiro,jsSafe:true},
		//"numero_elementos":{id:T_parO,parameters:[{name:"vetor",type:T_Vlogico}],type:T_inteiro,jsSafe:true},
		
		"numero_colunas":{id:T_parO,parameters:[{name:"matriz",type:T_Matriz}],type:T_inteiro,jsSafe:true},
		//"numero_colunas":{id:T_parO,parameters:[{name:"matriz",type:T_Mcaracter}],type:T_inteiro,jsSafe:true},
		//"numero_colunas":{id:T_parO,parameters:[{name:"matriz",type:T_Mcadeia}],type:T_inteiro,jsSafe:true},
		//"numero_colunas":{id:T_parO,parameters:[{name:"matriz",type:T_Mreal}],type:T_inteiro,jsSafe:true},
		//"numero_colunas":{id:T_parO,parameters:[{name:"matriz",type:T_Mlogico}],type:T_inteiro,jsSafe:true},
		
		"numero_linhas":{id:T_parO,parameters:[{name:"matriz",type:T_Matriz}],type:T_inteiro,jsSafe:true},
		//"numero_linhas":{id:T_parO,parameters:[{name:"matriz",type:T_Mcaracter}],type:T_inteiro,jsSafe:true},
		//"numero_linhas":{id:T_parO,parameters:[{name:"matriz",type:T_Mcadeia}],type:T_inteiro,jsSafe:true},
		//"numero_linhas":{id:T_parO,parameters:[{name:"matriz",type:T_Mreal}],type:T_inteiro,jsSafe:true},
		//"numero_linhas":{id:T_parO,parameters:[{name:"matriz",type:T_Mlogico}],type:T_inteiro,jsSafe:true},
		
		"sorteia":{id:T_parO,parameters:[{name:"minimo",type:T_inteiro},{name:"maximo",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"tempo_decorrido":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true}
		};
		
		this.resetar();
	}
	
	resetar()
	{
		this.time = new Date().getTime();
	}
	
	aguarde(intervalo)
	{
		VM_setDelay(intervalo);
		return {state:STATE_DELAY};
	}
	
	numero_colunas(matriz)
	{
		return {value:matriz[0].length};
	}
	
	numero_linhas(matriz)
	{
		return {value:matriz.length};
	}
	
	numero_elementos(vetor)
	{
		return {value:vetor.length};
	}
	
	sorteia(minimo,maximo)
	{
		maximo += 1; // para incluir o maximo dentro do intervalo
		return {value: Math.floor(Math.random() * (maximo-minimo)) + minimo};
	}
	
	tempo_decorrido()
	{
		return {value:new Date().getTime() - this.time};
	}
}
