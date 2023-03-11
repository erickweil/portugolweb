programa														
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Util --> u
	inclua biblioteca Mouse --> m
	inclua biblioteca Tipos --> t
	funcao inicio()
	{
		g.iniciar_modo_grafico(verdadeiro)
		g.definir_titulo_janela("Experimental")
		//	g.entrar_modo_tela_cheia()
		g.definir_cor(0xffffff)
		g.limpar()
		inteiro umx = 0, umy = 0
		logico pressionado = falso
		enquanto(verdadeiro)
		{
			inteiro mx = m.posicao_x()
			inteiro my = m.posicao_y()

			se(m.botao_pressionado(m.BOTAO_ESQUERDO))
				g.definir_cor(0xFF0000)
			senao se(m.botao_pressionado(m.BOTAO_DIREITO))
				g.definir_cor(0x00FF00)
				
			se(m.botao_pressionado(m.BOTAO_MEIO))
			{
				g.definir_cor(0xFFFFFF)
				g.limpar()
			}
			
			se(pressionado e m.algum_botao_pressionado())
			{
				g.desenhar_linha(umx,umy,mx,my)
			}
			pressionado = m.algum_botao_pressionado()

			g.renderizar()
			u.aguarde(10) // bom esperar antes de desenhar denovo
			
			umx = mx
			umy = my
		}
	}
}