class portugolCompleter
{
	constructor(libraries)
	{
		this.listaPalavras = [
			"escreva",
			"limpa",
			"leia",
			"incl"
		];
		this.identifierRegexps = [/[^\s]+/];
		//this.identifierRegexps = [/.+/];
		this.librariesNames = Object.keys(libraries);
		this.libraries = libraries;
		this.incluas = false;
	}
	
	setCompiler(compiler)
	{
		this.incluas = compiler.incluas;
		
	}
	
	getCompletions(editor, session, pos, prefix, callback) {
		
		//prefix = prefix.trim();
		var sugestoes = [];
		var outPrefix = prefix;
		var outAppend = "";
		sugestoes = sugestoes.concat(this.listaPalavras);
		
		var bibliotecaCheck = /^.*[\D]\.[a-z0-9_]*$/.test(prefix.toLowerCase());
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
		}
		
		if(bibliotecaCheck)
		{
			
			var offPonto = prefix.lastIndexOf(".");
			var linhaSemPonto = prefix;
			if(offPonto != -1)
			{
				outPrefix = prefix.substring(offPonto+1);
				var linhaSemPonto = prefix.substring(0,offPonto);
				
			}
			
			outAppend = linhaSemPonto+".";
			
			console.info("Biblioteca:", linhaSemPonto);
			
			for(var i =0;i<this.librariesNames.length;i++)
			{
				if(linhaSemPonto.endsWith(this.librariesNames[i]))
				{
					
					var lib = this.libraries[this.librariesNames[i]];
				
					sugestoes = Object.keys(lib.members);
				}
			}
			if(this.incluas)
			{
				for(var i =0;i<this.incluas.length;i++)
				{
					var inclua = this.incluas[i];
					if(linhaSemPonto.endsWith(inclua.alias))
					{
						
						var lib = this.libraries[inclua.name];
					
						sugestoes = Object.keys(lib.members);
					}
				}
			}
		}
		
		var incluaCheck = /^\s*incl.*$/.test(prefix);
		
		if(incluaCheck)
		{
			var offPonto = prefix.lastIndexOf(".");			
			outAppend = "inclua biblioteca ";
			
			console.info("Inclua:", linhaSemPonto);
			sugestoes = [];
			for(var i =0;i<this.librariesNames.length;i++)
			{
				var libName = this.librariesNames[i];
				sugestoes.push(libName+" --> "+libName.toLowerCase().charAt(0));
			}
		}
		
		console.info(outPrefix+" --> "+sugestoes);
		
		for(var i=0;i<sugestoes.length;i++)
		{
			sugestoes[i] = outAppend+sugestoes[i];
		}
		
		callback(
			null,
			sugestoes.filter(entry=>{
				return entry.includes(outPrefix);
			}).map(entry=>{
				return {
					caption: entry.trim(),
					meta: "sugestão",
					value: entry
				};
			})
		);
	}
}