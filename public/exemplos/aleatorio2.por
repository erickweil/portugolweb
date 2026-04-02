programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Teclado --> t
	inclua biblioteca Util --> u
	inclua biblioteca Tipos --> tp
	inclua biblioteca Matematica --> m
	inclua biblioteca Mouse --> mouse

	/* Dimensões da tela do jogo */ 
	inteiro LARGURA_TELA = 800, ALTURA_TELA = 600

	const inteiro grade = 16
	/* Define quantos quadros serão desenhados por segundo (FPS) */
	const inteiro TAXA_ATUALIZACAO = 30

	/* Variáveis utilizadas para controlar o FPS e o tempo de jogo */
	inteiro tempo_inicio_jogo = 0, tempo_total_jogo = 0

	inteiro tempo_inicio = 0, tempo_decorrido = 0, tempo_restante = 0, tempo_quadro = 1000 / TAXA_ATUALIZACAO



	real projx = 0
	real projy = 0
	
	funcao inicio()
	{
		inicializar()
		loop()		
		finalizar()
	}
	
	funcao mapear(real &x,real &y, real minX,real maxX,real minY,real maxY)
	{
		x = x*(maxX-minX) + minX
		y = y*(maxY-minY) + minY
	}
	
	funcao esfera(real tx,real ty,real &px,real &py,real &pz)
	{
		mapear(tx,ty, 0,2*pi ,0,pi)
		px = m.seno(ty) * m.cosseno(tx)
		py = m.seno(ty) * m.seno(tx)
		pz = m.cosseno(ty)
	}
	
	funcao saddle(real tx,real ty,real &px,real &py,real &pz)
	{
		mapear(tx,ty, -1,1 ,-1,1)
		px = tx
		py = ty
		pz = tx*tx-ty*ty - 0.5
	}
	
	funcao cone(real tx,real ty,real &px,real &py,real &pz)
	{
		mapear(tx,ty, 0,2*pi ,0,1.0)
		px = ty * m.cosseno(tx)
		py = ty * m.seno(tx)
		pz = ty - 1.0
	}
	
	funcao donut(real tx,real ty,real &px,real &py,real &pz)
	{
		mapear(tx,ty, 0,2*pi,0,2*pi)
		real tpx = 1.0 + m.cosseno(ty)*0.4
		real tpy = m.seno(ty)*0.4
		real tpz = 0.0
		
		
		pz = (tpz * m.cosseno(tx)) - (tpx * m.seno(tx))
		px = (tpz * m.seno(tx)) + (tpx * m.cosseno(tx))
		py = tpy
	//	px = tpx
	//	py = tpy
	//	pz = tpz
	}


	
	funcao gerar(inteiro qual)
	{
	//	qual = 1
		inteiro k = 0
		
		para(inteiro y =0;y<grade+1;y++)
		{
		para(inteiro x =0;x<grade+1;x++)
		{
			real tx = x/(1.0*grade)
			real ty = y/(1.0*grade)
			
			real px = tx, py = ty, pz = 0.0
			
			escolha(qual)
			{
				caso 0:
					esfera(tx,ty,px,py,pz)
				pare
				caso 1:
					saddle(tx,ty,px,py,pz)
				pare
				caso 2:
					cone(tx,ty,px,py,pz)
				pare
				caso 3:
					donut(tx,ty,px,py,pz)
				pare
			}
			
			inteiro i = (y*(grade+1) +x)
			
			vertices[i*3 + 0] = px*50.0 
			vertices[i*3 + 1] = py*50.0 
			vertices[i*3 + 2] = pz*50.0 
			se(x <grade e y < grade)
			{
				inteiro i2 = ((y+1)*(grade+1) +x)
				tris[k+0] = i
				tris[k+1] = i+1
				tris[k+2] = i2
				
				tris[k+4] = i+1
				tris[k+3] = i2+1
				tris[k+5] = i2
				
				se(x<grade-1 e y<grade-1)
				k+=3
				senao
				k+=6
			}
		}
		}
		
		genfaces = k/3
	}

	
	real vertices[(grade+1)*(grade+1)*3]
	inteiro tris[grade*grade*2*3]
	inteiro genfaces = 0
	real rot = 0.0
	real cosr = 0.0
	real senr = 0.0
	
	real rotY = 0.0
	real cosrY = 0.0
	real senrY = 0.0
	real pi = m.PI
	funcao loop()
	{

		enquanto (nao t.tecla_pressionada(t.TECLA_ESC))
		{
			tempo_inicio = u.tempo_decorrido()
			
			desenhar()
			//rot += 0.02
			se(rot > 6.28)
			rot = 0.0
			cosr = m.cosseno(rot)
			senr = m.seno(rot)
			
			se(rotY > 3.14/2.0)
			rotY = 3.14/2.0
			se(rotY < -3.14/2.0)
			rotY = -3.14/2.0
			
			cosrY = m.cosseno(rotY)
			senrY = m.seno(rotY)
			

			
			se(mouse.botao_pressionado(mouse.BOTAO_ESQUERDO))
			{
				real moff = 1.0*mouse.posicao_y()/g.altura_janela()
				//escreva(moff)
				rotY += (moff*2.0 - 1.0)*0.3
			}
			senao
			{
				rot += 0.02
			}
			//escreva(cosr," ",senr,"\n")
			tempo_decorrido = u.tempo_decorrido() - tempo_inicio
			tempo_restante = tempo_quadro - tempo_decorrido 

			se (TAXA_ATUALIZACAO > 0  e tempo_restante > 0)
			{
				u.aguarde(tempo_restante)
			}			
		}


		
	}


	funcao desenhar()
	{
		//g.definir_tamanho_texto(22.0)
		//g.definir_cor(0xFFFFFF)
		//g.definir_estilo_texto(falso, falso, falso)
		//g.desenhar_texto(290, 240, "Aperte D para iniciar")
		g.definir_cor(0x000000)
		g.limpar()

		g.definir_cor(0xFF0000)
	//	inteiro faces = u.numero_elementos(tris)/3
		para(inteiro count = 0;count < genfaces;count ++)
		{
		//	real cr = count*255/genfaces
		//	inteiro cg = ((count/2) % grade)*256/grade
		//	inteiro cb = 255
		//	g.definir_cor(g.criar_cor(255,cr,cr))
			inteiro f = count*3
			inteiro v0 = tris[f+0]
			inteiro v1 = tris[f+1]
			inteiro v2 = tris[f+2]
			//escreva("\nf ",f+0,":",v0," ",f+1,":",v1," ",f+2,":",v2)
			linha3d(v0,v1)
			linha3d(v2,v0)
			//linha3d(v2,v0)
			//g.renderizar()
		}

		
		g.renderizar()
	}

	funcao linha3d(inteiro v1,inteiro v2)
	{
		_proj(v1)
		real px1 = projx * ALTURA_TELA +  LARGURA_TELA/2
		real py1 = projy * ALTURA_TELA + ALTURA_TELA/2
		
		_proj(v2)
		real px2 = projx * ALTURA_TELA +  LARGURA_TELA/2
		real py2 = projy * ALTURA_TELA +  ALTURA_TELA/2

		//escreva("[",px1,",", py1,"]  [", px2,",", py2,"]\n")
		g.desenhar_linha(px1, py1, px2, py2)
	}

	funcao _proj(inteiro v)
	{
		real px = vertices[v*3+0]
		real py = -vertices[v*3+2]
		real pz = vertices[v*3+1]

		//px += m.seno(rot)
		
		real tz = (pz * cosr) - (px * senr)
		real tx = (pz * senr) + (px * cosr)
		real ty = py
		
		
		
		real tty = (ty * cosrY) - (tz * senrY)
		real ttz = (ty * senrY) + (tz * cosrY)
		real ttx = tx

		
		ttz = ttz+150.0
		
		projx = ttx / ttz
		projy = tty / ttz
	}

	funcao inicializar()
	{
		g.iniciar_modo_grafico(verdadeiro)
		//g.definir_dimensoes_janela(LARGURA_TELA, ALTURA_TELA)
		g.definir_titulo_janela("Raymarcher")
		
		ALTURA_TELA = g.altura_janela()
		LARGURA_TELA = g.largura_janela()
		
		gerar(sorteia(0,3))
	}

	funcao finalizar()
	{
		g.encerrar_modo_grafico()
	}
}