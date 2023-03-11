import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../tokenizer.js";

function replaceSubstring(inSource, inToReplace, inReplaceWith) {
	let outString = [];
	let repLen = inToReplace.length;
	let idx = inSource.indexOf(inToReplace);
	while (idx !== -1) {
		outString.push(inSource.substring(0, idx));
		outString.push(inReplaceWith);

		inSource = inSource.substring(idx + repLen);
		idx = inSource.indexOf(inToReplace);
	}
	outString.push(inSource);
	return outString.join("");
}
	
export default class Texto {
	constructor() {
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
		throw "Posição inicial e final inválidas, a posição final deve ser maior que a inicial";

		if(posicao_inicial >= 0 && posicao_final < cad.length) {
			return {value:cad.substring(posicao_inicial,posicao_final)};
		} else throw "Posição inicial ou final fora do intervalo. Deve estar entre 0 e o tamanho do texto";
	}
	
	numero_caracteres(cad)
	{
		return {value:cad.length};
	}
	
	obter_caracter(cad,indice)
	{
		if(indice >= 0 && indice < cad.length)
		return {value:cad.charAt(indice)};
		else throw "Índice fora do intervalo. Deve estar entre 0 e o tamanho do texto";
	}
	
	posicao_texto(texto,cad,posicao_inicial)
	{
		if(posicao_inicial < 0 || posicao_inicial >= cad.length)
		throw "Posição inicial fora do intervalo, Deve estar entre 0 e o tamanho do texto";

		return {value:cad.indexOf(texto,posicao_inicial)};
	}
	
	preencher_a_esquerda(car,tamanho,cad)
	{
		return {value:cad.padStart(tamanho,car)};
	}
	

	
	substituir(cad,texto_pesquisa,texto_substituto)
	{
		//return {value:cad.replace(texto_pesquisa, texto_substituto)};
		let ret = replaceSubstring(cad, texto_pesquisa, texto_substituto);
		return {value:ret};
	}
}
