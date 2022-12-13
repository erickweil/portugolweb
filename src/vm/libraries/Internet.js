import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../compiler/tokenizer.js";
import { STATE_ASYNC_RETURN, STATE_DELAY_REPEAT, VM_async_return, VM_setDelay } from "../vm.js";

export default class Internet {
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
		this.ocupado = false;
		this.retorno = false;
		this.abortador = false;
		this.tempo = 0;
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
			Android.httpgetcheck(endereco,this.tempo_limite); // eslint-disable-line
			return {state:STATE_ASYNC_RETURN}; 
		}
		else //return {value:"Obter páginas da internet apenas funciona no aplicativo Android, pelo navegador não é possível devido a limitações de segurança que grande parte dos navegadores aplicam."};
		{
			let ret = this.obter_texto(endereco);
			if(ret.state == STATE_DELAY_REPEAT) {
				return ret;
			}

			return {value:ret.__sucess};
		}
	}
	
	obter_texto(endereco)
	{
		if(typeof Android !== 'undefined')
		{
			Android.httpget(endereco,this.tempo_limite); // eslint-disable-line
			return {state:STATE_ASYNC_RETURN}; 
		}
		else// return {value:"Obter páginas da internet apenas funciona no aplicativo Android, pelo navegador não é possível devido a limitações de segurança que grande parte dos navegadores aplicam."};
		{
			if(this.ocupado)
			{
				this.tempo = this.tempo + 1;

				if(this.retorno !== false)
				{
					let ret = this.retorno;
					this.ocupado = false;
					this.retorno = false;	
					this.tempo = 0;
					this.abortador = false;				
					return ret;
				}
				else
				{
					if(this.tempo > this.tempo_limite)
					{
						this.abortador.abort();
						this.ocupado = false;
						this.retorno = false;	
						this.tempo = 0;
						this.abortador = false;	
						return {value:"Tempo limite atingido",__sucess:false};
					}
					else 
					{
						VM_setDelay(1);
						return {state:STATE_DELAY_REPEAT};
					}
				}
			}
			else
			{
				this.ocupado = true;
				this.tempo = 0;
				this.retorno = false;
				this.abortador = new AbortController();
				
				try{
					let that = this;
					fetch(endereco, {method:"GET",  signal: that.abortador.signal})
					.then((response) => {
						// check for error response
						if (!response.ok) {
							// get error message from body or default to response status
							const error = response.status;
							return Promise.reject(error);
						}
				
						return response.text();
					})
					.then((text) => {
						if(!text) {
							return Promise.reject("Resposta Vazia");
						}
				
						that.retorno = {value:""+text,__sucess:true};
					})
					.catch( (reason) => {
						console.log("FETCH --> CATCH:"+reason);
						if (reason.name === 'AbortError') {
							console.log('Fetch aborted');
						} else {
							that.retorno = {value:""+reason,__sucess:false};
						}
					});
				}
				catch(e) {
					console.log("TRY --> CATCH"+e);
					this.ocupado = false;
					this.retorno = false;	
					this.tempo = 0;
					this.abortador = false;	
					return {value:""+e,__sucess:false};
				}

				VM_setDelay(1);
				return {state:STATE_DELAY_REPEAT};
			}
		}
	}
}
