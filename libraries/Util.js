class Util {
	constructor() {
		this.members = {
		"aguarde":{id:T_parO,parameters:[T_inteiro],type:T_vazio},
		"numero_elementos":{id:T_parO,parameters:[T_squareO],type:T_inteiro},
		"numero_colunas":{id:T_parO,parameters:[T_squareO],type:T_inteiro},
		"numero_linhas":{id:T_parO,parameters:[T_squareO],type:T_inteiro},
		"sorteia":{id:T_parO,parameters:[T_inteiro,T_inteiro],type:T_inteiro},
		"tempo_decorrido":{id:T_parO,parameters:[],type:T_inteiro}
		};
		
		this.time = new Date().getTime();
	}
	
	aguarde(intervalo)
	{
		VM_delay = intervalo;
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
