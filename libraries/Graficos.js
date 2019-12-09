class Graficos {
	constructor(canvas,modal,cwindow,title)
	{
		this.canvas = canvas;
		this.modal = modal;
		this.cwindow = cwindow;
		this.title = title;
		this.members = {
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
		"desenhar_linha":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_inteiro],type:T_vazio},
		"desenhar_texto":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_cadeia],type:T_vazio},
		"definir_tamanho_texto":{id:T_parO,parameters:[T_real],type:T_vazio},
		"largura_texto":{id:T_parO,parameters:[T_cadeia],type:T_inteiro},
		"desenhar_elipse":{id:T_parO,parameters:[T_inteiro,T_inteiro,T_inteiro,T_inteiro,T_logico],type:T_vazio},
		"entrar_modo_tela_cheia":{id:T_parO,parameters:[],type:T_vazio}
		};
		
		this.resetar();
	}
	
	resetar()
	{
		this.telaCheia = false;
		this.title.value = "Janela sem Título";
		this.lastWidth = 100;
		this.lastHeight = 100;
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
		this.ctx.lineWidth = 1;
		this.ctx.fillStyle = "#000000";
		//this.ctx.strokeStyle = "#000000";
		this.limpar(); 
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
		//this.ctx.strokeStyle = this.ctx.fillStyle;
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
		this.ctx.font = tamanho+"px Arial";
	}
	
	largura_texto(texto)
	{
		return {value:this.ctx.measureText(texto).width};
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
	}
	
	sair_modo_tela_cheia()
	{
		closeFullscreen();
		this.definir_dimensoes_janela(this.lastWidth,this.lastHeight);
		this.telaCheia = false;
	}
}