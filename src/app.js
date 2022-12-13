import { checkIsMobile } from "./extras/mobile.js";

import portugolCompleter from "./ace-editor/ace_portugol_completer.js";
import { escreva, getCurrentTokenIndex, getTokenIndex, limpa, STATE_ASYNC_RETURN, STATE_BREATHING, STATE_DELAY, STATE_DELAY_REPEAT, STATE_ENDED, STATE_PENDINGSTOP, STATE_RUNNING, STATE_STEP, STATE_WAITINGINPUT, VMrun, VMsetup, VMtoString, VM_async_return, VM_getCodeMax, VM_getDelay, VM_getExecJS, VM_getSaida, VM_getTextInput, VM_setExecJS 
} from "./vm/vm.js";
import { elementIsAllScrolled, getScreenDimensions, httpGetAsync, numberOfLinesUntil, cursorToEnd as _cursorToEnd } from "./extras/extras.js";
import { htmlEntities, Tokenizer } from "./compiler/tokenizer.js";
import { Parser } from "./compiler/parser.js";
import { Compiler } from "./compiler/vmcompiler.js";
import JsGenerator from "./compiler/jsgenerator.js";
import { myClearTimeout, mySetTimeout } from "./extras/timeout.js";
import { persistentGetValue, persistentStoreValue } from "./extras/persistent.js";
import PortugolRuntime from "./vm/portugolrun.js";
import EditorManager from "./pages/index/editor.js";

	const div_saida = document.getElementById("textAreaSaida");
	const errosSaida =document.getElementById("errorArea");

	const myCanvasModal = document.getElementById("myCanvasModal");
	const myCanvasWindow = document.getElementById("myCanvasWindow");
	const myCanvasWindowTitle = document.getElementById("myCanvasWindowTitle");
	const myCanvas = document.getElementById("myCanvas");
	const myCanvasKeys = document.getElementById("myCanvasKeys");

	let fontSize = 10;
	
	let isMobile = checkIsMobile();
	if(isMobile) {
		fontSize = 9;
	}

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

	let portugolRun = new PortugolRuntime(div_saida);
	portugolRun.iniciarBibliotecas(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys);

	export const editorManager = new EditorManager();


	function editorFocus()
	{
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
	}

	editorManager.initEditor("myEditor",fontSize,portugolRun.libraries,isMobile,editorFocus);

	div_saida.style.fontSize = fontSize+"pt";
	errosSaida.style.fontSize = fontSize+"pt";
	
	//####################################################
	//################# UI ###############################
	//####################################################
	export function executar(btn,passoapasso)
	{
		if(portugolRun.lastvmState == STATE_ENDED)
		{
			btn.value == "Executar";

			autoSave();
			limparErros();
			
			// abrir hotbar e animar
			//if(isMobile)
			//{
				if(hotbar_yOffset < hotbar_extendedyOffset)
				setHotbarPosition(hotbar_extendedyOffset,true);
			//}
			
			let string_cod = editorManager.getValue();
			try{
				let compilado = portugolRun.compilar(string_cod,enviarErro,VM_getExecJS());
				editorManager.updateAutoComplete(compilado);
				if(!compilado.success) return;
				
				btn.value = "Parar";
				portugolRun.executar(string_cod,compilado,enviarErro)
				.then((output) => {
					btn.value = "Executar";
				})
				.catch((err) => {
					let myStackTrace = err.stack || err.stacktrace || "";

					console.log(myStackTrace);

					btn.value = "Executar";
				});
			}
			catch(e)
			{
				let myStackTrace = e.stack || e.stacktrace || "";

				console.log(myStackTrace);
			
				enviarErro({
					row: 0,
					column: 0,
					columnFim: 0,
					textprev: "",
					textnext: "",
					text: "Erro ao compilar"+e, // Or the Json reply from the parser 
					type: "error", // also warning and information
					myErrorType: "compilador"
				});

				btn.value = "Executar";
				return;
			}
		}
		else
		{
			btn.value == "Parando...";

			if(portugolRun.parar())
			{
				btn.value = "Executar";
			}
		}
	}

	export function exemplo(nome)
	{
		if(nome == "aleatorio")
		{
			nome+=  Math.floor(Math.random() * 4);
		}
		httpGetAsync("exemplos/"+nome+".por",
		function(code)
		{
			editorManager.setValue(code); // moves cursor to the start
			limparErros();
		}
		);
		document.getElementById('modalExemplos').style.display = 'none';
	}

	export function toggleHotbar(show)
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

	export function setModoTurbo(checkbox)
	{
		VM_setExecJS( (portugolRun.lastvmState == STATE_ENDED) && checkbox.checked);
		checkbox.checked = VM_getExecJS();
		console.log("Modo: "+(VM_getExecJS() ? 'Modo Turbo' : 'Modo Normal'));
	}

	export function setAutoCompleterState(checked)
	{
		editorManager.setAutoCompleterState(checked);
	}

	export function executarStepStart(btn)
	{
		//onmousedown="this.className = 'clicou';executar(document.getElementById('btn-run'),true);this.className = 'segurando';" onmouseup="executarStepPause();this.className = '';"
		
		// Assim vai dar um delay maior no primeiro clique, mas se segurar o botão, executa a 10 linhas por segundo
		btn.className = 'clicou';
		executar(document.getElementById('btn-run'),true);
		btn.className = 'segurando';
	}
	
	// soltou o botao
	export function executarStepPause(btn)
	{
		myClearTimeout("STATE_STEP");
		btn.className = '';
	}

	export function preventFocusCanvas(event) {
		event.preventDefault();
		event.stopPropagation();

		myCanvas.focus();
	}
		
	export function preventFocus(event) {
		event.preventDefault();
		event.stopPropagation();
		/*if (event.relatedTarget) {
			// Revert focus back to previous blurring element
			event.relatedTarget.focus();
		} else {
			// No previous focus target, blur instead
			event.currentTarget.blur();
		}*/
		editorManager.focus();
	}

	export function fonteAumentar()
	{
		fontSize++;
		editorManager.setFontSize(fontSize);
		
		div_saida.style.fontSize = fontSize+"pt";
		errosSaida.style.fontSize = fontSize+"pt";
	}
	
	export function fonteDiminuir()
	{
		fontSize--;
		editorManager.setFontSize(fontSize);
		
		div_saida.style.fontSize = fontSize+"pt";
		errosSaida.style.fontSize = fontSize+"pt";
	}

	export function save() {
		let string_cod = editorManager.getValue();
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

	export function load() {
	
		if(typeof Android !== 'undefined')
		{
			Android.load(); //eslint-disable-line
			// retorna em android_loaded
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
					editorManager.setValue(this.result); // moves cursor to the start
					
					limparErros();
				};
				reader.readAsText(file);
				document.body.removeChild(element);
			});
		
		}
	}
	
	export function editorCommand(keycode)
	{
		editorManager.editorCommand(keycode);
	}

	export function editorType(c)
	{
		editorManager.editorType(c);
	}

	export function GraficosBtnTypeDown(t)
	{
		portugolRun.libraries["Teclado"].tecladoDown({preventDefault:function(){},key:t},t);
	}
	
	export function GraficosBtnTypeUp(t)
	{
		portugolRun.libraries["Teclado"].tecladoUp({preventDefault:function(){},key:t},t);
	}
		
	export function receiveInput(textarea)
	{
		if(portugolRun.lastvmState == STATE_WAITINGINPUT)
		{
			let saidadiv = textarea.value;
			saidadiv = saidadiv.replace(/\r\n/g,"\n");

			let entrada = saidadiv.substring(VM_getSaida().length,saidadiv.length);
			
			if(entrada.endsWith("\n"))
			{
				portugolRun.notifyReceiveInput();
			}
		}
		else if(portugolRun.lastvmState != STATE_ENDED)
		{
			div_saida.value = VM_getSaida();
		}
	}

	export function cursorToEnd(textarea) {
		_cursorToEnd(textarea);
	}

	/**
	 * PARA FUNCIONAR COM O ANDROID PRECISA DESSAS FUNÇÕES NO OBJETO WINDOW.
	 * É O JEITO DE INTEGRAR
	 */
	export function android_loaded(code){
		editorManager.setValue(code);
		limparErros();
	}
	
	export function android_async_return(retValue)
	{
		if(portugolRun.lastvmState == STATE_ASYNC_RETURN)
		{
			portugolRun.notifyAsyncReturn(retValue);
		}
	}

	window.android_loaded = android_loaded;
	window.android_async_return = android_async_return;
	
	hotbar.addEventListener("touchstart", hotbar_dragStart, false);
	hotbar.addEventListener("touchend", hotbar_dragEnd, false);
	hotbar.addEventListener("touchmove", hotbar_drag, false);
	
	hotbar.addEventListener("mousedown",hotbar_dragStart, false);
	window.addEventListener("mouseup", hotbar_dragEnd, false);
	//hotbar.addEventListener("mouseleave",hotbar_dragEnd, false);
	window.addEventListener("mousemove",hotbar_drag, false);
	
	window.addEventListener("resize", resizeEditorToFitHotbar);

	
	if(isMobile) {
		if(typeof Android === 'undefined')
		{
			editorManager.setValue("programa\n{\n\tfuncao inicio()\n\t{\n\t\t\n\t\tescreva(\"Baixe o aplicativo na play store:\\n\")\n\t\tescreva(\"https://play.google.com/store/apps/details?id=br.erickweil.portugolweb \\n\")\n\t\t\n\t}\n}\n");
		}
	}

	function setEditorFromAutoSave() {
		let last_code = getAutoSave();
		if(last_code)
			editorManager.setValue(last_code);
	}
	setEditorFromAutoSave();

	resizeEditorToFitHotbar();
	if(isMobile)
	{
		document.body.classList.add('mobile');
		mostrarHotbar();
	}
	else
	{
		ocultarHotbar();
	}
	
	function limparErros(tipoErros)
	{
		editorManager.removeMarkers();
		errosSaida.innerHTML = "";
		if(tipoErros)
		{
			// apaga os erros e re-envia os que nao é para apagar?
			let annots = editorManager.getAnnotations(tipoErros);
			editorManager.removeAnnotations();
			for(let annot of annots) {
				enviarErro(annot);
			}
		}
		else
		{
			editorManager.removeAnnotations();
		}
	}
	
	function realcarLinha(textInput,index,scrollTo)
	{
		let linha = numberOfLinesUntil(index,textInput);
		let prev_line = textInput.substring(textInput.lastIndexOf('\n', index)+1,index).replace(/\t/g,'    ');
		let next_line = textInput.substring(index,textInput.indexOf('\n', index));
		let coluna = prev_line.length;
		let colunaFim = coluna+next_line.length;
		
		editorManager.highlight(linha,coluna,colunaFim,scrollTo);
	}
	
	function enviarErro(annot)
	{
		if(!annot) return;
		
		if(annot.text)
		errosSaida.innerHTML += htmlEntities(annot.text)+"\n";
		if(annot.textprev && annot.textnext)
		{
			errosSaida.innerHTML += htmlEntities(annot.textprev+annot.textnext)+"\n";
			errosSaida.innerHTML += " ".repeat(annot.textprev.length)+"^\n\n";
		}
	
		editorManager.errMarker(annot);
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
		portugolRun.execMesmoComErros = !portugolRun.execMesmoComErros;
		if(!portugolRun.execMesmoComErros)
			btn.value = "Ignorar Erros";
		else
			btn.value = "Parar em Erros";
	}
		
	/*function editorMove(column,row)
	{
		editor.gotoLine((editor.getCursorPosition().row+1) + row, editor.getCursorPosition().column + column); 
	}
	
	function editorDelete()
	{
		let p = editor.getCursorPosition();
		editor.getSession().replace(new Range(p.row, p.column, p.row, p.column+1), "");
	}*/

	// HOTBAR	
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
		else if(e.target === div_saida)
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
		
			if(hotbar_textarea && !elementIsAllScrolled(div_saida))
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
		if(!editorManager) return;

		let h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		
		//if(!isMobile)
		//document.getElementById("myEditor").style.height = (h-hotbar_yOffset+15)+"px";
		//else
		editorManager.resizeEditor(h-hotbar_yOffset);
		
		
		let isHotbarVisible = document.getElementById("hotbar_commands").style.display != "none";
		
		
		
		if(!isHotbarVisible)
		div_saida.style.height = (hotbar_yOffset-50)+"px";
		else
		div_saida.style.height = (hotbar_yOffset-130)+"px";
		
	}
	
	function resizeEditorMax()
	{
		if(!editorManager) return;

		let screenDimension = getScreenDimensions();
		
		editorManager.resizeEditor(screenDimension.height);
		
		div_saida.style.height = (screenDimension.height)+"px";
	}
	
	function autoSave()
	{
		try {
			persistentStoreValue("code",editorManager.getValue());
			let autoComplete = document.getElementById("check-auto-completar").checked;
			persistentStoreValue("autoComplete",autoComplete);
			
			let modoTurbo = document.getElementById("check-modo-turbo").checked;
			persistentStoreValue("modoTurbo",modoTurbo);
			
			let mostrandoHotbar = document.getElementById("check-mostrar-hotbar").checked;
			persistentStoreValue("mostrarHotbar",mostrandoHotbar);
			
			
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
	}
	
	function getAutoSave()
	{
		let last_code = persistentGetValue("code");
		//var hideHotbar = (""+persistentGetValue("hideHotbar")) == "true";
		let mostrandoHotbar = persistentGetValue("mostrarHotbar");
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
		
		if(typeof(mostrandoHotbar) == "string")
		{
			mostrandoHotbar = ""+mostrandoHotbar == "true";
			
			
			document.getElementById("check-mostrar-hotbar").checked = mostrandoHotbar; 
			toggleHotbar(mostrandoHotbar);
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
	
		try {
			// Apenas se não estiver executando
			if(portugolRun.lastvmState == STATE_ENDED)
			{
				let string_cod = editorManager.getValue();
				
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
				
				
				let compilado = portugolRun.compilar(string_cod,false);
				editorManager.updateAutoComplete(compilado);

				//console.log("Compilou:"+compilado.success+" Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
			}
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
	}
	
	setInterval(autoPreCompile, 5000);
	
	//https://stackoverflow.com/questions/821011/prevent-a-webpage-from-navigating-away-using-javascript
	window.onbeforeunload = function() {
		return "";
	};

	function exitHandler()
	{
		let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(!fullscreenElement)
		{
			if(portugolRun.lastvmState != STATE_ENDED) {
				if(portugolRun.libraries["Graficos"].telaCheia)
				{
					portugolRun.libraries["Graficos"].sair_modo_tela_cheia();
				}
			}
		}
	}

	if (document.addEventListener)
	{
		//window.addEventListener("resize", hideHotBarWhenLandscape);
		document.addEventListener('fullscreenchange', exitHandler, false);
		document.addEventListener('mozfullscreenchange', exitHandler, false);
		document.addEventListener('MSFullscreenChange', exitHandler, false);
		document.addEventListener('webkitfullscreenchange', exitHandler, false);
	}
