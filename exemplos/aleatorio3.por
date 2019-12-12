programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Teclado --> t
	inclua biblioteca Util --> u
	inclua biblioteca Tipos --> tp
	inclua biblioteca Matematica --> m
	inclua biblioteca Sons --> sn

	/* 
	 *  Define se o jogo está sendo depurado ou não. Quando o jogo está em modo de depuração, 
	 *  algumas informações adicionais aparecem na tela como, por exemplo, a taxa de atualização,
	 *  isto é, a contagem de FPS
	 */
	const logico DEPURANDO = verdadeiro

	/* Dimensões da tela do jogo */ 

	
	
	/* 
	 * Esta constante define a que distância irá se considerarq que o foguete está próximo 
	 * da plataformma.
	 * 
	 * É utilizada pela inteligência artificial da demonstração para saber quando o foguete 
	 * deve ser acelerado.
	 */
	const inteiro DISTANCIA_DE_PROXIMIDADE_DA_PLATAFORMA = 70

	/* Define quantos quadros serão desenhados por segundo (FPS) */
	const inteiro TAXA_DE_ATUALIZACAO = 85


	inteiro BRANCO = -1
	
	
	/* Variáveis utilizadas para controlar o FPS e o tempo de jogo */
	inteiro tempo_inicio_jogo = 0

	inteiro tempo_inicio = 0, tempo_decorrido = 0, tempo_restante = 0, tempo_quadro = 0
	
	inteiro tempo_inicio_fps = 0, tempo_fps = 0, frames = 0, fps = 0

	inteiro tempo_inicio_tela = 0, tempo_inicio_aceleracao = 0, tempo_escolhido_aceleracao = 0


	inteiro atorx = 400
	inteiro atory = 300

	inteiro moedax = 100
	inteiro moeday = 100

	real inimigox = 500
	real inimigoy = 600
	real inimigovel = 0.01
	
	logico perdeu = falso
	inteiro num_moedas = 0
	
	funcao desenhar_tela_do_jogo()
	{
		g.definir_cor(0x000000)
		g.limpar()
		inimigox = atorx * inimigovel + inimigox * (1-inimigovel)
		inimigoy = atory * inimigovel + inimigoy * (1-inimigovel)
		//  horizontal
		se(atorx < 0) atorx = g.largura_janela()
		se(atorx > g.largura_janela()  ) atorx = 0

		//  vertical
		se(atory < 0) atory = g.altura_janela()
		se(atory > g.altura_janela()) atory = 0

		inteiro distmoeda = dist(atorx,atory,moedax,moeday) 
		se(distmoeda < 50*50)
		{
			moedax = u.sorteia(0, 800)
			moeday = u.sorteia(0, 600)
			inimigovel += 0.001
			num_moedas += 1
		}

		inteiro distinimigo = dist(atorx,atory,inimigox,inimigoy)
		se(distinimigo < 50*50)
		{
			perdeu = verdadeiro
		}
		
		g.definir_cor(0x9347c6)
		g.desenhar_elipse(atorx-25, atory-25, 50, 50, verdadeiro)

		g.definir_cor(0xf6ff00)
		g.desenhar_elipse(moedax-25, moeday-25, 50, 50, verdadeiro)

		g.definir_cor(0x0000ff)
		g.desenhar_elipse(inimigox-25, inimigoy-25, 50, 50, verdadeiro)
		g.renderizar()

		g.definir_tamanho_texto(12.0)
			g.definir_cor(0xFFFFFF)
			g.definir_estilo_texto(falso, verdadeiro, falso)
			g.desenhar_texto(25, 40, "MOEDAS: " + num_moedas)

		se(perdeu)
		{
			g.definir_tamanho_texto(36.0)
			g.definir_cor(0xFFFFFF)
			g.definir_estilo_texto(falso, verdadeiro, falso)
			g.desenhar_texto(40, 300, "PERDEU! " + num_moedas+" moedas")
				g.desenhar_texto(40, 400, " aperte R")
		}
	}
	
	funcao inteiro dist(inteiro x1, inteiro y1, inteiro x2, inteiro y2)
	{
		retorne (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)
	}
	
	funcao inicio()
	{
		inicializar()		

		enquanto (verdadeiro)
		{
			tela_jogo()
		}
		
		finalizar()
	}

	

	funcao inteiro tempo_dentro_da_tela()
	{
		retorne u.tempo_decorrido() - tempo_inicio_tela
	}

	funcao iniciar_sincronia_da_taxa_de_atualizacao()
	{
		tempo_inicio = u.tempo_decorrido() + tempo_restante
	}


	funcao tela_jogo()
	{
		reiniciar_jogo()		
		
		enquanto (verdadeiro)
		{
			iniciar_sincronia_da_taxa_de_atualizacao()

			ler_controles_do_usuario()
			desenhar_tela_do_jogo()
			
			finalizar_sincronia_da_taxa_de_atualizacao()

			se (t.tecla_pressionada(t.TECLA_ESC))
			{
				retorne
			}
		}
	}

	funcao ler_controles_do_usuario()
	{	
		se (t.tecla_pressionada(t.TECLA_R))
		{
			atorx = 100
			atory = 100
			inimigox = 400
			inimigoy = 400
			num_moedas = 0
			inimigovel = 0.01
			perdeu = falso
		}
		se(perdeu) retorne
		//reiniciar_variaveis_de_controle()
		
		se (t.tecla_pressionada(t.TECLA_W) ou t.tecla_pressionada(t.TECLA_SETA_ACIMA))
		{
	     	atory -= 10
	     }
	     senao se (t.tecla_pressionada(t.TECLA_S) ou t.tecla_pressionada(t.TECLA_SETA_ABAIXO))
		{
	     	atory += 10
	     }

	     se (t.tecla_pressionada(t.TECLA_A) ou t.tecla_pressionada(t.TECLA_SETA_ESQUERDA))
		{
			atorx -= 10
		}
		senao se (t.tecla_pressionada(t.TECLA_D) ou t.tecla_pressionada(t.TECLA_SETA_DIREITA))
		{
			atorx += 10
		}

		
	}

	funcao finalizar_sincronia_da_taxa_de_atualizacao()
	{
		tempo_decorrido = u.tempo_decorrido() - tempo_inicio
		tempo_restante = tempo_quadro - tempo_decorrido 

		enquanto (TAXA_DE_ATUALIZACAO > 0 e tempo_restante > 0)
		{
			tempo_decorrido = u.tempo_decorrido() - tempo_inicio
			tempo_restante = tempo_quadro - tempo_decorrido
			u.aguarde(1)
		}
	}

	funcao reiniciar_jogo()
	{
		

		tempo_restante = 0		
		tempo_inicio_jogo = u.tempo_decorrido()
		
		frames = 0
		
		// Hack para não exibir o FPS zerado na primeira vez que desenhar a tela
		tempo_inicio_fps = u.tempo_decorrido() - 1000
	}

	funcao inicializar()
	{
		se (TAXA_DE_ATUALIZACAO > 0)
		{
			tempo_quadro = 1000 / TAXA_DE_ATUALIZACAO
		}
		
		
		inicializar_janela()		
		
	}

	
	funcao inicializar_janela()
	{
		g.iniciar_modo_grafico(verdadeiro)
		g.definir_titulo_janela("JOGO ERICK")
	}

	

	funcao finalizar()
	{
		g.encerrar_modo_grafico()
	}
}