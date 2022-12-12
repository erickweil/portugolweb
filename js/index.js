import { checkIsMobile } from "./extras/mobile.js";
import Calendario from "./vm/libraries/Calendario.js";
import Graficos from "./vm/libraries/Graficos.js";
import Internet from "./vm/libraries/Internet.js";
import Matematica from "./vm/libraries/Matematica.js";
import Mouse from "./vm/libraries/Mouse.js";
import Objetos from "./vm/libraries/Objetos.js";
import Teclado from "./vm/libraries/Teclado.js";
import Texto from "./vm/libraries/Texto.js";
import Tipos from "./vm/libraries/Tipos.js";
import Util from "./vm/libraries/Util.js";

import portugolCompleter from "./ace-editor/ace_portugol_completer.js";
import { escreva, getCurrentTokenIndex, getTokenIndex, limpa, STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMrun, VMsetup, VMtoString, VM_async_return, VM_getCodeMax, VM_getDelay, VM_getExecJS, VM_getSaida, VM_getTextInput, VM_setExecJS 
} from "./vm/vm.js";
import { elementIsAllScrolled, getScreenDimensions, httpGetAsync, numberOfLinesUntil } from "./extras/extras.js";
import { htmlEntities, Tokenizer } from "./compiler/tokenizer.js";
import { Parser } from "./compiler/parser.js";
import { Compiler } from "./compiler/vmcompiler.js";
import JsGenerator from "./compiler/jsgenerator.js";
import { myClearTimeout, mySetTimeout } from "./extras/timeout.js";
import { persistentGetValue, persistentStoreValue } from "./extras/persistent.js";


import * as ace from '../lib/ace-src-min-noconflict/ace.js';
	//var codigo = document.getElementById("myEditor");
	const saida = document.getElementById("textAreaSaida");
	const errosSaida =document.getElementById("errorArea");
//for( var i = 0;i< codigos.length;i++)
//{
	//var div_port = codigo;
	let div_saida = saida;
	
	const myCanvasModal = document.getElementById("myCanvasModal");
	const myCanvasWindow = document.getElementById("myCanvasWindow");
	const myCanvasWindowTitle = document.getElementById("myCanvasWindowTitle");
	const myCanvas = document.getElementById("myCanvas");
	const myCanvasKeys = document.getElementById("myCanvasKeys");
	//var string_cod = decodeEntities(div_port.innerHTML);
	let fontSize = 10;
	
	let isMobile = checkIsMobile();
	const hotbar = document.getElementById("hotbar");
    let hotbar_currentY;
    let hotbar_initialY;
	let hotbar_clickY;
	// se mexer nesses numeros tudo para de funcionar deixa assim.
	let hotbar_initialHeight = 200;
	
	let hotbar_minyOffset = 40;
	let hotbar_collapsedyOffset = 80;
	let hotbar_middleyOffset = 120;
	let hotbar_extendedyOffset = 295;
	//var hotbar_maxyOffset = 300;
    let hotbar_yOffset = hotbar_collapsedyOffset;
	let hotbar_active = false;
	let hotbar_textarea = false;
	let hotbar_isDragging = false;
	let mostrar_bytecode = false;


	
	let execMesmoComErros = false;

	let lastvmState = STATE_ENDED;
	let lastvmTime = 0;
	let lastvmStep = false;

	let editor = false;
	//var screenDimension = getScreenDimensions();
	//isMobile = true;
	
	hotbar.addEventListener("touchstart", hotbar_dragStart, false);
	hotbar.addEventListener("touchend", hotbar_dragEnd, false);
	hotbar.addEventListener("touchmove", hotbar_drag, false);
	
	hotbar.addEventListener("mousedown",hotbar_dragStart, false);
	window.addEventListener("mouseup", hotbar_dragEnd, false);
	//hotbar.addEventListener("mouseleave",hotbar_dragEnd, false);
	window.addEventListener("mousemove",hotbar_drag, false);
	
	
	
	window.addEventListener("resize", resizeEditorToFitHotbar);
	

	let libraries = {};
	libraries["Util"] = new Util();
	libraries["Calendario"] = new Calendario();
	libraries["Matematica"] = new Matematica();
	libraries["Texto"] = new Texto();
	libraries["Teclado"] = new Teclado(myCanvas);
	libraries["Graficos"] = new Graficos(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys,libraries["Teclado"]);
	libraries["Teclado"].libGraficos = libraries["Graficos"];
	libraries["Mouse"] = new Mouse(myCanvas);
	libraries["Objetos"] = new Objetos();
	libraries["Tipos"] = new Tipos();
	libraries["Internet"] = new Internet();
	
	if(isMobile) {
		fontSize = 9;
	}

    editor = ace.edit("myEditor",{
			minLines: 10,
			fontSize: fontSize+"pt",
			useSoftTabs: false,
			navigateWithinSoftTabs: false
		}
	);
    editor.setTheme("ace/theme/portugol_dark");
    editor.session.setMode("ace/mode/portugol");
	resizeEditorToFitHotbar();
	if(isMobile) {
		editor.renderer.setShowGutter(false);	
		if(typeof Android === 'undefined')
		{
			editor.setValue("programa\n{\n\tfuncao inicio()\n\t{\n\t\t\n\t\tescreva(\"Baixe o aplicativo na play store:\\n\")\n\t\tescreva(\"https://play.google.com/store/apps/details?id=br.erickweil.portugolweb \\n\")\n\t\t\n\t}\n}\n", -1); // moves cursor to the start
		}
	}
	
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: false, // negócio chato demais, tenho que fazer ficar mais intuitivo antes de ativar
		enableEmmet: false, // oq é Emmet? nem eu sei
		enableLiveAutocompletion: true,
		scrollPastEnd: 0.5
	});
	
	let langTools = ace.require('ace/ext/language_tools');
	let myPortugolCompleter = new portugolCompleter(libraries);
	langTools.setCompleters();		
	langTools.addCompleter(myPortugolCompleter);
	
	editor.commands.on("afterExec", function(e){
     if (e.command.name == "insertstring" && /^[\.]$/.test(e.args)) {
         editor.execCommand("startAutocomplete");
     }
	});
	
	
	let last_code = getAutoSave();
	if(last_code)
		editor.setValue(last_code,-1);
			
	div_saida.style.fontSize = fontSize+"pt";
	errosSaida.style.fontSize = fontSize+"pt";
	

	
	let errosAnnot = [];
	let errosMarkers = [];
	
	let Range = ace.require("ace/range").Range;

	if(isMobile)
	{
		//hotbar.style.display = "block";
		
		//var myOutput = document.getElementById("myOutput");
		//hotbar.appendChild(myOutput);
		//hotbar.insertBefore(document.getElementById("myOutput_buttons"),document.getElementById("hotbar_commands"));
				
		
		document.body.classList.add('mobile');
		//document.getElementById("myEditor").classList.add('mobile');
		//myOutput.classList.add('mobile');
		//document.getElementById("myOutput_buttons").classList.add('mobile');
		//saida.classList.add('mobile');
		mostrarHotbar();
	}
	else
	{
		ocultarHotbar();
	}

	function save() {
		let string_cod = editor.getValue();
		string_cod = string_cod.replace(/\r\n/g,"\n");
		if(typeof Android !== 'undefined')
		{
			Android.save(string_cod); // eslint-disable-line
		}
		else
		{
			let element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string_cod));
			element.setAttribute('download', 'programa.por');

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}
	}
	
	function android_loaded(code){

		editor.setValue(code, -1); // moves cursor to the start

		limparErros();
	}
	
	function android_async_return(retValue)
	{
		if(lastvmState == STATE_ASYNC_RETURN)
		{
			VM_async_return(retValue);
			executarVM();
		}
	}

	function load() {
	
		if(typeof Android !== 'undefined')
		{
			Android.load(); //eslint-disable-line
		}
		else
		{
	
			let element = document.createElement('input');
			element.setAttribute('type', 'file');

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();
			
			element.addEventListener('change', function(){
				let file = element.files[0];

				let reader = new FileReader();
				reader.onload = function(progressEvent)
				{
					editor.setValue(this.result, -1); // moves cursor to the start
					
					limparErros();
				};
				reader.readAsText(file);
				document.body.removeChild(element);
			});
		
		}
	}
	
	function limparErros(tipoErros)
	{
		errosSaida.innerHTML = "";

		
		for(let i=0;i<errosMarkers.length;i++)
		{
			editor.getSession().removeMarker(errosMarkers[i]);
		}
		errosMarkers = [];
		
		if(tipoErros)
		{
			// apaga os erros e re-envia os que nao é para apagar
			let _errosAnnot = errosAnnot;
			errosAnnot = [];
			editor.getSession().setAnnotations(errosAnnot);
			for(let i=0;i<_errosAnnot.length;i++)
			{
				if(!tipoErros.includes(_errosAnnot[i].myErrorType) && _errosAnnot[i].type == "error")
				{
					_enviarErroAnnot(_errosAnnot[i]);
				}
			}
		}
		else
		{
			errosAnnot = [];
			editor.getSession().setAnnotations(errosAnnot);
		}
	}
	
	function realcarLinha(textInput,index,scrollTo)
	{
		let linha = numberOfLinesUntil(index,textInput);
		let prev_line = textInput.substring(textInput.lastIndexOf('\n', index)+1,index).replace(/\t/g,'    ');
		let next_line = textInput.substring(index,textInput.indexOf('\n', index));
		let coluna = prev_line.length;
		let colunaFim = coluna+next_line.length;
		
		errosAnnot.push({
			row: linha-1,
			column: coluna,
			text: "", // Or the Json reply from the parser 
			type: "information" // also warning and information
		});
		editor.getSession().setAnnotations(errosAnnot);
		
		errosMarkers.push(editor.getSession().addMarker(new Range(linha-1, 0, linha-1, colunaFim), 'ace_realceportugol-marker', 'screenLine'));
		
		if(scrollTo)
		{
			editor.scrollToLine(linha, true, true, function () {});
		}
	}
	
	function enviarErro(textInput,token,msg,tipoErro)
	{
		let lineNumber = numberOfLinesUntil(token.index,textInput);
		let prev_line = textInput.substring(textInput.lastIndexOf('\n', token.index)+1,token.index).replace(/\t/g,'    ');
		let next_line = textInput.substring(token.index,textInput.indexOf('\n', token.index));
		let colNumber = prev_line.length;
		let logprev = "Linha "+lineNumber+":"+prev_line;
		
		try {
			throw "ERRO";
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";
			
			console.log(myStackTrace);
		}
		
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
	
	/*function _enviarErro(linha,coluna,colunaFim,msg,tipoErro)
	{

	}*/
	
	function _enviarErroAnnot(annot)
	{
		if(!annot) return;
		
		if(annot.text)
		errosSaida.innerHTML += htmlEntities(annot.text)+"\n";
		if(annot.textprev && annot.textnext)
		{
			errosSaida.innerHTML += htmlEntities(annot.textprev+annot.textnext)+"\n";
			errosSaida.innerHTML += " ".repeat(annot.textprev.length)+"^\n\n";
		}
		errosAnnot.push(annot);
		editor.getSession().setAnnotations(errosAnnot);
		
		errosMarkers.push(editor.getSession().addMarker(new Range(annot.row, 0, annot.row, annot.columnFim), 'ace_erroportugol-marker', 'screenLine'));
	}
	
	function setAutoCompleterState(checked)
	{
		editor.setOptions({ enableBasicAutocompletion: checked, enableLiveAutocompletion: checked });
	}
	
	function setModoTurbo(checkbox)
	{
		VM_setExecJS( (lastvmState == STATE_ENDED) && checkbox.checked);
		checkbox.checked = VM_getExecJS();
		console.log("Modo: "+(VM_getExecJS() ? 'Modo Turbo' : 'Modo Normal'));
	}
	
	function cursorToEnd(textarea)
	{
		let txtEnd =textarea.value.length;
		textarea.selectionStart= txtEnd;
		textarea.selectionEnd= txtEnd;
	}
	
	function fonteAumentar()
	{
		fontSize++;
		editor.setOptions({
			fontSize: fontSize+"pt"
		});
		
		div_saida.style.fontSize = fontSize+"pt";
		errosSaida.style.fontSize = fontSize+"pt";
	}
	
	function fonteDiminuir()
	{
		fontSize--;
		editor.setOptions({
			fontSize: fontSize+"pt"
		});
		
		div_saida.style.fontSize = fontSize+"pt";
		errosSaida.style.fontSize = fontSize+"pt";
	}
	
	function toggleHotbar(show)
	{
		///if(document.getElementById("hotbar_commands").style.display == "block")
		if(!show)
		{
			ocultarHotbar();
			if(isMobile)
			{
				if(hotbar_yOffset > hotbar_middleyOffset)
				{
					setHotbarPosition(hotbar_middleyOffset,true);
				}
			}
		}
		else
		{
			mostrarHotbar();
		}
	}
	
	function mostrarHotbar()
	{
		// se mexer nesses numeros tudo para de funcionar deixa assim.
		hotbar_initialHeight = 200;
		
		
		hotbar_minyOffset = 40;
		hotbar_collapsedyOffset = 80;
		hotbar_middleyOffset = 120;
		hotbar_extendedyOffset = 295;
		hotbar_yOffset = hotbar_collapsedyOffset;
		
		document.getElementById("hotbar_commands").style.display = "block";
		
		document.getElementById("hotbar_keys").style.display = "block";
		
		//document.getElementById("btn-mostrar-hotbar").value = "Ocultar";
		document.getElementById("check-mostrar-hotbar").checked = true;
		
		setHotbarPosition(hotbar_middleyOffset);
	}
	
	function ocultarHotbar()
	{
		// se mexer nesses numeros tudo para de funcionar deixa assim.
		hotbar_initialHeight = 200 - 80;
		
		hotbar_minyOffset = 40;
		hotbar_collapsedyOffset = 80 - 80;
		hotbar_middleyOffset = 120 - 80;
		hotbar_extendedyOffset = 295 - 80;
		//hotbar_maxyOffset = hotbar_maxyOffset + 600;
		hotbar_yOffset = 0;
		//hotbar.style.display = "none";
		
		document.getElementById("hotbar_commands").style.display = "none";
		
		document.getElementById("hotbar_keys").style.display = "none";
		
		//document.getElementById("btn-mostrar-hotbar").value = "Mostrar";
		document.getElementById("check-mostrar-hotbar").checked = false;
		
		setHotbarPosition(hotbar_extendedyOffset);
	}
	
	function check_execErros()
	{
		// Get the checkbox
		let btn = document.getElementById("btn-execErros");

		// If the checkbox is checked, display the output text
		execMesmoComErros = !execMesmoComErros;
		if(!execMesmoComErros)
			btn.value = "Ignorar Erros";
		else
			btn.value = "Parar em Erros";
	}
	
	//alert(string_cod);
	//div_port.innerHTML = token_replace(string_cod);
	/*function executar()
	{
		limparErros();
		var string_cod = editor.getValue();
		
		var tokenizer = new Tokenizer(string_cod);
		console.log(tokenizer.tokenize());
		
		//div_port.innerHTML = tokenizer.formatHTML();
		
		var relevantTokens = tokenizer.getRelevantTokens();
		var tree = new Parser(relevantTokens,string_cod).parse();
		console.log(tree.funcoes[0].statements);
		
		var interpreter = new Interpreter(tree,relevantTokens,string_cod,div_saida);
		interpreter.run();
	}*/
	
	//var lastvm = false;

	
	function exemplo(nome)
	{
		if(nome == "aleatorio")
		{
			nome+=  Math.floor(Math.random() * 4);
		}
		httpGetAsync("exemplos/"+nome+".por",
		function(code)
		{
			editor.setValue(code, -1); // moves cursor to the start
			limparErros();
		}
		);
		document.getElementById('modalExemplos').style.display = 'none';
	}
	
	function compilar(string_cod,mayCompileJS)
	{
		let first_Time = performance.now();
		
		let last_Time = first_Time;
		let token_Time = 0;
		let tree_Time = 0;
		let compiler_Time = 0;
		let other_Time = 0;

		try{
			let nErrosInicio = errosAnnot.length;
		string_cod = string_cod.replace(/\r\n/g,"\n");
		
		
		last_Time = performance.now();
		
		let tokenizer = new Tokenizer(string_cod,enviarErro);
		//console.log(tokenizer.tokenize());
		tokenizer.tokenize();
		
		token_Time = Math.trunc(performance.now() - last_Time);
		last_Time = performance.now();
		
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		//div_port.innerHTML = tokenizer.formatHTML();
		
		let relevantTokens = tokenizer.getRelevantTokens();
		let tree = new Parser(relevantTokens,string_cod,enviarErro).parse();
		//console.log(tree);
		
		tree_Time = Math.trunc(performance.now() - last_Time);
		last_Time = performance.now();
		
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer,"tree":tree};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		let librariesNames = Object.keys(libraries);
		for(let i =0;i<librariesNames.length;i++)
		{
			libraries[librariesNames[i]].resetar();
		}
		
		let compiler = new Compiler(tree,libraries,relevantTokens,string_cod,div_saida,enviarErro);
		compiler.compile();
		
		compiler_Time = Math.trunc(performance.now() - last_Time);
		last_Time = performance.now();
		
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			let ret = {success:false,"tokenizer":tokenizer,"tree":tree,"compiler":compiler};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		let jsgenerator = {"functions":false};
		if(mayCompileJS && VM_getExecJS())
		{
			try{
				jsgenerator = new JsGenerator(tree,libraries,relevantTokens,string_cod,enviarErro);
				jsgenerator.compile();
				
			}
			catch(e){
				let myStackTrace = e.stack || e.stacktrace || "";
				console.log(myStackTrace);
			}
		}
		
		let ret = {success:true,"tokenizer":tokenizer,"tree":tree,"compiler":compiler,"jsgenerator":jsgenerator};
		myPortugolCompleter.setCompiler(ret);
		return ret;
		}
		finally
		{
			first_Time = Math.trunc(performance.now()-first_Time);
			other_Time = first_Time - (token_Time + tree_Time + compiler_Time);
			console.log("Compilou: Tempo de execução:"+first_Time+" milissegundos \n[token:"+token_Time+" ms,tree:"+tree_Time+" ms,compiler:"+compiler_Time+" ms, other:"+other_Time+"]");
		}
	}
	
	function executar(btn,passoapasso)
	{
		if(passoapasso && lastvmState == STATE_STEP)
		{
		
			// abrir hotbar e animar
			//if(isMobile)
			//{
				if(hotbar_yOffset < hotbar_extendedyOffset)
				setHotbarPosition(hotbar_extendedyOffset,true);
			//}
		
			executarVM();
			return;
		}
	
		lastvmStep = passoapasso;
		if(btn.value == "Executar" && lastvmState == STATE_ENDED)
		{
			autoSave();
			limparErros();
			limpa();
			
			// abrir hotbar e animar
			//if(isMobile)
			//{
				if(hotbar_yOffset < hotbar_extendedyOffset)
				setHotbarPosition(hotbar_extendedyOffset,true);
			//}
			
			let string_cod = editor.getValue();
			try{
			
				let compilado = compilar(string_cod,true);
				
				//lastvm = new Vm(compiler.functions,string_cod,div_saida);
				if(!compilado.success)
				{
					return;
				}
				
				VMsetup(compilado.compiler.functions,compilado.jsgenerator.functions,libraries,compilado.compiler.globalCount,string_cod,div_saida,enviarErro);
				
				try{
					if(mostrar_bytecode)
					document.getElementById("hidden").innerHTML = VMtoString();
				}
				catch(e){
					let myStackTrace = e.stack || e.stacktrace || "";
					console.log(myStackTrace);
				}
				//lastvmState = lastvm.run();
				lastvmTime = performance.now();
				
			}
			catch(e)
			{
				let myStackTrace = e.stack || e.stacktrace || "";

				console.log(myStackTrace);
			
				enviarErro(string_cod,{index:0},"Erro na compilação:"+e,"compilador");
				return;
			}
			
			btn.value = "Parar";
			executarVM();
		}
		else if(!passoapasso) // não faz nada se clicar no passo a passo durante algum delay ou entrada de dados
		{
			if(btn.value == "Parar" && (lastvmState == STATE_RUNNING || lastvmState == STATE_WAITINGINPUT || lastvmState == STATE_BREATHING || lastvmState == STATE_DELAY || lastvmState == STATE_DELAY_REPEAT || lastvmState == STATE_STEP || lastvmState == STATE_ASYNC_RETURN))
			{
				btn.value = "Parando...";
				if(lastvmState == STATE_WAITINGINPUT || lastvmState == STATE_STEP || lastvmState == STATE_ASYNC_RETURN || lastvmState == STATE_DELAY || lastvmState == STATE_DELAY_REPEAT)
				{
					if(lastvmState == STATE_STEP)
					{
						myClearTimeout("STATE_STEP");
					}
					if(lastvmState == STATE_DELAY || lastvmState == STATE_DELAY_REPEAT)
					{
						myClearTimeout("STATE_DELAY");
					}
					escreva("\n\nPrograma interrompido pelo usuário. Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
					executarParou();
				}
				else if(lastvmState == STATE_RUNNING || lastvmState == STATE_BREATHING)
				{
					lastvmState = STATE_PENDINGSTOP; // isso pode dar problema para valores de delay muito altos.
				}
				else
				{
					console.log("botão estava em estado inconsistente: lastvmState:'"+lastvmState+"' e valor:'"+btn.value+"'");
				}
			}
			else if(btn.value == "Parando..." && lastvmState == STATE_PENDINGSTOP)
			{
				// ta idaí?
				lastvmState = STATE_PENDINGSTOP; // só para confirmar
			}
			else // para deixar o botao do jeito certo, e corrigir no caso de algum erro.
			{
				console.log("botão estava em estado inconsistente: lastvmState:'"+lastvmState+"' e valor:'"+btn.value+"'");
				if(lastvmState == STATE_ENDED) btn.value = "Executar";
				else if(lastvmState == STATE_PENDINGSTOP) btn.value = "Parando...";
				else btn.value = "Parar";
			}
		}
	}
	
	function executarParou()
	{
		lastvmState = STATE_ENDED;
		document.getElementById("btn-run").value = "Executar";
		myCanvasModal.style.display = "none";
		if(libraries["Graficos"].telaCheia)
		{
			libraries["Graficos"].encerrar_modo_grafico();
		}
		//limparErros();
	}
	
	function executarStepStart(btn)
	{
		//onmousedown="this.className = 'clicou';executar(document.getElementById('btn-run'),true);this.className = 'segurando';" onmouseup="executarStepPause();this.className = '';"
		
		// Assim vai dar um delay maior no primeiro clique, mas se segurar o botão, executa a 10 linhas por segundo
		btn.className = 'clicou';
		executar(document.getElementById('btn-run'),true);
		btn.className = 'segurando';
	}
	
	// soltou o botao
	function executarStepPause(btn)
	{
		myClearTimeout("STATE_STEP");
		btn.className = '';
	}
	
	function executarVM()
	{
		if(lastvmState == STATE_PENDINGSTOP) {
			// blz então
			escreva("\n\nPrograma interrompido pelo usuário. Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
			executarParou();
			return;
		}
		lastvmState = STATE_RUNNING;
		
		if(lastvmStep)
		{

			let i = getCurrentTokenIndex();
			let ui = i;
			
			limparErros();
			realcarLinha(VM_getTextInput(),i,true);
			
			do
			{
				lastvmState = VMrun(1);
			
				//console.log(i+","+ui+","+lastvmState);
				
				ui = i;
				i = getCurrentTokenIndex();
			}
			while( (i == 0 || i == ui) && lastvmState == STATE_BREATHING);
			
			//console.log(i+","+ui+","+lastvmState);
			
			if(lastvmState == STATE_BREATHING)
			{
				lastvmState = STATE_STEP;
				let btnStep = document.getElementById('btn-step');
				if(btnStep.className=="clicou")
				{
					mySetTimeout("STATE_STEP",executarVM,1000);
				}
				if(btnStep.className=="segurando")
				{
					mySetTimeout("STATE_STEP",executarVM,100);
				}
			}
		}
		else
		{	
			lastvmState = VMrun(VM_getCodeMax());
		}
		//VM_saidaDiv.value = VM_saida;
		if(lastvmState == STATE_ENDED)
		{
			escreva("\n\nPrograma finalizado. Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
			executarParou();
		}
		else if(lastvmState == STATE_WAITINGINPUT) {
			div_saida.focus();
			
			//if(isMobile)
			//setTimeout(function(){window.dispatchEvent(new Event('resize'));}, 200); // pq n funciona?
			
			cursorToEnd(div_saida);
		}
		else if(lastvmState == STATE_BREATHING) {
			mySetTimeout("STATE_BREATHING",executarVM, 0); // permite o navegador ficar responsivo
		}
		else if(lastvmState == STATE_DELAY || lastvmState == STATE_DELAY_REPEAT) {
			mySetTimeout("STATE_DELAY",executarVM, VM_getDelay());
		}
	}
	
	function receiveInput(textarea)
	{
		if(lastvmState == STATE_WAITINGINPUT)
		{
			let saidadiv = textarea.value;
			let entrada = saidadiv.substring(VM_getSaida().length,saidadiv.length);
			
			if(entrada.endsWith("\n"))
			{
				executarVM();
			}
		}
		else
		{
			div_saida.value = VM_getSaida();
		}
	}
	
	function editorFocus()
	{
		//if(isMobile)
		//{
			//document.getElementById("hotbar").style.display = "block";
			if(isMobile)
			{
				if(hotbar_yOffset > hotbar_middleyOffset)
				{
					setHotbarPosition(hotbar_middleyOffset,true);
				}
			}
			else
			{
				if(hotbar_yOffset > hotbar_extendedyOffset)
				{
					setHotbarPosition(hotbar_extendedyOffset,true);
				}
			}
		//}
	}
	
	function preventFocusCanvas(event) {
		event.preventDefault();
		event.stopPropagation();

		myCanvas.focus();
	}
		
	function preventFocus(event) {
		event.preventDefault();
		event.stopPropagation();
		/*if (event.relatedTarget) {
			// Revert focus back to previous blurring element
			event.relatedTarget.focus();
		} else {
			// No previous focus target, blur instead
			event.currentTarget.blur();
		}*/
		editor.focus();
	}
	
	/*function editorBlur()
	{
		if(isMobile)
		{
			document.getElementById("hotbar").style.display = "none";
		}
	}*/	
	
	function editorCommand(keycode)
	{
		//var KEY_MODS= {
        //    "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
        //    "super": 8, "meta": 8, "command": 8, "cmd": 8
        //};
		/*
		        FUNCTION_KEYS : {
            8  : "Backspace",
            9  : "Tab",
            13 : "Return",
            19 : "Pause",
            27 : "Esc",
            32 : "Space",
            33 : "PageUp",
            34 : "PageDown",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
            44 : "Print",
            45 : "Insert",
            46 : "Delete",
            96 : "Numpad0",
            97 : "Numpad1",
            98 : "Numpad2",
            99 : "Numpad3",
            100: "Numpad4",
            101: "Numpad5",
            102: "Numpad6",
            103: "Numpad7",
            104: "Numpad8",
            105: "Numpad9",
            '-13': "NumpadEnter",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

		*/
		
		editor.onCommandKey({}, 0, keycode);
	}
	function editorType(c)
	{
		editor.onTextInput(c);
		

		//isTyping = true;
		//editor.getSession().insert(editor.getCursorPosition(), c);
		//editor.focus();
		
		//if(shift)
		//{
		//	editor.onCommandKey({}, KEY_MODS.shift, keycode);
		//}//
		//else
		//editor.onCommandKey({}, -1, keycode);
	}
	
	function editorMove(column,row)
	{
		editor.gotoLine((editor.getCursorPosition().row+1) + row, editor.getCursorPosition().column + column); 
	}
	
	function editorDelete()
	{
		let p = editor.getCursorPosition();
		editor.getSession().replace(new Range(p.row, p.column, p.row, p.column+1), "");
	}
	
	function GraficosBtnTypeDown(t)
	{
		libraries["Teclado"].tecladoDown({preventDefault:function(){},key:t},t);
	}
	
	function GraficosBtnTypeUp(t)
	{
		libraries["Teclado"].tecladoUp({preventDefault:function(){},key:t},t);
	}
	//editor.on("blur", editorBlur);
	
	// HOTBAR
	
	function hideHotBarWhenLandscape()
	{
	/*
		//que ideia ridícula era essa afinal.
		
		var screenDimension = getScreenDimensions();
		
		console.log("hideHotBarWhenLandscape :screenDimension");
		if(isMobile)
		{
			if(screenDimension.width > screenDimension.height)
			{
				ocultarHotbar();
				if(hotbar_yOffset > hotbar_middleyOffset)
				{
					setHotbarPosition(hotbar_middleyOffset,true);
				}
			}
		}
		
		if(hotbar_yOffset > screenDimension.height)
		{
			setHotbarPosition(screenDimension.height,false);
		}
	*/
	}
	
	function hotbar_dragStart(e) {
		let yValue = 0;
		if (e.type === "touchstart") {
			yValue = -e.touches[0].clientY;
		} else {
			yValue = -e.clientY;
		}
		
		hotbar_clickY = yValue;
		hotbar_initialY = yValue - hotbar_yOffset;

		//console.log("click:"+hotbar_clickY);
		if(e.target === errosSaida)
		{
			// nada. deixa quieto
		}
		else if(e.target === saida)
		{
			hotbar_textarea = true;
		}
		else if (e.target === hotbar || e.type !== "touchstart") {
			hotbar_active = true;
		}
		
		
    }

    function hotbar_dragEnd(e) {
		if(e.type !== "touchend")
		{
			if(!hotbar_active) return; // só passou o mouse
			
			hotbar.style.cursor = "grab";
		}
		//initialX = currentX;
		hotbar_initialY = hotbar_currentY;

		
		
		/*if(hotbar_yOffset > (hotbar_extendedyOffset + 30))
		{
			setHotbarPosition(hotbar_maxyOffset,true);
		}
		else */
		if(hotbar_yOffset > (hotbar_middleyOffset + 30) && hotbar_yOffset < hotbar_extendedyOffset)
		{
			setHotbarPosition(hotbar_extendedyOffset,true);
		}
		else if(Math.abs(hotbar_yOffset - hotbar_middleyOffset) < 30)
		{
			setHotbarPosition(hotbar_middleyOffset,true);
		}
		else if(Math.abs(hotbar_yOffset - hotbar_collapsedyOffset) < 30)
		{
			setHotbarPosition(hotbar_collapsedyOffset,true);
		}
		else if(Math.abs(hotbar_yOffset - hotbar_minyOffset) < 30)
		{
			setHotbarPosition(hotbar_minyOffset,true);
		}
		else
		{
			resizeEditorToFitHotbar();
		}


		hotbar_active = false;
		hotbar_textarea = false;
		hotbar_isDragging = false;
    }

    function hotbar_drag(e) {
		let yValue = 0;
		if (e.type === "touchmove") {
			yValue = -e.touches[0].clientY;
		} else {
			if(!hotbar_active) return; // só passou o mouse
			yValue = -e.clientY;
			
			hotbar.style.cursor = "grabbing";
		}
		
		let hotbar_lastY = hotbar_currentY;
		hotbar_currentY = yValue - hotbar_initialY;
		let yOff = Math.abs(hotbar_clickY - yValue);
		//console.log("drag:"+hotbar_initialY);
		
		
	
		if (!hotbar_active) {
		
			if(hotbar_textarea && !elementIsAllScrolled(saida))
			{
				hotbar_clickY = yValue;
				hotbar_initialY = yValue - hotbar_yOffset;
				return;
			}
		
			if(yOff < 20)
			{
				return;
			}
			else
			{
				hotbar_active = true;
			}
		}
		else
		{
			if(e.cancelable)
			{
				e.preventDefault();
			}
		}

		//xOffset = currentX;
		

		//setTranslate(hotbar_currentY, hotbar);
		setHotbarPosition(hotbar_currentY,false,true);
		
		if(!hotbar_isDragging)
		resizeEditorMax();
		
		hotbar_isDragging = true;
    }

    function setHotbarPosition(yPos,animate,fastUpdates) {
		if(animate)
		{
			hotbar.classList.add('animate');
		}
		else
		{
			hotbar.classList.remove('animate');
		}
		
		
		//el.style.transform = "translate3d(0px,	  " + yPos + "px, 0)";
		let screenDimension = getScreenDimensions();
		hotbar_yOffset = Math.max(hotbar_minyOffset,yPos);
		hotbar_yOffset = Math.min(hotbar_yOffset,screenDimension.height-5);
		//hotbar_yOffset = Math.min(hotbar_maxyOffset,yPos);
		hotbar.style.bottom = (hotbar_yOffset - hotbar_initialHeight)+"px";
		
		if(!fastUpdates)
		resizeEditorToFitHotbar(false);
    }

	function resizeEditorToFitHotbar(e)
	{
		if(!editor) return;

		let h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		
		//if(!isMobile)
		//document.getElementById("myEditor").style.height = (h-hotbar_yOffset+15)+"px";
		//else
		document.getElementById("myEditor").style.height = (h-hotbar_yOffset)+"px";
		editor.resize();
		
		
		let isHotbarVisible = document.getElementById("hotbar_commands").style.display != "none";
		
		
		
		if(!isHotbarVisible)
		saida.style.height = (hotbar_yOffset-50)+"px";
		else
		saida.style.height = (hotbar_yOffset-130)+"px";
		
	}
	
	function resizeEditorMax()
	{
		if(!editor) return;

		let screenDimension = getScreenDimensions();
		
		document.getElementById("myEditor").style.height = (screenDimension.height)+"px";
		editor.resize();
		
		
		saida.style.height = (screenDimension.height)+"px";
	}
	
	//https://stackoverflow.com/questions/821011/prevent-a-webpage-from-navigating-away-using-javascript
	window.onbeforeunload = function() {
	return "";
	};
	
	function autoSave()
	{
		try {
			persistentStoreValue("code",editor.getValue());
			let autoComplete = document.getElementById("check-auto-completar").checked;
			persistentStoreValue("autoComplete",autoComplete);
			
			let modoTurbo = document.getElementById("check-modo-turbo").checked;
			persistentStoreValue("modoTurbo",modoTurbo);
			
			let mostrarHotbar = document.getElementById("check-mostrar-hotbar").checked;
			persistentStoreValue("mostrarHotbar",mostrarHotbar);
			
			
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
	}
	
	function getAutoSave()
	{
		let last_code = persistentGetValue("code");
		//var hideHotbar = (""+persistentGetValue("hideHotbar")) == "true";
		let mostrarHotbar = persistentGetValue("mostrarHotbar");
		let autoComplete = persistentGetValue("autoComplete");
		let modoTurbo = persistentGetValue("modoTurbo");
		
		if(typeof(autoComplete) == "string")
		{
			autoComplete = ""+autoComplete == "true";
			document.getElementById("check-auto-completar").checked = autoComplete;
			setAutoCompleterState(autoComplete);
		}
		else
		{
			document.getElementById("check-auto-completar").checked = true; 
		}
		
		if(typeof(modoTurbo) == "string")
		{
			modoTurbo = ""+modoTurbo == "true";
			document.getElementById("check-modo-turbo").checked = modoTurbo;
			setModoTurbo(document.getElementById("check-modo-turbo"));
		}
		else
		{
			document.getElementById("check-modo-turbo").checked = VM_getExecJS(); 
		}
		
		if(typeof(mostrarHotbar) == "string")
		{
			mostrarHotbar = ""+mostrarHotbar == "true";
			
			
			document.getElementById("check-mostrar-hotbar").checked = mostrarHotbar; 
			toggleHotbar(mostrarHotbar);
		}
		
		return last_code;
	}
	
	setInterval(autoSave, 30000);
	
	
	let _PreCompileLastHash = -1;
	let _PreCompileCompileHash = -1;
	// Para melhorar o auto completar e para não ficar os erros para sempre na tela
	// Talvez vai deixar um pouco mais lento, mas só compila se ficar uns 4 a 5 segundos sem escrever nada
	// Também não compila duas vezes seguidas o mesmo código
	// usa um hash do código para saber se algo mudou. Talvez deveria usar os listeners do Acer ao invés disso
	function autoPreCompile()
	{
		// Essa compilação é para melhorar o auto completar
		// Não vai precisar fazer nada se o auto completar estiver desativado
		if(!document.getElementById("check-auto-completar").checked) return;
	
		lastvmTime = performance.now();
		try {
			// Apenas se não estiver executando
			if(lastvmState == STATE_ENDED)
			{
				let string_cod = editor.getValue();
				
				// Vai Detectar se escreveu algo ou nao usando hash mesmo??
				//var codigoHash = stringHashCode(string_cod);
				let codigoHash = string_cod.length;
				// 1. não pre compila se escreveu algo nos últimos 2 segundos
				if(_PreCompileLastHash != codigoHash)
				{
					_PreCompileLastHash = codigoHash;
					//console.log("escreveu, espera... Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
					return;
				}
				
				// 2. não pre compila se não escreveu nada desde a ultima compilacao
				
				if(_PreCompileCompileHash == codigoHash)
				{
					//console.log("não escreveu nada, espera... Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
					return;
				}
				_PreCompileCompileHash = codigoHash;
				
				
				// não apaga os erros de execução
				limparErros(["sintatico","semantico","contexto"]);
				
				
				let compilado = compilar(string_cod,false);
				
				//console.log("Compilou:"+compilado.success+" Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
			}
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
	}
	
	setInterval(autoPreCompile, 5000);
	
	
	editor.on("focus", editorFocus);
	editor.focus();
	if (document.addEventListener)
	{
		window.addEventListener("resize", hideHotBarWhenLandscape);
		document.addEventListener('fullscreenchange', exitHandler, false);
		document.addEventListener('mozfullscreenchange', exitHandler, false);
		document.addEventListener('MSFullscreenChange', exitHandler, false);
		document.addEventListener('webkitfullscreenchange', exitHandler, false);
	}

	function exitHandler()
	{
		//if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
		//{
		//	// Run code on exit
		//	console.log("AAA");
		//}
		//else{
		//	console.log("BBB");
		//}
		let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(!fullscreenElement)
		{
			if(lastvmState != STATE_ENDED) {
				if(libraries["Graficos"].telaCheia)
				{
					libraries["Graficos"].sair_modo_tela_cheia();
				}
			}
		}
	}
	
	//var TogetherJSLoaded = false;
	//var TogetherJSConfig_hubBase = "https://togetherjs-hub.glitch.me/"
	//function addTogheterJS(elem)
	//{
		//if(TogetherJSLoaded) {
		//	window.alert("TogetherJS já foi carregado");
		//	return;
		//}
		//TogetherJSLoaded= true;
		//var script = document.createElement('script');
		//script.onload = function () {
		//	//do stuff with the script
			//TogetherJS(document.body);
		//};
		//script.src = "https://togetherjs.com/togetherjs-min.js";

		//document.head.appendChild(script); //or something of the likes
		

	//}
//}
