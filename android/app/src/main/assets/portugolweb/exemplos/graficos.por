programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Util --> u

	// VOCÊ VAI FAZER SEU CÓDIGO AQUI
	funcao desenhar(inteiro posicao)
	{
		// 'A' REPETE DE 0 A 200 CONFORME POSIÇÃO VAI PRO INFINITO
		inteiro a = posicao % 200
		
		g.definir_cor(g.COR_PRETO)
		// X:A, Y:50,
		// LARG:100, ALTURA:150, 
		// ARREDONDAR:FALSO, PREENCHER:VERDADEIRO
		g.desenhar_retangulo(a, 50, 100, 150, falso, verdadeiro)
	}

	/*#########################################
	* MODIFIQUE APENAS A FUNÇÃO DESENHAR
	* A FUNÇÃO INICIO JÁ FAZ O QUE DEVERIA
	* ########################################*/
	funcao inicio()
	{
		// para usar os gráficos
		g.iniciar_modo_grafico(falso)

		// variavel contadora, conta de 0 até infinito
		inteiro posicao = 0
		enquanto(verdadeiro)
		{
			// Pinta a tela de verde
			g.definir_cor(g.COR_VERDE)
			g.limpar()
		
			//Aqui vamos fazer o código
			desenhar(posicao)

			// conta até o infinito
			posicao = posicao + 1

			// desenha na tela tudo
			g.renderizar()

			// espera 20 milisegundos
			u.aguarde(20)
		}
	}
}