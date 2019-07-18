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
		"definir_titulo_janela":{id:T_parO,parameters:[T_cadeia],type:T_vazio}
		};
	}
	
	iniciar_modo_grafico(manter_visivel)
	{
		this.manter_visivel = manter_visivel == 0;
		this.definir_dimensoes_janela(600,480);
		this.modal.style.display = "block";
		
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineWidth = 1;
		this.ctx.fillStyle = "#000000";
		//this.ctx.strokeStyle = "#000000";
		this.limpar(); 
	}
	
	encerrar_modo_grafico()
	{
		this.modal.style.display = "none";
	}
	
	definir_dimensoes_janela(w,h)
	{
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
}