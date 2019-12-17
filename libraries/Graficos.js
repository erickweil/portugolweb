class Graficos {
	constructor(canvas,modal,cwindow,title)
	{
		this.canvas = canvas;
		this.modal = modal;
		this.cwindow = cwindow;
		this.title = title;
		
		this.COR_AMARELO = 0xFFFF00;
		this.COR_AZUL = 0x0000FF;
		this.COR_BRANCO = 0xFFFFFF;
		this.COR_PRETO = 0x000000;
		this.COR_VERDE = 0x00FF00;
		this.COR_VERMELHO = 0xFF0000;
		
		
		this.CANAL_R = 0;
		this.CANAL_G = 1;
		this.CANAL_B = 2;
		
		this.GRADIENTE_DIREITA = 0;
		
		this.members = {
		"COR_AMARELO":{id:T_word,type:T_inteiro},
		"COR_AZUL":{id:T_word,type:T_inteiro},
		"COR_BRANCO":{id:T_word,type:T_inteiro},
		"COR_PRETO":{id:T_word,type:T_inteiro},
		"COR_VERDE":{id:T_word,type:T_inteiro},
		"COR_VERMELHO":{id:T_word,type:T_inteiro},
		
		"CANAL_R":{id:T_word,type:T_inteiro},
		"CANAL_G":{id:T_word,type:T_inteiro},
		"CANAL_B":{id:T_word,type:T_inteiro},
		
		
		"GRADIENTE_DIREITA":{id:T_word,type:T_inteiro},
		
		"iniciar_modo_grafico":{id:T_parO,parameters:[T_logico],type:T_vazio},
		"encerrar_modo_grafico":{id:T_parO,parameters:[],type:T_vazio},
		"definir_dimensoes_janela":{id:T_parO,parameters:[T_inteiro,T_inteiro],type:T_vazio},
		"definir_cor":{id:T_parO,parameters:[T_inteiro],type:T_vazio},
		"renderizar":{id:T_parO,parameters:[],type:T_vazio},
		"desenhar_retangulo":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_inteiro,T_logico,T_logico],type:T_vazio},
		"limpar":{id:T_parO,parameters:[],type:T_vazio},
		"definir_titulo_janela":{id:T_parO,parameters:[T_cadeia],type:T_vazio},
		"altura_janela":{id:T_parO,parameters:[],type:T_inteiro},
		"largura_janela":{id:T_parO,parameters:[],type:T_inteiro},
		"altura_tela":{id:T_parO,parameters:[],type:T_inteiro},
		"largura_tela":{id:T_parO,parameters:[],type:T_inteiro},
		"desenhar_linha":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_inteiro],type:T_vazio},
		"desenhar_texto":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_cadeia],type:T_vazio},
		"definir_tamanho_texto":{id:T_parO,parameters:[T_real],type:T_vazio},
		"largura_texto":{id:T_parO,parameters:[T_cadeia],type:T_inteiro},
		"altura_texto":{id:T_parO,parameters:[T_cadeia],type:T_inteiro},
		"desenhar_elipse":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_inteiro,T_logico],type:T_vazio},
		"entrar_modo_tela_cheia":{id:T_parO,parameters:[],type:T_vazio},
		"desenhar_poligono":{id:T_parO,parameters:[T_squareO,T_logico],type:T_vazio},
		"desenhar_ponto":{id:T_parO,parameters:[T_inteiro,T_inteiro],type:T_vazio},
		"carregar_imagem":{id:T_parO,parameters:[T_cadeia],type:T_inteiro},
		"liberar_imagem":{id:T_parO,parameters:[T_inteiro],type:T_vazio},
		"desenhar_imagem":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro],type:T_vazio},
		
		"altura_imagem":{id:T_parO,parameters:[T_inteiro],type:T_inteiro},
		"largura_imagem":{id:T_parO,parameters:[T_inteiro],type:T_inteiro},
		
		"criar_cor":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro],type:T_inteiro},
		"obter_cor":{id:T_parO,parameters:[T_inteiro,T_inteiro],type:T_inteiro},
		"definir_estilo_texto":{id:T_parO,parameters:[T_logico,T_logico,T_logico],type:T_vazio},
		"definir_fonte_texto":{id:T_parO,parameters:[T_cadeia],type:T_vazio},
		
		"definir_gradiente":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro],type:T_vazio},
		
		"definir_opacidade":{id:T_parO,parameters:[T_inteiro],type:T_vazio},
		"definir_rotacao":{id:T_parO,parameters:[T_inteiro],type:T_vazio},
		"fechar_janela":{id:T_parO,parameters:[],type:T_vazio},
		
		"redimensionar_imagem":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_logico],type:T_inteiro},
		};
		
		this.resetar();
	}
	
	updateText()
	{
		this.ctx.font = (this.textoItalico ? "italic" : "")+" "+(this.textoNegrito ? "bold" : "")+" "+this.textoTamanho+"pt "+this.textoFonte;
	}
	
	resetar()
	{
		this.telaCheia = false;
		this.title.value = "Janela sem Título";
		this.lastWidth = 100;
		this.lastHeight = 100;
		
		this.textoTamanho = 16;
		this.textoItalico = false;
		this.textoNegrito = false;
		this.textoSublinhado = false;
		this.textoFonte = "Arial";
		
		this.imgs = [];
	}
	
	iniciar_modo_grafico(manter_visivel)
	{
		this.manter_visivel = manter_visivel == 0;
		
		var screenDim = getScreenDimensions();

		
		var square = Math.min(screenDim.width,screenDim.height);
		//this.definir_dimensoes_janela(600,480);
		this.definir_dimensoes_janela(square-32,square-72);
		
		this.modal.style.display = "table";
		
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineWidth = 2;
		this.ctx.fillStyle = "#000000";
		//this.ctx.strokeStyle = "#000000";
		this.limpar();
		
		this.canvas.focus();
	}
	
	encerrar_modo_grafico()
	{
		this.modal.style.display = "none";
		if(this.telaCheia)
		{
			this.sair_modo_tela_cheia();
		}
	}
	
	definir_dimensoes_janela(w,h)
	{
		var screenDim = getScreenDimensions();
		w = Math.min(screenDim.width-8,w);
		h = Math.min(screenDim.height-48,h);
		this.lastWidth = w;
		this.lastHeight = h;
		this.canvas.height = h;
		this.canvas.width = w;
		this.cwindow.style.height = (h+8+40)+"px";
		this.cwindow.style.width = (w+8)+"px";
	}
	
	definir_cor(cor)
	{
		this.ctx.fillStyle = "#"+Number(cor).toString(16).padStart(6, '0');
		this.ctx.strokeStyle = this.ctx.fillStyle;
	}
	
	renderizar()
	{
		// lol. deveria fazer algo aqui? talvez implementar o requestAnimationFrame?
		// respira para não travar tudo
		return {state:STATE_BREATHING};
	}
	
	desenhar_retangulo(x,y,w,h,arredondar,preencher) // lembrar que logico 0 é verdadeiro outra coisa é falso
	{
		if(preencher == 0)
		{
			this.ctx.fillRect(x, y, w, h);
		}
		else
		{
			this.ctx.strokeRect(x, y, w, h);
		}
	}
	
	limpar()
	{
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Clears the canvas
	}
	
	definir_titulo_janela(titulo)
	{
		this.title.value = titulo;
	}
	
	altura_tela()
	{
		var screenDim = getScreenDimensions();
		return {value:screenDim.height};
	}
	
	largura_tela()
	{
		var screenDim = getScreenDimensions();
		return {value:screenDim.width};
	}
	
	altura_janela()
	{
		return {value:this.canvas.height};
	}
	
	largura_janela()
	{
		return {value:this.canvas.width};
	}
	
	
	desenhar_linha(x1,y1,x2,y2)
	{
		this.ctx.beginPath(); 
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		// Make the line visible
		this.ctx.stroke();
	}
	
	desenhar_texto(x,y,texto)
	{
		this.ctx.fillText(texto, x, y);
	}
	
	definir_tamanho_texto(tamanho)
	{
		//this.ctx.font = tamanho+"px Arial";
		this.textoTamanho = tamanho;
		this.updateText();
	}
	
	largura_texto(texto)
	{
		return {value:this.ctx.measureText(texto).width};
	}
	
	altura_texto(texto)
	{
		return this.largura_texto(texto.charAt(0));
	}
	
	desenhar_elipse(x,y,largura,altura,preencher)
	{
		var rx = largura/2.0;
		var ry = altura/2.0;
		if(this.ctx.ellipse)
        {
          //ctx.save();
          this.ctx.beginPath();
		 
          this.ctx.ellipse(x + rx, y+ry, rx, ry, 0, 0, Math.PI*2);
          //ctx.strokeStyle=style;
		  if(preencher == 0) this.ctx.fill();
          else this.ctx.stroke();
          //ctx.restore();
        }
		else
		{
			var kappa = .5522848,
			 ox = (largura / 2) * kappa, // control point offset horizontal
			 oy = (altura / 2) * kappa, // control point offset vertical
			 xe = x + w,           // x-end
			 ye = y + h,           // y-end
			 xm = x + w / 2,       // x-middle
			 ym = y + h / 2;       // y-middle

			this.ctx.beginPath();
			this.ctx.moveTo(x, ym);
			this.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			this.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			this.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

			if(preencher == 0) this.ctx.fill();
			else this.ctx.stroke();
			
		}
	}
	
	entrar_modo_tela_cheia()
	{
		openFullscreen(this.modal);
		
		this.cwindow.style.height = "100%";
		this.cwindow.style.width = "100%";
		this.telaCheia = true;
		
		var screenDim = getScreenDimensions();
		this.canvas.height = screenDim.height-48;
		this.canvas.width = screenDim.width-8;
		
		var that = this;
		window.setTimeout(function(){ // pq a tela redimensiona depois
			var screenDim = getScreenDimensions();
			that.canvas.height = screenDim.height-48;
			that.canvas.width = screenDim.width-8;
		}, 50);
		
		window.setTimeout(function(){ // muito depois 
			var screenDim = getScreenDimensions();
			that.canvas.height = screenDim.height-48;
			that.canvas.width = screenDim.width-8;
		}, 250);
		
		this.canvas.focus();
	}
	
	sair_modo_tela_cheia()
	{
		closeFullscreen();
		this.definir_dimensoes_janela(this.lastWidth,this.lastHeight);
		this.telaCheia = false;
	}
	
	desenhar_poligono(pontos,preencher)
	{
		this.ctx.beginPath();
		
		this.ctx.moveTo(pontos[0][0], pontos[0][1]);
		for(var i=1;i<pontos.length;i++)
		{
			var ponto = pontos[i];
			this.ctx.lineTo(ponto[0],ponto[1]);
		}
		this.ctx.closePath();
		if(preencher == 0) this.ctx.fill();
		else this.ctx.stroke();
	}
	
	desenhar_ponto(x1,y1)
	{
		this.ctx.fillRect(x1,y1,1,1); // fill in the pixel at (10,10)
	}
	
	carregar_imagem(url)
	{
		var imgObject = this.imgs[this.imgs.length-1];
		if(imgObject && imgObject.url == url)
		{
			
			if(imgObject.loaded)
			{
				return {value:this.imgs.length-1};
			}
			else if(imgObject.error)
			{
				throw "Erro ao carregar a imagem \""+url+"\",\n só é permitido carregar imagens usando um endereço web, por exemplo: \"https://upload.wikimedia.org/wikipedia/commons/0/0f/Exemplo.jpg\"";
			}
			else
			{
				VM_delay = 1;
				return {state:STATE_DELAY_REPEAT};
			}
		}
		else
		{
			var img = new Image();
			img.src = url;
			
			imgObject = {url:url,img:img,loaded:false,error:false,rescale:false,rescaleX:0,rescaleY:0};
			
			img.onerror = function()
			{
				console.log("Erro ao carregar imagem :"+url);
				imgObject.error = true;
			};
			
			img.onload = function() {
				console.log("Carregada imagem :"+url);
				imgObject.loaded = true;
			}
			
			
			this.imgs.push(imgObject);
			
			VM_delay = 1;
			return {state:STATE_DELAY_REPEAT};
		}
	}
	
	liberar_imagem(endereco)
	{
		this.imgs[endereco] = false;
	}
	
	
	redimensionar_imagem(endereco,largura,altura,qualidade)
	{
		if(this.imgs[endereco] && this.imgs[endereco].loaded)
		{
			var imgObject = this.imgs[endereco];
			var newImgObject = {url:imgObject.url,img:imgObject.img,loaded:true,error:false,rescale:true,rescaleX:largura,rescaleY:altura};
			
			this.imgs.push(newImgObject);
			return {value:this.imgs.length-1};
		}
		else
		{
			throw "Imagem "+endereco+" não existe ou não foi carregada";
		}
	}
	
	desenhar_imagem(x,y, endereco)
	{
		if(this.imgs[endereco] && this.imgs[endereco].loaded)
		{
			var imgObject = this.imgs[endereco];
			if(!imgObject.rescale)
			{
				this.ctx.drawImage(imgObject.img, x, y);
			}
			else
			{
				this.ctx.drawImage(imgObject.img, x, y,imgObject.rescaleX,imgObject.rescaleY);
			}
		}
		else
		{
			throw "Imagem "+endereco+" não existe ou não foi carregada";
		}
	}
	
	altura_imagem(endereco)
	{
		if(this.imgs[endereco] && this.imgs[endereco].loaded)
		{
			return {value:this.imgs[endereco].img.height}; 
		}
		else
		{
			throw "Imagem "+endereco+" não existe ou não foi carregada";
		}
	}
	
	largura_imagem(endereco)
	{
		if(this.imgs[endereco] && this.imgs[endereco].loaded)
		{
			return {value:this.imgs[endereco].img.width}; 
		}
		else
		{
			throw "Imagem "+endereco+" não existe ou não foi carregada";
		}
	}
	
	criar_cor(r,g,b)
	{
		return {value:
		((r&0xFF)<<16) | ((g&0xFF)<<8) | (b&0xFF)
		};
	}
	
	obter_cor(rgb,canal)
	{
		if(canal == this.CANAL_R)
		return {value: (rgb>>16) & 0xFF};
		else if(canal == this.CANAL_G)
		return {value: (rgb>>8) & 0xFF};
		else if(canal == this.CANAL_B)
		return {value: (rgb) & 0xFF};
		else throw "canal deve ser CANAL_R, CANAL_G ou CANAL_B";
	}
	
	definir_estilo_texto(italico,negrito,sublinhado)
	{
		this.textoItalico = italico == 0;
		this.textoNegrito = negrito == 0;
		this.textoSublinhado = sublinhado == 0;
		
		this.updateText();
	}
	
	definir_fonte_texto(fonte)
	{
		this.textoFonte = fonte;
		
		this.updateText();
	}
	
	definir_gradiente(tipo,cor1,cor2)
	{
		var hexcor1 =  "#"+Number(cor1).toString(16).padStart(6, '0');
		var hexcor2 =  "#"+Number(cor2).toString(16).padStart(6, '0');
		if(tipo == this.GRADIENTE_DIREITA)
		{
			// Create gradient
			var grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
			grd.addColorStop(0, hexcor1);
			grd.addColorStop(1, hexcor2);

			// Fill with gradient
			this.ctx.fillStyle = grd;
		}
	}
	
	definir_opacidade(opacidade)
	{
		this.ctx.globalAlpha = opacidade/255.0;
	}
	
	definir_rotacao(rot)
	{
		this.ctx.rotate(rot * Math.PI / 180);
	}
	
	fechar_janela()
	{
		this.encerrar_modo_grafico();
		return {state:STATE_ENDED};
	}
	
}