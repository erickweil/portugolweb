var libraries = {};
libraries["Util"] = new Util();
libraries["Calendario"] = new Calendario();
libraries["Matematica"] = new Matematica();
libraries["Texto"] = new Texto();
libraries["Teclado"] = new Teclado(myCanvas);
libraries["Graficos"] = new Graficos(myCanvas,myCanvasModal,myCanvasWindow,myCanvasWindowTitle,myCanvasKeys,libraries["Teclado"]);
libraries["Mouse"] = new Mouse(myCanvas);
libraries["Objetos"] = new Objetos();
libraries["Tipos"] = new Tipos();
libraries["Internet"] = new Internet();



class PortugolRuntime {
    constructor() {
		this.lastvmState = STATE_ENDED;
		this.lastvmTime = 0;
		this.lastvmStep = false;
    }
	
	function compilar(string_cod,mayCompileJS)
	{
		var nErrosInicio = errosAnnot.length;
		string_cod = string_cod.replace(/\r\n/g,"\n");
		
		var tokenizer = new Tokenizer(string_cod);
		console.log(tokenizer.tokenize());
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			ret = {success:false,"tokenizer":tokenizer};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		//div_port.innerHTML = tokenizer.formatHTML();
		
		var relevantTokens = tokenizer.getRelevantTokens();
		var tree = new Parser(relevantTokens,string_cod).parse();
		console.log(tree);
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			ret = {success:false,"tokenizer":tokenizer,"tree":tree};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		var librariesNames = Object.keys(libraries);
		for(var i =0;i<librariesNames.length;i++)
		{
			libraries[librariesNames[i]].resetar();
		}
		
		var compiler = new Compiler(tree,libraries,relevantTokens,string_cod,div_saida);
		compiler.compile();
		if(!execMesmoComErros && errosAnnot.length > nErrosInicio)
		{
			ret = {success:false,"tokenizer":tokenizer,"tree":tree,"compiler":compiler};
			myPortugolCompleter.setCompiler(ret);
			return ret;
		}
		
		var jsgenerator = {"functions":false};
		if(mayCompileJS && VM_execJS)
		{
			try{
				jsgenerator = new JsGenerator(tree,libraries,relevantTokens,string_cod,div_saida);
				jsgenerator.compile();
				
			}
			catch(e){
				var myStackTrace = e.stack || e.stacktrace || "";
				console.log(myStackTrace);
			}
		}
		
		ret = {success:true,"tokenizer":tokenizer,"tree":tree,"compiler":compiler,"jsgenerator":jsgenerator};
		myPortugolCompleter.setCompiler(ret);
		return ret;
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

			i = getTokenIndex(VM_i,VM_funcIndex);
			ui = i;
			
			limparErros();
			realcarLinha(VM_textInput,i,true);
			
			do
			{
				lastvmState = VMrun(1);
			
				//console.log(i+","+ui+","+lastvmState);
				
				ui = i;
				i = getTokenIndex(VM_i,VM_funcIndex);
			}
			while( (i == 0 || i == ui) && lastvmState == STATE_BREATHING);
			
			//console.log(i+","+ui+","+lastvmState);
			
			if(lastvmState == STATE_BREATHING)
			{
				lastvmState = STATE_STEP;
				var btnStep = document.getElementById('btn-step');
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
			lastvmState = VMrun(VM_codeMax);
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
			mySetTimeout("STATE_DELAY",executarVM, VM_delay);
		}
	}
	
	erro(token,msg)
	{
		enviarErro(this.input,token,msg,"compilador");
	}
	
	getRelevantTokens()
	{
		
	}
}