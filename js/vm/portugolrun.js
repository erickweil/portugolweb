import JsGenerator from "../compiler/jsgenerator.js";
import { Parser } from "../compiler/parser.js";
import { Tokenizer } from "../compiler/tokenizer.js";
import { Compiler } from "../compiler/vmcompiler.js";
import { myClearTimeout, mySetTimeout } from "../extras/timeout.js";
import Calendario from "./libraries/Calendario.js";
import Graficos from "./libraries/Graficos.js";
import Internet from "./libraries/Internet.js";
import Matematica from "./libraries/Matematica.js";
import Mouse from "./libraries/Mouse.js";
import Objetos from "./libraries/Objetos.js";
import Teclado from "./libraries/Teclado.js";
import Texto from "./libraries/Texto.js";
import Tipos from "./libraries/Tipos.js";
import Util from "./libraries/Util.js";
import { STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMrun, VMsetup, VMtoString, VM_getCodeMax, VM_getDelay, VM_getExecJS 
} from "./vm.js";

function debug_exibe_bytecode() {
	try{
		document.getElementById("hidden").innerHTML = VMtoString();
	}
	catch(e){
		let myStackTrace = e.stack || e.stacktrace || "";
		console.log(myStackTrace);
	}
}

export default class PortugolRuntime {
    constructor(div_saida) {
		this.lastvmState = STATE_ENDED;
		this.lastvmTime = 0;
		this.lastvmStep = false;
		this.counter = 0;
		this.errosAnnot = [];
		this.execMesmoComErros = false;
		this.mostrar_bytecode = false;
		this.div_saida = div_saida;

		this.libraries = {};
    }

	iniciarBibliotecas(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys) {
		this.libraries["Util"] = new Util();
		this.libraries["Calendario"] = new Calendario();
		this.libraries["Matematica"] = new Matematica();
		this.libraries["Texto"] = new Texto();
		this.libraries["Objetos"] = new Objetos();
		this.libraries["Tipos"] = new Tipos();
		this.libraries["Internet"] = new Internet();

		// Dependem de graficos
		if(myCanvas && myCanvasModal && myCanvasWindow && myCanvasWindowTitle && myCanvasKeys)
		{
			this.libraries["Teclado"] = new Teclado(myCanvas);
			this.libraries["Graficos"] = new Graficos(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys,this.libraries["Teclado"]);
			this.libraries["Mouse"] = new Mouse(myCanvas);
		}
	}

	executar(string_cod,compilado,erroCallback)
	{
		if(!compilado.success)
		{
			throw "Tentou executar mas havia erros na compilação";
		}

		const that = this;
		that.lastvmStep = false;
		if(that.lastvmState == STATE_ENDED)
		{	
			return new Promise((resolve, reject)=> {
				try{					
					// Preparar Máquina
					VMsetup(
						compilado.compiler.functions,
						compilado.jsgenerator.functions,
						that.libraries,
						compilado.compiler.globalCount,
						string_cod,
						that.div_saida,
						erroCallback
					);
					
					// Para testar compilação se tiver ativado
					if(that.mostrar_bytecode) debug_exibe_bytecode();					
				}
				catch(e)
				{
					let myStackTrace = e.stack || e.stacktrace || "";

					console.log(myStackTrace);
				
					if(erroCallback)
					erroCallback(string_cod,{index:0},"Erro ao preparar a máquina:"+e,"vm");
					
					reject("Erro ao preparar a máquina");
					return;
				}

				// Inicia contagem de tempo
				that.lastvmTime = performance.now();

				// Loop de execução
				const tryExec = () => {
					if(that.lastvmState == STATE_PENDINGSTOP)
					{
						that.executarParou();
						return;
					}

					let delay = that.executarVM();

					if(that.lastvmState == STATE_ENDED)
					{
						resolve(that.div_saida.value);
						return;
					}
					else if(that.lastvmState == STATE_DELAY || that.lastvmState == STATE_DELAY_REPEAT)
					{
						mySetTimeout("STATE_DELAY",tryExec,delay);
					}
					else if(that.lastvmState.STATE_WAITINGINPUT || that.lastvmState.STATE_ASYNC_RETURN)
					{
						throw "Não funciona";
					}
					else
					{
						mySetTimeout("EXEC",tryExec,0);
					}
				};
				tryExec();
		});
		}
	}

	parar()
	{
		if(this.lastvmState == STATE_RUNNING || this.lastvmState == STATE_WAITINGINPUT || this.lastvmState == STATE_BREATHING || this.lastvmState == STATE_DELAY || this.lastvmState == STATE_DELAY_REPEAT || this.lastvmState == STATE_STEP || this.lastvmState == STATE_ASYNC_RETURN)
		{
			if(this.lastvmState == STATE_WAITINGINPUT || this.lastvmState == STATE_STEP || this.lastvmState == STATE_ASYNC_RETURN || this.lastvmState == STATE_DELAY || this.lastvmState == STATE_DELAY_REPEAT)
			{
				if(this.lastvmState == STATE_STEP)
				{
					myClearTimeout("STATE_STEP");
				}
				if(this.lastvmState == STATE_DELAY || this.lastvmState == STATE_DELAY_REPEAT)
				{
					myClearTimeout("STATE_DELAY");
				}
				//escreva("\n\nPrograma interrompido pelo usuário. Tempo de execução:"+Math.trunc(performance.now()-this.lastvmTime)+" milissegundos");
				this.executarParou();
			}
			else if(this.lastvmState == STATE_RUNNING || this.lastvmState == STATE_BREATHING)
			{
				this.lastvmState = STATE_PENDINGSTOP; // isso pode dar problema para valores de delay muito altos.
			}
			else
			{
				console.log("estado inconsistente: lastvmState:'"+this.lastvmState+"'");
			}
		}
		else if(this.lastvmState == STATE_PENDINGSTOP)
		{
			// ta idaí?
			this.lastvmState = STATE_PENDINGSTOP; // só para confirmar
		}
		else // para deixar o botao do jeito certo, e corrigir no caso de algum erro.
		{
			console.log("botão estava em estado inconsistente: lastvmState:'"+this.lastvmState);
			//if(lastvmState == STATE_ENDED) btn.value = "Executar";
			//else if(lastvmState == STATE_PENDINGSTOP) btn.value = "Parando...";
			//else btn.value = "Parar";
		}
		
	}
	
	compilar(string_cod,erroCallback,mayCompileJS)
	{
		let erroCount = {value:0};
		let erroCounterCallback = (textInput,token,msg,tipoErro) => {
			erroCount.value++;

			if(erroCallback)
			erroCallback(textInput,token,msg,tipoErro);
			else console.log("Erro ",tipoErro,":",msg);
		};

		let first_Time = performance.now();
		
		let last_Time = first_Time;
		let token_Time = 0;
		let tree_Time = 0;
		let compiler_Time = 0;
		let other_Time = 0;

		try	{
			last_Time = performance.now();
			let tokenizer = new Tokenizer(string_cod,erroCounterCallback);
			tokenizer.tokenize();

			token_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();

			if(!this.execMesmoComErros && erroCount.value > 0)
			{
				return {success:false,"tokenizer":tokenizer};
			}
			
			let relevantTokens = tokenizer.getRelevantTokens();
			let tree = new Parser(relevantTokens,string_cod,erroCounterCallback).parse();

			tree_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();
			
			if(!this.execMesmoComErros && erroCount.value > 0)
			{
				return {success:false,"tokenizer":tokenizer,"tree":tree};
			}
			
			let librariesNames = Object.keys(this.libraries);
			for(let i =0;i<librariesNames.length;i++)
			{
				this.libraries[librariesNames[i]].resetar();
			}
			
			let compiler = new Compiler(tree,this.libraries,relevantTokens,string_cod,null,erroCounterCallback);
			compiler.compile();

			compiler_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();
			
			if(!this.execMesmoComErros && erroCount.value > 0)
			{
				return {success:false,"tokenizer":tokenizer,"tree":tree,"compiler":compiler};
			}
			
			let jsgenerator = {"functions":false};
			if(mayCompileJS && VM_getExecJS())
			{
				try{
					jsgenerator = new JsGenerator(tree,this.libraries,relevantTokens,string_cod,this.div_saida,erroCounterCallback);
					jsgenerator.compile();	
				}
				catch(e){
					let myStackTrace = e.stack || e.stacktrace || "";
					console.log(myStackTrace);
				}
			}
			
			return {success:true,"tokenizer":tokenizer,"tree":tree,"compiler":compiler,"jsgenerator":jsgenerator};
		}
		finally{
			first_Time = Math.trunc(performance.now()-first_Time);
			other_Time = first_Time - (token_Time + tree_Time + compiler_Time);
			console.log("Compilou: Tempo de execução:"+first_Time+" milissegundos \n[token:"+token_Time+" ms,tree:"+tree_Time+" ms,compiler:"+compiler_Time+" ms, other:"+other_Time+"]");
		}
	}
	
	executarVM()
	{
		this.counter++;

		if(this.lastvmState == STATE_PENDINGSTOP) {
			// blz então
			//escreva("\n\nPrograma interrompido pelo usuário. Tempo de execução:"+Math.trunc(performance.now()-this.lastvmTime)+" milissegundos");
			this.executarParou();
			return 0;
		}
		this.lastvmState = STATE_RUNNING;
		

		this.lastvmState = VMrun(VM_getCodeMax());
		
		if(this.lastvmState == STATE_ENDED)
		{
			//escreva("\n\nPrograma finalizado. Tempo de execução:"+Math.trunc(performance.now()-this.lastvmTime)+" milissegundos");
			this.executarParou();
			return 0;
		}
		else if(this.lastvmState == STATE_WAITINGINPUT) {
			//div_saida.focus();
			
			//if(isMobile)
			//setTimeout(function(){window.dispatchEvent(new Event('resize'));}, 200); // pq n funciona?
			
			//cursorToEnd(div_saida);
			return -1;
		}
		else if(this.lastvmState == STATE_BREATHING) {
			return 0;
		}
		else if(this.lastvmState == STATE_DELAY || this.lastvmState == STATE_DELAY_REPEAT) {
			return VM_getDelay();
		}
		else if(this.lastvmState == STATE_ASYNC_RETURN) {
			//?
			return -1;
		}
	}

	executarParou()
	{
		this.lastvmState = STATE_ENDED;
		if(this.libraries["Graficos"] && this.libraries["Graficos"].telaCheia)
		{
			this.libraries["Graficos"].encerrar_modo_grafico();
		}
	}
}