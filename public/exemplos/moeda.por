programa
{
	// Aqui bibliotecas necessárias
	inclua biblioteca Util --> u
	inclua biblioteca Texto --> t
	
	funcao inicio ()
	{
		inteiro d = 10
		inteiro i = 0
		// Repete aleatoriamente
		// As vezes termina rápido as vezes não
		enquanto(i < 5 ou sorteia(0,50) != 0)
		{
			limpa()
			escreva("Jogando moeda...\n\n")
			d += sorteia(-1, 1)
			escreva(t.preencher_a_esquerda(' ', d, ""))
			se(i % 2 == 0) 
			{
				escreva("●\n")
			} 
			senao 
			{
				escreva("❙\n")
			}
			u.aguarde(100)
			i++
		}
		
		// Resultado final, sorteia um número 
		// Ou seja a moeda 'girando' é só visual
		se(sorteia(0, 1) == 1)
		{
			escreva("CARA!")
		}
		senao
		{
			escreva("COROA!")
		}
	}
}