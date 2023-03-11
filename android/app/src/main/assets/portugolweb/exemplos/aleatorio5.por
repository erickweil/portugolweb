programa
{
	inclua biblioteca Graficos --> g
	inclua biblioteca Util --> u
	inclua biblioteca Mouse --> mouse
	inclua biblioteca Teclado --> teclado
	
	
	inteiro gradew = 20
	inteiro grade[gradew][gradew]
	inteiro grade_off = 2
	
	inteiro astar_current = 0
	inteiro astar_index[gradew*gradew]
	inteiro astar_via[gradew*gradew]
	inteiro astar_cost[gradew*gradew]
	inteiro astar_dist[gradew*gradew]
		
	inteiro origem = 0
	inteiro destino = 0
	
	// Graph data strutcture
	inteiro astar_neighsz = 8
	inteiro astar_neigh_via=-1
	inteiro astar_neigh_index[astar_neighsz]
	inteiro astar_neigh_cost[astar_neighsz]
	
	funcao fillneigh(inteiro pos)
	{
		

		
		inteiro posx = pos/gradew
		inteiro posy = pos%gradew
		
		
		
		para(inteiro x = 0; x < astar_neighsz; x++)
			astar_neigh_index[x] = -1
			
		inteiro i=0
		para(inteiro x = -1; x <= 1; x++)
		para(inteiro y = -1; y <= 1; y++)
		{
			se(i < astar_neighsz e nao (x == 0 e y == 0))
			{
				inteiro tx = posx+x
				inteiro ty = posy+y
				
				astar_neigh_cost[i] = 1
				//(tx - destinox)*(tx - destinox) +
				//(ty - destinoy)*(ty - destinoy)
				
				
				se(tx >= 0 e tx < gradew e ty >= 0 e ty < gradew)
				{
					inteiro t = grade[tx][ty]
					se(t == 0 ou t == 2)
					{
						astar_neigh_index[i] = tx*gradew + ty
					}
				}
				i++
			}
		}
	}
	
	funcao inteiro getastar(inteiro index)
	{
		para(inteiro i = 0; i < gradew*gradew; i++)
		{
			se(astar_index[i] == index) retorne i
		}
		retorne -1
	}
	
	funcao neighcostapply(inteiro cost)
	{
		para(inteiro i=0;i<astar_neighsz;i++)
		{
			inteiro v = astar_neigh_index[i]
			se(v != -1)
			{
				inteiro astari = getastar(v)
				se(astari != -1)
				{
					se(astar_cost[astari] > astar_neigh_cost[i]+cost)
					{
						astar_cost[astari] = astar_neigh_cost[i]+cost
						astar_via[astari] = astar_neigh_via
					}
				}
			}
		}
	}
	
	
	funcao orderastar()
	{
		para(inteiro i = astar_current; i < gradew*gradew; i++)
		{
			inteiro min_i = i
			inteiro min_cost = astar_cost[i]+astar_dist[i]
			para(inteiro k = i+1; k < gradew*gradew; k++)
			{
				inteiro costk = astar_cost[k]+astar_dist[k]
				se(costk < min_cost)
				{
					min_cost = costk
					min_i = k
				}
			}
			
			se(min_i != i)
			{
				// swap min_i & i
				inteiro index = astar_index[min_i]
				inteiro via = astar_via[min_i]
				inteiro cost = astar_cost[min_i]
				inteiro dist = astar_dist[min_i]
				
				astar_index[min_i] = astar_index[i]
				astar_via[min_i] = astar_via[i]
				astar_cost[min_i] = astar_cost[i]
				astar_dist[min_i] = astar_dist[i]
				
				astar_index[i] = index
				astar_via[i] = via
				astar_cost[i] = cost
				astar_dist[i] = dist
			}
		}
	}
	
	funcao inicio()
	{
		g.iniciar_modo_grafico(verdadeiro)
		
		
		

		recomecar()
		
		enquanto(verdadeiro)
		{
			se(teclado.tecla_pressionada(teclado.TECLA_R))
			{
				recomecar()
				u.aguarde(100)
			}
			
			se(teclado.tecla_pressionada(teclado.TECLA_E))
			{
				se(astar_current < gradew*gradew e astar_index[astar_current] != destino
				)
				{
					astar_neigh_via = astar_index[astar_current]
					fillneigh(astar_neigh_via)
					neighcostapply(astar_cost[astar_current])
					
					orderastar()

					se(astar_current+1 < gradew*gradew e astar_cost[astar_current+1] < gradew*gradew*gradew)
					{
						astar_current++
						fillneigh(astar_index[astar_current])
					}
				}
				
				//u.aguarde(100)
			}
			
			se(teclado.tecla_pressionada(teclado.TECLA_C))
			{
				escreva("astar_current:"+astar_current+"\n")
				escreva(astar_cost)
				escreva("\n")
				escreva(astar_dist)
				escreva("\n")
				u.aguarde(200)
			}
			
			g.definir_cor(g.COR_PRETO)
			g.limpar()
			
			desenhar_grade()
			
			u.aguarde(5)
		}
		
	}
	
	funcao recomecar()
	{
		origem = u.sorteia(0,gradew*gradew-1)
		
		destino = origem
		enquanto(origem == destino)
			destino = u.sorteia(0,gradew*gradew-1)
		

		
		inteiro destinox = destino/gradew
		inteiro destinoy = destino%gradew
		

		para(inteiro i=0;i<gradew*gradew;i++)
		{
			astar_index[i] = i
			astar_via[i] = -1
			astar_cost[i] = gradew*gradew*gradew
			
			inteiro tx = i / gradew
			inteiro ty = i % gradew
			
			tx = (tx - destinox)
			ty = (ty - destinoy)
			
			se(tx < 0) tx = -tx
			se(ty < 0) ty = -ty
			
			se(tx < ty)
			tx = ty
			
			astar_dist[i] = tx
		}
		astar_current = 0
		
		para(inteiro x=0;x<gradew;x++)
		para(inteiro y=0;y<gradew;y++)
		{
			se(u.sorteia(0,5) == 0)
			grade[x][y] = -1
			senao
			grade[x][y] = 0
		}
		
		grade
		[origem/gradew]
		[origem%gradew] = 1
		
		grade
		[destinox]
		[destinoy] = 2
		
		
		astar_cost[origem] = 0
		orderastar()
		
	}
	
	inteiro gradelarg
	funcao desenhar_quadrado(inteiro index,inteiro larg,inteiro cor)
	{
		inteiro x = index / gradew
		inteiro y = index % gradew
		
		inteiro px = (x+2) * (gradelarg + grade_off)
		inteiro py = (y+2) * (gradelarg + grade_off)
		
		g.definir_cor(cor)
		
		g.desenhar_retangulo(px-larg/2,py-larg/2,larg,larg,falso,verdadeiro)
	}
	
	funcao desenhar_grade()
	{
		
		inteiro telax = g.largura_janela()
		inteiro telay = g.largura_janela()
		inteiro telalarg = telax
		se(telalarg > telay) telalarg = telay
		
		gradelarg = (telalarg / (gradew+4)) - grade_off
		
		
		para(inteiro x=0;x<gradew;x++)
		para(inteiro y=0;y<gradew;y++)
		{
			inteiro v = grade[x][y]
			inteiro px = (x+2) * (gradelarg + grade_off)
			inteiro py = (y+2) * (gradelarg + grade_off)
			
			inteiro cor = g.COR_AMARELO
			se(v == -1)
			{
				cor = 0x333333
			}
			senao se(v == 0)
			{
				cor = g.COR_BRANCO
				
				se(astar_cost[getastar(x * gradew + y)] < gradew*gradew*gradew)
				cor = g.COR_AMARELO
			}
			senao se(v == 1)
			{
				cor = g.COR_VERDE
			}
			senao se(v == 2)
			{
				cor = g.COR_VERMELHO
			}
			senao
			{
				cor = g.COR_AMARELO
			}
			
			
			
			//g.desenhar_retangulo(px,py,gradelarg,gradelarg,falso,verdadeiro)
			desenhar_quadrado(x * gradew + y,gradelarg,cor)
		}
		
		para(inteiro i=0;i<astar_neighsz;i++)
		{
			inteiro v = astar_neigh_index[i]
			se(v != -1)
			{
				//inteiro x = v / gradew
				//inteiro y = v % gradew
				//inteiro px = (x+2) * (gradelarg + grade_off)
				//inteiro py = (y+2) * (gradelarg + grade_off)
				
				//g.definir_cor(g.COR_AZUL)
				//g.desenhar_retangulo(px+gradelarg/2-gradelarg/8,py+gradelarg/2-gradelarg/8,gradelarg/4,gradelarg/4,falso,verdadeiro)
				desenhar_quadrado(v,gradelarg/4,g.COR_AZUL)
			}
		}
		
		
		inteiro maxi = 0
		inteiro astari = astar_current
		enquanto(maxi < gradew*gradew e astari >= 0 e astari < gradew*gradew e astar_index[astari] >= 0 e astar_index[astari] < gradew*gradew)
		{
			desenhar_quadrado(astar_index[astari],gradelarg/4,g.COR_VERMELHO)
			
			astari =  getastar(astar_via[astari])
			
			maxi++
		}
	}
	
}