import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../tokenizer.js";
import { BibliotecaBase } from "./libHelper.js";

	
export default class Texto extends BibliotecaBase {
	constructor() {
		super();
		
		this.members = {
		"caixa_alta":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_cadeia,jsSafe:true},
		"caixa_baixa":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_cadeia,jsSafe:true},
		"extrair_subtexto":{id:T_parO,parameters:[{name:"cad",type:T_cadeia},{name:"posicao_inicial",type:T_inteiro},{name:"posicao_final",type:T_inteiro}],type:T_cadeia,jsSafe:true},
		"numero_caracteres":{id:T_parO,parameters:[{name:"cad",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"obter_caracter":{id:T_parO,parameters:[{name:"cad",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_caracter,jsSafe:true},
		"posicao_texto":{id:T_parO,parameters:[{name:"agulha",type:T_cadeia},{name:"palheiro",type:T_cadeia},{name:"posicao_inicial",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"preencher_a_esquerda":{id:T_parO,parameters:[{name:"letra",type:T_caracter},{name:"tamanho",type:T_inteiro},{name:"cad",type:T_cadeia}],type:T_cadeia,jsSafe:true},
		"substituir":{id:T_parO,parameters:[{name:"cad",type:T_cadeia},{name:"texto_pesquisa",type:T_cadeia},{name:"texto_substituto",type:T_cadeia}],type:T_cadeia,jsSafe:true}
		};
	}
	
	resetar()
	{
	}
	
	caixa_alta(cad)
	{
		return {value:cad.toUpperCase()};
	}
	
	caixa_baixa(cad)
	{
		return {value:cad.toLowerCase()};
	}
	
	extrair_subtexto(cad,posicao_inicial,posicao_final)
	{
		if(posicao_inicial > posicao_final) 
		throw new Error("Posição inicial e final inválidas, a posição final deve ser maior ou igual que a inicial");

		// maior ou igual a zero E menor OU IGUAL ao tamanho do texto
		if(posicao_inicial >= 0 && posicao_final <= cad.length) {
			return {value:cad.substring(posicao_inicial,posicao_final)};
		} else throw new Error("Posição inicial ou final fora do intervalo. Deve estar entre 0 e o tamanho do texto");
	}
	
	numero_caracteres(cad)
	{
		return {value:cad.length};
	}
	
	obter_caracter(cad,indice)
	{
		// Pode ser 0 mas tem que ser MENOR que o tamanho do texto
		if(indice >= 0 && indice < cad.length)
		return {value:cad.charAt(indice)};
		else throw new Error("Índice fora do intervalo. Deve estar entre 0 e o tamanho do texto");
	}
	
	posicao_texto(texto,cad,posicao_inicial)
	{
		// Essa checagem não deveria existir?
		//if(posicao_inicial < 0 || posicao_inicial >= cad.length)
		//throw "Posição inicial fora do intervalo, Deve estar entre 0 e o tamanho do texto";
		
		return {value:cad.indexOf(texto,posicao_inicial)};
	}
	
	preencher_a_esquerda(car,tamanho,cad)
	{
		return {value:cad.padStart(tamanho,car)};
	}
	
	substituir(cad,texto_pesquisa,texto_substituto)
	{
		//return {value:cad.replace(texto_pesquisa, texto_substituto)};
		//let ret = replaceSubstring(cad, texto_pesquisa, texto_substituto);
		return {
			value: texto_pesquisa === "" ? cad : cad.replaceAll(texto_pesquisa, texto_substituto)
		};
	}
}
