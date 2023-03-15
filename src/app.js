import { checkIsMobile } from "./extras/mobile.js";

import { getCurrentTokenIndex, STATE_ASYNC_RETURN, STATE_ENDED, STATE_STEP, STATE_WAITINGINPUT, VM_getExecJS, VM_getSaida, VM_setExecJS, VM_valueToString 
} from "./compiler/vm/vm.js";
import { httpGetAsync, numberOfLinesUntil, cursorToEnd as _cursorToEnd } from "./extras/extras.js";
import { htmlEntities } from "./compiler/tokenizer.js";
import { myClearTimeout } from "./extras/timeout.js";
import { persistentGetValue, persistentStoreValue } from "./extras/persistent.js";
import PortugolRuntime from "./compiler/vm/portugolrun.js";
import EditorManager from "./pages/index/editor.js";
import Hotbar from "./pages/index/hotbar.js";

	const div_saida = document.getElementById("textAreaSaida");
	const errosSaida =document.getElementById("errorArea");
	const div_tabelavariaveis = document.getElementById("tabelavariaveis");

	const myCanvasModal = document.getElementById("myCanvasModal");
	const myCanvasWindow = document.getElementById("myCanvasWindow");
	const myCanvasWindowTitle = document.getElementById("myCanvasWindowTitle");
	const myCanvas = document.getElementById("myCanvas");
	const myCanvasKeys = document.getElementById("myCanvasKeys");
	const hotbar = document.getElementById("hotbar");

	let fontSize = 10;
	
	let isMobile = checkIsMobile();
	if(isMobile) { fontSize = 9; }

	let mostrar_bytecode = false;

	export const portugolRun = new PortugolRuntime(div_saida);

	export const editorManager = new EditorManager();
	const hotbarManager = new Hotbar(hotbar,div_saida,errosSaida,isMobile,(sz) => {
		editorManager.resizeEditor(sz);
	});
	
	//####################################################
	//################# UI ###############################
	//####################################################
	function gerarTabelaVariaveis() {
		const tabela = portugolRun.getCurrentDeclaredVariables();
		let txt = "<table><tr><th>Nome</th><th>Valor</th></tr>";
		for(const v of tabela) {
			let vtxt = "";

			if (v.value === undefined || v.value === null) 
			vtxt = "";
			else vtxt = VM_valueToString(v.type,v.value);
			

			if(vtxt.length > 100) {
				vtxt = vtxt.substring(0,64) + "...";
			}
			txt += "<tr><td>"+v.name+"</td><td>"+vtxt+"</td></tr>";
		}
		txt += "</table>";

		div_tabelavariaveis.style.display = "block";
		div_tabelavariaveis.innerHTML = txt;
	}

	function ocultarTabelaVariaveis() {
		div_tabelavariaveis.style.display = "none";
	}

	export function executar(btn,passoapasso)
	{
		if(passoapasso && portugolRun.lastvmState == STATE_STEP)
		{
			// abrir hotbar e animar
			hotbarManager.extendUntil("EXTENDED");
		
			gerarTabelaVariaveis();
			// realçar linha?
			limparErros();
			realcarLinha(editorManager.getValue(),getCurrentTokenIndex(),true);

			portugolRun.executar_step();
			
			return;
		} else {
			ocultarTabelaVariaveis();
		}

		if(portugolRun.lastvmState == STATE_ENDED)
		{
			if(btn.value != "Executar")
			{
				console.error("Botão em estado inconsistente(Deveria ser Executar):"+btn.value);
				btn.value == "Executar";
			}

			autoSave();
			limparErros();
			
			// abrir hotbar e animar
			hotbarManager.extendUntil("EXTENDED");
			
			let string_cod = editorManager.getValue();
			try{
				portugolRun.mostrar_bytecode = mostrar_bytecode;
				let compilado = portugolRun.compilar(string_cod,enviarErro,VM_getExecJS());
				editorManager.updateAutoComplete(compilado);
				if(!compilado.success) {
					console.log(portugolRun.errosCount+" Erros na compilação:");
					return;
				}
				
				btn.value = "Parar";
				portugolRun.executar(string_cod,compilado,enviarErro,passoapasso)
				.then((output) => {

					if(passoapasso)
					limparErros(["information"]); // Limpa o último realce de linha (por algum motivo não funciona no leia quando é pulado)

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
			if(btn.value != "Parar" && btn.value != "Parando...")
			{
				console.error("Botão em estado inconsistente(Deveria ser 'Parar' ou 'Parando...'):"+btn.value);
			}
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
		hotbarManager.toggleHotbar(show);
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

	export function preventFocusSaida(event) {
		event.preventDefault();
		event.stopPropagation();

		div_saida.focus();
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

	function fonteTamanho(size) 
	{
		fontSize = size;
		editorManager.setFontSize(fontSize);
		
		div_saida.style.fontSize = fontSize+"pt";
		errosSaida.style.fontSize = fontSize+"pt";
	}

	export function fonteAumentar()
	{
		fonteTamanho(fontSize+1);
	}
	
	export function fonteDiminuir()
	{
		fonteTamanho(fontSize-1);
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
	
	function limparErros(tipoErros)
	{
		console.log("limpando erros");
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
			
			let tamanhoFonte = fontSize;
			persistentStoreValue("tamanhoFonte",tamanhoFonte);
			
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
		let tamanhoFonte = persistentGetValue("tamanhoFonte");
		
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
			// Lembrando da última escolha do usuário
			mostrandoHotbar = ""+mostrandoHotbar == "true";
			document.getElementById("check-mostrar-hotbar").checked = mostrandoHotbar; 
			toggleHotbar(mostrandoHotbar);
		} 
		else 
		{
			// Padrão mostrar hotbar no mobile, esconder no pc
			toggleHotbar(isMobile);
		}

		if(typeof(tamanhoFonte) == "string")
		{
			fonteTamanho(parseInt(""+tamanhoFonte));
		}
		
		return last_code;
	}
		
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
				
				
				let compilado = portugolRun.compilar(string_cod,enviarErro,false);
				editorManager.updateAutoComplete(compilado);

				//console.log("Compilou:"+compilado.success+" Tempo de execução:"+Math.trunc(performance.now()-lastvmTime)+" milissegundos");
			}
		} catch (e) {
			let myStackTrace = e.stack || e.stacktrace || "";

			console.log(myStackTrace);
		}
	}
	
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

	/**
	 * Finalizado declarações...
	 * Iniciando o editor e a interface
	 * 
	 */
	
	portugolRun.iniciarBibliotecas(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys);

	editorManager.initEditor("myEditor",fontSize,portugolRun.libraries,isMobile,() => {
		if(isMobile)
		{
			hotbarManager.collapseUntil("MIDDLE");
		}
		else
		{
			hotbarManager.collapseUntil("EXTENDED");
		}
	});

	div_saida.style.fontSize = fontSize+"pt";
	errosSaida.style.fontSize = fontSize+"pt";

	setInterval(autoSave, 30000);
	setInterval(autoPreCompile, 5000);

	//https://stackoverflow.com/questions/821011/prevent-a-webpage-from-navigating-away-using-javascript
	window.onbeforeunload = function() {
		return "";
	};

	if (document.addEventListener)
	{
		//window.addEventListener("resize", hideHotBarWhenLandscape);
		document.addEventListener('fullscreenchange', exitHandler, false);
		document.addEventListener('mozfullscreenchange', exitHandler, false);
		document.addEventListener('MSFullscreenChange', exitHandler, false);
		document.addEventListener('webkitfullscreenchange', exitHandler, false);
	}

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

	hotbarManager.resizeEditorToFitHotbar();
	if(isMobile)
	{
		document.body.classList.add('mobile');
	}