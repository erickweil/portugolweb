programa														
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Util --> u
	inclua biblioteca Mouse --> m
	inclua biblioteca Tipos --> t
	inclua biblioteca Matematica --> mat
	
	// Mude esses valores para mudar o tamanho da grade
	const inteiro GW = 80
	const inteiro GH = 60
	
	inteiro grade[GH][GW]
	inteiro gradea[GH][GW]
	inteiro gradeInicial[GH][GW]
	logico jogando = verdadeiro
	inteiro v = 0
	inteiro setadox = 0, setadoy = 0
	funcao inicio()
	{
		aleatorioGrade()
		
		g.iniciar_modo_grafico(verdadeiro)
		g.definir_titulo_janela("Jogo da vida")
		//g.entrar_modo_tela_cheia()
		g.definir_cor(0xffffff)
		g.limpar()
		inteiro umx = 0, umy = 0
		logico pressionado = falso
		enquanto(verdadeiro)
		{
			inteiro mx = m.posicao_x()
			inteiro my = m.posicao_y()
			g.definir_cor(0x000000)
			g.limpar()
			g.definir_cor(0x00FF00)
			
			se(jogando)
			{
				execJogo()
			}
			desenhar_grade()
			se((nao pressionado ou nao jogando) e m.botao_pressionado(m.BOTAO_ESQUERDO))
			{
				setar(mx,my,pressionado)
			}
			se(nao pressionado e m.botao_pressionado(m.BOTAO_DIREITO))
			{
				jogando = nao jogando
				se(jogando)
				{
					copiar(gradeInicial,grade)
				}
				senao
				{
					copiar(grade,gradeInicial)
				}
			}
			
			pressionado = m.algum_botao_pressionado()

			g.renderizar()
			u.aguarde(0) // bom esperar antes de desenhar denovo
			
			umx = mx
			umy = my
		}
	}
	
	funcao copiar(inteiro a[][],inteiro b[][])
	{
		para(inteiro x=0;x<GH;x++)
		{
			para(inteiro y=0;y<GW;y++)
			{
				a[x][y] = b[x][y]
			}
		}
	}
	
	funcao desenhar_grade()
	{
		inteiro telay = g.altura_janela()
		inteiro telax = g.largura_janela()
		
		inteiro telaMax = mat.menor_numero(telay,telax)
		
		inteiro gw = telaMax/GH
		
		para(inteiro x=0;x<GH;x++)
		{
			para(inteiro y=0;y<GW;y++)
			{
				se(grade[x][y] == 1)
				g.desenhar_retangulo(gw*x,gw*y,gw-1,gw-1,falso,verdadeiro)
			}
		}
	}
	
	funcao aleatorioGrade()
	{
		para(inteiro x=0;x<GH;x++)
		{
			para(inteiro y=0;y<GW;y++)
			{
				grade[x][y] = u.sorteia(0,1)
			//	grade[x][y] = 1
			}
		}
	}
	
	
	
	funcao execJogo()
	{
		para(inteiro x=0;x<GH;x++)
		{
			para(inteiro y=0;y<GW;y++)
			{
				inteiro vizinhos = 0
				inteiro offnx = x-1
				inteiro offpx = x+1
				inteiro offny = y-1
				inteiro offpy = y+1
	
				se(offnx < 0) offnx = GH-1
				se(offpx >= GH) offpx = 0
				se(offny < 0) offny = GW-1
				se(offpy >= GW) offpy = 0

					vizinhos =
					grade[offnx][offny]+
					grade[offnx][offpy]+
					grade[offpx][offny]+
					grade[offpx][offpy]+
					grade[x][offny]+
					grade[offnx][y]+
					grade[offpx][y]+
					grade[x][offpy]

					se(vizinhos <2)
					{
						gradea[x][y] = 0
					}
					senao se(vizinhos == 3)
					{
						gradea[x][y] = 1
					}
					senao se(vizinhos > 3)
					{
						gradea[x][y] = 0
					}
					senao
					{
						gradea[x][y] = grade[x][y]
					}
				
			}
		}
		copiar(grade,gradea)
	
	}
	
	
	funcao setar(inteiro mx,inteiro my,logico pressionado)
	{
		inteiro telay = g.altura_janela()
		inteiro telax = g.largura_janela()
		
		inteiro telaMax = mat.menor_numero(telay,telax)
		
		inteiro gw = telaMax/GH
		
		inteiro gx = mat.menor_numero(GH-2,mat.maior_numero(2,mx/gw))
		inteiro gy = mat.menor_numero(GW-2,mat.maior_numero(2,my/gw))
		
		se(setadox != gx ou setadoy != gy)
		{
			setadox = gx
			setadoy = gy
		
			//se(nao pressionado)
			//{
				v = grade[gx][gy]
				se(v == 1) v = 0
				senao v = 1
			//}
			
			
			
			
			se(jogando)
			{
				grade[gx][gy] = v
				grade[gx][gy-1] = v
				grade[gx][gy-2] = v
				grade[gx-1][gy-2] = v
				grade[gx-2][gy-1] = v
			}
			senao
			{
				grade[gx][gy] = v
			}
		
		}
	}

}
