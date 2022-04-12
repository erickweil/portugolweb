class portugolCompleter
{
	constructor(libraries)
	{
		this.listaPalavras = [
			"leia(variavel)"
		];
		
		this.listaPalavras = this.listaPalavras.concat(reserved_words);
		this.listaPalavras = this.listaPalavras.concat(type_words);
		
		this.identifierRegexps = [/[^\s\+\-\*\/%><!=&|^~;,.{}()\[\]:]+/]; // Match not a separator
		//this.identifierRegexps = [/[^\s]+/];
		//this.identifierRegexps = [/.+/];
		this.tokenizer = false;
		this.librariesNames = Object.keys(libraries);
		this.libraries = libraries;
		this.incluas = false;
		this.functions = false;
		this.variaveisGlobais = false;
		this.todasvariaveis = false;
	}
	
	setCompiler(compilado)
	{
		if(compilado.tokenizer)
		{
			this.tokenizer = compilado.tokenizer;
		}
		if(compilado.compiler)
		{
			this.incluas = compilado.compiler.incluas;
			this.functions = compilado.compiler.functions;
		}
		if(compilado.tree)
		{
			this.variaveisGlobais = compilado.tree.variaveis;
			this.todasvariaveis = [];
			getAllVariableParserDecl(compilado.tree.funcoes,this.todasvariaveis);
		}
		
		
		
		/*this.todasvariaveis = {};
		for(var i=0;i<codetree.funcoes.length;i++)
		{
			var f = codetree.funcoes[i];
		
			
			this.todasvariaveis[f.name] = f.statements.filter(entry=>{
				return entry.id == STATEMENT_declArr || entry.id == STATEMENT_declVar;
			});
			
		}*/
	}
	
	getFunctionDefinition(name,member,caption,id)
	{
		//"largura_texto":{id:T_parO,parameters:[T_cadeia],type:T_inteiro,jsSafe:true},
		
		if(id == T_word)
		{
			var ret = name;
			
			if(caption)
			{
				return ret+" : "+getTypeWord(member.type);
			}
			else
			{
				return ret;
			}
		}
		else if(id == T_parO)
		{
			var ret = name+"(";
			
			if(member.parameters)
			{
				for(var i=0;i<member.parameters.length;i++)
				{
					if(i > 0) ret += ",";
					
					var p = member.parameters[i];
					if(typeof p === 'object')
					{
						ret += getTypeWord(p.type);
						ret += " ";
						ret += p.name;
					}
				}
			}
			
			if(caption)
			{
				return ret+") : "+getTypeWord(member.type);
			}
			else
			{
				return ret+")";
			}
		}
	}
	
	getCompletions(editor, session, pos, prefix, callback) {
		
		var firstvmTime = performance.now();
		var lastvmTime = firstvmTime;
		//prefix = prefix.trim();
		var sugestoes = []; // Lista de sugestões
		var outPrefix = prefix; // Prefixo do identificador que está sendo escrito, e será substituido
		
		
		var entireLine = editor.session.getLine(pos.row);
		
		//if(this.tokenizer)
		//{
		//	var tokenindex = this.tokenizer.getTokenIndexAtRowCol(pos.row+1,pos.column);
		//	var token = this.tokenizer.tokens[tokenindex];
		//	console.log("row:"+pos.row+",col:"+pos.column+" i:"+tokenindex+":'"+token.txt+"'");
		//}
		
		var millis_tokens = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		//this.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
		//var outAppend = ""; // ??
		
		// value é o valor a ser checado
		// caption é o valor que será exibido na lista
		// meta é a palavrinha que aparece depois
		for(var i =0;i<this.listaPalavras.length;i++)
		{
			var p = this.listaPalavras[i];
			sugestoes.push({value:p,caption:p,meta:"sugestão",tooltip:"",score:0});
		}
		
		var millis_palavras = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		/*var bibliotecaCheck = /^.*[\D]\.[a-z0-9_]*$/.test(entireLine.toLowerCase());
		if(!bibliotecaCheck && this.incluas)
		{
			for(var i =0;i<this.incluas.length;i++)
			{
				var inclua = this.incluas[i];
				if(prefix == inclua.alias)
				{
					bibliotecaCheck = true;
				}
			}
		}*/
		
		//var incluaCheck = /^\s*incl.*$/.test(prefix);
		
		//if(incluaCheck)
		//{
			var offPonto = prefix.lastIndexOf(".");			
			//outAppend = "inclua biblioteca ";
			
			//console.info("Inclua:", linhaSemPonto);
			//sugestoes = [];
			for(var i =0;i<this.librariesNames.length;i++)
			{
				var libName = this.librariesNames[i];
				var sugValue = "inclua biblioteca "+libName+" --> "+libName.toLowerCase().charAt(0);
				sugestoes.push({value:sugValue,caption:sugValue,meta:"Biblioteca",tooltip:"Incluir a biblioteca",score:0});
			}
		//}
		
		var millis_incluas = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		
		if(this.functions)
		{
			for(var i =0;i<this.functions.length;i++)
			{
				var entry = this.functions[i];
				if(entry.name.includes("$") || entry.name.includes("#")) continue; // pula os leia$inteiro, leia$cadeia, etc...
				
				sugestoes.push({
							caption: this.getFunctionDefinition(entry.name,entry,true,T_parO),
							meta: "Função",
							value: this.getFunctionDefinition(entry.name,entry,false,T_parO),
							tooltip:"Função criada neste programa.",
							score:0
				});
				
				
			}
		}
		
		
		var millis_funcoes = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		
		if(this.variaveisGlobais)
		{
			for(var i =0;i<this.variaveisGlobais.length;i++)
			{
				var entry = this.variaveisGlobais[i];
				
				sugestoes.push({
							caption: this.getFunctionDefinition(entry.name,entry,true,T_word),
							meta: "Variável Global",
							value: this.getFunctionDefinition(entry.name,entry,false,T_word),
							tooltip:"Variável Global neste programa.",
							score:0
				});
			}
		}
		
		var millis_globais = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		
		// deveria encontrar em que escopo está?
		if(this.todasvariaveis)
		{
			for(var i =0;i<this.todasvariaveis.length;i++)
			{
				var entry = this.todasvariaveis[i];
				
				sugestoes.push({
							caption: this.getFunctionDefinition(entry.name,entry,true,T_word),
							meta: "Variável Local",
							value: this.getFunctionDefinition(entry.name,entry,false,T_word),
							tooltip:"Variável Local neste programa.",
							score:0
				});
			}
		}
		
		
		var millis_variaveis = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		
		if(this.incluas)
		{
			
			var offPonto = entireLine.lastIndexOf(".");
			var linhaSemPonto = "";
			if(offPonto != -1)
			{
				//outPrefix = prefix.substring(offPonto+1);
				linhaSemPonto = entireLine.substring(0,offPonto);
			}
			
			var cursorNoPonto = offPonto+1==pos.column;
			
			//outAppend = linhaSemPonto+".";
			
			console.info("Biblioteca:"+linhaSemPonto+" offPonto:"+offPonto+" col:"+pos.column);
			
			//var libsugestoes = [];
			
			for(var i =0;i<this.librariesNames.length;i++)
			{
				sugestoes.push({
							caption: this.librariesNames[i],
							meta: "Biblioteca",
							value: this.librariesNames[i],
							tooltip:"Nome de Biblioteca.",
							score:0
				});
				
				if(cursorNoPonto && linhaSemPonto.endsWith(this.librariesNames[i]))
				{
					
					var lib = this.libraries[this.librariesNames[i]];
				
					sugestoes = sugestoes.concat( Object.keys(lib.members).map(entry=>{
						return {
							caption: this.getFunctionDefinition(entry,lib.members[entry],true,lib.members[entry].id),
							meta: this.librariesNames[i],
							value: this.getFunctionDefinition(entry,lib.members[entry],false,lib.members[entry].id),
							tooltip:"Membro da Biblioteca "+this.librariesNames[i],
							score:100000
						};
					}));
				}
			}
			if(this.incluas)
			{
				for(var i =0;i<this.incluas.length;i++)
				{
					var inclua = this.incluas[i];
					
					sugestoes.push({
							caption: inclua.alias + " ("+inclua.name+")",
							meta: "Biblioteca",
							value: inclua.alias,
							tooltip:"Abreviação da Biblioteca "+inclua.name,
							score:0
					});
					
					if(cursorNoPonto && linhaSemPonto.endsWith(inclua.alias))
					{
						
						var lib = this.libraries[inclua.name];
					
						sugestoes = sugestoes.concat( Object.keys(lib.members).map(entry=>{
						return {
							caption: this.getFunctionDefinition(entry,lib.members[entry],true,lib.members[entry].id),
							meta: inclua.name,
							value: this.getFunctionDefinition(entry,lib.members[entry],false,lib.members[entry].id),
							tooltip:"Membro da Biblioteca "+inclua.name,
							score:100000
						};
						}));
					}
				}
			}
			
			// para só mostrar as sugestões de bibliotecas
			//if(libsugestoes.length > 0)
			//{
			//	sugestoes = libsugestoes;
			//}
		}
		
		var millis_bibliotecas = Math.trunc(performance.now()-lastvmTime);
		lastvmTime = performance.now();
		
		//console.info(entireLine+" ("+outPrefix+") --> "+sugestoes.map(entry=>{
		//		return entry.value;
		//}));
		
		//for(var i=0;i<sugestoes.length;i++)
		//{
		//	sugestoes[i] = outAppend+sugestoes[i];
		//}
		
		/*for(var i=0;i<sugestoes.length;i++)
		{
			sugestoes[i].score = i;
		}*/
		
		console.log("Sugestoes Tempo de execução:"+Math.trunc(performance.now()-firstvmTime)+" milissegundos ["+
		millis_tokens+" "+
		millis_palavras+" "+
		millis_incluas+" "+
		millis_globais+" "+
		millis_funcoes+" "+
		millis_variaveis+" "+
		millis_bibliotecas+"]"
		);
		
		callback(
			null,
			sugestoes.filter(entry=>{
				return outPrefix=="" || (typeof(entry.value) == "string" && entry.value.includes(outPrefix));
			})
			//.map(entry=>{
			//	return {
			//		caption: entry.label.trim(),
			//		meta: "sugestão",
			//		value: entry.check
			//	};
			//})
		);
	}
	
	getDocTooltip(item) {
        if (!item.docHTML) {
            item.docHTML = [
                "<b>", item.caption , "</b>", "<hr></hr>",
                item.tooltip
            ].join("");
        }
    }
}