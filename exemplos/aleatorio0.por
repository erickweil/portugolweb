programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Teclado --> t
	inclua biblioteca Mouse --> mouse
	inclua biblioteca Util --> u
	inclua biblioteca Tipos --> tp
	inclua biblioteca Matematica --> m

	/* Dimensões da tela do jogo */ 
	//const inteiro LARGURA_DA_TELA = 1000, ALTURA_DA_TELA = 800
	real WIDTH2 = 500.0, HEIGHT2 = 400.0
	

	/* Define quantos quadros serão desenhados por segundo (FPS) */
	const inteiro TAXA_DE_ATUALIZACAO = 85
	real DELTATIME = 1.0 / TAXA_DE_ATUALIZACAO


	inteiro BRANCO = -1

	//inteiro centro_da_tela =0
	
	/* Variáveis utilizadas para controlar o FPS e o tempo de jogo */
	inteiro tempo_inicio_jogo = 0

	inteiro tempo_inicio = 0, tempo_decorrido = 0, tempo_restante = 0, tempo_quadro = 0
	
	inteiro tempo_inicio_fps = 0, tempo_fps = 0, frames = 0, fps = 0

	inteiro tempo_inicio_tela = 0, tempo_inicio_aceleracao = 0, tempo_escolhido_aceleracao = 0


	inteiro terreno_larg = 16
	inteiro terreno[32768]

	const inteiro CUBO_FULL = 1
	const inteiro CUBO_U = 2
	const inteiro CUBO_D = 3
	const inteiro CUBO_L = 4
	const inteiro CUBO_R = 5
	const inteiro CUBO_F = 6
	const inteiro CUBO_B = 7
	const inteiro CUBO_VERDE = 8
	

	real ponto3d[50][3]
	inteiro proj1x=0
	inteiro proj1y=0
	inteiro proj2x=0
	inteiro proj2y=0

	real proj_transx=0.0
	real proj_transy=0.0
	real proj_transz=0.0
	const inteiro X = 0
	const inteiro Y = 1
	const inteiro Z = 2

	real giro = 0.0
	real jogx = 8.0
	real jogy = 10.0
	real jogz = 8.0


	real camx = 16.0
	real camy = 4.0
	real camz = 13.0
	real atorvx = 0.0
	real atorvy = 0.0
	real atorvz = 0.0
	real atordir = 0.0
	real atordirsin = 0.0
	real atordircos = 0.0
	real atordirv = 0.0
	real atordirvsin = 0.0
	real atordirvcos = 0.0
	real atordx = 0.0
	real atordy = 0.0
	real atordz = 0.0

	logico ganhou = falso
	real ganhou_anim = 0.0

	funcao linha(inteiro pa,inteiro pb)
	{
		projetar1(pa)
		projetar2(pb)
		g.desenhar_linha(proj1x, proj1y, proj2x, proj2y)
	}

	funcao ponto(inteiro index,real _x,real _y,real _z)
	{
		ponto3d[index][X] = _x
		ponto3d[index][Y] = _y
		ponto3d[index][Z] = _z
	}

	funcao projetar1(inteiro ponto)
	{
		real transx = ponto3d[ponto][X] - camx + proj_transx
		real transy = ponto3d[ponto][Y] - camy + proj_transy
		real transz = ponto3d[ponto][Z] - camz + proj_transz


		
		
		real rotx = transx * atordircos + transz * atordirsin
		real roty = transy
		real rotz = transx * atordirsin - transz * atordircos

		//x' = x
		//y' = y*cos q - z*sin q
		//z' = y*sin q + z*cos q
	
		real rot2x = rotx
		real rot2y = roty*atordirvcos - rotz*atordirvsin
		real rot2z = roty*atordirvsin + rotz*atordirvcos

		rot2z -= 2.0
		
		real x = rot2x / rot2z
		real y = rot2y / rot2z

		proj1x = (x * HEIGHT2) + WIDTH2
		proj1y = (y * HEIGHT2) + HEIGHT2
	}
	funcao projetar2(inteiro ponto)
	{
		real transx = ponto3d[ponto][X] - camx + proj_transx
		real transy = ponto3d[ponto][Y] - camy + proj_transy
		real transz = ponto3d[ponto][Z] - camz + proj_transz

		real rotx = transx * atordircos + transz * atordirsin
		real roty = transy
		real rotz = transx * atordirsin - transz * atordircos

		
		
		real rot2x = rotx
		real rot2y = roty*atordirvcos - rotz*atordirvsin
		real rot2z = roty*atordirvsin + rotz*atordirvcos

		rot2z -= 2.0
		
		real x = rot2x / rot2z
		real y = rot2y / rot2z

		proj2x = (x * HEIGHT2) + WIDTH2
		proj2y = (y * HEIGHT2) + HEIGHT2
	}

	
	funcao cubo_x(real px,real py,real pz)
	{
		proj_transx=px
		proj_transy=py
		proj_transz=pz
		linha(8,11)
		linha(9,10)
	}

	funcao desenhar_personagem(real px,real py,real pz)
	{
		proj_transx=px
		proj_transy=py
		proj_transz=pz
		linha(12,13)
		linha(13,14)
		linha(14,15)
		linha(15,16)
		linha(16,17)
		linha(17,12)

		linha(18,19)
		linha(19,20)
		linha(20,21)
		linha(21,22)
		linha(22,23)
		linha(23,18)

		linha(18,12)
		linha(19,13)
		linha(20,14)
		linha(21,15)
		linha(22,16)
		linha(23,17)



		linha(11,12)
		linha(11,13)
		linha(11,14)
		linha(11,15)
		linha(11,16)
		linha(11,17)
	}

	funcao real rdn()
	{
		retorne u.sorteia(0, 100)*u.sorteia(0, 100)* 0.00001
	}
	
	funcao cubo_full_verde(real px,real py,real pz)
	{
		// +Z
		proj_transx=px + rdn()
		proj_transy=py + rdn()
		proj_transz=pz + ganhou_anim + rdn()
		linha(4,5)
		linha(5,7)
		linha(7,6)
		linha(6,4)

		// -Z
		proj_transx=px + rdn()
		proj_transy=py + rdn()
		proj_transz=pz - ganhou_anim + rdn()
		linha(0,1)
		linha(1,3)
		linha(3,2)
		linha(2,0)

		// +Y
		proj_transx=px + rdn()
		proj_transy=py + ganhou_anim + rdn()
		proj_transz=pz + rdn()
		linha(1,3)
		linha(3,7)
		linha(7,5)
		linha(5,1)
		
		// -Y
		proj_transx=px + rdn()
		proj_transy=py - 1.0 - ganhou_anim + rdn()
		proj_transz=pz + rdn()
		linha(1,3)
		linha(3,7)
		linha(7,5)
		linha(5,1)

		// +X
		proj_transx=px + ganhou_anim + rdn()
		proj_transy=py + rdn()
		proj_transz=pz + rdn()
		linha(3,2)
		linha(2,6)
		linha(3,7)
		linha(6,7)

		// -X
		proj_transx=px - 1.0 - ganhou_anim + rdn()
		proj_transy=py + rdn()
		proj_transz=pz + rdn()
		linha(3,2)
		linha(2,6)
		linha(3,7)
		linha(6,7)
	}

	funcao cubo_full(real px,real py,real pz)
	{
		proj_transx=px
		proj_transy=py
		proj_transz=pz
		linha(0,1)
		linha(1,3)
		linha(3,2)
		linha(2,0)

		linha(4,5)
		linha(5,7)
		linha(7,6)
		linha(6,4)

		linha(0,4)
		linha(1,5)
		linha(2,6)
		linha(3,7)
	}

	funcao cubo_u(real px,real py,real pz)
	{
		proj_transx=px
		proj_transy=py
		proj_transz=pz
		//1,3,5,7
		linha(1,3)
		linha(3,7)
		linha(7,5)
		linha(5,1)
	}

	funcao cubo_b(real px,real py,real pz)
	{
		proj_transx=px
		proj_transy=py
		proj_transz=pz
		//0,1,2,3
		linha(0,2)
		linha(2,1)
		linha(3,2)
		linha(1,0)
	}
	
	funcao iniciarCubo()
	{
		ponto(0,-0.5,-0.5,-0.5)
		ponto(1,-0.5,0.5,-0.5)
		ponto(2,0.5,-0.5,-0.5)
		ponto(3,0.5,0.5,-0.5)
		
		ponto(4,-0.5,-0.5,0.5)
		ponto(5,-0.5,0.5,0.5)
		ponto(6,0.5,-0.5,0.5)
		ponto(7,0.5,0.5,0.5)

		ponto(8,-0.2,0.0,-0.2)
		ponto(9,-0.2,0.0,0.2)
		ponto(10,0.2,0.0,-0.2)
		ponto(11,0.2,0.0,0.2)

		ponto(11,0.0,0.0,0.0)

		real d = 0.5
		ponto(12,0.0,0.5,d)
		ponto(13,d*0.866,0.5,d*0.5)
		ponto(14,d*0.866,0.5,-d*0.5)
		ponto(15,0.0,0.5,-d)
		ponto(16,-d*0.866,0.5,-d*0.5)
		ponto(17,-d*0.866,0.5,d*0.5)
		d = 0.3
		
		ponto(18,0.0,0.9,d)
		ponto(19,d*0.866,0.9,d*0.5)
		ponto(20,d*0.866,0.9,-d*0.5)
		ponto(21,0.0,0.9,-d)
		ponto(22,-d*0.866,0.9,-d*0.5)
		ponto(23,-d*0.866,0.9,d*0.5)
	}

	funcao terreno_cubo(inteiro v,inteiro px,inteiro py,inteiro pz)
	{
		terreno[px + py*terreno_larg + pz*terreno_larg*terreno_larg] = v
	}


	funcao real terreno_gen(real x,real y,real z)
	{
		//retorne m.raiz(x*x + y*y + z*z,2.0) - 16.0
		retorne m.raiz(x*x + z*z,2.0) -y
	}

	funcao iniciar_terreno()
	{
		
		para(inteiro x =0;x < terreno_larg;x++)
		{
			para(inteiro y =0;y < terreno_larg;y++)
			{
				para(inteiro z =0;z< terreno_larg;z++)
				{
					se(u.sorteia(0, y+1)*u.sorteia(0, y+1) == 1)
					//real v = terreno_gen(x,y,z)
					//se(v < 0.5 e v > -0.5)
					{
						terreno_cubo(CUBO_U,x,y,z)
					}
				}
			}
		}
		terreno_cubo(CUBO_VERDE,u.sorteia(0,terreno_larg-1),u.sorteia(0,terreno_larg-1),u.sorteia(0,terreno_larg-1))
		//terreno_cubo(CUBO_VERDE,16,9,18)
		terreno_cubo(CUBO_U,16,9,16)
		//para(inteiro x =0;x < terreno_larg;x++)
		//{
		//	para(inteiro y =0;y< terreno_larg;y++)
		//	{
		//		terreno_cubo(CUBO_B,x,y,10)
		//	}
		//}
		//terreno_cubo(CUBO_FULL,16,2,16)
		//terreno_cubo(CUBO_FULL,16,2,17)
		//terreno_cubo(CUBO_FULL,16,2,15)
		//terreno_cubo(CUBO_FULL,17,2,16)
		//terreno_cubo(CUBO_FULL,15,2,16)

		
	}
	
	funcao contar_taxa_de_fps()
	{
		frames = frames + 1
		tempo_fps = u.tempo_decorrido() - tempo_inicio_fps

		se (tempo_fps >= 1000)
		{
			fps = frames
			tempo_inicio_fps = u.tempo_decorrido() - (tempo_fps - 1000)
			frames = 0
		}
	}

	funcao desenhar_taxa_de_fps()
	{
		g.definir_tamanho_texto(12.0)
		g.definir_cor(0xFFFFFF)
		g.definir_estilo_texto(falso, verdadeiro, falso)
		g.desenhar_texto(25, 40, "FPS: " + fps)
	}
		
	funcao inicio()
	{
		mouse.ocultar_cursor()
		escreva(DELTATIME,"\n")
		se (TAXA_DE_ATUALIZACAO > 0)
		{
			tempo_quadro = 1000 / TAXA_DE_ATUALIZACAO
		}
		
		g.iniciar_modo_grafico(verdadeiro)
		g.entrar_modo_tela_cheia()

		WIDTH2 = g.largura_tela()/2.0
		HEIGHT2 = g.altura_tela()/2.0
		//g.definir_dimensoes_janela(LARGURA_DA_TELA, ALTURA_DA_TELA)
		g.definir_titulo_janela("O CUBO VERDE")	

		
				
		tempo_restante = 0		
		tempo_inicio_jogo = u.tempo_decorrido()
		
		frames = 0
		
		// Hack para não exibir o FPS zerado na primeira vez que desenhar a tela
		tempo_inicio_fps = u.tempo_decorrido() - 1000		

		iniciarCubo()
		iniciar_terreno()
		enquanto (verdadeiro)
		{
			tempo_inicio = u.tempo_decorrido() + tempo_restante

			mover_ator()
			desenhar_tela_do_jogo()
			
			tempo_decorrido = u.tempo_decorrido() - tempo_inicio
			tempo_restante = tempo_quadro - tempo_decorrido 
	
			//enquanto (TAXA_DE_ATUALIZACAO > 0 e tempo_restante > 0)
			//{
			//	tempo_decorrido = u.tempo_decorrido() - tempo_inicio
			//	tempo_restante = tempo_quadro - tempo_decorrido
				u.aguarde(5)
			//}
	
			contar_taxa_de_fps()
			
			se (t.tecla_pressionada(t.TECLA_ESC))
			{
				pare
			}

			giro = giro + 0.01
			se(giro > 1.0) giro = -3.0
		}

		
		g.encerrar_modo_grafico()
	}

	inteiro mx=0
	inteiro my=0
	funcao mover_ator()
	{
		
		real diffmx = (mx - mouse.posicao_x())/100.0
		real diffmy = (my - mouse.posicao_y())/100.0

		atordir -= diffmx
		atordirv -= diffmy
		
		se(t.tecla_pressionada(t.TECLA_SETA_DIREITA))
		{
			atordir += 0.04
		}
		senao se(t.tecla_pressionada(t.TECLA_SETA_ESQUERDA))
		{
			atordir -= 0.04
		}
		se(t.tecla_pressionada(t.TECLA_SETA_ACIMA))
		{
			atordirv += 0.04
		}
		senao se(t.tecla_pressionada(t.TECLA_SETA_ABAIXO))
		{
			atordirv -= 0.04
		}
		
		mx = mouse.posicao_x()
		my = mouse.posicao_y()

		se(atordir < 0.0)
		{
			atordir += m.PI*2
		}
		se(atordir > m.PI*2)
		{
			atordir -= m.PI*2
		}

		se(atordirv < -m.PI/2)
		{
			atordirv = -m.PI/2
		}
		se(atordirv > m.PI/2)
		{
			atordirv = m.PI/2
		}
		
		atordirsin = m.seno(atordir)
		atordircos = m.cosseno(atordir)

		atordirvsin = m.seno(atordirv)
		atordirvcos = m.cosseno(atordirv)
		
		// x = x*cos - y*sin
		// y = y*cos + x*sin

		atordx = 0.0
		atordy = 0.0
		atordz = 1.0


		real atord1x = atordx
		real atord1y = atordy*atordirvcos - atordz*atordirvsin
		real atord1z = atordy*atordirvsin + atordz*atordirvcos
		
		atordx = atord1x * atordircos - atord1z * atordirsin
		atordy = atord1y
		atordz = atord1x * atordirsin + atord1z * atordircos

		real forward_x = 0.0 * atordircos - 3.0 * atordirsin
		real forward_z = 0.0 * atordirsin + 3.0 * atordircos


		//se(t.tecla_pressionada(t.TECLA_SETA_ACIMA))
		//{
		//escreva(atordx,",",atordz,"\n")
		//}

		real right_x = 3.0 * atordircos - 0.0 * atordirsin
		real right_z = 3.0 * atordirsin + 0.0 * atordircos

		atorvx = 0.0
		atorvz = 0.0

		se(t.tecla_pressionada(t.TECLA_A))
		{
			atorvx += right_x
			atorvz += right_z
		}
		se(t.tecla_pressionada(t.TECLA_D))
		{
			atorvx += -right_x
			atorvz += -right_z
		}


		se(t.tecla_pressionada(t.TECLA_W))
		{
			atorvx += forward_x
			atorvz += forward_z
		}
		se(t.tecla_pressionada(t.TECLA_S))
		{
			atorvx += -forward_x
			atorvz += -forward_z
		}

		se(colidindo(0.0,-0.1,0.0))
		{
			se(atorvy < 0) atorvy = 0.0
			se(t.tecla_pressionada(t.TECLA_ESPACO))
			{
				atorvy = 8.9
			}
			//escreva("colidindo Y:"+atorpy+"\n")
		}
		senao
		{
			atorvy -= 9.8 * DELTATIME
		}

		
		se(atorvy > 0 e colidindo(0.0,0.1,0.0)) atorvy = 0.0

		se(atorvz > 0 e colidindo(0.0,0.0,0.1)) atorvz = 0.0
		se(atorvz < 0 e colidindo(0.0,0.0,-0.1)) atorvz = 0.0

		se(atorvx > 0 e colidindo(0.1,0.0,0.0)) atorvx = 0.0
		se(atorvx < 0 e colidindo(-0.1,0.0,0.0)) atorvx = 0.0
		//se(nao colidindo(atorvx * DELTATIME,0.0,0.0))
		//jogx = jogx + atorvx * DELTATIME
		//se(nao colidindo(0.0,atorvy * DELTATIME,0.0))
		//jogy = jogy + atorvy * DELTATIME
		//se(nao colidindo(0.0,0.0,atorvz * DELTATIME))
		//jogz = jogz + atorvz * DELTATIME
		se(ganhou){
			/*se(ganhou_anim < 2.0)*/
			ganhou_anim += 0.005
			/*senao
			{
				ganhou_anim += 0.001
				atordirsin += 0.1* ganhou_anim
				atordircos += 0.1* ganhou_anim
				atordirvsin += 0.1* ganhou_anim
				atordirvcos += 0.1* ganhou_anim

				ponto(0,-0.5+rdn()*5,-0.5+rdn()*5,-0.5+rdn()*5)
				ponto(1,-0.5+rdn()*5,0.5+rdn()*5,-0.5+rdn()*5)
				ponto(2,0.5+rdn()*5,-0.5+rdn()*5,-0.5+rdn()*5)
				ponto(3,0.5+rdn()*5,0.5+rdn()*5,-0.5+rdn()*5)
				
				ponto(4,-0.5+rdn()*5,-0.5+rdn()*5,0.5+rdn()*5)
				ponto(5,-0.5+rdn()*5,0.5+rdn()*5,0.5+rdn()*5)
				ponto(6,0.5+rdn()*5,-0.5+rdn()*5,0.5+rdn()*5)
				ponto(7,0.5+rdn()*5,0.5+rdn()*5,0.5+rdn()*5)
			}*/
			retorne
		}
		
		encostar(atorvx * DELTATIME,atorvy * DELTATIME,atorvz * DELTATIME)

		se(jogy < -20.0) 
		{
			jogy = 40.0
			atorvy = 0.0
		}

		camx = jogx
		camy = jogy + 1.5
		camz = jogz
	}

	
	funcao desenhar_tela_do_jogo()
	{
		g.definir_cor(0x000000)
		g.limpar()
        desenhar_taxa_de_fps()
        g.definir_tamanho_texto(20.0)
		g.desenhar_texto(25, 60, "TESTE")

		desenharTerreno()
		g.renderizar()
	}

	funcao encostar(real dx,real dy,real dz)
	{
		para(inteiro i =0;i<10;i++)
		{
			dx = dx/2.0
			dy = dy/2.0
			dz = dz/2.0
			se(colidindo(dx,dy,dz))
			{
				jogx -=dx
				jogy -=dy
				jogz -=dz
			}
			senao
			{
				jogx +=dx
				jogy +=dy
				jogz +=dz	
			}
		}
	}

	funcao logico colidindo(real dx,real dy,real dz)
	{
		inteiro b = getBlocor(jogx+dx,jogy+dy,jogz+dz)
		se(b == CUBO_VERDE) ganhou = verdadeiro
		se(b != 0) retorne verdadeiro
		senao retorne falso
	}


	funcao desenharTerreno()
	{
		g.definir_cor(0xFFFFFF)
		inteiro distvisao = 8
		inteiro dx = tp.real_para_inteiro(camx)
		inteiro dy = tp.real_para_inteiro(camy)
		inteiro dz = tp.real_para_inteiro(camz)
		para(inteiro x = -distvisao;x <= distvisao;x++)
		{
			para(inteiro y = -distvisao;y <= distvisao;y++)
			{
				para(inteiro z= -distvisao;z <= distvisao;z++)
				{
					inteiro px = dx + x
					inteiro py = dy + y
					inteiro pz = dz + z
					se(px >= 0 e py >= 0 e pz >= 0 e px < terreno_larg e py < terreno_larg e pz < terreno_larg)
					{
						inteiro t = terreno[px + py*terreno_larg + pz*terreno_larg*terreno_larg]
						se( t != 0)
						{
							se( (atordx*(px-camx) + atordy*(py-camy) + atordz*(pz-camz)) < 0.0) 
							{
							
							}
							senao
							{
								real d = (jogx-px)*(jogx-px) + (jogy-py)*(jogy-py) + (jogz-pz)*(jogz-pz)
								inteiro cor = (d/(13.0*13.0)) * 255.0
								se(cor > 255) cor = 255
								cor = 255 - cor
								
								g.definir_cor(g.criar_cor(cor, cor, cor))
								se(t == CUBO_VERDE ou ganhou)
								{
									g.definir_cor(g.criar_cor(0, cor, 0))
									cubo_full_verde(px,py,pz)
								}
								senao se(t == CUBO_FULL)
								{
									cubo_full(px,py,pz)
								}
								senao se(t == CUBO_U)
								{
									cubo_u(px,py,pz)
								}
								senao se(t == CUBO_B)
								{
									cubo_b(px,py,pz)
								} 
							}
						}
					}
				}
			}
		}

		//g.definir_cor(0xFFFF00)
		//cubo_x(jogx,jogy,jogz)
		//inteiro px = tp.real_para_inteiro(jogx+0.5)
		//inteiro py = tp.real_para_inteiro(jogy+0.5)
		//inteiro pz = tp.real_para_inteiro(jogz+0.5)
		//cubo_full(px,py,pz)
		g.definir_cor(0xFF0000)
		desenhar_personagem(jogx,jogy,jogz)
	}

	funcao inteiro getBlocor(real x,real y,real z)
	{
		inteiro px = tp.real_para_inteiro(x+0.5)
		inteiro py = tp.real_para_inteiro(y+0.5)
		inteiro pz = tp.real_para_inteiro(z+0.5)
		se(px >= 0 e py >= 0 e pz >= 0 e px < terreno_larg e py < terreno_larg e pz < terreno_larg)
		{
			retorne terreno[px + py*terreno_larg + pz*terreno_larg*terreno_larg]
		} senao retorne 0
	}
	
}