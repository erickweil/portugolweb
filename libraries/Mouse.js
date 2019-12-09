class Mouse {
	constructor(canvas) {
		this.canvas = canvas;
		this.BOTAO_DIREITO = 1;
		this.BOTAO_MEIO= 2;
		this.BOTAO_ESQUERDO = 0;
		this.members = {
		"BOTAO_DIREITO":{id:T_word,type:T_inteiro},
		"BOTAO_MEIO":{id:T_word,type:T_inteiro},
		"BOTAO_ESQUERDO":{id:T_word,type:T_inteiro},
		"posicao_x":{id:T_parO,parameters:[],type:T_inteiro},
		"posicao_y":{id:T_parO,parameters:[],type:T_inteiro},
		"botao_pressionado":{id:T_parO,parameters:[T_inteiro],type:T_logico},
		"algum_botao_pressionado":{id:T_parO,parameters:[],type:T_logico},
		"exibir_cursor":{id:T_parO,parameters:[],type:T_vazio},
		"ocultar_cursor":{id:T_parO,parameters:[],type:T_vazio},
		"ler_botao":{id:T_parO,parameters:[],type:T_inteiro},
		};

		var that = this;
		
		//this.canvas.addEventListener("mousemove",function(evt) {console.log("LOL");});
		this.canvas.addEventListener("mousemove",function(evt) {that.mouseMove(evt)});
		this.canvas.addEventListener("click",function(evt) {that.mouseClick(evt);});
		this.canvas.addEventListener("mouseenter",function(evt) {that.mouseEnter(evt);});
		this.canvas.addEventListener("mouseleave",function(evt) {that.mouseLeave(evt);});
		
		this.canvas.addEventListener("mousedown",function(evt) {that.mouseDown(evt);});
		this.canvas.addEventListener("mouseup",function(evt) {that.mouseUp(evt);});
		
		this.resetar();
	}
	
	resetar()
	{
				
		this.x = 0;
		this.y = 0;
		// 0 Left
		// 1 Middle
		// 2 Right
		this.pressionado = [false,false,false];
	}
	
	mouseChanged(evt)
	{	
		var rect = this.canvas.getBoundingClientRect();
		this.x = evt.clientX - rect.left;
		this.y = evt.clientY - rect.top;
		//console.log(this.x+","+this.y);
	}
	mouseMove(evt)
	{
		this.mouseChanged(evt);
	}
	mouseClick(evt)
	{
		this.mouseChanged(evt);
	}
	mouseEnter(evt)
	{
		this.mouseChanged(evt);
	}	
	mouseLeave(evt)
	{
		this.mouseChanged(evt);
	}
	mouseDown(evt)
	{
		this.mouseChanged(evt);
		this.pressionado[evt.button] = true;
	}	
	mouseUp(evt)
	{
		this.mouseChanged(evt);
		this.pressionado[evt.button] = false;
	}
	
	posicao_x()
	{
		return {value:Math.floor(this.x)};
	}
	
	posicao_y()
	{
		return {value:Math.floor(this.y)};
	}
	
	botao_pressionado(botao)
	{
		if(botao == this.BOTAO_DIREITO) return {value:this.pressionado[2]};
		else if(botao == this.BOTAO_ESQUERDO) return {value:this.pressionado[0]};
		else if(botao == this.BOTAO_MEIO) return {value:this.pressionado[1]};
		else throw "O Botão deve ser 0, 1 ou 2";
	}
	
	algum_botao_pressionado()
	{
		return {value:this.pressionado[0] || this.pressionado[1] || this.pressionado[2]};
	}
	
	exibir_cursor()
	{
		this.canvas.style.cursor = "auto";
	}
	
	ocultar_cursor()
	{
		this.canvas.style.cursor = "none";
	}
	
	ler_botao()
	{
		// kk isso nem funciona
		return {state:STATE_WAITINGINPUT};
	}
}
