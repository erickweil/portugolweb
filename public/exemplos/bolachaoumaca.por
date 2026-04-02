programa
{
	funcao inicio()
	{
		inteiro resposta
		
		escreva("Você está com fome, e na cozinha tem poucas coisas\n")
		escreva("Escolha o que irá comer:\n")
		escreva("1 - Bolacha\n")
		escreva("2 - Maçã\n")
		
		leia(resposta)
		
		se(resposta == 1)
		{
			// Bolacha
			escreva("Deseja Tomar a Bolacha com Leite?\n")
			escreva("1 - Sim, Com leite\n")
			escreva("2 - Não\n")
			
			leia(resposta)
			se(resposta == 1)
			{
				// Com leite
				escreva("A Bolacha derrete e virou mingau \n")	
			}
			senao
			{
				// Não, sem leite
				escreva("é Isso aí, 😎")
			}
		}
		senao
		{
			// Maçã
			escreva("Irá descascar a Maçã?\n")
			escreva("1 - Sim\n")
			escreva("2 - Não\n")
			
			leia(resposta)
			se(resposta == 1)
			{
				// Descascar a maçã
				escreva("Você cortou o dedo. ")		
			}
			senao
			{
				// Não descascou
				escreva("A maçã estava ótima.")	
			}
		}
	}
}