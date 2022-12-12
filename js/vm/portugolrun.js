import { Parser } from "../compiler/parser.js";
import { htmlEntities, Tokenizer } from "../compiler/tokenizer.js";
import { Compiler } from "../compiler/vmcompiler.js";
import { numberOfLinesUntil } from "../extras/extras.js";
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
import { escreva, getCurrentTokenIndex, getTokenIndex, limpa, STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMrun, VMsetup, VMtoString, VM_getCodeMax, VM_getDelay, VM_getExecJS 
} from "./vm.js";

var libraries = {};
libraries["Util"] = new Util();
libraries["Calendario"] = new Calendario();
libraries["Matematica"] = new Matematica();
libraries["Texto"] = new Texto();
//libraries["Teclado"] = new Teclado(myCanvas);
//libraries["Graficos"] = new Graficos(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys,libraries["Teclado"]);
//libraries["Mouse"] = new Mouse(myCanvas);
libraries["Objetos"] = new Objetos();
libraries["Tipos"] = new Tipos();
libraries["Internet"] = new Internet();

function enviarErro(textInput,token,msg,tipoErro)
{
	var lineNumber = numberOfLinesUntil(token.index,textInput);
	var prev_line = textInput.substring(textInput.lastIndexOf('\n', token.index)+1,token.index).replace(/\t/g,'    ');
	var next_line = textInput.substring(token.index,textInput.indexOf('\n', token.index));
	var colNumber = prev_line.length;
	var logprev = "Linha "+lineNumber+":"+prev_line;
	/*
	try {
		throw "ERRO"
	} catch (e) {
		var myStackTrace = e.stack || e.stacktrace || "";
		
		console.log(myStackTrace);
	}
	*/
	console.log("token index:"+token.index+" ... "+lineNumber+":"+colNumber+" -> "+msg);
	
	_enviarErroAnnot(//(lineNumber,colNumber,colNumber+next_line.length,msg,tipoErro);
	{
		row: lineNumber-1,
		column: colNumber,
		columnFim: colNumber+next_line.length,
		textprev: logprev,
		textnext: next_line,
		text: msg, // Or the Json reply from the parser 
		type: "error", // also warning and information
		myErrorType: tipoErro
	});
}

function _enviarErroAnnot(annot)
{
	if(!annot) return;
	
	let txt = ""
	txt += htmlEntities(annot.text)+"\n";
	if(annot.textprev && annot.textnext)
	{
		txt += htmlEntities(annot.textprev+annot.textnext)+"\n";
		txt += " ".repeat(annot.textprev.length)+"^\n\n";
	}
	console.error(txt)
	/*if(annot.text)
	errosSaida.innerHTML += htmlEntities(annot.text)+"\n";
	if(annot.textprev && annot.textnext)
	{
		errosSaida.innerHTML += htmlEntities(annot.textprev+annot.textnext)+"\n";
		errosSaida.innerHTML += " ".repeat(annot.textprev.length)+"^\n\n";
	}
	errosAnnot.push(annot);
	editor.getSession().setAnnotations(errosAnnot);
	
	errosMarkers.push(editor.getSession().addMarker(new Range(annot.row, 0, annot.row, annot.columnFim), 'ace_erroportugol-marker', 'screenLine'));*/
}


export default class PortugolRuntime {
    constructor() {
		this.lastvmState = STATE_ENDED;
		this.lastvmTime = 0;
		this.lastvmStep = false;
		this.counter = 0;
		this.errosAnnot = [];
		this.execMesmoComErros = false;
		this.mostrar_bytecode = false;
		this.saida = {value:"",scrollTop:0};
    }

	executar(string_cod)
	{
		const that = this;
		that.lastvmStep = false;
		if(that.lastvmState == STATE_ENDED)
		{	
			return new Promise((resolve, reject)=> {
				that.limparErros();	
				// abrir hotbar e animar
				//if(isMobile)
				//{
					//if(hotbar_yOffset < hotbar_extendedyOffset)
					//setHotbarPosition(hotbar_extendedyOffset,true);
				//}
				
				//var string_cod = editor.getValue();
				try{
				
					var compilado = that.compilar(string_cod,true);
					
					//lastvm = new Vm(compiler.functions,string_cod,div_saida);
					if(!compilado.success)
					{
						reject("Erro na compilação");
						return;
					}
					
					VMsetup(compilado.compiler.functions,compilado.jsgenerator.functions,libraries,compilado.compiler.globalCount,string_cod,that.saida);
					
					try{
						if(that.mostrar_bytecode)
						document.getElementById("hidden").innerHTML = VMtoString();
					}
					catch(e){
						var myStackTrace = e.stack || e.stacktrace || "";
						console.log(myStackTrace);
					}
					//lastvmState = lastvm.run();
					that.lastvmTime = performance.now();
					
				}
				catch(e)
				{
					let myStackTrace = e.stack || e.stacktrace || "";

					console.log(myStackTrace);
				
					enviarErro(string_cod,{index:0},"Erro na compilação:"+e,"compilador");
					reject("Erro na compilação");
					return;
				}

				//autoSave();
				that.limparErros();
				limpa();

				const tryExec = () => {
					let delay = that.executarVM()

					if(that.lastvmState == STATE_ENDED)
					{
						resolve(that.saida.value);
						return;
					}
					else if(that.lastvmState == STATE_DELAY || that.lastvmState == STATE_DELAY_REPEAT)
					{
						mySetTimeout("EXEC",tryExec,delay);
					}
					else if(that.lastvmState.STATE_WAITINGINPUT || that.lastvmState.STATE_ASYNC_RETURN)
					{
						throw "Não funciona"
					}
					else
					{
						mySetTimeout("EXEC",tryExec,0);
					}
				}
				tryExec()

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
				console.log("botão estava em estado inconsistente: lastvmState:'"+this.lastvmState+"'");
			}
		}
		else if(this.lastvmState == STATE_PENDINGSTOP)
		{
			// ta idaí?
			this.lastvmState = STATE_PENDINGSTOP; // só para confirmar
		}
		else // para deixar o botao do jeito certo, e corrigir no caso de algum erro.
		{
			//console.log("botão estava em estado inconsistente: lastvmState:'"+lastvmState+"' e valor:'"+btn.value+"'");
			//if(lastvmState == STATE_ENDED) btn.value = "Executar";
			//else if(lastvmState == STATE_PENDINGSTOP) btn.value = "Parando...";
			//else btn.value = "Parar";
		}
		
	}
	
	compilar(string_cod,mayCompileJS)
	{
		let nErrosInicio = this.errosAnnot.length;
		
		let tokenizer = new Tokenizer(string_cod,enviarErro);
		tokenizer.tokenize()
		//console.log(tokenizer.tokenize());
		if(!this.execMesmoComErros && this.errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer};
			//myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		//div_port.innerHTML = tokenizer.formatHTML();
		
		var relevantTokens = tokenizer.getRelevantTokens();
		var tree = new Parser(relevantTokens,string_cod,enviarErro).parse();
		//console.log(tree);
		if(!this.execMesmoComErros && this.errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer,"tree":tree};
			//myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		var librariesNames = Object.keys(libraries);
		for(var i =0;i<librariesNames.length;i++)
		{
			libraries[librariesNames[i]].resetar();
		}
		
		var compiler = new Compiler(tree,libraries,relevantTokens,string_cod,null,enviarErro);
		compiler.compile();
		if(!this.execMesmoComErros && this.errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer,"tree":tree,"compiler":compiler};
			//myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		var jsgenerator = {"functions":false};
		if(mayCompileJS && VM_getExecJS())
		{
			/*try{
				jsgenerator = new JsGenerator(tree,libraries,relevantTokens,string_cod,div_saida);
				jsgenerator.compile();
				
			}
			catch(e){
				var myStackTrace = e.stack || e.stacktrace || "";
				console.log(myStackTrace);
			}*/
		}
		
		{
			let ret = {success:true,"tokenizer":tokenizer,"tree":tree,"compiler":compiler,"jsgenerator":jsgenerator};
			//myPortugolCompleter.setCompiler(ret);
			return ret;
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
		
		//VM_saidaDiv.value = VM_saida;
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
			//mySetTimeout("STATE_BREATHING",() => {that.executarVM()}, 0); // permite o navegador ficar responsivo
			return 0
		}
		else if(this.lastvmState == STATE_DELAY || this.lastvmState == STATE_DELAY_REPEAT) {
			//mySetTimeout("STATE_DELAY",() => {that.executarVM()}, VM_getDelay());
			return VM_getDelay();
		}
	}

	executarParou()
	{
		this.lastvmState = STATE_ENDED;
		//document.getElementById("btn-run").value = "Executar";
		//myCanvasModal.style.display = "none";
		if(libraries["Graficos"] && libraries["Graficos"].telaCheia)
		{
			libraries["Graficos"].encerrar_modo_grafico();
		}
		//limparErros();
	}
	
	erro(token,msg)
	{
		enviarErro(this.input,token,msg,"compilador");
	}

	limparErros(tipoErros)
	{
		/*errosSaida.innerHTML = "";

		
		for(let i=0;i<errosMarkers.length;i++)
		{
			editor.getSession().removeMarker(errosMarkers[i]);
		}
		errosMarkers = [];*/
		
		if(tipoErros)
		{
			// apaga os erros e re-envia os que nao é para apagar
			let _errosAnnot = this.errosAnnot;
			this.errosAnnot = [];
			//editor.getSession().setAnnotations(errosAnnot);
			for(var i=0;i<_errosAnnot.length;i++)
			{
				if(!tipoErros.includes(_errosAnnot[i].myErrorType) && _errosAnnot[i].type == "error")
				{
					_enviarErroAnnot(_errosAnnot[i]);
				}
			}
		}
		else
		{
			this.errosAnnot = [];
			//editor.getSession().setAnnotations(errosAnnot);
		}
	}
}