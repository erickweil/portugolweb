import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../tokenizer.js";
import { BibliotecaBase } from "./libHelper.js";

export default class Objetos extends BibliotecaBase {
	constructor() {
		super();
		
		this.TIPO_CADEIA = 2;
		this.TIPO_CARACTER = 3;
		this.TIPO_INTEIRO = 1;
		this.TIPO_LOGICO = 5;
		this.TIPO_OBJETO = 6;
		this.TIPO_REAL = 4;
		this.TIPO_VETOR = 7;
		
		this.members = {
		"TIPO_CADEIA":{id:T_word,type:T_inteiro},
		"TIPO_CARACTER":{id:T_word,type:T_inteiro},
		"TIPO_INTEIRO":{id:T_word,type:T_inteiro},
		"TIPO_LOGICO":{id:T_word,type:T_inteiro},
		"TIPO_OBJETO":{id:T_word,type:T_inteiro},
		"TIPO_REAL":{id:T_word,type:T_inteiro},
		"TIPO_VETOR":{id:T_word,type:T_inteiro},
		"atribuir_propriedade":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"valor",type:T_vazio}],type:T_vazio,jsSafe:true},
		"contem_propriedade":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_logico,jsSafe:true},
		"criar_objeto":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"criar_objeto_via_json":{id:T_parO,parameters:[{name:"json",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"criar_objeto_via_xml":{id:T_parO,parameters:[{name:"xml",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"liberar":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"liberar_objeto":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"obter_json":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro}],type:T_cadeia,jsSafe:true},
		"obter_propriedade_tipo_cadeia":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_cadeia,jsSafe:true},
		"obter_propriedade_tipo_cadeia_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_cadeia,jsSafe:true},
		"obter_propriedade_tipo_caracter":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_caracter,jsSafe:true},
		"obter_propriedade_tipo_caracter_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_caracter,jsSafe:true},
		"obter_propriedade_tipo_inteiro":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"obter_propriedade_tipo_inteiro_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"obter_propriedade_tipo_logico":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_logico,jsSafe:true},
		"obter_propriedade_tipo_logico_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_logico,jsSafe:true},
		"obter_propriedade_tipo_objeto":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"obter_propriedade_tipo_objeto_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"obter_propriedade_tipo_real":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_real,jsSafe:true},
		"obter_propriedade_tipo_real_em_vetor":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia},{name:"indice",type:T_inteiro}],type:T_real,jsSafe:true},
		"obter_tamanho_vetor_propriedade":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"tipo_propriedade":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"propriedade",type:T_cadeia}],type:T_inteiro,jsSafe:true}
		};
		
		this.obter_propriedade_tipo_cadeia = this.obter_propriedade_tipo_danese;
		this.obter_propriedade_tipo_caracter = this.obter_propriedade_tipo_danese;
		this.obter_propriedade_tipo_inteiro = this.obter_propriedade_tipo_danese;
		this.obter_propriedade_tipo_logico = this.obter_propriedade_tipo_danese;
		this.obter_propriedade_tipo_objeto = this.obter_propriedade_tipo_danese;
		this.obter_propriedade_tipo_real = this.obter_propriedade_tipo_danese;

		this.obter_propriedade_tipo_cadeia_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;
		this.obter_propriedade_tipo_caracter_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;
		this.obter_propriedade_tipo_inteiro_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;
		this.obter_propriedade_tipo_logico_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;
		this.obter_propriedade_tipo_objeto_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;
		this.obter_propriedade_tipo_real_em_vetor = this.obter_propriedade_tipo_danese_em_vetor;

		this.resetar();
	}

	obter_objeto(endereco)
	{
		let obj = this.objs[endereco];
		if(obj) return obj;
		throw new Error("Nenhum objeto encontrado no endereco "+endereco);
	}

	obter_valor_propriedade(endereco,propriedade)
	{
		let obj = this.obter_objeto(endereco);
		if(propriedade in obj)
		{
			return obj[propriedade];
		}

		throw new Error("Não pôde acessar a propriedade '"+propriedade+"' no endereco "+endereco);
	}
	
	atribuir_propriedade(endereco,propriedade,valor)
	{
		let obj = this.obter_objeto(endereco);
		obj[propriedade] = valor;
	}
	
	contem_propriedade(endereco,propriedade)
	{
		let obj = this.obter_objeto(endereco);
		return {value:propriedade in obj};
	}

	resetar()
	{
		this.objs = [];
	}
	
	criar_objeto()
	{
		this.objs.push( {} );
		return {value: this.objs.length-1};
	}
	
	criar_objeto_via_json(json)
	{
		this.objs.push(JSON.parse(json));
		return {value: this.objs.length-1};
	}
		
	criar_objeto_via_xml(xml)
	{
		throw new Error("JSON é melhor que XML, use criar_objeto_via_json");
	}
	
	liberar()
	{
		this.objs = [];
	}
	
	liberar_objeto(endereco)
	{
		this.objs[endereco] = false;
	}
	
	obter_json(endereco)
	{
		return {value:JSON.stringify(this.obter_objeto(endereco))};
	}
	
	obter_propriedade_tipo_danese(endereco,propriedade)
	{
		return {value:this.obter_valor_propriedade(endereco,propriedade)};
	}
	
	obter_propriedade_tipo_danese_em_vetor(endereco,propriedade,indice)
	{
		let arr = this.obter_valor_propriedade(endereco,propriedade);
		if(!Array.isArray(arr)) throw new Error("A propriedade '"+propriedade+"' não é um vetor");
		return {value:arr[indice]};
	}
	
	obter_tamanho_vetor_propriedade(endereco,propriedade)
	{
		let arr = this.obter_valor_propriedade(endereco,propriedade);
		if(!Array.isArray(arr)) throw new Error("A propriedade '"+propriedade+"' não é um vetor");
		return {value:arr.length};
	}
	
	tipo_propriedade(endereco,propriedade)
	{
		let prop = this.obter_valor_propriedade(endereco,propriedade);
		
		if(typeof prop === "object")
		{
			if(Array.isArray(prop))
				return {value:this.TIPO_VETOR};
			else if(prop === null)
				throw new Error("Tipo desconhecido 'null'");
			else
				return {value:this.TIPO_OBJETO};
		}
		else if(typeof prop === "boolean")
		return {value:this.TIPO_LOGICO};
		else if(typeof prop === "string")
		return {value:this.TIPO_CADEIA};
		else if(typeof prop === "number")
		return {value:this.TIPO_REAL};
		else throw new Error("Tipo desconhecido '"+(typeof prop)+"'");
	}

}
