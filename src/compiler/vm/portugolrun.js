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
import { escreva, getCurrentTokenIndex, getScopeFromTokenIndex, STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMgetGlobalVar, VMgetVar, VMrun, VMsetup, VMtoString, VM_async_return, VM_b2s, VM_f2s, VM_getCodeMax, VM_getDelay, VM_getExecJS, VM_i2s 
} from "./vm.js";
import { checkIsMobile } from "../../extras/mobile.js";

function debug_exibe_bytecode() {
	try{
		document.getElementById("hidden").innerHTML = VMtoString();
	}
	catch(e){
		let myStackTrace = e.stack || e.stacktrace || "";
		console.log(myStackTrace);
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
		throw "Estado desconhecido:"+state;
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
				try {
					let obj = {};
					console.log(obj.erro.erromesmo);
				} catch (e) {
					let myStackTrace = e.stack || e.stacktrace || "";
					
					console.log(myStackTrace);
				}
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
			throw "Tentou executar mas havia erros na compilação";
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
					let myStackTrace = e.stack || e.stacktrace || "";
					console.log(myStackTrace);

					reject("Erro ao preparar a máquina");
					return;
				}

				// Inicia contagem de tempo
				that.lastvmTime = performance.now();

				// Loop Assíncrono de execução
				that.promisefn = ()=>{_doExec(that,resolve);};
				that.promisefn();
		});
		}
	}

	_prepararMaquina(string_cod,compilado,erroCallback) {
		// Preparar Máquina
		VMsetup(
			compilado.compiler.functions,
			compilado.jsgenerator.functions,
			this.libraries,
			compilado.compiler.scopeList,
			compilado.compiler.globalCount,
			string_cod,
			this.div_saida,
			this.getErroMiddleCallback(erroCallback)
		);
			
		// Para testar compilação se tiver ativado
		if(this.mostrar_bytecode) debug_exibe_bytecode();
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
				this.libraries[librariesNames[i]].resetar();
			}
			
			let compiler = new Compiler(tree,this.libraries,relevantTokens,string_cod,null,erroCounterCallback);
			compiler.compile();

			compiler_Time = Math.trunc(performance.now() - last_Time);
			last_Time = performance.now();
			
			if(!this.execMesmoComErros && this.errosCount > 0)
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
			throw "Não estava esperando input";
		}
	}

	notifyAsyncReturn(retValue)
	{
		if(this.lastvmState == STATE_ASYNC_RETURN)
		{
			VM_async_return(retValue);
			//executarVM();
			this.promisefn();
		}
		else
		{
			throw "Não estava esperando async return";
		}
	}

	executarParou(msg)
	{
		if(this.escrever_tempo)
		escreva("\n\n"+msg+" Tempo de execução:"+Math.trunc(performance.now()-this.lastvmTime)+" milissegundos");

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