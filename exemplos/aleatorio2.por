programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Teclado --> t
	inclua biblioteca Texto --> txt
	inclua biblioteca Util --> u
	inclua biblioteca Tipos --> tp
	inclua biblioteca Matematica --> m

	/* Dimensões da tela do jogo */ 
	const inteiro LARGURA_TELA = 800, ALTURA_TELA = 600


	/* Define quantos quadros serão desenhados por segundo (FPS) */
	const inteiro TAXA_ATUALIZACAO = 85
	/* Variáveis utilizadas para controlar o FPS e o tempo de jogo */
	inteiro tempo_inicio_jogo = 0, tempo_total_jogo = 0

	inteiro tempo_inicio = 0, tempo_decorrido = 0, tempo_restante = 0, tempo_quadro = 1000 / TAXA_ATUALIZACAO

	inteiro nota_stride = 11
	// quando acessar uma nota
	inteiro nota_marcou = 9
	inteiro nota_errou = 0
	inteiro nota_final = 60
	
	inteiro nota_array[] = 
	{
		9, 0,0,0,0,0,0,0,0,0,60,
		9, 1,0,1,0,1,1,1,0,0,26,
		9, 1,0,1,0,1,1,0,0,0,33,
		6, 0,0,0,0,1,0,0,0,0,50,
		6, 0,0,1,0,1,1,0,0,0,30,
		9, 1,0,1,0,1,0,0,0,0,46,
		9, 1,0,1,0,1,0,0,0,0,40,
		6, 0,0,0,0,1,0,0,0,0,50,
		9, 0,0,1,0,1,0,0,0,0,46,
		6, 0,0,1,0,0,1,0,1,0,30,
		9, 0,0,1,0,1,1,0,0,0,40,
		9, 1,1,1,0,1,1,1,0,0,20,
		9, 1,0,1,0,1,0,0,0,0,40,
		9, 1,0,1,0,1,0,0,0,0,40,
		9, 1,0,1,1,1,1,1,0,0,20,
		9, 0,0,1,0,1,0,0,0,0,46,
		9, 1,1,1,0,0,1,1,0,0,26,
		9, 0,0,0,0,1,1,0,1,1,33,
		9, 1,0,1,0,1,1,1,0,0,26,
		9, 1,0,1,0,1,0,0,0,0,40,
		9, 1,0,1,0,1,1,1,1,1,13,
		6, 1,0,0,0,0,0,1,0,0,40,
		9, 0,1,1,0,0,0,0,0,0,46,
		6, 0,0,0,0,1,0,0,0,0,50,
		9, 0,1,1,1,1,1,1,0,1,13,
		9, 1,0,0,1,1,1,0,1,0,26,
		9, 0,0,1,0,1,1,0,0,0,40,
		9, 0,1,0,0,0,0,0,0,0,53,
		6, 1,0,1,1,0,1,0,0,0,20,
		9, 1,0,1,1,1,1,1,0,0,26,
		9, 0,0,0,0,0,0,0,0,1,53,
		9, 1,1,1,1,0,1,1,0,0,20,
		9, 0,0,0,0,0,0,1,0,0,53
	}

	inteiro erro_maximo = 0
	inteiro erros_array[] = {0,0,0,0,0,0,0,0,0}

	funcao get_nota(inteiro indice)
	{
		inteiro offset = indice*nota_stride
		nota_marcou = nota_array[offset+0]
		nota_errou = nota_array[offset+1]
		+nota_array[offset+2]
		+nota_array[offset+3]
		+nota_array[offset+4]
		+nota_array[offset+5]
		+nota_array[offset+6]
		+nota_array[offset+7]
		+nota_array[offset+8]
		+nota_array[offset+9]
		nota_final = nota_array[offset+10]
	}
	
	funcao inicio()
	{
		inicializar()
		calculaErros()
		
loop()
	}

	funcao calculaErros()
	{
		para(inteiro i=0;i< u.numero_elementos(nota_array)/ nota_stride;i++)
		{
			inteiro offset = i*nota_stride
			para(inteiro k=0;k< 9;k++)
			{
				erros_array[k] += nota_array[(offset+1)+k]
				//erros_array[k] += 1-nota_array[(offset+1)+k]
			}
		}

		erro_maximo = 30
		/*para(inteiro k=0;k< 9;k++)
		{
			se(erros_array[k] > erro_maximo)
			{
				erro_maximo = erros_array[k]
			}
		}*/
	}

	funcao loop()
	{
		enquanto (nao t.tecla_pressionada(t.TECLA_ESC))
		{
			tempo_inicio = u.tempo_decorrido()
	
			desenhar()
			
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
		g.definir_cor(g.COR_BRANCO)
		g.limpar()

		g.definir_tamanho_texto(18.0)
			g.definir_cor(0xFF0000)
			g.definir_estilo_texto(falso, falso, falso)
			
			//g.desenhar_texto(290, 240, "Parabéns, você venceu!")

			inteiro etapas = 10
			inteiro altura_marca = 45
			para(inteiro i=1;i<= etapas;i++)
			{
				g.desenhar_linha(40, 500 - (i*altura_marca), 750, 500 - (i*altura_marca))
				real erro_ateaqui = (tp.inteiro_para_real(erro_maximo) / tp.inteiro_para_real(etapas)) * tp.inteiro_para_real(i)
				cadeia erro_txt = ""+(erro_ateaqui)
				se( txt.numero_caracteres(erro_txt) > 6)
				{
				cadeia final = txt.extrair_subtexto(erro_txt, 0, 6)
				g.desenhar_texto(10, 500 - (i*altura_marca), final)
				}
				senao
				{
				g.desenhar_texto(10, 500 - (i*altura_marca), erro_txt)	
				}
			}

			g.definir_tamanho_texto(26.0)
			
			inteiro coluna = 0
			inteiro largura_coluna = 65
			inteiro padding_coluna = largura_coluna+15
			para(inteiro i=0;i< 9;i++)
			{
				inteiro erros = erros_array[i]
				g.definir_cor(0xFF0000)
				real altura = (tp.inteiro_para_real(erros)/ tp.inteiro_para_real(erro_maximo)) * 450.0
				g.desenhar_retangulo(50 + (i* (padding_coluna)), 500-altura, largura_coluna/2, altura, verdadeiro, verdadeiro)
				g.desenhar_texto(50 + (i* (padding_coluna)) + largura_coluna/2 - 9, 510, ""+(i+1))
				g.definir_cor(0x00FF00)
				altura = 450.0- altura
				g.desenhar_retangulo(50 + (i* (padding_coluna)) + largura_coluna/2, 500-altura, largura_coluna/2, altura, verdadeiro, verdadeiro)

			}
		
		g.renderizar()
	}

	funcao inicializar()
	{
		g.iniciar_modo_grafico(verdadeiro)
		//g.definir_dimensoes_janela(LARGURA_TELA, ALTURA_TELA)
		g.definir_titulo_janela("Grafico Notas")
	}
}
