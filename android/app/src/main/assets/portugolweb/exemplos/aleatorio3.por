programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Teclado --> t
	inclua biblioteca Util --> u
	inclua biblioteca Tipos --> tp
	inclua biblioteca Matematica --> m
	
	inteiro TelaW = 0
	inteiro TelaH = 0
	
	inteiro resolucao = 8
	real anim = 0.0
	funcao inicio()
	{
		inicializar()
		
		escreva("W:"+TelaW+" H:"+TelaH)
		
		loop()		
		finalizar()
	}

	funcao loop()
	{
		enquanto (nao t.tecla_pressionada(t.TECLA_ESC))
		{
			desenhar()
			u.aguarde(5)
			anim += 5.0 / 1000.0
		}
	}


	funcao desenhar()
	{
		g.definir_cor(0xFFFFFF)
		g.limpar()

		inteiro gridX = (TelaW / resolucao)
		inteiro gridY = (TelaH / resolucao)
		
		g.definir_cor(0xFF0000)
		
		para(inteiro x = 0;x<gridX;x++)
		{
			para(inteiro y = 0;y<gridY;y++)
			{
				real pX = (x / tp.inteiro_para_real(gridX)) - 0.5
				real pY = (y / tp.inteiro_para_real(gridY)) - 0.5
				
				real d = m.valor_absoluto(distEstimator(pX,pY))
				inteiro cor = 0x000000
				se(d > 0.0)
					cor = g.criar_cor(d*80,d*80,d*80)
				senao
				{
					
					se(pX < 0) cor |= 0xFF0000
					se(pY < 0) cor |= 0x00FF00
				}
				
				g.definir_cor(m.menor_numero(m.maior_numero(0,cor),0xFFFFFF))
				g.desenhar_retangulo(x*resolucao,y*resolucao,resolucao,resolucao,falso,verdadeiro)
			}
		}
		
		g.renderizar()
	}
	
	
	funcao real distEstimator(real x,real y)
	{
		//retorne m.raiz(x * x + y * y,2.0) - 0.25
		retorne m.cosseno(x*16) + m.cosseno(y*16) + m.cosseno(anim*16)
	}

	funcao inicializar()
	{
		g.iniciar_modo_grafico(verdadeiro)
		g.definir_titulo_janela("Seno e Cosseno")
		
		TelaH = g.altura_janela()
		TelaW = g.largura_janela()
	}

	funcao finalizar()
	{
		g.encerrar_modo_grafico()
	}
}