import { T_parO, T_word, T_inteiro, T_cadeia, T_caracter, T_real, T_logico, T_vazio, T_Minteiro } from "../../compiler/tokenizer.js";
import { closeFullscreen, getScreenDimensions, openFullscreen } from "../../extras/extras.js";
import { STATE_BREATHING, STATE_DELAY_REPEAT, STATE_ENDED, VM_setCodeMax, VM_setDelay } from "../vm.js";

export default class Graficos {
	constructor(canvas,modal,cwindow,title,divKeys,libTeclado,isMobile)
	{
		this.isMobile = isMobile;
		this.canvas = canvas;
		this.modal = modal;
		this.cwindow = cwindow;
		this.title = title;
		this.divKeys = divKeys;
		this.libTeclado = libTeclado;
		this.rotation = 0;
		
		
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
		this.GRADIENTE_ESQUERDA = 1;
		this.GRADIENTE_ACIMA = 2;
		this.GRADIENTE_ABAIXO = 3;
		this.GRADIENTE_INFERIOR_DIREITO = 4;
		this.GRADIENTE_INFERIOR_ESQUERDO = 5;
		this.GRADIENTE_SUPERIOR_DIREITO = 6;
		this.GRADIENTE_SUPERIOR_ESQUERDO = 7;
		
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
		"GRADIENTE_ESQUERDA":{id:T_word,type:T_inteiro},
		"GRADIENTE_ACIMA":{id:T_word,type:T_inteiro},
		"GRADIENTE_ABAIXO":{id:T_word,type:T_inteiro},
		"GRADIENTE_INFERIOR_DIREITO":{id:T_word,type:T_inteiro},
		"GRADIENTE_INFERIOR_ESQUERDO":{id:T_word,type:T_inteiro},
		"GRADIENTE_SUPERIOR_DIREITO":{id:T_word,type:T_inteiro},
		"GRADIENTE_SUPERIOR_ESQUERDO":{id:T_word,type:T_inteiro},
		
		"iniciar_modo_grafico":{id:T_parO,parameters:[{name:"manter_visivel",type:T_logico}],type:T_vazio,jsSafe:true},
		"encerrar_modo_grafico":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"definir_dimensoes_janela":{id:T_parO,parameters:[{name:"largura",type:T_inteiro},{name:"altura",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"definir_cor":{id:T_parO,parameters:[{name:"cor",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"renderizar":{id:T_parO,parameters:[],type:T_vazio,jsSafe:false},
		"desenhar_retangulo":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro},{name:"largura",type:T_inteiro},{name:"altura",type:T_inteiro},{name:"arredondar",type:T_logico},{name:"preencher",type:T_logico}],type:T_vazio,jsSafe:true},
		"limpar":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"definir_titulo_janela":{id:T_parO,parameters:[{name:"titulo",type:T_cadeia}],type:T_vazio,jsSafe:true},
		"altura_janela":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"largura_janela":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"altura_tela":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"largura_tela":{id:T_parO,parameters:[],type:T_inteiro,jsSafe:true},
		"desenhar_linha":{id:T_parO,parameters:[{name:"aX",type:T_inteiro},{name:"aY",type:T_inteiro},{name:"bX",type:T_inteiro},{name:"bY",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"desenhar_texto":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro},{name:"texto",type:T_cadeia}],type:T_vazio,jsSafe:true},
		"definir_tamanho_texto":{id:T_parO,parameters:[{name:"tamanho",type:T_real}],type:T_vazio,jsSafe:true},
		"largura_texto":{id:T_parO,parameters:[{name:"texto",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"altura_texto":{id:T_parO,parameters:[{name:"texto",type:T_cadeia}],type:T_inteiro,jsSafe:true},
		"desenhar_elipse":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro},{name:"largura",type:T_inteiro},{name:"altura",type:T_inteiro},{name:"preencher",type:T_logico}],type:T_vazio,jsSafe:true},
		"entrar_modo_tela_cheia":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"desenhar_poligono":{id:T_parO,parameters:[{name:"matriz_pontos",type:T_Minteiro},{name:"preenchar",type:T_logico}],type:T_vazio,jsSafe:true},
		"desenhar_ponto":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"carregar_imagem":{id:T_parO,parameters:[{name:"caminho",type:T_cadeia}],type:T_inteiro,jsSafe:false},
		"liberar_imagem":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"desenhar_imagem":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro},{name:"endereco",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"desenhar_porcao_imagem":{id:T_parO,parameters:[{name:"pX",type:T_inteiro},{name:"pY",type:T_inteiro},{name:"porcaoX",type:T_inteiro},{name:"porcaoY",type:T_inteiro},{name:"porcaoLargura",type:T_inteiro},{name:"porcaoAltura",type:T_inteiro},{name:"endereco",type:T_inteiro}],type:T_vazio,jsSafe:true},
		
		"altura_imagem":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"largura_imagem":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		
		"criar_cor":{id:T_parO,parameters:[{name:"R",type:T_inteiro},{name:"G",type:T_inteiro},{name:"B",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"obter_cor":{id:T_parO,parameters:[{name:"RGB",type:T_inteiro},{name:"canal",type:T_inteiro}],type:T_inteiro,jsSafe:true},// manter o antigo
		"obter_RGB":{id:T_parO,parameters:[{name:"RGB",type:T_inteiro},{name:"canal",type:T_inteiro}],type:T_inteiro,jsSafe:true},
		"definir_estilo_texto":{id:T_parO,parameters:[{name:"italico",type:T_logico},{name:"negrito",type:T_logico},{name:"sublinhado",type:T_logico}],type:T_vazio,jsSafe:true},
		"definir_fonte_texto":{id:T_parO,parameters:[{name:"caminho_fonte",type:T_cadeia}],type:T_vazio,jsSafe:true},
		
		"definir_gradiente":{id:T_parO,parameters:[{name:"tipo",type:T_inteiro},{name:"cor1",type:T_inteiro},{name:"cor2",type:T_inteiro}],type:T_vazio,jsSafe:true},
		
		"definir_opacidade":{id:T_parO,parameters:[{name:"opacidade",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"definir_rotacao":{id:T_parO,parameters:[{name:"rotacao",type:T_inteiro}],type:T_vazio,jsSafe:true},
		"fechar_janela":{id:T_parO,parameters:[],type:T_vazio,jsSafe:false},
		
		"redimensionar_imagem":{id:T_parO,parameters:[{name:"endereco",type:T_inteiro},{name:"largura",type:T_inteiro},{name:"altura",type:T_inteiro},{name:"qualidade",type:T_logico}],type:T_inteiro,jsSafe:true},
		
		
		"exibir_borda_janela":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"ocultar_borda_janela":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"minimizar_janela":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true},
		"restaurar_janela":{id:T_parO,parameters:[],type:T_vazio,jsSafe:true}
		
		};
		
		
		
		this.resetar();
	}
	
	updateText()
	{
		this.ctx.font = (this.textoItalico ? "italic" : "")+" "+(this.textoNegrito ? "bold" : "")+" "+(this.textoTamanho)+"px "+this.textoFonte;
	}
	
	resetar()
	{
		this.telaCheia = false;
		this.title.value = "Janela sem Título";
		this.lastWidth = 100;
		this.lastHeight = 100;
		this.rotation = 0;
		
		this.textoTamanho = 15;
		this.textoItalico = false;
		this.textoNegrito = false;
		this.textoSublinhado = false;
		this.textoFonte = "Calibri";
		
		this.imgs = [];
	}
	
	iniciar_modo_grafico(manter_visivel)
	{
		VM_setCodeMax(10000000); // para não dar flickering na tela
		this.manter_visivel = manter_visivel == 0;
		
		let screenDim = getScreenDimensions();

		
		let square = Math.min(screenDim.width,screenDim.height);
		//this.definir_dimensoes_janela(600,480);
		this.definir_dimensoes_janela(square-32,square-72);
		
		this.modal.style.display = "table";
		
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineWidth = 2;
		this.ctx.fillStyle = "#000000";
		//this.ctx.strokeStyle = "#000000";
		this.limpar();
		
		this.canvas.focus();
		
		this.divKeys.innerHTML = "";
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
		let screenDim = getScreenDimensions();
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
		// Double Buffering com dois canvas deixaria tudo mais lento ainda...
		// respira para não travar tudo
		// a forma que o javascript funciona é que ele só vai atualizar a tela quando der uma pausinha
		
		this.updateTecladoGraficos();
		
		return {state:STATE_BREATHING};
	}
	
		
	updateTecladoGraficos()
	{
		// Vamos aproveitar essa função para atualizar os botões do teclado, caso tenha algum
		if(this.isMobile && this.modal.style.display !== "none")
		{
			let teclas = Object.keys(this.libTeclado.checkMap);
			let teclaCharMap = Object.keys(this.libTeclado.teclaCharMap);
			let resHTML = "";
			
			if(teclas.length > 0)
			{
				for(let i =0;i<teclas.length;i++)
				{
					let t = teclas[i];
					
					if(this.libTeclado.checkMap[t] === true)
					{
						this.libTeclado.checkMap[t] = false;
						let tvalue = this.libTeclado.teclaCharMap[t];
						if(typeof tvalue === 'undefined')
						{
							tvalue = String.fromCharCode(t);
						}
						resHTML += "<input type=\"button\" value=\""+tvalue+"\" ontouchstart=\"GraficosBtnTypeDown('"+t+"')\" ontouchend=\"GraficosBtnTypeUp('"+t+"')\" onfocus=\"preventFocusCanvas(event)\" style=\"background: #1E2324;\">";
					}
				}
			}
					
			if(this.divKeys.innerHTML != resHTML)
			this.divKeys.innerHTML = resHTML;
		}		
	}
	
	desenhar_retangulo(x,y,w,h,arredondar,preencher) // lembrar que logico 0 é verdadeiro outra coisa é falso
	{
		this.startDraw(x,y,w,h);
		if(arredondar == 0)
		{
			let r = 0;
			if (w <= h) r = w / 10.0;
			else r = h / 10.0;
			
			this.ctx.beginPath();
			this.ctx.moveTo(x+r, y);
			this.ctx.arcTo(x+w, y,   x+w, y+h, r);
			this.ctx.arcTo(x+w, y+h, x,   y+h, r);
			this.ctx.arcTo(x,   y+h, x,   y,   r);
			this.ctx.arcTo(x,   y,   x+w, y,   r);
			this.ctx.closePath();
			
			if(preencher == 0) this.ctx.fill();
			else this.ctx.stroke();
		}
		else
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
		this.endDraw();
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
		let screenDim = getScreenDimensions();
		return {value:screenDim.height};
	}
	
	largura_tela()
	{
		let screenDim = getScreenDimensions();
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
		this.startDraw(x1,y1,x2-x1,y2-y1);
		this.ctx.beginPath(); 
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		// Make the line visible
		this.ctx.stroke();
		this.endDraw();
	}
	
	desenhar_texto(x,y,texto)
	{
		let altura = this.altura_texto(texto).value;
		let largura = this.largura_texto(texto).value;
		this.startDraw(x,y,largura,altura);
		
		this.ctx.fillText(texto, x, y+altura*0.8);
		this.endDraw();
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
		//return {value:this.largura_texto("W").value};
		return {value:this.textoTamanho};
	}
	
	desenhar_elipse(x,y,largura,altura,preencher)
	{
		this.startDraw(x,y,largura,altura);
		let rx = largura/2.0;
		let ry = altura/2.0;
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
			let kappa = .5522848,
			ox = (largura / 2) * kappa, // control point offset horizontal
			oy = (altura / 2) * kappa, // control point offset vertical
			xe = x + largura,           // x-end
			ye = y + altura,           // y-end
			xm = x + largura / 2,       // x-middle
			ym = y + altura / 2;       // y-middle

			this.ctx.beginPath();
			this.ctx.moveTo(x, ym);
			this.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			this.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			this.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

			if(preencher == 0) this.ctx.fill();
			else this.ctx.stroke();
			
		}
		
		this.endDraw();
	}
	
	entrar_modo_tela_cheia()
	{
		openFullscreen(this.modal);
		
		this.cwindow.style.height = "100%";
		this.cwindow.style.width = "100%";
		this.telaCheia = true;
		
		let screenDim = getScreenDimensions();
		this.canvas.height = screenDim.height-48;
		this.canvas.width = screenDim.width-8;
		
		let that = this;
		window.setTimeout(function(){ // pq a tela redimensiona depois
			let screenDim = getScreenDimensions();
			that.canvas.height = screenDim.height-48;
			that.canvas.width = screenDim.width-8;
		}, 50);
		
		window.setTimeout(function(){ // muito depois 
			let screenDim = getScreenDimensions();
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
		for(let i=1;i<pontos.length;i++)
		{
			let ponto = pontos[i];
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
		let imgObject = this.imgs[this.imgs.length-1];
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
				VM_setDelay(1);
				return {state:STATE_DELAY_REPEAT};
			}
		}
		else
		{
			let img = new Image();
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
			};
			
			
			this.imgs.push(imgObject);
			
			VM_setDelay(1);
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
			let imgObject = this.imgs[endereco];
			let newImgObject = {url:imgObject.url,img:imgObject.img,loaded:true,error:false,rescale:true,rescaleX:largura,rescaleY:altura};
			
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
			let imgObject = this.imgs[endereco];
			
			
			if(!imgObject.rescale)
			{
				this.startDraw(x,y,imgObject.img.width,imgObject.img.height);
				this.ctx.drawImage(imgObject.img, x, y);
			}
			else
			{
				this.startDraw(x,y,imgObject.rescaleX,imgObject.rescaleY);
				this.ctx.drawImage(imgObject.img, x, y,imgObject.rescaleX,imgObject.rescaleY);
			}
			this.endDraw();
		}
		else
		{
			throw "Imagem "+endereco+" não existe ou não foi carregada";
		}
	}
	
	desenhar_porcao_imagem(x,y,xi,yi,w,h, endereco)
	{
		if(this.imgs[endereco] && this.imgs[endereco].loaded)
		{
			let imgObject = this.imgs[endereco];
			
			this.startDraw(x,y,w,h);
				
			if(!imgObject.rescale)
			{
				this.ctx.drawImage(imgObject.img, xi, yi, w, h, x, y, w, h);
			}
			else
			{
				// Remapear para operar na imagem não escalonada.
				let sw = w/imgObject.rescaleX * imgObject.img.width;
				let sh = h/imgObject.rescaleY * imgObject.img.height;
				
				let sxi = xi/imgObject.rescaleX * imgObject.img.width;
				let syi = yi/imgObject.rescaleY * imgObject.img.height;
				
				this.ctx.drawImage(imgObject.img, sxi, syi, sw, sh, x, y, w,h);
			}
			
			
			this.endDraw();
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
	
	obter_RGB(rgb,canal)
	{
		if(canal == this.CANAL_R)
		return {value: (rgb>>16) & 0xFF};
		else if(canal == this.CANAL_G)
		return {value: (rgb>>8) & 0xFF};
		else if(canal == this.CANAL_B)
		return {value: (rgb) & 0xFF};
		else throw "canal deve ser CANAL_R, CANAL_G ou CANAL_B";
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
		let hexcor1 =  "#"+Number(cor1).toString(16).padStart(6, '0');
		let hexcor2 =  "#"+Number(cor2).toString(16).padStart(6, '0');
		//if(tipo == this.GRADIENTE_DIREITA)
		//{
			// Create gradient
			let grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
			grd.addColorStop(0, hexcor1);
			grd.addColorStop(1, hexcor2);

			// Fill with gradient
			this.ctx.fillStyle = grd;
		//}
	}
	
	definir_opacidade(opacidade)
	{
		this.ctx.globalAlpha = opacidade/255.0;
	}
	
	definir_rotacao(rot)
	{
		//this.ctx.rotate(rot * Math.PI / 180);
		this.rotation = rot;
	}
	
	// para aplicar a rotação antes de desenhar
	startDraw(x,y,w,h)
	{
		this.ctx.save();
		if(this.rotation != 0)
		{
			let centerX = (x + (x+w)) * 0.5;
			let centerY = (y + (y+h)) * 0.5;
			// move the origin to the canvas' center
			this.ctx.translate(centerX, centerY);
			this.ctx.rotate(this.rotation * Math.PI / 180);
			this.ctx.translate(-centerX, -centerY);
		}
	}

	// para des-aplicar a rotação
	endDraw()
	{
		this.ctx.restore();
	}
	
	
	fechar_janela()
	{
		this.encerrar_modo_grafico();
		return {state:STATE_ENDED};
	}
	
	exibir_borda_janela()
	{
		// que borda?
	}
	
	ocultar_borda_janela()
	{
		// que borda?
	}
	
	minimizar_janela()
	{
		// não faz nada
	}
	
	restaurar_janela()
	{
		// não faz nada
	}
}