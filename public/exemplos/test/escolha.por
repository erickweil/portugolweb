programa
{
	funcao inicio()
	{
		// Testa escolha-caso com caso contrario em laço
		// Sem o fix do vazamento de pilha, isso transbordaria a pilha após ~95 iterações
		inteiro acumulador = 0
		para(inteiro i = 0; i < 100; i++)
		{
			escolha(i % 4)
			{
				caso 0:
					acumulador += 1
					pare
				caso 1:
					acumulador += 2
					pare
				caso 2:
					acumulador += 4
					pare
				caso contrario:
					acumulador += 8
					pare
			}
		}
		// 25 iterações de cada caso: 25*(1+2+4+8) = 25*15 = 375
		escreva(acumulador, "\n")

		// Testa escolha-caso SEM caso contrario (o valor do escolha deve ser descartado)
		inteiro resultado = 0
		para(inteiro j = 0; j < 6; j++)
		{
			escolha(j)
			{
				caso 0:
					resultado += 1
					pare
				caso 5:
					resultado += 10
					pare
				// j=1,2,3,4 não casa com nenhum caso, deve ser descartado corretamente
			}
		}
		// j=0: +1, j=5: +10, j=1..4: nada
		escreva(resultado)
	}
}
/*---
375
11
---*/
