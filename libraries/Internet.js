class Internet {
	constructor() {
		this.members = {

		"baixar_imagem":{id:T_parO,parameters:[{name:"endereco",type:T_cadeia},{name:"caminho",type:T_cadeia}],type:T_cadeia,jsSafe:false},
		"definir_tempo_limite":{id:T_parO,parameters:[{name:"tempo_limite",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"endereco_disponivel":{id:T_parO,parameters:[{name:"endereco",type:T_cadeia}],type:T_logico,jsSafe:false},
		"obter_texto":{id:T_parO,parameters:[{name:"endereco",type:T_cadeia}],type:T_cadeia,jsSafe:false},
		};
		
		
		this.resetar();
	}
	
	resetar()
	{
		this.tempo_limite = 10000;
	}
	
	baixar_imagem(endereco, caminho)
	{
		return {value:"Não implementado baixar_imagem, ao invés disso, informe esse endereço da internet como o caminho na função carregar_imagem da biblioteca Graficos diretamente."}; 
	}

	definir_tempo_limite(tempo_limite)
	{
		this.tempo_limite = tempo_limite;
	}
	
	endereco_disponivel(endereco)
	{
		if(typeof Android !== 'undefined')
		{
			Android.httpgetcheck(endereco,this.tempo_limite);
			return {state:STATE_ASYNC_RETURN}; 
		}
		else return {value:"Obter páginas da internet apenas funciona no aplicativo Android, pelo navegador não é possível devido a limitações de segurança que grande parte dos navegadores aplicam."};
	}
	
	obter_texto(endereco)
	{
		if(typeof Android !== 'undefined')
		{
			Android.httpget(endereco,this.tempo_limite);
			return {state:STATE_ASYNC_RETURN}; 
		}
		else return {value:"Obter páginas da internet apenas funciona no aplicativo Android, pelo navegador não é possível devido a limitações de segurança que grande parte dos navegadores aplicam."};
	}
}
