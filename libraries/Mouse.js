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
		"posicao_x":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"posicao_y":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"botao_pressionado":{id:T_parO,parameters:[T_inteiro],type:T_logico,jsSafe:true},
		"algum_botao_pressionado":{id:T_parO,parameters:[],type:T_logico,jsSafe:true},
		"exibir_cursor":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"ocultar_cursor":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"ler_botao":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:false},
		};

		//this.canvas.addEventListener("mousemove",function(evt) {console.log("LOL");});
		this.canvas.addEventListener("mousemove",(e) => {this.mouseMove(e)});
		this.canvas.addEventListener("click",(e) => {this.mouseClick(e);});
		this.canvas.addEventListener("mouseenter",(e) => {this.mouseEnter(e);});
		this.canvas.addEventListener("mouseleave",(e) => {this.mouseLeave(e);});
		
		this.canvas.addEventListener("mousedown",(e) => {this.mouseDown(e);});
		this.canvas.addEventListener("mouseup",(e) => {this.mouseUp(e);});
		
		
		var touchMap = [-1,this.BOTAO_ESQUERDO,this.BOTAO_MEIO,this.BOTAO_DIREITO];
		this.touchManager = new TouchManager();
		this.canvas.addEventListener("touchstart",(e) => {this.touchManager.touchstart(e);}, false);
		this.canvas.addEventListener("touchmove",(e) => {
			e.preventDefault(); // prevent scrolling
			this.touchManager.touchmove(e);
		}, false);
		this.canvas.addEventListener("touchend", (e) => {
			
			e.preventDefault(); // prevent 300ms after a tap event?
			this.touchManager.touchend(e);
			
		}, false);
		this.canvas.addEventListener("touchcancel",(e) => {this.touchManager.touchcancel(e);}, false);
		this.canvas.addEventListener("touchleave",(e) => {this.touchManager.touchleave(e);}, false);
		
		this.touchManager.addEventListener("onTouchDown",(p,ntouches) => {this.mouseDown({clientX:p.x,clientY:p.y,button:touchMap[ntouches]})}, false);
		this.touchManager.addEventListener("onTouchMove",(p,ntouches) => {this.mouseMove({clientX:p.x,clientY:p.y,button:touchMap[ntouches]})}, false);
		this.touchManager.addEventListener("onTouchUp",(p,ntouches) => {this.mouseUp({clientX:p.x,clientY:p.y,button:touchMap[ntouches]})}, false);
		this.touchManager.addEventListener("onTouchZoom",(p,zoomDelta) => {this.doZoom(p,zoomDelta)}, false);
		
		
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
		this.touchManager.resetar();
	}
	
	doZoom(p,zoomDelta)
	{
		// ??
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
		//console.log("mouseDown["+evt.button+"]");
		this.mouseChanged(evt);
		this.pressionado[evt.button] = true;
	}	
	mouseUp(evt)
	{
		//console.log("mouseUp["+evt.button+"]");
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
		if(this.algum_botao_pressionado())
		{
			return {value:this.pressionado[0] ? this.BOTAO_ESQUERDO :( this.pressionado[1] ?  this.BOTAO_MEIO : this.BOTAO_DIREITO)};
		}
		else
		{
			VM_delay = 1;
			return {state:STATE_DELAY_REPEAT};
		}
	}
}
