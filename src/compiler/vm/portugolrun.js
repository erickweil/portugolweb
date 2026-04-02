import JsGenerator from "../jsgenerator.js";
import { Parser } from "../parser.js";
import { Tokenizer } from "../tokenizer.js";
import { Compiler } from "../vmcompiler.js";
import { cursorToEnd, numberOfLinesUntil } from "../../extras/extras.js";
import { myClearTimeout, mySetTimeout } from "../../extras/timeout.js";
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
import { escreva, flushEscreva, getCurrentTokenIndex, getScopeFromTokenIndex, STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMgetGlobalVar, VMgetVar, VMrun, VMsetup, VMtoString, VM_async_return, VM_b2s, VM_f2s, VM_getCodeMax, VM_getDelay, VM_getExecJS, VM_i2s, recursiveDeclareArray, limpa, leia, sorteia, VMerro, VM_realbool2s 
} from "./vm.js";
import { checkIsMobile } from "../../extras/mobile.js";
import ServicosWeb from "./libraries/ServicosWeb.js";

function debug_exibe_bytecode(text) {
	try{
		document.getElementById("hidden").innerHTML = text;
	}
	catch(e){
		console.error(e);
	}
}

function _doExec(that,resolve)
{
	let state = that.executarVM();

	if(state == STATE_ENDED)
	{
		resolve(that.div_saida.value);
	}
	else if(state == STATE_DELAY || state == STATE_DELAY_REPEAT)
	{
		mySetTimeout("STATE_DELAY",that.promisefn,VM_getDelay());
	}
	else if(state == STATE_WAITINGINPUT || state == STATE_ASYNC_RETURN)
	{
		if (typeof window !== 'undefined') {
			// BROWSER
			// Vai continuar depois
			if(typeof that.div_saida.focus === 'function')
				that.div_saida.focus();

			cursorToEnd(that.div_saida);
			return;
		} else {
			// NODE
			if(state == STATE_WAITINGINPUT)
			that.div_saida.leia().then((input) => {
				that.div_saida.value += input;
				that.notifyReceiveInput();
			});

			return;
		}
	}
	else if(state == STATE_STEP)
	{
		// não faz nada quando é o passo-a-passo, vai esperar clicar denovo no botão
		return;
	}
	else if(state == STATE_BREATHING)
	{
		mySetTimeout("EXEC",that.promisefn,0);
	}
	else
	{
		throw new Error("Estado desconhecido:"+state);
	}
}

class PararExecucaoError extends Error {
	constructor(message) {
		super(message);
		this.name = "PararExecucaoError";
	}
}

export default class PortugolRuntime {
    constructor(div_saida) {
		this.lastvmState = STATE_ENDED;
		this.lastvmTime = 0;
		this.lastvmStep = false;
		this.errosCount = 0;
		this.execMesmoComErros = false;
		this.mostrar_bytecode = false;
		this.escrever_erros = true;
		this.escrever_debug = false; // Tempo de compilação etc...
		this.escrever_tempo = true; // Programa finalizado etc...
		this.div_saida = div_saida;

		this.libraries = {};
		this.promisefn = false;
		this.isJsRunning = false;
		this._jsStopReject = null;
    }

	getErroMiddleCallback(erroCallback) {
		let that = this;
		return (textInput,token,msg,tipoErro) => {
			let lineNumber = numberOfLinesUntil(token.index,textInput);
			let prev_line = textInput.substring(textInput.lastIndexOf('\n', token.index)+1,token.index).replace(/\t/g,'    ');
			let next_line = textInput.substring(token.index,textInput.indexOf('\n', token.index));
			let colNumber = prev_line.length;
			let logprev = "Linha "+lineNumber+":"+prev_line;
			
			that.errosCount++;
			if(that.escrever_erros) {
				console.error("Linha " + lineNumber + ":" + colNumber + " [" + tipoErro + "] -> " + msg);
			}
			
			// manter no formato de erro esperado pelo Ace Editor
			let erroInfo = {
				row: lineNumber-1,
				column: colNumber,
				columnFim: colNumber+next_line.length,
				textprev: logprev,
				textnext: next_line,
				text: msg, // Or the Json reply from the parser 
				type: "error", // also warning and information
				myErrorType: tipoErro
			};

			if(erroCallback) erroCallback(erroInfo);
			else {
				console.log("token index:"+token.index+" ... "+lineNumber+":"+colNumber+" -> "+msg);
			
				if(erroInfo.text) console.log(erroInfo.text+"\n");

				if(erroInfo.textprev && erroInfo.textnext)
				{
					console.log(
						(erroInfo.textprev+erroInfo.textnext)+"\n"+
						" ".repeat(erroInfo.textprev.length)+"^\n\n"
					);
				}
			}
		};
	}

	iniciarBibliotecas(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys) {
		this.libraries["Util"] = new Util();
		this.libraries["Calendario"] = new Calendario();
		this.libraries["Matematica"] = new Matematica();
		this.libraries["Texto"] = new Texto();
		this.libraries["Objetos"] = new Objetos();
		this.libraries["Tipos"] = new Tipos();
		this.libraries["Internet"] = new Internet();
		this.libraries["ServicosWeb"] = new ServicosWeb(this.libraries["Internet"]);

		// Dependem de graficos
		if(myCanvas && myCanvasModal && myCanvasWindow && myCanvasWindowTitle && myCanvasKeys)
		{
			let isMobile = checkIsMobile(); // || true

			this.libraries["Teclado"] = new Teclado(myCanvas);
			this.libraries["Graficos"] = new Graficos(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys,this.libraries["Teclado"], isMobile);
			this.libraries["Mouse"] = new Mouse(myCanvas);
		}
	}

	executar_step() {
		if(this.lastvmStep && this.lastvmState == STATE_STEP)
		{
			this.promisefn();
		}
	}

	executar(string_cod,compilado,erroCallback,passoapasso)
	{		
		if(!compilado || !compilado.success)
		{
			throw new Error("Tentou executar mas havia erros na compilação");
		}
		
		const that = this;
		if(that.lastvmState == STATE_ENDED)
		{	
			return new Promise((resolve, reject)=> {
				that.lastvmStep = !(!passoapasso); // converte para boolean com o !!
				try{					
					that._prepararMaquina(string_cod,compilado,erroCallback);
				}
				catch(e)
				{
					console.error(e);

					reject("Erro ao preparar a máquina");
					return;
				}

				// Inicia contagem de tempo
				that.lastvmTime = performance.now();

				// Se tem código JS gerado e não é passo a passo, executar direto em JS
				if(compilado.jsgenerator && compilado.jsgenerator.generatedCode && !passoapasso) {
					that._executarJS(compilado).then(resolve).catch(reject);
				} else {
					// Loop Assíncrono de execução
					that.promisefn = ()=>{_doExec(that,resolve);};
					that.promisefn();
				}
		});
		}
	}

	async _executarJS(compilado)
	{
		const that = this;
		that.lastvmState = STATE_RUNNING;
		that.lastvmTime = performance.now();

		// Sinal de parada único: ao rejeitar, cancela leia, promisify e asyncReturn pendentes
		const stopPromise = new Promise((_, reject) => { that._jsStopReject = reject; });
		stopPromise.catch(() => {}); // evitar unhandled rejection quando o programa terminar normalmente
		for(let libName in this.libraries) {
			const lib = this.libraries[libName];
			lib.stopPromise = stopPromise;
			lib.setTimeout = (fun, delay) => {
				flushEscreva();
				mySetTimeout("EXEC", fun, delay);
			};
			lib.asyncReturn = () => {
				flushEscreva();
				this.lastvmState = STATE_ASYNC_RETURN;
				const asyncReturnPromise = new Promise((resolve, reject) => {
					this.promisefn = (retValue) => {
						this.lastvmState = STATE_RUNNING;
						resolve(retValue);
					};
				});
				return Promise.race([asyncReturnPromise, stopPromise]);
			};
		}
		
		const ctx = {
			libraries: this.libraries,
			escreva: escreva,
			limpa: limpa,
			i2s: VM_i2s,
			f2s: VM_f2s,
			b2s: VM_realbool2s,
			newArray: recursiveDeclareArray,
			sorteia: sorteia,
			leia: (tipo) => {
				const leiaPromise = new Promise((resolve, reject) => {
					flushEscreva();
					that.lastvmState = STATE_WAITINGINPUT;
					that.promisefn = () => {
						that.lastvmState = STATE_RUNNING;
						// Quando receber o input, parsear ele e retornar o valor para o programa
						let entrada = leia();
						switch(tipo)
						{
							case "inteiro":
								resolve(parseInt(entrada));
							break;
							case "real":
								resolve(parseFloat(entrada));
							break;
							case "caracter":
								resolve(entrada.charAt(0));
							break;
							case "logico":
								resolve(entrada.trim().toLowerCase() === "verdadeiro");
							break;
							case "cadeia":
							default:
								resolve(entrada);
						}
					};
					if (typeof window !== 'undefined') {
						// BROWSER
						// Vai continuar depois
						if(typeof that.div_saida.focus === 'function')
							that.div_saida.focus();

						cursorToEnd(that.div_saida);
						return;
					} else {
						// NODE
						that.div_saida.leia().then((input) => {
							that.div_saida.value += input;
							that.notifyReceiveInput();
						});
						return;
					}
				});
				return Promise.race([leiaPromise, stopPromise]);
			}		
		};
		
		try
		{
			//let asyncFn = (0, eval)(compilado.jsgenerator.generatedCode);
			// unlike eval(), the Function constructor creates functions that execute in the global scope only.
			const fnGen = new Function(compilado.jsgenerator.generatedCode);
			const asyncFn = fnGen();
			
			// Executar
			this.isJsRunning = true;
			await asyncFn(ctx);
			this.isJsRunning = false;
			flushEscreva();
			this.executarParou("Programa finalizado.");
			return this.div_saida.value;
		}
		catch(e)
		{
			this.isJsRunning = false;
			flushEscreva();
			if(e instanceof PararExecucaoError) {
				// Programa foi interrompido, não é um erro real
				this.executarParou("Programa interrompido pelo usuário.");
			} else {
				console.error("Erro na execução JS:", e);
				VMerro("Erro durante execução: "+e);
				this.executarParou("Programa finalizado com erro.");
			}
			return this.div_saida.value;
		}
		finally
		{
			// Limpar referências do sinal de parada nas bibliotecas
			for(let libName in this.libraries) {
				this.libraries[libName].stopPromise = null;
			}
			this._jsStopReject = null;
		}
	}
	
	_prepararMaquina(string_cod,compilado,erroCallback) {
		// Preparar Máquina
		VMsetup(
			compilado.compiler.functions,
			this.libraries,
			compilado.compiler.scopeList,
			compilado.compiler.globalCount,
			string_cod,
			this.div_saida,
			this.getErroMiddleCallback(erroCallback)
		);
			
		// Para testar compilação se tiver ativado
		if(this.mostrar_bytecode) {
			if(compilado.jsgenerator && compilado.jsgenerator.generatedCode) {
				debug_exibe_bytecode(compilado.jsgenerator.generatedCode);
			} else {
				debug_exibe_bytecode(VMtoString());
			}
		}
	}

	parar()
	{
		// Modo JS (turbo): independente do estado, rejeita a stopPromise via Promise.race.
		// O catch de _executarJS captura o PararExecucaoError e chama executarParou para limpeza.
		if(this.isJsRunning) {
			myClearTimeout("EXEC");
			if(this._jsStopReject) {
				const rej = this._jsStopReject;
				this._jsStopReject = null;
				rej(new PararExecucaoError("Programa interrompido pelo usuário."));
			}
			return true;
		}

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
				
				this.executarParou("Programa interrompido pelo usuário.");
				return true;
			}
			else if(this.lastvmState == STATE_RUNNING || this.lastvmState == STATE_BREATHING)
			{
				this.lastvmState = STATE_PENDINGSTOP; // isso pode dar problema para valores de delay muito altos.
				return false;
			}
			else
			{
				console.log("estado inconsistente: lastvmState:'"+this.lastvmState+"'");
				return false;
			}
		}
		else if(this.lastvmState == STATE_PENDINGSTOP)
		{
			// Se mandar parar denovo faz parar.
			myClearTimeout("EXEC");
			this.executarParou("Programa interrompido pelo usuário.");
			return true;
		}
		else // para deixar o botao do jeito certo, e corrigir no caso de algum erro.
		{
			console.log("botão estava em estado inconsistente: lastvmState:'"+this.lastvmState);
			return false;
		}
		
	}
	
	compilar(string_cod,erroCallback,mayCompileJS)
	{
		let first_Time = performance.now();
		this.errosCount = 0;	
		let last_Time = first_Time;
		let token_Time = 0;
		let tree_Time = 0;
		let compiler_Time = 0;
		let other_Time = 0;

		let erroCounterCallback = this.getErroMiddleCallback(erroCallback);

		try	{
			last_Time = performance.now();
			let tokenizer = new Tokenizer(string_cod,erroCounterCallback);
			let allTokens = tokenizer.tokenize();

			token_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();

			if(!this.execMesmoComErros && this.errosCount > 0)
			{
				return {success:false,"tokenizer":tokenizer};
			}
			
			let relevantTokens = tokenizer.getRelevantTokens();
			let tree = new Parser(relevantTokens,allTokens,string_cod,erroCounterCallback).parse();

			tree_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();
			
			if(!this.execMesmoComErros && this.errosCount > 0)
			{
				return {success:false,"tokenizer":tokenizer,"tree":tree};
			}
			
			let librariesNames = Object.keys(this.libraries);
			for(let i =0;i<librariesNames.length;i++)
			{
				const lib = this.libraries[librariesNames[i]];
				lib.resetar();
			}
			
			let compiler = new Compiler(tree,this.libraries,relevantTokens,string_cod,null,erroCounterCallback);
			compiler.compile();

			compiler_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();
			
			if(!this.execMesmoComErros && this.errosCount > 0)
			{
				return {success:false,"tokenizer":tokenizer,"tree":tree,"compiler":compiler};
			}
			
			let jsgenerator = {generatedCode:false};
			if(mayCompileJS && VM_getExecJS())
			{
				try{
					jsgenerator = new JsGenerator(compiler, tree,this.libraries,relevantTokens,string_cod,erroCounterCallback);
					jsgenerator.compile();	
				}
				catch(e){
					console.error(e);
				}
			}
			
			return {success:true,"tokenizer":tokenizer,"tree":tree,"compiler":compiler,"jsgenerator":jsgenerator};
		}
		finally{
			first_Time = Math.trunc(performance.now()-first_Time);
			other_Time = first_Time - (token_Time + tree_Time + compiler_Time);

			if(this.escrever_debug)
			console.log("Compilou: Tempo de execução:"+first_Time+" milissegundos \n[token:"+token_Time+" ms,tree:"+tree_Time+" ms,compiler:"+compiler_Time+" ms, other:"+other_Time+"]");
		}
	}

	_step() {
		let i = getCurrentTokenIndex();
		let ui = i;
		do
		{
			this.lastvmState = VMrun(1);
		
			//console.log(i+","+ui+","+lastvmState);
			
			ui = i;
			i = getCurrentTokenIndex();
		}
		while( (i == 0 || i == ui) && this.lastvmState == STATE_BREATHING);
	}
	
	executarVM()
	{
		if(this.lastvmState == STATE_PENDINGSTOP) {
			// blz então
			this.executarParou("Programa interrompido pelo usuário.");
			return this.lastvmState;
		}

		let justReceivedInput = this.lastvmState == STATE_WAITINGINPUT;
		this.lastvmState = STATE_RUNNING;
		
		if(this.lastvmStep)
		{
			this._step();
			if(justReceivedInput) {this._step();} // mais uma vez para sair do leia

			//console.log(i+","+ui+","+lastvmState);
			
			if(this.lastvmState == STATE_BREATHING)
			{
				this.lastvmState = STATE_STEP;
				//var btnStep = document.getElementById('btn-step');
				//if(btnStep.className=="clicou")
				//{
				//	mySetTimeout("STATE_STEP",executarVM,1000);
				//}
				//if(btnStep.className=="segurando")
				//{
				//	mySetTimeout("STATE_STEP",executarVM,100);
				//}
			}
		}
		else
		{	
			this.lastvmState = VMrun(VM_getCodeMax());
		}
		
		if(this.lastvmState == STATE_ENDED)
		{
			this.executarParou("Programa finalizado.");
		}

		return this.lastvmState;
	}

	// A entrada deve ser concatenada na div_saída
	notifyReceiveInput()
	{
		if(this.lastvmState == STATE_WAITINGINPUT)
		{
			this.promisefn();
		}
		else
		{
			throw new Error("Não estava esperando input");
		}
	}

	notifyAsyncReturn(retValue)
	{
		if(this.lastvmState == STATE_ASYNC_RETURN)
		{
			if(this.isJsRunning) {
				this.promisefn(retValue);
			} else {
				VM_async_return(retValue);
				this.promisefn();
			}
		}
		else
		{
			throw new Error("Não estava esperando async return");
		}
	}

	executarParou(msg)
	{
		if(this.escrever_tempo)
		escreva("\n\n"+msg+" Tempo de execução:"+Math.trunc(performance.now()-this.lastvmTime)+" milissegundos\n");

		flushEscreva();
		this.promisefn = false;
		this.lastvmState = STATE_ENDED;
		if(this.libraries["Graficos"])
		{
			this.libraries["Graficos"].encerrar_modo_grafico();
		}
	}
	// Para o Passo a Passo
	// Retorna uma lista onde que contém os nomes e valores das variáveis
	getCurrentDeclaredVariables()
	{
		let scope = getScopeFromTokenIndex(getCurrentTokenIndex());
		if(!scope) return [];

		let varTable = [];
		let v = false;
		let index = 0;
		while((v = scope.getVarByIndex(index,false)) != false) {
			const value = VMgetVar(v.index);
			varTable.push({
				...v,
				value: value
			});
			index++;
		}

		index = 0;
		while((v = scope.getVarByIndex(index,true)) != false) {
			const value = VMgetGlobalVar(v.index);
			varTable.push({
				...v,
				value: value
			});
			index++;
		}		

		return varTable;
	}
}